import { useState } from 'react';
import { usePromo } from '../../context/PromoContext';
import { useToast } from '../../context/ToastContext';

export default function PromoCodeInput({ 
  cartTotal, 
  cartItems = [], 
  userEmail = null, 
  shippingCost = 0,
  onPromoApplied = () => {},
  onPromoRemoved = () => {},
  className = ""
}) {
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  
  const { appliedPromo, applyPromoCode, removePromoCode } = usePromo();
  const { show } = useToast();

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      show('Please enter a promo code', { type: 'error' });
      return;
    }

    setIsApplying(true);
    
    try {
      const result = applyPromoCode(
        promoCode.trim(), 
        cartTotal, 
        cartItems, 
        userEmail, 
        shippingCost
      );
      
      if (result.success) {
        show(`Promo code applied! You saved $${result.promo.discount.toFixed(2)}`, { type: 'success' });
        setPromoCode('');
        onPromoApplied(result.promo);
      } else {
        show(result.error, { type: 'error' });
      }
    } catch (error) {
      show('Failed to apply promo code. Please try again.', { type: 'error' });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    show('Promo code removed', { type: 'success' });
    onPromoRemoved();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {appliedPromo ? (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {appliedPromo.code} applied
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {appliedPromo.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              -${appliedPromo.discount.toFixed(2)}
            </span>
            <button
              onClick={handleRemovePromo}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              aria-label="Remove promo code"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900 text-sm"
              disabled={isApplying}
            />
          </div>
          <button
            type="submit"
            disabled={isApplying || !promoCode.trim()}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}
      
      {/* Available promo codes hint */}
      {!appliedPromo && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Available codes: WELCOME15, SAVE20, FREESHIP, NEWUSER25</p>
        </div>
      )}
    </div>
  );
}
