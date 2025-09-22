import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const PromoContext = createContext();

export const usePromo = () => {
  const context = useContext(PromoContext);
  if (!context) {
    throw new Error('usePromo must be used within a PromoProvider');
  }
  return context;
};

// Default promo codes
const defaultPromoCodes = [
  {
    id: 'welcome15',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    description: '15% off your first order',
    minOrderAmount: 0,
    maxDiscount: null,
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    validFrom: new Date('2024-01-01').toISOString(),
    validUntil: new Date('2025-12-31').toISOString(),
    applicableCategories: [],
    firstTimeOnly: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'save20',
    code: 'SAVE20',
    type: 'percentage',
    value: 20,
    description: '20% off orders over $100',
    minOrderAmount: 100,
    maxDiscount: 50,
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    validFrom: new Date('2024-01-01').toISOString(),
    validUntil: new Date('2025-12-31').toISOString(),
    applicableCategories: [],
    firstTimeOnly: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'freeship',
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    description: 'Free shipping on any order',
    minOrderAmount: 0,
    maxDiscount: null,
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    validFrom: new Date('2024-01-01').toISOString(),
    validUntil: new Date('2025-12-31').toISOString(),
    applicableCategories: [],
    firstTimeOnly: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'newuser25',
    code: 'NEWUSER25',
    type: 'fixed',
    value: 25,
    description: '$25 off for new customers',
    minOrderAmount: 75,
    maxDiscount: null,
    usageLimit: 50,
    usedCount: 0,
    isActive: true,
    validFrom: new Date('2024-01-01').toISOString(),
    validUntil: new Date('2025-12-31').toISOString(),
    applicableCategories: [],
    firstTimeOnly: true,
    createdAt: new Date().toISOString()
  }
];

export function PromoProvider({ children }) {
  const [promoCodes, setPromoCodes] = useState(defaultPromoCodes);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [usedPromoCodes, setUsedPromoCodes] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedPromoCodes = localStorage.getItem('promoCodes');
    const savedUsedCodes = localStorage.getItem('usedPromoCodes');
    
    if (savedPromoCodes) {
      try {
        setPromoCodes(JSON.parse(savedPromoCodes));
      } catch (error) {
        console.error('Error parsing promo codes:', error);
      }
    }
    
    if (savedUsedCodes) {
      try {
        setUsedPromoCodes(JSON.parse(savedUsedCodes));
      } catch (error) {
        console.error('Error parsing used promo codes:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem('usedPromoCodes', JSON.stringify(usedPromoCodes));
  }, [usedPromoCodes]);

  const validatePromoCode = (code, cartTotal, cartItems = [], userEmail = null) => {
    const promoCode = promoCodes.find(
      promo => promo.code.toLowerCase() === code.toLowerCase() && promo.isActive
    );

    if (!promoCode) {
      return { valid: false, error: 'Invalid promo code' };
    }

    // Check if code is expired
    const now = new Date();
    const validFrom = new Date(promoCode.validFrom);
    const validUntil = new Date(promoCode.validUntil);

    if (now < validFrom) {
      return { valid: false, error: 'This promo code is not yet active' };
    }

    if (now > validUntil) {
      return { valid: false, error: 'This promo code has expired' };
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return { valid: false, error: 'This promo code has reached its usage limit' };
    }

    // Check if user has already used this code (for first-time only codes)
    if (promoCode.firstTimeOnly && userEmail) {
      const hasUsed = usedPromoCodes.some(
        used => used.code === promoCode.code && used.userEmail === userEmail
      );
      if (hasUsed) {
        return { valid: false, error: 'This promo code can only be used once per customer' };
      }
    }

    // Check minimum order amount
    if (promoCode.minOrderAmount && cartTotal < promoCode.minOrderAmount) {
      return { 
        valid: false, 
        error: `Minimum order amount of $${promoCode.minOrderAmount} required` 
      };
    }

    // Check applicable categories
    if (promoCode.applicableCategories.length > 0) {
      const hasApplicableItems = cartItems.some(item => 
        promoCode.applicableCategories.includes(item.category)
      );
      if (!hasApplicableItems) {
        return { 
          valid: false, 
          error: 'This promo code is not applicable to items in your cart' 
        };
      }
    }

    return { valid: true, promoCode };
  };

  const calculateDiscount = (promoCode, cartTotal, shippingCost = 0) => {
    if (!promoCode) return { discount: 0, newTotal: cartTotal, freeShipping: false };

    let discount = 0;
    let freeShipping = false;

    switch (promoCode.type) {
      case 'percentage':
        discount = (cartTotal * promoCode.value) / 100;
        if (promoCode.maxDiscount) {
          discount = Math.min(discount, promoCode.maxDiscount);
        }
        break;
      
      case 'fixed':
        discount = Math.min(promoCode.value, cartTotal);
        break;
      
      case 'shipping':
        freeShipping = true;
        discount = shippingCost;
        break;
      
      default:
        discount = 0;
    }

    const newTotal = Math.max(0, cartTotal - discount + (freeShipping ? 0 : shippingCost));

    return {
      discount: Math.round(discount * 100) / 100,
      newTotal: Math.round(newTotal * 100) / 100,
      freeShipping,
      type: promoCode.type
    };
  };

  const applyPromoCode = (code, cartTotal, cartItems = [], userEmail = null, shippingCost = 0) => {
    const validation = validatePromoCode(code, cartTotal, cartItems, userEmail);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const discountInfo = calculateDiscount(validation.promoCode, cartTotal, shippingCost);
    
    setAppliedPromo({
      ...validation.promoCode,
      ...discountInfo
    });

    return {
      success: true,
      promo: {
        ...validation.promoCode,
        ...discountInfo
      }
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const markPromoAsUsed = (code, userEmail = null) => {
    // Increment usage count
    setPromoCodes(prev => prev.map(promo => 
      promo.code === code 
        ? { ...promo, usedCount: promo.usedCount + 1 }
        : promo
    ));

    // Add to used codes list
    if (userEmail) {
      const usageRecord = {
        code,
        userEmail,
        usedAt: new Date().toISOString()
      };
      setUsedPromoCodes(prev => [...prev, usageRecord]);
    }
  };

  const addPromoCode = (promoData) => {
    const newPromo = {
      id: crypto.randomUUID(),
      ...promoData,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };
    
    setPromoCodes(prev => [...prev, newPromo]);
    return newPromo;
  };

  const updatePromoCode = (id, updates) => {
    setPromoCodes(prev => prev.map(promo => 
      promo.id === id ? { ...promo, ...updates } : promo
    ));
  };

  const deletePromoCode = (id) => {
    setPromoCodes(prev => prev.filter(promo => promo.id !== id));
  };

  const getActivePromoCodes = () => {
    return promoCodes.filter(promo => promo.isActive);
  };

  const getPromoStats = () => {
    const active = promoCodes.filter(promo => promo.isActive).length;
    const totalUsage = promoCodes.reduce((sum, promo) => sum + promo.usedCount, 0);
    const expired = promoCodes.filter(promo => new Date() > new Date(promo.validUntil)).length;
    
    return {
      total: promoCodes.length,
      active,
      expired,
      totalUsage
    };
  };

  const value = useMemo(() => ({
    promoCodes,
    appliedPromo,
    usedPromoCodes,
    validatePromoCode,
    calculateDiscount,
    applyPromoCode,
    removePromoCode,
    markPromoAsUsed,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    getActivePromoCodes,
    getPromoStats,
  }), [promoCodes, appliedPromo, usedPromoCodes]);

  return (
    <PromoContext.Provider value={value}>
      {children}
    </PromoContext.Provider>
  );
}
