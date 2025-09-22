import { useEffect, useMemo, useState } from 'react';
import { initialProducts } from '../data/products';
import { ProductsContext } from './productsContext.js';

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Load from localStorage or seed
  useEffect(() => {
    // Clear old localStorage data to force refresh with new brunch-focused categories
    const currentVersion = '2.0-brunch';
    const savedVersion = localStorage.getItem('dataVersion');
    
    if (savedVersion !== currentVersion) {
      // Clear old data and update to new brunch-focused products
      localStorage.removeItem('inventory');
      localStorage.removeItem('categories');
      localStorage.setItem('dataVersion', currentVersion);
    }
    
    const saved = localStorage.getItem('inventory');
    const savedCats = localStorage.getItem('categories');
    
    if (savedCats) {
      try {
        const arr = JSON.parse(savedCats);
        if (Array.isArray(arr) && arr.length) setCategories(arr);
      } catch { /* ignore parse errors */ }
    }
    
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
        setLoading(false);
        return;
      } catch { /* ignore parse errors */ }
    }
    
    // Use new brunch-focused products
    setProducts(initialProducts);
    // Seed categories from initial products
    const seeded = Array.from(new Set(initialProducts.map((p) => p.category)));
    if (seeded.length) setCategories(seeded);
    setLoading(false);
  }, []);

  // Persist
  useEffect(() => {
    if (products?.length) localStorage.setItem('inventory', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (categories?.length) localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const api = useMemo(() => ({
    products,
    loading,
    categories,
    addProduct: (p) => setProducts((prev) => [...prev, { ...p, id: crypto.randomUUID() }]),
    updateProduct: (id, updates) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p))),
    deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),
    addCategory: (name) => setCategories((prev) => {
      const n = String(name || '').trim();
      if (!n) return prev;
      if (prev.includes(n)) return prev;
      return [...prev, n];
    }),
    removeCategory: (name) => setCategories((prev) => prev.filter((c) => c !== name)),
  }), [products, loading, categories]);

  return <ProductsContext.Provider value={api}>{children}</ProductsContext.Provider>;
}
