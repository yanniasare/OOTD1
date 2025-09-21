import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/useProducts.js';
import { useCart } from '../context/useCart.js';
import SizeGuide from '../components/SizeGuide.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { show } = useToast();
  const { openMiniCart } = useUI();
  const [selectedSize, setSelectedSize] = useState('');
  const [openSizeGuide, setOpenSizeGuide] = useState(false);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  if (!product) return <p>Product not found.</p>;

  const add = () => {
    if (!selectedSize) {
      show('Please select a size', { type: 'error' });
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize });
    show('Added to cart', { type: 'success' });
    // Auto-open quick cart to confirm add
    if (typeof openMiniCart === 'function') openMiniCart();
  };

  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl shadow-card">
            <img
              loading="lazy"
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover transition-transform duration-300 ease-out hover:scale-105"
            />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-2xl font-semibold">GHC {product.price.toFixed(2)}</p>
            <Badge color={inStock ? 'green' : 'gray'}>
              {inStock ? `In stock (${product.stock})` : 'Out of stock'}
            </Badge>
          </div>
          {inStock && product.stock <= 5 && (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">Hurry — low stock remaining!</p>
          )}
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                title={`Select size ${s}`}
                aria-pressed={selectedSize === s}
                disabled={!inStock}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-2 rounded-md border transition shadow-sm hover:shadow ${
                  selectedSize === s
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40 ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button onClick={add} disabled={!inStock}>
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="secondary" onClick={() => setOpenSizeGuide(true)}>View Size Guide</Button>
          </div>

          {/* Highlights */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Highlights</h2>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-start gap-2"><span aria-hidden className="mt-1 text-green-600">✓</span><span>Free returns within 30 days</span></li>
              <li className="flex items-start gap-2"><span aria-hidden className="mt-1 text-green-600">✓</span><span>Standard shipping 3–5 business days</span></li>
              <li className="flex items-start gap-2"><span aria-hidden className="mt-1 text-green-600">✓</span><span>Secure checkout</span></li>
            </ul>
          </div>

          {/* Product details */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Product details</h2>
            <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 py-2">
                <dt className="text-gray-600 dark:text-gray-400">Category</dt>
                <dd className="text-gray-900 dark:text-gray-100">{product.category}</dd>
              </div>
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 py-2">
                <dt className="text-gray-600 dark:text-gray-400">SKU</dt>
                <dd className="text-gray-900 dark:text-gray-100">{(product.id || '').slice(0, 8).toUpperCase()}</dd>
              </div>
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 py-2">
                <dt className="text-gray-600 dark:text-gray-400">Availability</dt>
                <dd className="text-gray-900 dark:text-gray-100">{inStock ? 'In stock' : 'Out of stock'}</dd>
              </div>
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 py-2">
                <dt className="text-gray-600 dark:text-gray-400">Returns</dt>
                <dd className="text-gray-900 dark:text-gray-100">30-day returns</dd>
              </div>
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 py-2">
                <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
                <dd className="text-gray-900 dark:text-gray-100">3–5 business days</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <SizeGuide open={openSizeGuide} onClose={() => setOpenSizeGuide(false)} />
    </div>
  );
}
