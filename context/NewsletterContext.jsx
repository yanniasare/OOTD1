import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const NewsletterContext = createContext();

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
};

export function NewsletterProvider({ children }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load subscribers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('newsletterSubscribers');
    if (saved) {
      try {
        setSubscribers(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing newsletter subscribers:', error);
        localStorage.removeItem('newsletterSubscribers');
      }
    }
  }, []);

  // Save subscribers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  const subscribe = async (email, preferences = {}) => {
    setLoading(true);
    
    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if already subscribed
      const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
      if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
          throw new Error('This email is already subscribed to our newsletter');
        } else {
          // Reactivate subscription
          const updatedSubscribers = subscribers.map(sub =>
            sub.email.toLowerCase() === email.toLowerCase()
              ? { ...sub, status: 'active', resubscribedAt: new Date().toISOString() }
              : sub
          );
          setSubscribers(updatedSubscribers);
          return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
        }
      }

      // Add new subscriber
      const newSubscriber = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        status: 'active',
        subscribedAt: new Date().toISOString(),
        preferences: {
          newArrivals: true,
          sales: true,
          exclusiveOffers: true,
          styleGuides: false,
          ...preferences
        },
        source: 'website'
      };

      setSubscribers(prev => [...prev, newSubscriber]);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: 'Thank you for subscribing! Check your email for a welcome message.',
        subscriber: newSubscriber
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (email) => {
    try {
      const updatedSubscribers = subscribers.map(sub =>
        sub.email.toLowerCase() === email.toLowerCase()
          ? { ...sub, status: 'unsubscribed', unsubscribedAt: new Date().toISOString() }
          : sub
      );
      
      setSubscribers(updatedSubscribers);
      return { success: true, message: 'You have been unsubscribed successfully.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePreferences = async (email, preferences) => {
    try {
      const updatedSubscribers = subscribers.map(sub =>
        sub.email.toLowerCase() === email.toLowerCase()
          ? { ...sub, preferences: { ...sub.preferences, ...preferences } }
          : sub
      );
      
      setSubscribers(updatedSubscribers);
      return { success: true, message: 'Preferences updated successfully.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isSubscribed = (email) => {
    const subscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
    return subscriber && subscriber.status === 'active';
  };

  const getSubscriber = (email) => {
    return subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  };

  const getStats = () => {
    const activeSubscribers = subscribers.filter(sub => sub.status === 'active');
    const unsubscribed = subscribers.filter(sub => sub.status === 'unsubscribed');
    
    return {
      total: subscribers.length,
      active: activeSubscribers.length,
      unsubscribed: unsubscribed.length,
      growthRate: 0 // Could calculate based on date ranges
    };
  };

  const value = useMemo(() => ({
    subscribers,
    loading,
    subscribe,
    unsubscribe,
    updatePreferences,
    isSubscribed,
    getSubscriber,
    getStats,
  }), [subscribers, loading]);

  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
}
