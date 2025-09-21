import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t bg-gray-50 dark:bg-gray-950 border-gray-200/70 dark:border-gray-800/80">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
        {/* Brand summary */}
        <div className="md:col-span-4">
          <div className="text-lg font-semibold">Clothing-Site</div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm">
            Modern styles for every season. Thoughtfully curated fits, sizes, and essentials.
          </p>
        </div>

        {/* Explore */}
        <div className="md:col-span-2">
          <div className="font-semibold mb-3">Explore</div>
          <ul className="space-y-2 text-gray-800 dark:text-gray-200">
            <li><Link className="hover:underline" to="/">Home</Link></li>
            <li><Link className="hover:underline" to="/shop">Shop</Link></li>
            <li><Link className="hover:underline" to="/cart">Cart</Link></li>
            <li><Link className="hover:underline" to="/admin">Admin</Link></li>
          </ul>
        </div>

        {/* Help / Legal placeholders */}
        <div className="md:col-span-3">
          <div className="font-semibold mb-3">Help & Legal</div>
          <ul className="space-y-2 text-gray-800 dark:text-gray-200">
            <li><Link className="hover:underline inline-flex items-center gap-2" to="/faq">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92A2.51 2.51 0 0012 12h-1v-1h1a1.5 1.5 0 00.99-2.57l-1.2-1.2 1.41-1.41 1.2 1.2a3.5 3.5 0 01-.33 5.01z"/></svg>
              FAQ
            </Link></li>
            <li><Link className="hover:underline inline-flex items-center gap-2" to="/contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M21 8V7l-3 2-2-1-3 2-2-1-3 2V8l3-2 2 1 3-2 2 1 3-2zM3 10l3-2 2 1 3-2 2 1 3-2 3 2v8l-3-2-2 1-3-2-2 1-3-2-3 2v-8z"/></svg>
              Contact
            </Link></li>
            <li><a className="hover:underline inline-flex items-center gap-2" href="#" aria-label="Terms">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 2h9l3 3v17a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v18h10V6h-3V4H6z"/></svg>
              Terms
            </a></li>
            <li><a className="hover:underline inline-flex items-center gap-2" href="#" aria-label="Privacy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 1l8 4v6c0 5-3.5 9.74-8 11-4.5-1.26-8-6-8-11V5l8-4z"/></svg>
              Privacy
            </a></li>
          </ul>
        </div>

        {/* Social placeholders */}
        <div className="md:col-span-3">
          <div className="font-semibold mb-3">Follow Us</div>
          <ul className="space-y-2 text-gray-800 dark:text-gray-200">
            <li><a className="hover:underline inline-flex items-center gap-2" href="#" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z"/></svg>
              Instagram
            </a></li>
            <li><a className="hover:underline inline-flex items-center gap-2" href="#" aria-label="Twitter / X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M3 3h4l5 7 5-7h4l-7 9 7 9h-4l-5-7-5 7H3l7-9L3 3z"/></svg>
              Twitter / X
            </a></li>
            <li><a className="hover:underline inline-flex items-center gap-2" href="#" aria-label="Pinterest">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a8 8 0 00-3 15.45l1-3.9a3.99 3.99 0 112.9-6.55c1.3 1.3 1.2 3.4.4 5.2-.5 1.2-1.4 2.3-2.3 3.1l-.2.2-.5 1.9C7.5 20 6 21 6 21l1.1-4.1A8 8 0 1012 2z"/></svg>
              Pinterest
            </a></li>
          </ul>
        </div>
      </div>

      {/* subtle separator */}
      <div className="border-t border-gray-200/70 dark:border-gray-800/80">
        <div className="container mx-auto px-4 py-4 text-xs text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {year} Clothing-Site. All rights reserved.</p>
          <p className="text-gray-600 dark:text-gray-400">Built with React, Vite, and Tailwind.</p>
        </div>
      </div>
    </footer>
  );
}
