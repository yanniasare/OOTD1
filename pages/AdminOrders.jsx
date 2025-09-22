import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrdersContext } from '../context/ordersContext.js';
import { useToast } from '../context/ToastContext.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useContext(OrdersContext);
  const { show } = useToast();
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');
  const [orderSort, setOrderSort] = useState('date-desc');

  // Order statistics
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const paid = orders.filter(o => o.status === 'paid').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

    return { total, pending, paid, shipped, cancelled, totalRevenue };
  }, [orders]);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        if (orderStatus !== 'all' && o.status !== orderStatus) return false;
        const q = orderQuery.trim().toLowerCase();
        if (!q) return true;
        const hay = [o.id, o.customer?.name, o.customer?.email, o.customer?.phone].join(' ').toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => {
        if (orderSort === 'date-desc') return b.createdAt - a.createdAt;
        if (orderSort === 'date-asc') return a.createdAt - b.createdAt;
        const ta = a.totals?.total ?? 0; 
        const tb = b.totals?.total ?? 0;
        if (orderSort === 'total-desc') return tb - ta;
        if (orderSort === 'total-asc') return ta - tb;
        return 0;
      });
  }, [orders, orderQuery, orderStatus, orderSort]);

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    show(`Order ${orderId.slice(0, 8)} updated to ${newStatus}`, { type: 'success' });
  };

  const exportOrders = () => {
    const header = ['id', 'createdAt', 'status', 'customer_name', 'email', 'phone', 'total', 'payment_method', 'payment_provider', 'payment_reference'];
    const rows = filteredOrders.map(o => [
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
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
          <div className="text-sm text-gray-500">
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{orderStats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{orderStats.paid}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{orderStats.shipped}</div>
            <div className="text-sm text-gray-600">Shipped</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">GHC {orderStats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <input 
                value={orderQuery} 
                onChange={(e) => setOrderQuery(e.target.value)} 
                placeholder="Search by ref, name, email, phone" 
                className="w-full md:w-64 border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" 
              />
              <label className="text-sm text-gray-600">Status</label>
              <select 
                value={orderStatus} 
                onChange={(e) => setOrderStatus(e.target.value)} 
                className="border rounded px-2 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <label className="text-sm text-gray-600">Sort</label>
              <select 
                value={orderSort} 
                onChange={(e) => setOrderSort(e.target.value)} 
                className="border rounded px-2 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
              >
                <option value="date-desc">Date (newest)</option>
                <option value="date-asc">Date (oldest)</option>
                <option value="total-desc">Total (high-low)</option>
                <option value="total-asc">Total (low-high)</option>
              </select>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={exportOrders}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8">
              <div className="text-center py-12 px-6">
                <div className="text-5xl mb-3" aria-hidden>📭</div>
                <h3 className="text-lg font-semibold">No orders match your filters</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clear filters or try searching a different term.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3">
                        <Link 
                          to={`/order-success/${o.id}`} 
                          className="font-mono text-blue-600 hover:underline"
                        >
                          {o.id.slice(0, 10)}...
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div>{new Date(o.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.customer?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{o.customer?.email}</div>
                        {o.customer?.phone && (
                          <div className="text-xs text-gray-500">{o.customer.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {o.items?.length || 0} item(s)
                        </div>
                        {o.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-500 truncate">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                        {o.items?.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{o.items.length - 2} more
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        GHC {(o.totals?.total ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{o.payment?.method?.toUpperCase?.() || 'N/A'}</div>
                        {o.payment?.provider && (
                          <div className="text-xs text-gray-500">
                            {String(o.payment.provider).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select 
                          value={o.status} 
                          onChange={(e) => handleStatusUpdate(o.id, e.target.value)} 
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(o.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button 
                            className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs hover:bg-blue-200 transition-colors" 
                            onClick={() => show('Email notification sent (demo)', { type: 'info' })}
                            title="Send email notification"
                          >
                            📧
                          </button>
                          <button 
                            className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs hover:bg-green-200 transition-colors" 
                            onClick={() => show('WhatsApp message sent (demo)', { type: 'info' })}
                            title="Send WhatsApp message"
                          >
                            💬
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
