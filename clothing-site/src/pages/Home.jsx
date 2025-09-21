import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Button from '../components/ui/Button.jsx';
import { useProducts } from '../context/useProducts.js';
import { useCart } from '../context/useCart.js';
import { useHomeConfig } from '../context/useHomeConfig.js';

export default function Home() {
  const { products, categories, loading } = useProducts();
  const { addToCart } = useCart();
  const { config } = useHomeConfig();

  // SEO: basic title/description for Home
  useEffect(() => {
    document.title = 'OOTD — Modern styles for every season';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Discover curated fashion with secure checkout and local support.');
  }, []);

  // Featured products: take first 8 for now
  const featured = useMemo(() => {
    if (config?.featuredProductIds?.length) {
      const map = new Map((products||[]).map(p=>[p.id,p]));
      return config.featuredProductIds.map(id => map.get(id)).filter(Boolean).slice(0,8);
    }
    return (products || []).slice(0, 8);
  }, [products, config]);

  // Category spotlight: map categories to a cover image (first product in category) or fallback
  const categoryCovers = useMemo(() => {
    const map = {};
    for (const c of categories) {
      const p = (products || []).find((x) => x.category === c);
      map[c] = p?.image || 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1600&auto=format&fit=crop';
    }
    return map;
  }, [categories, products]);

  const spotlight = useMemo(() => {
    const list = config?.spotlightCategories?.length ? config.spotlightCategories : categories;
    return (list || []).slice(0,6);
  }, [config, categories]);

  const onQuickAdd = (p) => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, size: (p.sizes?.[0] || 'One') });

  return (
    <section className="space-y-10">
      <Breadcrumbs />

      {/* Slim promo bar */}
      <div className="rounded-lg border bg-white/60 dark:bg-black/20 backdrop-blur px-4 py-2 text-center text-sm">
        {config?.promoText}
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <img
          loading="lazy"
          decoding="async"
          src={config?.hero?.image}
          srcSet={`${config?.hero?.image}&w=640 640w, ${config?.hero?.image}&w=960 960w, ${config?.hero?.image}&w=1280 1280w, ${config?.hero?.image}&w=1600 1600w`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
          alt="Hero banner"
          className="w-full h-72 sm:h-[28rem] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="px-8 sm:px-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">{config?.hero?.headline}</h1>
            <p className="text-white/90 mt-3 max-w-xl">{config?.hero?.sub}</p>
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <Button as={Link} to="/shop" className="!bg-white !text-black hover:!bg-gray-100">Shop Now</Button>
              <Link to="/shop" className="inline-flex items-center gap-2 text-white underline-offset-4 hover:underline">
                New Arrivals <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spotlight.map((c) => (
          <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="group relative rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40">
            <img loading="lazy" decoding="async" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={categoryCovers[c]} alt={c} className="w-full h-56 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/30 flex items-end">
              <div className="p-4">
                <h2 className="text-white text-xl font-semibold">{c}</h2>
                <span className="text-white/90 text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">Shop {c} →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured / New In */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">New In</h2>
          <Link to="/shop" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">View all</Link>
        </div>
        <div className="-mx-4 px-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-60 shrink-0">
                  <div className="h-40 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-lg" />
                  <div className="mt-2 h-4 w-3/4 bg-gray-100 dark:bg-gray-900 animate-pulse rounded" />
                  <div className="mt-1 h-4 w-1/2 bg-gray-100 dark:bg-gray-900 animate-pulse rounded" />
                </div>
              ))
            ) : (
              featured.map((p) => (
                <div key={p.id} className="w-60 shrink-0">
                  <Link to={`/product/${p.id}`} className="group block overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40">
                    <img loading="lazy" decoding="async" sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 240px" src={p.image} alt={p.name} className="h-40 w-full object-cover transition-transform group-hover:scale-105" />
                  </Link>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${p.id}`} className="font-medium truncate hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30">{p.name}</Link>
                      <div className="text-sm text-gray-600 dark:text-gray-400">GHC {p.price.toFixed(2)}</div>
                    </div>
                    <button aria-label="Quick add to cart" className="px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
                      onClick={() => onQuickAdd(p)}>
                      +
                    </button>
                  </div>
                  {(p.stock ?? 0) <= 5 && <div className="mt-1 text-xs inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Low stock</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Editorial tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/shop?collection=work" className="group relative rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40">
          <img loading="lazy" decoding="async" srcSet="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=960&auto=format&fit=crop 960w, https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop 1200w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop" alt="Styles for Work" className="w-full h-56 object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="p-4">
              <h3 className="text-white text-lg font-semibold">Styles for Work</h3>
              <span className="text-white/80 text-sm">Shop now →</span>
            </div>
          </div>
        </Link>
        <Link to="/shop?collection=weekend" className="group relative rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40">
          <img loading="lazy" decoding="async" srcSet="https://images.unsplash.com/photo-1520975922325-24c0ef6df2a8?q=80&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1520975922325-24c0ef6df2a8?q=80&w=960&auto=format&fit=crop 960w, https://images.unsplash.com/photo-1520975922325-24c0ef6df2a8?q=80&w=1200&auto=format&fit=crop 1200w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src="https://images.unsplash.com/photo-1520975922325-24c0ef6df2a8?q=80&w=1200&auto=format&fit=crop" alt="Weekend Fits" className="w-full h-56 object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="p-4">
              <h3 className="text-white text-lg font-semibold">Weekend Fits</h3>
              <span className="text-white/80 text-sm">Explore →</span>
            </div>
          </div>
        </Link>
        <Link to="/shop?collection=sale" className="group relative rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40">
          <img loading="lazy" decoding="async" srcSet="https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=960&auto=format&fit=crop 960w, https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1200&auto=format&fit=crop 1200w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src="https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1200&auto=format&fit=crop" alt="Seasonal Sale" className="w-full h-56 object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="p-4">
              <h3 className="text-white text-lg font-semibold">Seasonal Sale</h3>
              <span className="text-white/80 text-sm">Save now →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Trust bar removed per request */}
    </section>
  );
}
