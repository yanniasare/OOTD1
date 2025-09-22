import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../context/useProducts.js';
import { useHomeConfig } from '../context/useHomeConfig.js';
import ProductCard from '../components/ProductCard.jsx';
import Carousel from '../components/ui/Carousel.jsx';
import Banner from '../components/ui/Banner.jsx';
import CategoryGrid from '../components/ui/CategoryGrid.jsx';
import ProductSection from '../components/ui/ProductSection.jsx';
import SEO, { generateOrganizationStructuredData } from '../components/SEO.jsx';

export default function Home() {
  const { products, categories, loading } = useProducts();
  const { config } = useHomeConfig();
  const [heroImages] = useState([
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop',
      title: 'Summer Collection 2025',
      subtitle: 'Discover the latest trends for the season',
      buttonText: 'Shop Now',
      buttonLink: '/shop?collection=summer'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop',
      title: 'New Arrivals',
      subtitle: 'Fresh styles just landed',
      buttonText: 'Explore',
      buttonLink: '/shop?category=new'
    },
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
      title: 'Seasonal Sale',
      subtitle: 'Up to 50% off selected items',
      buttonText: 'Shop Sale',
      buttonLink: '/shop?category=sale'
    }
  ]);

  // SEO: basic title/description for Home
  useEffect(() => {
    document.title = 'OOTD — Modern styles for every season';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Discover curated fashion with secure checkout and local support.');
  }, []);

  // Featured products
  const featured = useMemo(() => {
    if (config?.featuredProductIds?.length) {
      const map = new Map((products||[]).map(p=>[p.id,p]));
      return config.featuredProductIds.map(id => map.get(id)).filter(Boolean).slice(0,8);
    }
    return (products || []).slice(0, 8);
  }, [products, config]);

  // New arrivals: most recent products
  const newArrivals = useMemo(() => {
    return [...(products || [])]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 8);
  }, [products]);

  // Best sellers
  const bestSellers = useMemo(() => {
    return [...(products || [])]
      .filter(p => p.bestseller)
      .slice(0, 8);
  }, [products]);

  // Category data for grid
  const categoryData = useMemo(() => {
    return (categories || []).map(category => {
      const productInCategory = (products || []).find(p => p.category === category);
      return {
        name: category,
        image: productInCategory?.image || `https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1600&auto=format&fit=crop`
      };
    }).slice(0, 6);
  }, [categories, products]);

  return (
    <>
      <SEO
        title="OOTD - Easy Brunch Outfits & Casual Fashion | Ghana"
        description="Discover effortless style at OOTD Ghana. Shop easy brunch outfits, casual dresses, and comfortable fashion perfect for everyday wear. Free shipping over GHC 300, 30-day returns."
        keywords="brunch outfits, casual fashion, comfortable clothing, Ghana fashion, women's casual wear, brunch dresses, everyday outfits, OOTD Ghana, lifestyle fashion"
        structuredData={generateOrganizationStructuredData()}
      />
      <div className="space-y-12 md:space-y-16 pb-8">

      {/* Hero Carousel */}
      <div className="-mt-6 md:-mt-12">
        <Carousel
          slides={heroImages.map((hero, index) => (
            <div key={index} className="relative h-[70vh] max-h-[700px] min-h-[500px] w-full">
              <img 
                src={hero.image} 
                alt={hero.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center">
                <div className="container mx-auto px-6 md:px-8">
                  <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                      {hero.title}
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                      {hero.subtitle}
                    </p>
                    <Link 
                      to={hero.buttonLink} 
                      className="inline-block px-8 py-4 bg-white text-black font-medium text-lg rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {hero.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          autoplaySpeed={6000}
          className="w-full"
        />
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-8">Shop by Category</h2>
        <CategoryGrid categories={categoryData} layout="featured" />
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4">
        <ProductSection
          title="New Arrivals"
          subtitle="The latest styles added to our collection"
          products={newArrivals}
          loading={loading}
          viewAllLink="/shop?sort=newest"
        />
      </div>

      {/* Featured Banner */}
      <div className="container mx-auto px-4">
        <Banner
          image="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop"
          title="Summer Essentials"
          subtitle="Curated pieces for warm days ahead"
          buttonText="Shop Collection"
          buttonLink="/shop?collection=summer"
          position="left"
        />
      </div>

      {/* Best Sellers Section */}
      <div className="container mx-auto px-4">
        <ProductSection
          title="Best Sellers"
          subtitle="Our most popular styles"
          products={bestSellers.length ? bestSellers : featured}
          loading={loading}
          viewAllLink="/shop?sort=popular"
        />
      </div>

      {/* Split Banners */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Banner
            image="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"
            title="Office Edit"
            subtitle="Workwear essentials"
            buttonText="Shop Now"
            buttonLink="/shop?collection=work"
            height="h-80"
            position="bottom-left"
          />
          <Banner
            image="https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1200&auto=format&fit=crop"
            title="Sale"
            subtitle="Up to 50% off"
            buttonText="Shop Sale"
            buttonLink="/shop?category=sale"
            height="h-80"
            position="bottom-left"
            dark={true}
          />
        </div>
      </div>

      {/* Instagram Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="section-title">Follow Us @OOTD</h2>
          <p className="text-gray-600 dark:text-gray-400">Tag us in your posts for a chance to be featured</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <a 
              key={i} 
              href="#" 
              className="group aspect-square overflow-hidden"
              aria-label={`Instagram post ${i + 1}`}
            >
              <img 
                src={`https://images.unsplash.com/photo-${1550000000 + i * 10000}?q=80&w=600&auto=format&fit=crop`} 
                alt="Instagram post" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </a>
          ))}
        </div>
      </div>

      </div>
    </>
  );
}