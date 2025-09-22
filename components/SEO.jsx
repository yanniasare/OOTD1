import { useEffect } from 'react';

export default function SEO({
  title = 'OOTD - Modern Fashion for Every Season',
  description = 'Discover curated fashion with OOTD. Shop the latest trends in clothing, dresses, and accessories. Free shipping, easy returns, and secure checkout.',
  keywords = 'fashion, clothing, dresses, online shopping, trendy clothes, women fashion, men fashion, accessories',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  structuredData = null
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'OOTD Fashion');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'OOTD Fashion', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@ootdfashion');

    // Additional SEO tags
    updateMetaTag('theme-color', '#000000');
    updateMetaTag('msapplication-TileColor', '#000000');

    // Structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

  }, [title, description, keywords, image, url, type, structuredData]);

  return null; // This component doesn't render anything
}

// Helper function to generate product structured data
export const generateProductStructuredData = (product) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": product.id,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": "OOTD"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "OOTD Fashion"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1
    } : undefined
  };
};

// Helper function to generate organization structured data
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OOTD Fashion",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "description": "Ghana-based fashion brand specializing in easy brunch outfits and casual fashion. Comfortable, stylish pieces perfect for everyday wear and social occasions.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.instagram.com/theootd.brand?utm_source=ig_web_button_share_sheet&igsh=MXg0d25tMm5wbnRycg==",
      "https://www.tiktok.com/@theootd.brand?_t=ZM-8xZ2nP7J2Xw&_r=1",
      "https://www.facebook.com/ootdfashion"
    ]
  };
};

// Helper function to generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${window.location.origin}${crumb.url}`
    }))
  };
};
