import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import NotFound from './pages/NotFound.jsx';
import Toaster from './components/Toaster.jsx';
import MiniCartDrawer from './components/MiniCartDrawer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/authContext.js';
import AdminLogin from './pages/AdminLogin.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import AdminHomeSettings from './pages/AdminHomeSettings.jsx';

const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function Protected({ children }) {
  const { isAdmin } = useContext(AuthContext);
  const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/admin-login';
  if (!isAdmin) return <Navigate to={ADMIN_LOGIN_PATH} replace />;
  return children;
}

function App() {
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith('/admin');
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <ErrorBoundary>
          <Suspense fallback={<div className="py-10 text-center text-gray-600">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path={(import.meta.env.VITE_ADMIN_LOGIN_PATH || '/admin-login')} element={<AdminLogin />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/admin/home-settings" element={<Protected><AdminHomeSettings /></Protected>} />
              <Route path="/admin" element={<Protected><Admin /></Protected>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster />
      {!onAdmin && <MiniCartDrawer />}
    </div>
  );
}

export default App
