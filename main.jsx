import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import OrdersProvider from './context/OrdersProvider.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { NewsletterProvider } from './context/NewsletterContext.jsx'
import { PromoProvider } from './context/PromoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <ProductsProvider>
              <CartProvider>
                <WishlistProvider>
                  <PromoProvider>
                    <NewsletterProvider>
                      <OrdersProvider>
                        <UIProvider>
                          <ToastProvider>
                            <App />
                          </ToastProvider>
                        </UIProvider>
                      </OrdersProvider>
                    </NewsletterProvider>
                  </PromoProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductsProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
