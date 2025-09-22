import { useMemo, useState } from 'react';
import { useProducts } from '../context/useProducts.js';
import { useToast } from '../context/ToastContext.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';

const emptyForm = {
  name: '',
  category: 'Brunch',
  price: '',
  sizes: 'S,M,L',
  stock: '',
  image: '',
  description: '',
};

export default function AdminInventory() {
  const { products, categories, addCategory, removeCategory, addProduct, updateProduct, deleteProduct } = useProducts();
  const { show } = useToast();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [newCategory, setNewCategory] = useState('');

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      sizes: p.sizes.join(','),
      stock: String(p.stock),
      image: p.image,
      description: p.description,
    });
    setPreview(p.image || '');
  };

  // Inventory filtering and sorting
  const viewProducts = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || (p.description || '').toLowerCase().includes(t));
    }
    const [field, dir] = sort.split('-');
    return [...list].sort((a, b) => {
      const get = (p) => (field === 'price' ? p.price : field === 'stock' ? p.stock : p.name.toLowerCase());
      const va = get(a);
      const vb = get(b);
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, search, sort]);

  // Low stock products for alerts
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= 5);
  }, [products]);

  // Category management
  const onAddCategory = () => {
    const n = newCategory.trim();
    if (!n) return;
    addCategory(n);
    setNewCategory('');
    show('Category added', { type: 'success' });
  };

  const onRemoveCategory = (name) => {
    const usedBy = products.filter((p) => p.category === name);
    if (usedBy.length > 0) {
      if (!confirm(`Category "${name}" is used by ${usedBy.length} product(s). Remap them to "Uncategorized" and remove?`)) return;
      // Ensure fallback exists
      if (!categories.includes('Uncategorized')) addCategory('Uncategorized');
      usedBy.forEach((p) => updateProduct(p.id, { category: 'Uncategorized' }));
    }
    removeCategory(name);
    show('Category removed', { type: 'success' });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview('');
  };

  const onFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      show('Please select an image file', { type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
      setPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price || 0),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock || 0),
      image: form.image || 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=900&auto=format&fit=crop',
      description: form.description.trim(),
    };
    // Basic validation
    const nextErrors = {};
    if (!payload.name) nextErrors.name = 'Name is required';
    if (!payload.sizes.length) nextErrors.sizes = 'At least one size is required';
    if (Number.isNaN(payload.price) || payload.price < 0) nextErrors.price = 'Price must be 0 or more';
    if (!Number.isInteger(payload.stock) || payload.stock < 0) nextErrors.stock = 'Stock must be 0 or more';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      show('Please fix the form errors', { type: 'error' });
      return;
    }

    if (editingId) {
      updateProduct(editingId, payload);
      show('Product updated', { type: 'success' });
    } else {
      addProduct(payload);
      show('Product added', { type: 'success' });
    }
    reset();
  };

  const onDelete = (id) => {
    if (confirm('Delete this product?')) {
      deleteProduct(id);
      show('Product deleted', { type: 'success' });
    }
  };

  return (
    <AdminLayout activeTab="inventory">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <div className="text-sm text-gray-500">
            {products.length} products • {lowStockProducts.length} low stock
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                ⚠️
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {lowStockProducts.length} product(s) have 5 or fewer items in stock: {lowStockProducts.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-64 border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
                />
                <label className="text-sm text-gray-600">Sort</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-2 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30">
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                  <option value="price-asc">Price (Low–High)</option>
                  <option value="price-desc">Price (High–Low)</option>
                  <option value="stock-asc">Stock (Low–High)</option>
                  <option value="stock-desc">Stock (High–Low)</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-3">
              {viewProducts.length === 0 ? (
                <div className="text-center border rounded-lg py-12 px-6 bg-white/40 dark:bg-black/10">
                  <div className="text-5xl mb-3" aria-hidden>🪄</div>
                  <h3 className="text-lg font-semibold">No products found</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Try a different search or add a new product.</p>
                </div>
              ) : viewProducts.map((p) => (
                <div key={p.id} className="p-4 border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-gray-600 truncate">Category: {p.category}</div>
                      <div className="text-xs text-gray-600 truncate">Sizes: {p.sizes.join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">GHC {p.price.toFixed(2)}</div>
                      <div className={`text-sm ${p.stock <= 5 ? 'text-red-600' : 'text-gray-600'}`}>
                        Stock: {p.stock}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm" 
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 rounded-md bg-red-100 text-red-700 text-sm" 
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Category Manager */}
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-semibold mb-3">Categories</h2>
              <div className="flex gap-2 mb-3">
                <input 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  placeholder="Add category" 
                  className="flex-1 border rounded px-3 py-2" 
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-black text-white rounded-md" 
                  onClick={onAddCategory}
                >
                  Add
                </button>
              </div>
              <ul className="divide-y dark:divide-gray-800">
                {categories.map((c) => (
                  <li key={c} className="py-2 flex items-center justify-between">
                    <span>{c}</span>
                    <button 
                      type="button" 
                      className="px-2 py-1 text-sm bg-gray-100 rounded-md" 
                      onClick={() => onRemoveCategory(c)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add / Edit Product */}
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-semibold mb-3">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={onSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input 
                    className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-300' : ''}`} 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Price (GHC)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className={`w-full border rounded px-3 py-2 ${errors.price ? 'border-red-300' : ''}`} 
                    value={form.price} 
                    onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  />
                  {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Sizes (comma separated)</label>
                  <input 
                    className={`w-full border rounded px-3 py-2 ${errors.sizes ? 'border-red-300' : ''}`} 
                    value={form.sizes} 
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })} 
                  />
                  {errors.sizes && <p className="text-xs text-red-600 mt-1">{errors.sizes}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Stock</label>
                  <input 
                    type="number" 
                    className={`w-full border rounded px-3 py-2 ${errors.stock ? 'border-red-300' : ''}`} 
                    value={form.stock} 
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                  />
                  {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Image</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="url" 
                      className="w-full border rounded px-3 py-2" 
                      value={form.image} 
                      onChange={(e) => setForm({ ...form, image: e.target.value })} 
                      placeholder="Paste image URL or upload below" 
                    />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => onFile(e.target.files?.[0])} 
                    />
                    {(preview || form.image) && (
                      <img 
                        src={preview || form.image} 
                        alt="Preview" 
                        className="mt-2 w-full h-40 object-cover rounded border" 
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea 
                    className="w-full border rounded px-3 py-2" 
                    rows={3} 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-black text-white rounded-md"
                  >
                    {editingId ? 'Save' : 'Add'}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      className="px-4 py-2 bg-gray-100 rounded-md" 
                      onClick={reset}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
