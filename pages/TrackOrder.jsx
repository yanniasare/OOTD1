import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

export default function TrackOrder() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // This would connect to your backend API
      const response = await fetch(`/api/orders/${encodeURIComponent(email.trim())}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data.orders || []);
      } else {
        setError('No orders found for this email address');
        setOrders([]);
      }
    } catch (err) {
      setError('Unable to fetch orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-purple-600 bg-purple-50';
      case 'shipped': return 'text-indigo-600 bg-indigo-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      <SEO 
        title="Track Your Order - OOTD Ghana"
        description="Track your brunch outfit order from OOTD Ghana. Enter your email to see order status and delivery updates."
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Order
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email address to view your brunch outfit orders
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email used for your order"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Track Orders'}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && (
            <div className="space-y-6">
              {orders.length > 0 ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Orders ({orders.length})
                  </h2>
                  
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            GHS {order.total.toFixed(2)}
                          </span>
                        </div>
                        
                        {order.trackingNumber && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Tracking Number: <span className="font-mono font-medium">{order.trackingNumber}</span>
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <Link
                            to={`/order/${order._id}`}
                            className="flex-1 text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            View Details
                          </Link>
                          {order.status === 'pending' && (
                            <button className="flex-1 text-center bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 py-2 px-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't find any orders for this email address.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Shop Brunch Outfits
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Can't find your order? Make sure you're using the same email address you used during checkout.</p>
              <p>
                For additional support, contact us at{' '}
                <Link to="/contact" className="text-black dark:text-white hover:underline">
                  support@theootd.brand
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
