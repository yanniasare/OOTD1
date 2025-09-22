import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api.js';
import { formatCurrency } from '../utils/currency.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setStatus('error');
        setError('Missing payment reference');
        return;
      }
      try {
        const data = await apiFetch('/api/payments/verify', {
          method: 'POST',
          body: { reference },
        });
        setResult(data?.data || null);
        setStatus('success');
      } catch (e) {
        setError(e.message || 'Verification failed');
        setStatus('error');
      }
    }
    verify();
  }, [reference]);

  return (
    <section className="space-y-6">
      <Breadcrumbs />
      {status === 'loading' && (
        <div className="max-w-lg mx-auto text-center p-8 border rounded-lg">
          <div className="mx-auto mb-4 h-8 w-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" aria-hidden />
          <h1 className="text-xl font-semibold">Verifying payment…</h1>
          <p className="text-gray-600 mt-1">Please wait while we confirm your transaction.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Payment successful</h1>
            <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">PAID</span>
          </div>
          <p className="text-gray-600 mt-1">Your order has been confirmed.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded">
              <div className="text-gray-500">Amount</div>
              <div className="font-medium">{formatCurrency(result?.payment?.amount || 0)}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-gray-500">Currency</div>
              <div className="font-medium">{result?.payment?.currency || 'GHS'}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-gray-500">Paid At</div>
              <div className="font-medium">{result?.payment?.paidAt ? new Date(result.payment.paidAt).toLocaleString() : '-'}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-gray-500">Channel</div>
              <div className="font-medium">{result?.payment?.channel || '-'}</div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded text-sm">
            <div className="text-gray-500 mb-1">Order</div>
            {result?.order ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{result.order.orderNumber}</div>
                  <div className="text-gray-600">Status: {result.order.status}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(result.order.total || 0)}</div>
                  <div className="text-gray-600">{new Date(result.order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ) : (
              <div>-</div>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <Link to="/shop" className="px-4 py-2 rounded-md bg-black text-white">Continue Shopping</Link>
            <Link to="/track-order" className="px-4 py-2 rounded-md border">Track Order</Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="max-w-lg mx-auto p-6 border rounded-lg">
          <h1 className="text-2xl font-semibold mb-1">Payment verification failed</h1>
          <p className="text-gray-600">{error || 'We could not verify your payment.'}</p>
          <div className="mt-4 flex gap-2">
            <Link to="/checkout" className="px-4 py-2 rounded-md bg-black text-white">Try Again</Link>
            <Link to="/contact" className="px-4 py-2 rounded-md border">Contact Support</Link>
          </div>
        </div>
      )}
    </section>
  );
}
