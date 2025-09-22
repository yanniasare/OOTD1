import { useContext, useMemo, useState } from 'react';
import { OrdersContext } from '../context/ordersContext.js';
import AdminLayout from '../components/admin/AdminLayout.jsx';

export default function AdminCustomers() {
  const { orders } = useContext(OrdersContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('orders-desc');

  // Process customer data from orders
  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach(order => {
      if (!order.customer?.email) return;

      const email = order.customer.email;
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          email,
          name: order.customer.name || 'N/A',
          phone: order.customer.phone || '',
          orders: [],
          totalSpent: 0,
          firstOrder: order.createdAt,
          lastOrder: order.createdAt,
          status: 'active'
        });
      }

      const customer = customerMap.get(email);
      customer.orders.push(order);
      customer.totalSpent += order.totals?.total || 0;
      customer.firstOrder = Math.min(customer.firstOrder, order.createdAt);
      customer.lastOrder = Math.max(customer.lastOrder, order.createdAt);
      
      // Update name and phone if more recent order has better data
      if (order.createdAt === customer.lastOrder) {
        customer.name = order.customer.name || customer.name;
        customer.phone = order.customer.phone || customer.phone;
      }
    });

    return Array.from(customerMap.values()).map(customer => ({
      ...customer,
      orderCount: customer.orders.length,
      avgOrderValue: customer.totalSpent / customer.orders.length,
      daysSinceLastOrder: Math.floor((Date.now() - customer.lastOrder) / (1000 * 60 * 60 * 24)),
      customerType: customer.orderCount === 1 ? 'New' : 
                   customer.orderCount >= 5 ? 'VIP' : 'Returning',
      lifetimeValue: customer.totalSpent
    }));
  }, [orders]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query)
      );
    }

    // Sort
    const [field, direction] = sortBy.split('-');
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (field) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'orders':
          aVal = a.orderCount;
          bVal = b.orderCount;
          break;
        case 'spent':
          aVal = a.totalSpent;
          bVal = b.totalSpent;
          break;
        case 'last-order':
          aVal = a.lastOrder;
          bVal = b.lastOrder;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [customers, searchQuery, sortBy]);

  // Customer statistics
  const customerStats = useMemo(() => {
    const total = customers.length;
    const newCustomers = customers.filter(c => c.customerType === 'New').length;
    const returningCustomers = customers.filter(c => c.customerType === 'Returning').length;
    const vipCustomers = customers.filter(c => c.customerType === 'VIP').length;
    const avgLifetimeValue = total > 0 ? customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / total : 0;
    const avgOrdersPerCustomer = total > 0 ? customers.reduce((sum, c) => sum + c.orderCount, 0) / total : 0;

    return {
      total,
      newCustomers,
      returningCustomers,
      vipCustomers,
      avgLifetimeValue,
      avgOrdersPerCustomer
    };
  }, [customers]);

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Returning': return 'bg-green-100 text-green-800';
      case 'VIP': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <AdminLayout activeTab="customers">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <div className="text-sm text-gray-500">
            {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>

        {/* Customer Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{customerStats.total}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{customerStats.newCustomers}</div>
            <div className="text-sm text-gray-600">New</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">{customerStats.returningCustomers}</div>
            <div className="text-sm text-gray-600">Returning</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{customerStats.vipCustomers}</div>
            <div className="text-sm text-gray-600">VIP</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">GHC {customerStats.avgLifetimeValue.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Avg LTV</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{customerStats.avgOrdersPerCustomer.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Orders</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="flex-1 border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30"
              >
                <option value="orders-desc">Most Orders</option>
                <option value="orders-asc">Fewest Orders</option>
                <option value="spent-desc">Highest Spent</option>
                <option value="spent-asc">Lowest Spent</option>
                <option value="last-order-desc">Recent Activity</option>
                <option value="last-order-asc">Oldest Activity</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-8">
              <div className="text-center py-12 px-6">
                <div className="text-5xl mb-3" aria-hidden>👥</div>
                <h3 className="text-lg font-semibold">No customers found</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {customers.length === 0 ? 'No orders have been placed yet.' : 'Try adjusting your search criteria.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Orders</th>
                    <th className="px-4 py-3 font-medium">Total Spent</th>
                    <th className="px-4 py-3 font-medium">Avg Order</th>
                    <th className="px-4 py-3 font-medium">First Order</th>
                    <th className="px-4 py-3 font-medium">Last Order</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer.email} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-xs text-gray-500">{customer.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCustomerTypeColor(customer.customerType)}`}>
                          {customer.customerType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {customer.orderCount}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        GHC {customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        GHC {customer.avgOrderValue.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(customer.firstOrder)}
                      </td>
                      <td className="px-4 py-3">
                        <div>{formatDate(customer.lastOrder)}</div>
                        <div className="text-xs text-gray-500">
                          {customer.daysSinceLastOrder} days ago
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button 
                            className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs hover:bg-blue-200 transition-colors"
                            title="Send email"
                          >
                            📧
                          </button>
                          <button 
                            className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs hover:bg-green-200 transition-colors"
                            title="WhatsApp"
                          >
                            💬
                          </button>
                          <button 
                            className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs hover:bg-purple-200 transition-colors"
                            title="View orders"
                          >
                            📋
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

        {/* Customer Insights */}
        {customers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Top Customers by Spending</h3>
              <div className="space-y-3">
                {customers
                  .sort((a, b) => b.totalSpent - a.totalSpent)
                  .slice(0, 5)
                  .map((customer, index) => (
                    <div key={customer.email} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.orderCount} orders</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">GHC {customer.totalSpent.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {customers
                  .sort((a, b) => b.lastOrder - a.lastOrder)
                  .slice(0, 5)
                  .map((customer) => (
                    <div key={customer.email} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{formatDate(customer.lastOrder)}</div>
                        <div className="text-xs text-gray-500">{customer.daysSinceLastOrder} days ago</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
