import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/useProducts';
import { useCart } from '../context/useCart';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { show } = useToast();

  const wishlistProducts = useMemo(() => {
    return wishlistItems
      .map(productId => products.find(p => p.id === productId))
      .filter(Boolean);
  }, [wishlistItems, products]);

  const handleAddToCart = (product) => {
    const defaultSize = product.sizes?.[0] || 'One Size';
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: defaultSize,
      quantity: 1
    });
    show(`Added ${product.name} to cart`, { type: 'success' });
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    show('Removed from wishlist', { type: 'success' });
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      show('Wishlist cleared', { type: 'success' });
    }
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="text-sm text-red-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Save items you love to your wishlist and shop them later
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                
                {/* Remove from wishlist button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Remove from wishlist"
                >
                  <svg
                    className="h-4 w-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </button>

                {/* Quick add to cart button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Wishlist Actions */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  wishlistProducts.forEach(product => handleAddToCart(product));
                }}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
              >
                Add All to Cart
              </button>
              <Link
                to="/shop"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Recently Viewed or Recommendations */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="text-xl font-semibold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => !wishlistItems.includes(p.id))
                .slice(0, 4)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
