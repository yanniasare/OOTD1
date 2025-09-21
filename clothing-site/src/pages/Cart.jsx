import { useCart } from '../context/useCart.js';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <section className="space-y-6">
      <Breadcrumbs />
      <h1 className="text-2xl sm:text-3xl font-semibold">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 border rounded-lg dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block px-5 py-2 rounded-md bg-black text-white">Go to Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={`${it.id}-${it.size}`} className="p-4 border rounded-lg dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <img loading="lazy" src={it.image} alt={it.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{it.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Size: {it.size}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">GHC {it.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => updateQuantity(it.id, it.size, Math.max(1, Number(e.target.value)))}
                      className="w-20 border rounded px-2 py-1 dark:bg-gray-900 dark:border-gray-700"
                    />
                    <button onClick={() => removeFromCart(it.id, it.size)} className="text-sm text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="border rounded-lg p-4 space-y-4 h-fit dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium">GHC {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full inline-block text-center px-4 py-2 bg-black text-white rounded-md">Checkout</Link>
            <button onClick={clearCart} className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">Clear Cart</button>
            <p className="text-xs text-gray-600 dark:text-gray-400">Taxes and shipping calculated at checkout.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
