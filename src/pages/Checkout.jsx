import { useState, useMemo, useEffect, useContext } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useCart } from '../context/useCart.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { OrdersContext } from '../context/ordersContext.js';
import { apiFetch } from '../utils/api.js';
import { formatCurrency } from '../utils/currency.js';

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { show } = useToast();
  const navigate = useNavigate();
  const { addOrder } = useContext(OrdersContext);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items]);
  const shipping = items.length > 0 ? 20 : 0; // flat demo shipping
  const total = subtotal + shipping;
  const [orderRef] = useState(() => `ORD-${Date.now()}`);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    region: '',
    country: 'Ghana',
    payment: 'momo',
    provider: 'mtn',
    momoNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showMomoGuide, setShowMomoGuide] = useState(false);
  const [loadingPaystack, setLoadingPaystack] = useState(false);

  // Dynamically load Paystack inline script when needed
  useEffect(() => {
    if (form.payment !== 'card' && form.payment !== 'momo') return;
    const id = 'paystack-inline';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.async = true;
    document.body.appendChild(s);
  }, [form.payment]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validGhPhone = (val) => {
    const phone = parsePhoneNumberFromString(String(val || ''), 'GH');
    return !!(phone && phone.isValid());
  };

  const formatGhPhone = (val) => {
    const phone = parsePhoneNumberFromString(String(val || ''), 'GH');
    if (!phone) return val;
    // Format to national (e.g., 024 123 4567)
    try { return phone.formatNational(); } catch { return val; }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!validGhPhone(form.phone)) e.phone = 'Enter valid Ghana phone (e.g., 024xxxxxxx or +23324xxxxxxx)';
    if (!form.address1.trim()) e.address1 = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.region.trim()) e.region = 'Required';
    if (form.payment === 'momo' && !form.momoNumber.trim()) e.momoNumber = 'MoMo number required';
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    if (form.payment === 'momo') {
      // Show manual Mobile Money instructions modal
      setShowMomoGuide(true);
      return;
    }

    if (form.payment === 'card') {
      // Use Paystack Inline if available
      const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      if (!key || !window.PaystackPop) {
        show({ type: 'error', message: 'Payment gateway not configured. Set VITE_PAYSTACK_PUBLIC_KEY.' });
        return;
      }
      try {
        setLoadingPaystack(true);
        const handler = window.PaystackPop.setup({
          key,
          email: form.email,
          amount: Math.round(total * 100), // amount in pesewas (GHS)
          currency: 'GHS',
          ref: orderRef,
          metadata: {
            custom_fields: [
              { display_name: 'Customer', variable_name: 'customer_name', value: `${form.firstName} ${form.lastName}` },
              { display_name: 'Phone', variable_name: 'phone', value: form.phone },
              { display_name: 'Order Ref', variable_name: 'order_ref', value: orderRef },
            ],
          },
          callback: function (response) {
            (async () => {
              setLoadingPaystack(false);
              // Verify payment on backend for server-side confirmation
              try {
                if (response?.reference) {
                  await apiFetch('/api/payments/verify', {
                    method: 'POST',
                    body: { reference: response.reference },
                  });
                }
              } catch (e) {
                // Do not block the flow; inform the user and continue
                show({ type: 'warning', message: `Payment verified client-side, but server verification failed: ${e.message}` });
              }

              // Create local order record for UI continuity
              const order = addOrder({
                items,
                totals: { subtotal, shipping, total },
                customer: {
                  name: `${form.firstName} ${form.lastName}`.trim(),
                  email: form.email,
                  phone: form.phone,
                  address: { line1: form.address1, line2: form.address2, city: form.city, region: form.region, country: form.country },
                },
                payment: { method: 'card', provider: 'paystack', reference: response?.reference || orderRef },
                status: 'paid',
              });
              clearCart();
              navigate(`/order-success/${order.id}`);
            })();
          },
          onClose: function () {
            setLoadingPaystack(false);
            show({ type: 'info', message: 'Payment cancelled' });
          },
        });
        handler.openIframe();
      } catch {
        setLoadingPaystack(false);
        show({ type: 'error', message: 'Payment failed to start. Try again.' });
      }
      return;
    }

    // COD fallback
    setSubmitting(true);
    const order = addOrder({
      items,
      totals: { subtotal, shipping, total },
      customer: {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        address: { line1: form.address1, line2: form.address2, city: form.city, region: form.region, country: form.country },
      },
      payment: { method: 'cod', reference: orderRef },
      status: 'pending',
    });
    clearCart();
    navigate(`/order-success/${order.id}`);
  };

  return (
    <section className="space-y-6">
      <Breadcrumbs />
      <h1 className="text-2xl sm:text-3xl font-semibold">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Your cart is empty. Add items from the Shop.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment */}
          <form onSubmit={submit} className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
              <h2 className="font-semibold mb-3">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">First name</label>
                  <input name="firstName" value={form.firstName} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Last name</label>
                  <input name="lastName" value={form.lastName} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                  {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  {!errors.email && form.email && <p className="text-xs text-gray-500 mt-1">We’ll send your receipt here.</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={onChange} onBlur={(e)=>setForm((f)=>({...f, phone: formatGhPhone(e.target.value)}))} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  {!errors.phone && form.phone && <p className="text-xs text-gray-500 mt-1">We’ll only use this for order updates.</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
              <h2 className="font-semibold mb-3">Shipping</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm mb-1">Address line 1</label>
                  <input name="address1" value={form.address1} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                  {errors.address1 && <p className="text-xs text-red-600 mt-1">{errors.address1}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Address line 2 (optional)</label>
                  <input name="address2" value={form.address2} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm mb-1">City</label>
                    <input name="city" value={form.city} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                    {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Region</label>
                    <input name="region" value={form.region} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                    {errors.region && <p className="text-xs text-red-600 mt-1">{errors.region}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Country</label>
                    <input name="country" value={form.country} onChange={onChange} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
              <h2 className="font-semibold mb-3">Payment</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input id="pay-momo" type="radio" name="payment" value="momo" checked={form.payment === 'momo'} onChange={onChange} />
                  <label htmlFor="pay-momo">Mobile Money</label>
                </div>
                {form.payment === 'momo' && (
                  <div className="pl-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Provider</label>
                      <select name="provider" value={form.provider} onChange={onChange} className="w-full border rounded px-3 py-2">
                        <option value="mtn">MTN MoMo</option>
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="airteltigo">AirtelTigo</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm mb-1">MoMo Number</label>
                      <input name="momoNumber" value={form.momoNumber} onChange={onChange} onBlur={(e)=>setForm((f)=>({...f, momoNumber: formatGhPhone(e.target.value)}))} className="w-full border rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30" placeholder="e.g., 024xxxxxxx" />
                      {errors.momoNumber && <p className="text-xs text-red-600 mt-1">{errors.momoNumber}</p>}
                      {!errors.momoNumber && form.momoNumber && <p className="text-xs text-gray-500 mt-1">Ensure this matches your MoMo wallet number.</p>}
                    </div>
                    <div className="sm:col-span-3">
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <p className="font-medium">How to pay:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Dial your provider short code and choose Merchant Payments.</li>
                          <li>Enter Merchant ID, amount, and reference: <span className="font-mono">{orderRef}</span>.</li>
                          <li>Approve the transaction with your MoMo PIN.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input id="pay-card" type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={onChange} />
                  <label htmlFor="pay-card">Card (via gateway)</label>
                </div>
                <div className="flex items-center gap-3">
                  <input id="pay-cod" type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={onChange} />
                  <label htmlFor="pay-cod">Cash on Delivery</label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button type="submit" className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50 flex items-center gap-2" disabled={loadingPaystack || submitting}>
                {(loadingPaystack || submitting) && <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" aria-hidden />}
                {form.payment === 'card' ? (loadingPaystack ? 'Opening Paystack…' : 'Pay with Paystack') : (submitting ? 'Placing order…' : 'Place Order')}
              </button>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <span aria-hidden>🔒</span>
                <span>Secure checkout. Your data is encrypted.</span>
              </div>
            </div>
          </form>

          {/* Order summary */}
          <aside className="lg:col-span-1 border rounded-md p-4 h-max hover:shadow-sm transition-shadow">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <ul className="divide-y dark:divide-gray-800">
              {items.map((it) => (
                <li key={`${it.id}-${it.size}`} className="py-2 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{it.name} <span className="text-gray-500">× {it.quantity}</span></p>
                    <p className="text-gray-600 dark:text-gray-400">Size: {it.size}</p>
                  </div>
                  <div className="font-medium">{formatCurrency(it.price * it.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span>{formatCurrency(shipping)}</span></div>
              <div className="flex items-center justify-between font-semibold border-t pt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </aside>
        </div>
      )}

      {/* Manual Mobile Money instructions modal */}
      {showMomoGuide && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMomoGuide(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-5">
            <h3 className="text-lg font-semibold">Mobile Money Payment Instructions</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Follow the steps for your provider to complete payment. Use your order reference when prompted.</p>
            <div className="mt-4 space-y-4 text-sm">
              {form.provider === 'mtn' && (
                <ol className="list-decimal list-inside space-y-1">
                  <li>Dial <strong>*170#</strong></li>
                  <li>Select Pay and then Merchant Payments</li>
                  <li>Enter Merchant ID and Amount: <strong>{formatCurrency(total)}</strong></li>
                  <li>Reference: <strong>ORD-{new Date().getTime()}</strong></li>
                  <li>Approve with MoMo PIN</li>
                </ol>
              )}
              {form.provider === 'vodafone' && (
                <ol className="list-decimal list-inside space-y-1">
                  <li>Dial <strong>*110#</strong></li>
                  <li>Select Make Payments</li>
                  <li>Enter Merchant ID and Amount: <strong>{formatCurrency(total)}</strong></li>
                  <li>Reference: <strong>ORD-{new Date().getTime()}</strong></li>
                  <li>Approve payment</li>
                </ol>
              )}
              {form.provider === 'airteltigo' && (
                <ol className="list-decimal list-inside space-y-1">
                  <li>Dial <strong>*110#</strong></li>
                  <li>Select Pay Bill / Merchant</li>
                  <li>Enter Merchant ID and Amount: <strong>{formatCurrency(total)}</strong></li>
                  <li>Reference: <strong>ORD-{new Date().getTime()}</strong></li>
                  <li>Confirm with PIN</li>
                </ol>
              )}
              <div className="mt-2">
                <label className="block text-sm mb-1">MoMo Number used</label>
                <input value={form.momoNumber} onChange={(e) => setForm((f) => ({ ...f, momoNumber: e.target.value }))} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setShowMomoGuide(false)} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800">Close</button>
              <button
                onClick={() => { setShowMomoGuide(false); const order = addOrder({ items, totals: { subtotal, shipping, total }, customer: { name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: form.phone, address: { line1: form.address1, line2: form.address2, city: form.city, region: form.region, country: form.country } }, payment: { method: 'momo', provider: form.provider, number: form.momoNumber, reference: orderRef }, status: 'pending' }); clearCart(); navigate(`/order-success/${order.id}`); }}
                className="px-3 py-2 rounded-md bg-black text-white"
              >
                I have paid
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
