import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext.js';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Header() {
  const { items } = useCart();
  const { theme, toggle } = useTheme();
  const { openMiniCart } = useUI();
  const { isAdmin, logout } = useContext(AuthContext);
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith('/admin');
  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navClass = ({ isActive }) =>
    `px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? 'text-black dark:text-white border-black dark:border-white'
        : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-black dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-950 shadow-navbar">
      {/* Top announcement bar */}
      <div className="bg-black dark:bg-gray-900 text-white py-2 text-center text-xs">
        <p className="font-medium">Easy brunch outfits & casual fashion · Free shipping over GHC 300 · 30-day returns</p>
      </div>
      
      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-display font-bold tracking-tight">OOTD</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center justify-center space-x-6 flex-1 mx-8">
            <NavLink to="/" className={navClass} end>Home</NavLink>
            <NavLink to="/shop" className={navClass}>Shop</NavLink>
            <NavLink to="/shop?category=Brunch" className={navClass}>Brunch Outfits</NavLink>
            <NavLink to="/shop?category=Casual" className={navClass}>Casual Wear</NavLink>
            <NavLink to="/shop?category=Sale" className={navClass}>Sale</NavLink>
            {isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
          </nav>

          {/* Search, Cart, Order Tracking - Right */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-10 py-2 w-40 lg:w-60 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-gray-50 dark:bg-gray-900"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400"
                  aria-label="Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Order Tracking - replaces account login */}
            <Link 
              to="/track-order" 
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-label="Track Order"
              title="Track your order"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-accent text-white" aria-hidden>
                  {Math.min(wishlistCount, 9)}
                </span>
              )}
            </Link>

            {/* Cart */}
            {!onAdmin && (
              <button
                type="button"
                onClick={openMiniCart}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                aria-label="Open cart drawer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-accent text-white" aria-hidden>
                    {Math.min(count, 9)}
                  </span>
                )}
              </button>
            )}

            {/* Theme Toggle */}
            <button
              aria-label="Toggle dark mode"
              onClick={toggle}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Admin Badge */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 ml-2 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <span className="text-xs text-gray-700 dark:text-gray-300">Admin</span>
                <button
                  onClick={() => { logout(); navigate(import.meta.env.VITE_ADMIN_LOGIN_PATH || '/admin-login', { replace: true }); }}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-gray-50 dark:bg-gray-900"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <nav className="flex flex-col space-y-3">
              <NavLink 
                to="/" 
                className={({isActive}) => `px-2 py-2 ${isActive ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/shop" 
                className={({isActive}) => `px-2 py-2 ${isActive ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </NavLink>
              <NavLink 
                to="/shop?category=Brunch" 
                className={({isActive}) => `px-2 py-2 ${isActive ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Brunch Outfits
              </NavLink>
              <NavLink 
                to="/shop?category=Casual" 
                className={({isActive}) => `px-2 py-2 ${isActive ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Casual Wear
              </NavLink>
              <NavLink 
                to="/shop?category=Sale" 
                className={({isActive}) => `px-2 py-2 ${isActive ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sale
              </NavLink>
              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  className={({isActive}) => `px-2 py-2 ${isActive ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
