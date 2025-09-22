import { useContext, useMemo } from 'react';
import { useProducts } from '../context/useProducts.js';
import { OrdersContext } from '../context/ordersContext.js';
import AdminLayout from '../components/admin/AdminLayout.jsx';

export default function AdminAnalytics() {
  const { products } = useProducts();
  const { orders } = useContext(OrdersContext);

  // Business Analytics
  const analytics = useMemo(() => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Revenue Analytics
    const totalRevenue = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

    const last30DaysRevenue = orders
      .filter(o => o.status === 'paid' && o.createdAt >= thirtyDaysAgo)
      .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

    const last7DaysRevenue = orders
      .filter(o => o.status === 'paid' && o.createdAt >= sevenDaysAgo)
      .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

    // Order Analytics
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;
    const avgOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

    // Product Analytics
    const productSales = new Map();
    const categorySales = new Map();
    
    orders.forEach(order => {
      if (order.status === 'paid' && order.items) {
        order.items.forEach(item => {
          // Product sales
          const productKey = item.name;
          if (!productSales.has(productKey)) {
            productSales.set(productKey, { name: item.name, quantity: 0, revenue: 0 });
          }
          const productData = productSales.get(productKey);
          productData.quantity += item.quantity;
          productData.revenue += (item.price || 0) * item.quantity;

          // Category sales (find product to get category)
          const product = products.find(p => p.name === item.name);
          if (product) {
            const category = product.category;
            if (!categorySales.has(category)) {
              categorySales.set(category, { category, quantity: 0, revenue: 0 });
            }
            const categoryData = categorySales.get(category);
            categoryData.quantity += item.quantity;
            categoryData.revenue += (item.price || 0) * item.quantity;
          }
        });
      }
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const topCategories = Array.from(categorySales.values())
      .sort((a, b) => b.revenue - a.revenue);

    // Customer Analytics
    const customerEmails = new Set();
    const returningCustomers = new Map();
    
    orders.forEach(order => {
      if (order.customer?.email) {
        const email = order.customer.email;
        if (customerEmails.has(email)) {
          returningCustomers.set(email, (returningCustomers.get(email) || 1) + 1);
        } else {
          customerEmails.add(email);
        }
      }
    });

    const totalCustomers = customerEmails.size;
    const repeatCustomers = returningCustomers.size;
    const customerRetentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    // Brunch-specific insights
    const brunchProducts = products.filter(p => 
      p.category === 'Brunch' || 
      p.name.toLowerCase().includes('brunch') ||
      p.description.toLowerCase().includes('brunch')
    );

    const brunchRevenue = Array.from(productSales.values())
      .filter(p => brunchProducts.some(bp => bp.name === p.name))
      .reduce((sum, p) => sum + p.revenue, 0);

    const brunchRevenuePercentage = totalRevenue > 0 ? (brunchRevenue / totalRevenue) * 100 : 0;

    // Inventory insights
    const lowStockProducts = products.filter(p => p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      revenue: {
        total: totalRevenue,
        last30Days: last30DaysRevenue,
        last7Days: last7DaysRevenue,
        avgOrderValue
      },
      orders: {
        total: totalOrders,
        paid: paidOrders,
        conversionRate
      },
      customers: {
        total: totalCustomers,
        returning: repeatCustomers,
        retentionRate: customerRetentionRate
      },
      products: {
        topProducts,
        topCategories,
        brunchRevenue,
        brunchRevenuePercentage
      },
      inventory: {
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        totalValue: totalInventoryValue
      }
    };
  }, [orders, products]);

  // Monthly revenue trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = date.getTime();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
      
      const monthRevenue = orders
        .filter(o => o.status === 'paid' && o.createdAt >= monthStart && o.createdAt <= monthEnd)
        .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      });
    }
    
    return months;
  }, [orders]);

  return (
    <AdminLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Analytics</h1>
          <div className="text-sm text-gray-500">
            OOTD Brunch Fashion Insights
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">GHC {analytics.revenue.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Last 30 days: GHC {analytics.revenue.last30Days.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.orders.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{analytics.orders.paid} of {analytics.orders.total} orders</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                📈
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">GHC {analytics.revenue.avgOrderValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Per paid order</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                🛍️
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Retention</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.customers.retentionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{analytics.customers.returning} returning customers</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                👥
              </div>
            </div>
          </div>
        </div>

        {/* Brunch Brand Insights */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🥂 Brunch Collection Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-pink-600">GHC {analytics.products.brunchRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Brunch Category Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{analytics.products.brunchRevenuePercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Of Total Revenue</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">
                Your signature brunch collection is {analytics.products.brunchRevenuePercentage > 50 ? 'driving' : 'contributing to'} your business success! 
                {analytics.products.brunchRevenuePercentage > 30 ? ' 🎉' : ' Keep promoting these items! 📈'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend (6 Months)</h3>
            <div className="space-y-3">
              {monthlyTrend.map((month, index) => {
                const maxRevenue = Math.max(...monthlyTrend.map(m => m.revenue));
                const width = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="w-16 text-sm text-gray-600">{month.month}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-20 text-sm font-medium text-right">
                      GHC {month.revenue.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Top Categories by Revenue</h3>
            <div className="space-y-3">
              {analytics.products.topCategories.map((category, index) => {
                const maxRevenue = Math.max(...analytics.products.topCategories.map(c => c.revenue));
                const width = maxRevenue > 0 ? (category.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="font-medium">{category.category}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 text-sm font-medium text-right">
                        GHC {category.revenue.toFixed(0)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Best Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Units Sold</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {analytics.products.topProducts.map((product, index) => (
                  <tr key={product.name} className="border-t dark:border-gray-700">
                    <td className="px-4 py-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3 font-medium">GHC {product.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3">GHC {(product.revenue / product.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Insights */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Inventory Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.inventory.lowStock}</div>
              <div className="text-sm text-gray-600">Low Stock Items</div>
              <div className="text-xs text-gray-500">(≤5 units)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-800">{analytics.inventory.outOfStock}</div>
              <div className="text-sm text-gray-600">Out of Stock</div>
              <div className="text-xs text-gray-500">(0 units)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">GHC {analytics.inventory.totalValue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Inventory Value</div>
              <div className="text-xs text-gray-500">(at retail price)</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
