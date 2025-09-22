import { Link } from 'react-router-dom';

export default function CategoryGrid({ 
  categories = [],
  layout = 'grid', // 'grid' or 'featured'
  className = ''
}) {
  if (categories.length === 0) return null;
  
  if (layout === 'featured') {
    // Featured layout with one large category and others in a grid
    const [featured, ...rest] = categories;
    
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${className}`}>
        {/* Featured category - spans 2 columns on md+ screens */}
        <div className="md:col-span-2">
          <CategoryCard 
            category={featured} 
            className="h-80 md:h-full"
          />
        </div>
        
        {/* Grid of remaining categories */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
          {rest.slice(0, 2).map((category, index) => (
            <CategoryCard 
              key={category.id || index} 
              category={category}
              className="h-60"
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Default grid layout
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {categories.map((category, index) => (
        <CategoryCard 
          key={category.id || index} 
          category={category}
          className="h-60 md:h-72"
        />
      ))}
    </div>
  );
}

function CategoryCard({ category, className = '' }) {
  return (
    <Link 
      to={`/shop?category=${encodeURIComponent(category.name || category)}`}
      className={`group relative overflow-hidden rounded-lg ${className}`}
    >
      <img 
        src={category.image || category.coverImage} 
        alt={category.name || category}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-white">
          {category.name || category}
        </h3>
        <span className="inline-flex items-center text-sm text-white mt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          Shop now
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
