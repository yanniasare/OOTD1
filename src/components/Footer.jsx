import { Link } from 'react-router-dom';
import NewsletterSignup from './ui/NewsletterSignup.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter signup */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <NewsletterSignup />
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl font-display font-bold tracking-tight">OOTD</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Easy brunch outfits and effortless casual fashion. Comfortable, stylish pieces for your everyday moments and social occasions.
            </p>
            <div className="space-y-4">
              <h3 className="font-medium">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/theootd.brand?utm_source=ig_web_button_share_sheet&igsh=MXg0d25tMm5wbnRycg==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@theootd.brand?_t=ZM-8xZ2nP7J2Xw&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Follow us on TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop?category=Brunch" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Brunch Outfits</Link></li>
              <li><Link to="/shop?category=Casual" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Casual Wear</Link></li>
              <li><Link to="/shop?category=Dresses" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Dresses</Link></li>
              <li><Link to="/shop?category=Tops" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Tops & Blouses</Link></li>
              <li><Link to="/shop?category=Accessories" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Accessories</Link></li>
              <li><Link to="/shop?category=Sale" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Sale</Link></li>
            </ul>
          </div>

          {/* Help column */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-5">Help</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Shipping & Returns</Link></li>
              <li><Link to="/track-order" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Track Order</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Size Guide</Link></li>
            </ul>
          </div>

          {/* About column */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-5">About</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Our Story</Link></li>
              <li><Link to="/sustainability" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Sustainability</Link></li>
              <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Careers</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {year} OOTD. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="hover:text-black dark:hover:text-white">Terms</Link>
              <Link to="/privacy" className="hover:text-black dark:hover:text-white">Privacy</Link>
              <Link to="/cookies" className="hover:text-black dark:hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
