import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/useCart.js';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { show } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  // Use a placeholder for alternate image if not available
  const altImage = product.altImage || product.image;
  const inWishlist = isInWishlist(product.id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has sizes, use the first size as default
    const defaultSize = product.sizes?.[0] || 'One Size';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: defaultSize
    });
    
    show(`Added ${product.name} to cart`, { type: 'success' });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product.id);
    show(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 
      { type: 'success' }
    );
  };

  return (
    <div 
      className="product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        {/* Product image with hover effect */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={isHovered && altImage !== product.image ? altImage : product.image} 
            alt={product.name} 
            className="product-card-image"
            loading="lazy"
          />
          
          {/* Quick add button on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button 
              onClick={handleAddToCart}
              className="w-full py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Add to Cart
            </button>
          </div>
          
          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              inWishlist 
                ? 'bg-accent text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-accent'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill={inWishlist ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>

          {/* Category tag */}
          {product.category && (
            <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {product.category}
            </span>
          )}
          
          {/* Sale or low stock badge */}
          {product.sale && (
            <span className="absolute top-3 right-3 bg-accent text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
          {!product.sale && (product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0 && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </span>
          )}
        </div>
        
        {/* Product info */}
        <div className="product-card-info">
          <h3 className="font-medium text-sm sm:text-base line-clamp-1 group-hover:text-black dark:group-hover:text-white">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="font-medium">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="text-accent mr-2">${product.price.toFixed(2)}</span>
                  <span className="text-gray-500 line-through text-sm">${product.originalPrice.toFixed(2)}</span>
                </>
              ) : (
                <span>${product.price.toFixed(2)}</span>
              )}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
