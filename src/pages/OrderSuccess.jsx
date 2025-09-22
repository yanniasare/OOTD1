import { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrdersContext } from '../context/ordersContext.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  const { getOrder } = useContext(OrdersContext);
  const order = getOrder(id);

  if (!order) {
    return (
      <section className="space-y-6">
        <Breadcrumbs />
        <h1 className="text-2xl sm:text-3xl font-semibold">Order Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300">We couldn't find an order with that reference.</p>
        <Link to="/shop" className="inline-block px-4 py-2 bg-black text-white rounded-md">Continue Shopping</Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-xl border bg-white/60 dark:bg-black/20 backdrop-blur p-6 flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold">Thank you! Your order is confirmed.</h1>
          <p className="text-gray-700 dark:text-gray-300 mt-1">Order ref: <span className="font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{order.id}</span></p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Items ({order.items.length})</h2>
              <Link to="/shop" className="text-sm text-blue-600 hover:text-blue-800">Continue shopping</Link>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {order.items.map((it) => (
                <li key={`${it.id}-${it.size}`} className="py-3 flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{it.name} <span className="text-gray-500">× {it.quantity}</span></p>
                    <p className="text-gray-600 dark:text-gray-400">Size: {it.size}</p>
                  </div>
                  <div className="font-medium">GHC {(it.price * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <h2 className="font-semibold mb-2">Shipping details</h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
              <p>{order.customer?.name}</p>
              <p>{order.customer?.email}</p>
              <p>{order.customer?.phone}</p>
              <p>{order.customer?.address?.line1}{order.customer?.address?.line2 ? `, ${order.customer.address.line2}` : ''}</p>
              <p>{order.customer?.address?.city}, {order.customer?.address?.region}, {order.customer?.address?.country}</p>
            </div>
          </div>
        </div>

        <aside className="border rounded-lg p-4 h-max hover:shadow-sm transition-shadow">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span>GHC {order.totals?.subtotal?.toFixed?.(2) ?? '0.00'}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span>GHC {order.totals?.shipping?.toFixed?.(2) ?? '0.00'}</span></div>
            <div className="flex items-center justify-between font-semibold border-t pt-2"><span>Total</span><span>GHC {order.totals?.total?.toFixed?.(2) ?? '0.00'}</span></div>
          </div>
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>Payment: <strong>{order.payment?.method?.toUpperCase?.() || 'N/A'}</strong>{order.payment?.provider ? ` · ${String(order.payment.provider).toUpperCase()}` : ''}</p>
            {order.payment?.reference && <p>Ref: <span className="font-mono">{order.payment.reference}</span></p>}
            <p>Status: <span className="uppercase font-medium">{order.status}</span></p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => window.print()} className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-900">Print</button>
            <button onClick={() => navigator.share?.({ title: 'Order', text: `Order ${order.id}`, url: location.href })}
              className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-900">Share</button>
            <Link to="/shop" className="col-span-2 text-center px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">Continue Shopping</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
