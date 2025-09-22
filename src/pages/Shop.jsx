import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProducts } from '../context/useProducts.js';
import ProductGrid from '../components/ProductGrid.jsx';
import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Shop() {
  const { products, loading, categories } = useProducts();
  const query = useQuery();
  const categoryParam = query.get('category');
  const category = categories?.includes(categoryParam) ? categoryParam : null;
  const collection = query.get('collection');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category) : products;
    // Apply curated collections when present (work, weekend, sale)
    if (collection) {
      const rx = new RegExp(collection === 'work' ? '(work|office)' : collection === 'weekend' ? '(weekend|casual)' : '(sale|discount)', 'i');
      list = list.filter((p) => {
        const hay = `${p.name} ${(p.description||'')}`;
        const tags = Array.isArray(p.tags) ? p.tags.join(' ') : '';
        const byTag = tags && new RegExp(collection, 'i').test(tags);
        const byText = rx.test(hay);
        const byCategory = (collection === 'work' && ['Tops', 'Casual'].includes(p.category)) || (collection === 'weekend' && ['Brunch','Dresses','Casual'].includes(p.category));
        return byTag || byText || byCategory;
      });
    }
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t));
    }
    const [field, dir] = sort.split('-');
    list = [...list].sort((a, b) => {
      let va = field === 'price' ? a.price : a.name.toLowerCase();
      let vb = field === 'price' ? b.price : b.name.toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [products, category, collection, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  return (
    <section className="space-y-6">
      <Breadcrumbs />
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Shop</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{filtered.length} results{category ? ` in ${category}` : ''}{collection ? ` · collection: ${collection}` : ''}{q ? ` for “${q}”` : ''}</p>
        </div>
        <div className="flex flex-wrap gap-4 border-b border-gray-200/70 dark:border-gray-800/70">
          <Link to="/shop" className={`pb-2 text-sm border-b-2 ${!category ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}>All</Link>
          {(categories || []).map((c) => (
            <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className={`pb-2 text-sm border-b-2 ${category === c ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}>{c}</Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:max-w-sm border rounded-md px-3 py-2"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-md px-2 py-2">
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="price-asc">Price (Low–High)</option>
            <option value="price-desc">Price (High–Low)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="border rounded-lg bg-white dark:bg-gray-900 shadow-card overflow-hidden animate-pulse">
              <div className="w-full h-56 bg-gray-200 dark:bg-gray-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                <div className="mt-2 h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border rounded-lg dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300">No products found.</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link to="/shop" className="px-4 py-2 rounded-md bg-black text-white">Clear Filters</Link>
            {q && (
              <button onClick={() => setQ('')} className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800">Clear Search</button>
            )}
          </div>
        </div>
      ) : (
        <ProductGrid products={paged} />
      )}

      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
        <button
          className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
