import { useMemo, useState } from 'react';
import { useProducts } from '../context/useProducts.js';
import { useHomeConfig, writeHomeConfig } from '../context/useHomeConfig.js';
import { useToast } from '../context/ToastContext.jsx';

export default function AdminHomeSettings() {
  const { products, categories } = useProducts();
  const { config, save, saveHero } = useHomeConfig();
  const { show } = useToast();

  // Local UI state for multi-selects
  const [spotCats, setSpotCats] = useState(() => config.spotlightCategories || []);
  const [featuredIds, setFeaturedIds] = useState(() => config.featuredProductIds || []);

  const toggleCat = (name) => setSpotCats((prev) => prev.includes(name) ? prev.filter(c=>c!==name) : [...prev, name]);
  const toggleFeatured = (id) => setFeaturedIds((prev) => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const sortedProducts = useMemo(() => [...(products||[])], [products]);

  const onSave = () => {
    save({ spotlightCategories: spotCats, featuredProductIds: featuredIds });
    show('Home settings saved', { type: 'success' });
  };

  const onReset = () => {
    const d = writeHomeConfig({});
    setSpotCats(d.spotlightCategories);
    setFeaturedIds(d.featuredProductIds);
    show('Home settings reset to defaults', { type: 'info' });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Home Page Settings</h1>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800">Reset</button>
          <button onClick={onSave} className="px-3 py-2 rounded-md bg-black text-white">Save</button>
        </div>
      </div>

      {/* Promo bar */}
      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">Promo Bar</h2>
        <label className="block text-sm mb-1">Text</label>
        <input
          value={config.promoText}
          onChange={(e)=>save({ promoText: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., Free shipping over GHS 300 · 30-day returns · Secure checkout"
        />
      </div>

      {/* Hero */}
      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">Hero</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Headline</label>
            <input value={config.hero.headline} onChange={(e)=>saveHero({ headline: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Subheadline</label>
            <input value={config.hero.sub} onChange={(e)=>saveHero({ sub: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Image URL</label>
            <input value={config.hero.image} onChange={(e)=>saveHero({ image: e.target.value })} className="w-full border rounded px-3 py-2" />
            <div className="mt-2 overflow-hidden rounded-lg">
              <img src={config.hero.image} alt="Hero preview" className="w-full h-56 object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight categories */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Spotlight Categories</h2>
          <button onClick={()=>setSpotCats([])} className="text-sm underline">Clear</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(categories||[]).map((c) => (
            <label key={c} className={`px-3 py-2 rounded-md border cursor-pointer ${spotCats.includes(c) ? 'bg-black text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
              <input type="checkbox" className="mr-2" checked={spotCats.includes(c)} onChange={()=>toggleCat(c)} />
              {c}
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">If none selected, the first 6 categories will be shown by default.</p>
      </div>

      {/* Featured products */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Featured Products (New In)</h2>
          <button onClick={()=>setFeaturedIds([])} className="text-sm underline">Clear</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[28rem] overflow-auto">
          {sortedProducts.map((p) => (
            <label key={p.id} className={`flex items-center gap-3 p-2 rounded border cursor-pointer ${featuredIds.includes(p.id) ? 'bg-gray-50 dark:bg-gray-900' : ''}`}>
              <input type="checkbox" className="shrink-0" checked={featuredIds.includes(p.id)} onChange={()=>toggleFeatured(p.id)} />
              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
              <div className="min-w-0">
                <div className="truncate font-medium">{p.name}</div>
                <div className="text-xs text-gray-600">GHC {p.price.toFixed(2)}</div>
              </div>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">If none selected, the first 8 products will be shown by default.</p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button onClick={onReset} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800">Reset</button>
        <button onClick={onSave} className="px-3 py-2 rounded-md bg-black text-white">Save</button>
      </div>
    </section>
  );
}
