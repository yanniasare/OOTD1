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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <OrdersProvider>
                <UIProvider>
                  <ToastProvider>
                    <App />
                  </ToastProvider>
                </UIProvider>
              </OrdersProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
