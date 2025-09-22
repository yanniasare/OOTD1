import { useState } from 'react';

export default function ImageGallery({ 
  images = [], 
  alt = 'Product image',
  className = ''
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // If no images provided, return null
  if (!images || images.length === 0) return null;
  
  // If only one image, show it full width without thumbnails
  if (images.length === 1) {
    return (
      <div className={`overflow-hidden rounded-lg ${className}`}>
        <img 
          src={images[0]} 
          alt={alt} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main selected image */}
      <div className="overflow-hidden rounded-lg aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/9]">
        <img 
          src={images[selectedImage]} 
          alt={`${alt} - View ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`overflow-hidden rounded-md aspect-square ${
              selectedImage === index 
                ? 'ring-2 ring-black dark:ring-white' 
                : 'ring-1 ring-gray-200 dark:ring-gray-800 opacity-70 hover:opacity-100'
            }`}
            aria-label={`View image ${index + 1}`}
            aria-current={selectedImage === index}
          >
            <img 
              src={image} 
              alt={`${alt} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
