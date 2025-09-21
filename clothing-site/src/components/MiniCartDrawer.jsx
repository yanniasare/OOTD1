import { useCart } from '../context/useCart.js';
import { useUI } from '../context/UIContext.jsx';
import { Link } from 'react-router-dom';

export default function MiniCartDrawer() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const { miniCartOpen, closeMiniCart } = useUI();
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const count = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none ${miniCartOpen ? '' : 'invisible'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity pointer-events-auto ${miniCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeMiniCart}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 border-l dark:border-gray-800 shadow-xl transition-transform pointer-events-auto ${
          miniCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold">Your Cart <span className="text-sm text-gray-500">({count})</span></h2>
            <button onClick={closeMiniCart} className="text-gray-500 hover:text-black dark:hover:text-white">✕</button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
            ) : (
              items.map((it) => (
                <div key={`${it.id}-${it.size}`} className="flex items-center gap-3">
                  <img loading="lazy" src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{it.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Size: {it.size}</div>
                    <div className="text-sm">GHC {it.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => updateQuantity(it.id, it.size, Math.max(1, Number(e.target.value)))}
                      className="w-16 border rounded px-2 py-1 dark:bg-gray-900 dark:border-gray-700"
                    />
                    <button className="text-red-600 text-sm" onClick={() => removeFromCart(it.id, it.size)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t dark:border-gray-800 space-y-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">GHC {subtotal.toFixed(2)}</span>
            </div>
            <Link to="/cart" className="block text-center w-full px-4 py-2 bg-black text-white rounded-md">Go to Cart</Link>
            <Link to="/checkout" className="block text-center w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">Checkout</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
