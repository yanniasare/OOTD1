import { Link } from 'react-router-dom';

export default function Banner({
  image,
  title,
  subtitle,
  buttonText = 'Shop Now',
  buttonLink = '/shop',
  overlay = true,
  position = 'center',
  height = 'h-96 md:h-hero',
  className = '',
  imageClassName = '',
  contentClassName = '',
  dark = false
}) {
  // Position classes for content
  const positionClasses = {
    'center': 'items-center justify-center text-center',
    'left': 'items-center justify-start text-left pl-8 md:pl-16',
    'right': 'items-center justify-end text-right pr-8 md:pr-16',
    'bottom-left': 'items-end justify-start text-left p-8 md:p-16',
    'bottom-right': 'items-end justify-end text-right p-8 md:p-16',
    'top-left': 'items-start justify-start text-left p-8 md:p-16',
    'top-right': 'items-start justify-end text-right p-8 md:p-16'
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${height} ${className}`}>
      {/* Background image */}
      <img 
        src={image} 
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover ${imageClassName}`}
        loading="lazy"
      />
      
      {/* Optional overlay */}
      {overlay && (
        <div className={`absolute inset-0 ${dark ? 'bg-black/60' : 'bg-black/30'}`}></div>
      )}
      
      {/* Content */}
      <div className={`relative flex flex-col h-full ${positionClasses[position]} ${contentClassName}`}>
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3">{title}</h2>
          {subtitle && <p className="text-lg md:text-xl text-white/90 mb-6">{subtitle}</p>}
          
          <Link 
            to={buttonLink}
            className="inline-block px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
