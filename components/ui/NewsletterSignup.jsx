import { useState } from 'react';
import { useNewsletter } from '../../context/NewsletterContext';
import { useToast } from '../../context/ToastContext';

export default function NewsletterSignup({ 
  title = "Subscribe to Our Newsletter",
  subtitle = "Be the first to know about new collections and exclusive offers",
  placeholder = "Your email address",
  buttonText = "Subscribe",
  showPreferences = false,
  className = "",
  variant = "default" // "default", "minimal", "inline"
}) {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    newArrivals: true,
    sales: true,
    exclusiveOffers: true,
    styleGuides: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { subscribe, loading } = useNewsletter();
  const { show } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      show('Please enter your email address', { type: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await subscribe(email.trim(), showPreferences ? preferences : {});
      
      if (result.success) {
        setIsSuccess(true);
        setEmail('');
        show(result.message, { type: 'success' });
        
        // Reset success state after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        show(result.error, { type: 'error' });
      }
    } catch (error) {
      show('Something went wrong. Please try again.', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900"
          disabled={isSubmitting || loading}
        />
        <button
          type="submit"
          disabled={isSubmitting || loading || isSuccess}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? '...' : isSuccess ? '✓' : buttonText}
        </button>
      </form>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-4 ${className}`}>
        <span className="text-sm font-medium">{title}</span>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900"
            disabled={isSubmitting || loading}
          />
          <button
            type="submit"
            disabled={isSubmitting || loading || isSuccess}
            className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isSubmitting || loading ? '...' : isSuccess ? '✓' : 'Join'}
          </button>
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`max-w-xl mx-auto text-center ${className}`}>
      {isSuccess ? (
        <div className="animate-fade-in">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-heading font-medium mb-2">Welcome to OOTD!</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for subscribing. You'll receive our latest updates and exclusive offers.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-heading font-medium mb-3">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{subtitle}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900"
                disabled={isSubmitting || loading}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? 'Subscribing...' : buttonText}
              </button>
            </div>

            {showPreferences && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Email Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.newArrivals}
                      onChange={() => handlePreferenceChange('newArrivals')}
                      className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    New Arrivals
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.sales}
                      onChange={() => handlePreferenceChange('sales')}
                      className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    Sales & Promotions
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.exclusiveOffers}
                      onChange={() => handlePreferenceChange('exclusiveOffers')}
                      className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    Exclusive Offers
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.styleGuides}
                      onChange={() => handlePreferenceChange('styleGuides')}
                      className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    Style Guides
                  </label>
                </div>
              </div>
            )}
          </form>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            By subscribing, you agree to our{' '}
            <a href="/privacy" className="underline hover:no-underline">Privacy Policy</a>{' '}
            and{' '}
            <a href="/terms" className="underline hover:no-underline">Terms of Service</a>.
            You can unsubscribe at any time.
          </p>
        </>
      )}
    </div>
  );
}
