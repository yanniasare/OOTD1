import { useCart } from '../context/useCart.js';
import { useUser } from '../context/UserContext.jsx';
import { usePromo } from '../context/PromoContext.jsx';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import PromoCodeInput from '../components/ui/PromoCodeInput.jsx';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const { appliedPromo } = usePromo();
  const [shippingCost] = useState(20); // Fixed shipping cost for demo
  
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  
  const totals = useMemo(() => {
    let discount = 0;
    let finalShipping = shippingCost;
    
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        discount = (subtotal * appliedPromo.value) / 100;
        if (appliedPromo.maxDiscount) {
          discount = Math.min(discount, appliedPromo.maxDiscount);
        }
      } else if (appliedPromo.type === 'fixed') {
        discount = Math.min(appliedPromo.value, subtotal);
      } else if (appliedPromo.type === 'shipping') {
        finalShipping = 0;
        discount = shippingCost;
      }
    }
    
    const total = subtotal - discount + finalShipping;
    
    return {
      subtotal,
      discount: Math.round(discount * 100) / 100,
      shipping: finalShipping,
      total: Math.round(total * 100) / 100,
      freeShipping: appliedPromo?.type === 'shipping'
    };
  }, [subtotal, appliedPromo, shippingCost]);

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
            <h2 className="text-lg font-semibold">Order Summary</h2>
            
            {/* Promo Code Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <PromoCodeInput
                cartTotal={subtotal}
                cartItems={items}
                userEmail={user?.email}
                shippingCost={shippingCost}
              />
            </div>
            
            <div className="space-y-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.discount > 0 && (
                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span className="font-medium">-${totals.discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={totals.freeShipping ? 'line-through' : ''}>
                  {totals.freeShipping ? (
                    <>
                      <span className="line-through">${shippingCost.toFixed(2)}</span>
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium">FREE</span>
                    </>
                  ) : (
                    `$${totals.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link to="/checkout" className="w-full inline-block text-center px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors">
              Proceed to Checkout
            </Link>
            
            <button 
              onClick={clearCart} 
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Cart
            </button>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Secure checkout • 30-day returns • Customer support
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
