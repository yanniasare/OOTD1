import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from './UserContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export function WishlistProvider({ children }) {
  const { user, isLoggedIn, addToWishlist: addToUserWishlist, removeFromWishlist: removeFromUserWishlist } = useUser();
  const [guestWishlist, setGuestWishlist] = useState([]);

  // Load guest wishlist from localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem('guestWishlist');
      if (saved) {
        try {
          setGuestWishlist(JSON.parse(saved));
        } catch (error) {
          console.error('Error parsing guest wishlist:', error);
          localStorage.removeItem('guestWishlist');
        }
      }
    }
  }, [isLoggedIn]);

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
    }
  }, [guestWishlist, isLoggedIn]);

  // Merge guest wishlist with user wishlist when user logs in
  useEffect(() => {
    if (isLoggedIn && guestWishlist.length > 0) {
      // Merge guest wishlist items with user's wishlist
      const userWishlist = user?.wishlist || [];
      const mergedWishlist = [...new Set([...userWishlist, ...guestWishlist])];
      
      // Update user's wishlist with merged items
      if (mergedWishlist.length > userWishlist.length) {
        // Only update if there are new items to add
        mergedWishlist.forEach(productId => {
          if (!userWishlist.includes(productId)) {
            addToUserWishlist(productId);
          }
        });
      }
      
      // Clear guest wishlist
      setGuestWishlist([]);
      localStorage.removeItem('guestWishlist');
    }
  }, [isLoggedIn, user, guestWishlist, addToUserWishlist]);

  const wishlistItems = useMemo(() => {
    if (isLoggedIn) {
      return user?.wishlist || [];
    }
    return guestWishlist;
  }, [isLoggedIn, user?.wishlist, guestWishlist]);

  const addToWishlist = (productId) => {
    if (isLoggedIn) {
      addToUserWishlist(productId);
    } else {
      setGuestWishlist(prev => {
        if (!prev.includes(productId)) {
          return [...prev, productId];
        }
        return prev;
      });
    }
  };

  const removeFromWishlist = (productId) => {
    if (isLoggedIn) {
      removeFromUserWishlist(productId);
    } else {
      setGuestWishlist(prev => prev.filter(id => id !== productId));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const clearWishlist = () => {
    if (isLoggedIn) {
      // Clear user's wishlist
      const userWishlist = user?.wishlist || [];
      userWishlist.forEach(productId => removeFromUserWishlist(productId));
    } else {
      setGuestWishlist([]);
    }
  };

  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  }), [wishlistItems]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
