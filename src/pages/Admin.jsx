import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/useProducts.js';
import { useToast } from '../context/ToastContext.jsx';
import { AuthContext } from '../context/authContext.js';
import { OrdersContext } from '../context/ordersContext.js';
import { Link } from 'react-router-dom';
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

export default function Admin() {
  const { products, categories, addCategory, removeCategory, addProduct, updateProduct, deleteProduct } = useProducts();
  const { show } = useToast();
  const { logout } = useContext(AuthContext);
  const { orders, updateOrderStatus } = useContext(OrdersContext);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [newCategory, setNewCategory] = useState('');
  const [view, setView] = useState('inventory'); // 'inventory' | 'orders' - defaults to inventory
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');
  const [orderSort, setOrderSort] = useState('date-desc');

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
    <AdminLayout activeTab="admin">
      <div className="space-y-8">
        {/* Header - Shopify style */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {view === 'inventory' ? 'Products' : 'Orders'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {view === 'inventory' 
                ? 'Manage your brunch outfit collection and inventory' 
                : 'View and manage customer orders'
              }
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              {view === 'inventory' ? 'Add product' : 'Create order'}
            </button>
          </div>
        </div>

        {/* Tabs - Modern card style */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                view === 'inventory' 
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white bg-gray-50 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setView('inventory')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products ({products.length})
            </button>
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                view === 'orders' 
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white bg-gray-50 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setView('orders')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

      {view === 'inventory' ? (
        <>
          {/* Products List */}
          <div className="xl:col-span-3">
            {/* Filters - Shopify style */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="relative">
                      <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 w-full sm:w-80 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                      />
                    </div>
                    <select 
                      value={sort} 
                      onChange={(e) => setSort(e.target.value)} 
                      className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    >
                      <option value="name-asc">Name (A–Z)</option>
                      <option value="name-desc">Name (Z–A)</option>
                      <option value="price-asc">Price (Low–High)</option>
                      <option value="price-desc">Price (High–Low)</option>
                      <option value="stock-asc">Stock (Low–High)</option>
                      <option value="stock-desc">Stock (High–Low)</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {viewProducts.length} product{viewProducts.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-4">
              {viewProducts.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="text-center py-16 px-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first brunch outfit to the collection.</p>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                      Add product
                    </button>
                  </div>
                </div>
              ) : viewProducts.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{p.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                {p.category}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Sizes: {p.sizes.join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">GHC {p.price.toFixed(2)}</div>
                              <div className={`text-sm ${p.stock <= 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {p.stock} in stock
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
                                onClick={() => startEdit(p)}
                              >
                                Edit
                              </button>
                              <button 
                                className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" 
                                onClick={() => onDelete(p.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-1 border rounded-lg p-4 h-fit space-y-6">
              {/* Category Manager */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Categories</h2>
                <div className="flex gap-2 mb-3">
                  <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Add category" className="flex-1 border rounded px-3 py-2" />
                  <button type="button" className="px-4 py-2 bg-black text-white rounded-md" onClick={onAddCategory}>Add</button>
                </div>
                <ul className="divide-y dark:divide-gray-800">
                  {categories.map((c) => (
                    <li key={c} className="py-2 flex items-center justify-between">
                      <span>{c}</span>
                      <button type="button" className="px-2 py-1 text-sm bg-gray-100 rounded-md" onClick={() => onRemoveCategory(c)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Orders */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No orders yet.</p>
                ) : (
                  <ul className="divide-y dark:divide-gray-800">
                    {orders.slice(0, 6).map((o) => (
                      <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <Link to={`/order-success/${o.id}`} className="font-mono text-sm hover:underline truncate block">{o.id}</Link>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(o.createdAt).toLocaleString()} · {o.payment?.method?.toUpperCase?.()} · GHC {(o.totals?.total ?? 0).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add / Edit Product */}
              <div>
                <h2 className="text-lg font-semibold mb-3">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <form onSubmit={onSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-300' : ''}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <select className="w-full border rounded px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Price (GHC)</label>
                    <input type="number" step="0.01" className={`w-full border rounded px-3 py-2 ${errors.price ? 'border-red-300' : ''}`} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Sizes (comma separated)</label>
                    <input className={`w-full border rounded px-3 py-2 ${errors.sizes ? 'border-red-300' : ''}`} value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
                    {errors.sizes && <p className="text-xs text-red-600 mt-1">{errors.sizes}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Stock</label>
                    <input type="number" className={`w-full border rounded px-3 py-2 ${errors.stock ? 'border-red-300' : ''}`} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                    {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Image</label>
                    <div className="flex flex-col gap-2">
                      <input type="url" className="w-full border rounded px-3 py-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Paste image URL or upload below" />
                      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
                      {(preview || form.image) && (
                        <img src={preview || form.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded border" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Description</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">{editingId ? 'Save' : 'Add'}</button>
                    {editingId && <button type="button" className="px-4 py-2 bg-gray-100 rounded-md" onClick={reset}>Cancel</button>}
                  </div>
                </form>
              </div>
            </aside>
          </>
      ) : (
        // Orders view
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h1 className="text-2xl font-semibold">Orders</h1>
            <div className="flex flex-wrap items-center gap-2">
              <input value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} placeholder="Search by ref, name, email, phone" className="w-full md:w-64 border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
              <label className="text-sm text-gray-600">Status</label>
              <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="border rounded px-2 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <label className="text-sm text-gray-600">Sort</label>
              <select value={orderSort} onChange={(e) => setOrderSort(e.target.value)} className="border rounded px-2 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30">
                <option value="date-desc">Date (newest)</option>
                <option value="date-asc">Date (oldest)</option>
                <option value="total-desc">Total (high-low)</option>
                <option value="total-asc">Total (low-high)</option>
              </select>
              <button
                type="button"
                className="px-3 py-2 rounded-md bg-gray-100"
                onClick={() => {
                  // Export CSV
                  const header = ['id','createdAt','status','customer_name','email','phone','total','payment_method','payment_provider','payment_reference'];
                  const rows = orders.map(o => [
                    o.id,
                    new Date(o.createdAt).toISOString(),
                    o.status,
                    o.customer?.name ?? '',
                    o.customer?.email ?? '',
                    o.customer?.phone ?? '',
                    (o.totals?.total ?? 0).toFixed(2),
                    o.payment?.method ?? '',
                    o.payment?.provider ?? '',
                    o.payment?.reference ?? '',
                  ]);
                  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}` + '"').join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `orders-${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Orders table */}
          <div className="overflow-x-auto border rounded-lg">
            {orders.filter(o => {
              if (orderStatus !== 'all' && o.status !== orderStatus) return false;
              const q = orderQuery.trim().toLowerCase();
              if (!q) return true;
              const hay = [o.id, o.customer?.name, o.customer?.email, o.customer?.phone].join(' ').toLowerCase();
              return hay.includes(q);
            }).length === 0 ? (
              <div className="p-8">
                <div className="text-center border rounded-lg py-12 px-6 bg-white/40 dark:bg-black/10">
                  <div className="text-5xl mb-3" aria-hidden>📭</div>
                  <h3 className="text-lg font-semibold">No orders match your filters</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clear filters or try searching a different term.</p>
                </div>
              </div>
            ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-left">
                  <th className="px-3 py-2">Ref</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(o => {
                    if (orderStatus !== 'all' && o.status !== orderStatus) return false;
                    const q = orderQuery.trim().toLowerCase();
                    if (!q) return true;
                    const hay = [o.id, o.customer?.name, o.customer?.email, o.customer?.phone].join(' ').toLowerCase();
                    return hay.includes(q);
                  })
                  .sort((a,b)=>{
                    if (orderSort === 'date-desc') return b.createdAt - a.createdAt;
                    if (orderSort === 'date-asc') return a.createdAt - b.createdAt;
                    const ta = a.totals?.total ?? 0; const tb = b.totals?.total ?? 0;
                    if (orderSort === 'total-desc') return tb - ta;
                    if (orderSort === 'total-asc') return ta - tb;
                    return 0;
                  })
                  .map(o => (
                  <tr key={o.id} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-3 py-2 font-mono"><Link to={`/order-success/${o.id}`} className="hover:underline">{o.id.slice(0,10)}</Link></td>
                    <td className="px-3 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{o.customer?.name}<div className="text-xs text-gray-500">{o.customer?.email}</div></td>
                    <td className="px-3 py-2 font-medium">GHC {(o.totals?.total ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{o.payment?.method?.toUpperCase?.()} {o.payment?.provider ? `· ${String(o.payment.provider).toUpperCase()}` : ''}</td>
                    <td className="px-3 py-2">
                      <select value={o.status} onChange={(e)=>updateOrderStatus(o.id, e.target.value)} className="border rounded px-2 py-1 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30">
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 space-x-2">
                      <button className="px-2 py-1 rounded bg-gray-100" onClick={()=>show({type:'info', message:'Pretend email sent to customer'})}>Email</button>
                      <button className="px-2 py-1 rounded bg-gray-100" onClick={()=>show({type:'info', message:'Pretend SMS sent to customer'})}>SMS</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </AdminLayout>
  );
}
