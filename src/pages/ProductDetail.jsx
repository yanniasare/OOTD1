import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/useProducts.js';
import { useCart } from '../context/useCart.js';
import SizeGuide from '../components/SizeGuide.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import ImageGallery from '../components/ui/ImageGallery.jsx';
import ProductSection from '../components/ui/ProductSection.jsx';
import SEO, { generateProductStructuredData, generateBreadcrumbStructuredData } from '../components/SEO.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { show } = useToast();
  const { openMiniCart } = useUI();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [openSizeGuide, setOpenSizeGuide] = useState(false);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  
  // Related products: same category, excluding current product
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-medium mb-4">Product Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/shop" 
          className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Create an array of images (use alternate images if available)
  const productImages = [
    product.image,
    ...(product.additionalImages || []),
    // If no additional images, create some variations for demo purposes
    ...((!product.additionalImages || product.additionalImages.length === 0) ? 
      [product.image] : [])
  ];

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      show('Please select a size', { type: 'error' });
      return;
    }
    
    const size = selectedSize || (product.sizes?.[0] || 'One Size');
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      quantity: selectedQuantity
    });
    
    show(`Added ${product.name} to cart`, { type: 'success' });
    
    // Auto-open mini cart
    if (typeof openMiniCart === 'function') openMiniCart();
  };

  const inStock = (product.stock ?? 0) > 0;
  const lowStock = inStock && product.stock <= 5;

  // Generate breadcrumb data for SEO
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product.category, url: `/shop?category=${encodeURIComponent(product.category)}` },
    { name: product.name, url: `/product/${product.id}` }
  ];

  return (
    <>
      <SEO
        title={`${product.name} - ${product.category} | OOTD Fashion`}
        description={`${product.description} Shop ${product.name} at OOTD. Price: GHC ${product.price}. Available sizes: ${product.sizes?.join(', ')}. Free shipping over GHC 300.`}
        keywords={`${product.name}, ${product.category}, fashion, clothing, online shopping, OOTD`}
        image={product.image}
        type="product"
        structuredData={[
          generateProductStructuredData(product),
          generateBreadcrumbStructuredData(breadcrumbs)
        ]}
      />
      <div className="pb-16">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex text-sm">
          <Link to="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">Shop</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link 
            to={`/shop?category=${encodeURIComponent(product.category)}`} 
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            {product.category}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{product.name}</span>
        </nav>
      </div>
      
      {/* Product details */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image gallery */}
          <div>
            <ImageGallery images={productImages} alt={product.name} />
          </div>
          
          {/* Right: Product info */}
          <div className="space-y-6">
            {/* Product title and price */}
            <div>
              <h1 className="text-3xl font-heading font-semibold">{product.name}</h1>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-medium">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Stock status */}
            <div>
              {inStock ? (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">
                    {lowStock ? `Only ${product.stock} left in stock` : 'In Stock'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                  <span className="text-sm">Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
            
            {/* Size selection */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Size</label>
                  <button 
                    type="button" 
                    onClick={() => setOpenSizeGuide(true)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                          : 'bg-white text-black border-gray-300 hover:border-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:border-gray-500'
                      } ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-32">
                <button 
                  type="button" 
                  disabled={selectedQuantity <= 1 || !inStock}
                  onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="flex-1 text-center">{selectedQuantity}</div>
                <button 
                  type="button" 
                  disabled={selectedQuantity >= (product.stock || 10) || !inStock}
                  onClick={() => setSelectedQuantity(prev => prev + 1)}
                  className="px-3 py-2 text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full py-3 px-6 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            {/* Shipping and returns */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h2 className="font-medium mb-4">Shipping & Returns</h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free standard shipping on orders over GHC 300</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free returns within 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Standard shipping: 3-5 business days</span>
                </li>
              </ul>
            </div>
            
            {/* Product details accordion */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer">
                  <h2 className="font-medium">Product Details</h2>
                  <span className="transform group-open:rotate-180 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>SKU: {(product.id || '').slice(0, 8).toUpperCase()}</p>
                  <p>Category: {product.category}</p>
                  {product.material && <p>Material: {product.material}</p>}
                  {product.care && <p>Care: {product.care}</p>}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <ProductSection
            title="You May Also Like"
            products={relatedProducts}
            columns={{ sm: 2, md: 4, lg: 4 }}
          />
        </div>
      )}
      
      {/* Size guide modal */}
      <SizeGuide open={openSizeGuide} onClose={() => setOpenSizeGuide(false)} />
      </div>
    </>
  );
}
