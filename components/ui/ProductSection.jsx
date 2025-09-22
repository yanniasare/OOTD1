import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

export default function ProductSection({ 
  title, 
  subtitle, 
  products = [], 
  viewAllLink = '/shop',
  loading = false,
  columns = {
    sm: 2,
    md: 3,
    lg: 4
  }
}) {
  // Generate grid classes based on columns prop
  const gridClasses = `grid grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-4 md:gap-6`;
  
  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <Link 
          to={viewAllLink} 
          className="mt-2 sm:mt-0 text-sm font-medium inline-flex items-center hover:underline text-black dark:text-white"
        >
          View all
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className={gridClasses}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: columns.md }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-800 aspect-[3/4] rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            </div>
          ))
        ) : products.length > 0 ? (
          // Product cards
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
