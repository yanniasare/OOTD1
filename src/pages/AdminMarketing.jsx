import { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';

export default function AdminMarketing() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState('campaigns');

  // Mock data for promotions (in real app, this would come from context/API)
  const [promotions, setPromotions] = useState([
    {
      id: '1',
      name: 'Brunch Babe Weekend',
      type: 'percentage',
      value: 20,
      code: 'BRUNCHBABE20',
      description: 'Perfect outfits for your weekend brunch dates',
      startDate: '2024-01-15',
      endDate: '2024-01-31',
      status: 'active',
      usageCount: 15,
      usageLimit: 100,
      categories: ['Brunch', 'Casual'],
      minOrderValue: 150
    },
    {
      id: '2',
      name: 'New Customer Welcome',
      type: 'fixed',
      value: 25,
      code: 'WELCOME25',
      description: 'Welcome to OOTD! Get GHS 25 off your first brunch outfit',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      usageCount: 8,
      usageLimit: null,
      categories: [],
      minOrderValue: 100
    }
  ]);

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'percentage',
    value: '',
    code: '',
    description: '',
    startDate: '',
    endDate: '',
    categories: [],
    minOrderValue: '',
    usageLimit: ''
  });

  // Marketing campaigns for Ghana market
  const marketingCampaigns = [
    {
      id: '1',
      name: 'Instagram Brunch Stories',
      platform: 'Instagram',
      type: 'Social Media',
      status: 'active',
      reach: '2.5K',
      engagement: '8.2%',
      budget: 'GHS 200',
      description: 'Showcase brunch outfits with local influencers'
    },
    {
      id: '2',
      name: 'TikTok Outfit Transitions',
      platform: 'TikTok',
      type: 'Video Content',
      status: 'planned',
      reach: '0',
      engagement: '0%',
      budget: 'GHS 150',
      description: 'Quick outfit change videos for brunch dates'
    },
    {
      id: '3',
      name: 'WhatsApp Business Catalog',
      platform: 'WhatsApp',
      type: 'Direct Marketing',
      status: 'active',
      reach: '500',
      engagement: '15.3%',
      budget: 'GHS 50',
      description: 'Share new arrivals with existing customers'
    }
  ];

  // Ghana-specific marketing ideas
  const ghanaMarketingIdeas = [
    {
      title: 'Mobile Money Promotions',
      description: 'Special discounts for MTN Mobile Money and Vodafone Cash payments',
      priority: 'high',
      effort: 'medium',
      impact: 'high'
    },
    {
      title: 'Accra Brunch Spots Partnership',
      description: 'Partner with popular brunch spots in Accra for cross-promotion',
      priority: 'high',
      effort: 'high',
      impact: 'high'
    },
    {
      title: 'University Campus Ambassadors',
      description: 'Student ambassadors at University of Ghana, KNUST for brand awareness',
      priority: 'medium',
      effort: 'high',
      impact: 'medium'
    },
    {
      title: 'Local Fashion Bloggers',
      description: 'Collaborate with Ghanaian fashion influencers and bloggers',
      priority: 'high',
      effort: 'medium',
      impact: 'high'
    }
  ];

  const handleCreatePromotion = (e) => {
    e.preventDefault();
    const promotion = {
      ...newPromotion,
      id: Date.now().toString(),
      status: 'active',
      usageCount: 0,
      categories: newPromotion.categories.filter(Boolean)
    };
    setPromotions([...promotions, promotion]);
    setNewPromotion({
      name: '',
      type: 'percentage',
      value: '',
      code: '',
      description: '',
      startDate: '',
      endDate: '',
      categories: [],
      minOrderValue: '',
      usageLimit: ''
    });
    show('Promotion created successfully!', { type: 'success' });
  };

  const togglePromotionStatus = (id) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p
    ));
    show('Promotion status updated', { type: 'success' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout activeTab="marketing">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing & Promotions</h1>
          <div className="text-sm text-gray-500">
            Grow your brunch fashion brand in Ghana
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'campaigns', label: 'Campaigns', icon: '📢' },
              { id: 'promotions', label: 'Promotions', icon: '🎯' },
              { id: 'ideas', label: 'Ghana Market Ideas', icon: '🇬🇭' },
              { id: 'social', label: 'Social Media', icon: '📱' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Active Marketing Campaigns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketingCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Platform:</span>
                        <span className="font-medium">{campaign.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reach:</span>
                        <span className="font-medium">{campaign.reach}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Engagement:</span>
                        <span className="font-medium">{campaign.engagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">{campaign.budget}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{campaign.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            {/* Create New Promotion */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Create New Promotion</h3>
              <form onSubmit={handleCreatePromotion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Promotion Name</label>
                  <input
                    type="text"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., Summer Brunch Special"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={newPromotion.code}
                    onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value.toUpperCase()})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., BRUNCH20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (GHS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({...newPromotion, value: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder={newPromotion.type === 'percentage' ? '20' : '50'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Order Value (GHS)</label>
                  <input
                    type="number"
                    value={newPromotion.minOrderValue}
                    onChange={(e) => setNewPromotion({...newPromotion, minOrderValue: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newPromotion.usageLimit}
                    onChange={(e) => setNewPromotion({...newPromotion, usageLimit: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    placeholder="Describe this promotion..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Promotion
                  </button>
                </div>
              </form>
            </div>

            {/* Active Promotions */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Active Promotions</h3>
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <div key={promo.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{promo.name}</h4>
                        <p className="text-sm text-gray-600">Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{promo.code}</span></p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(promo.status)}`}>
                          {promo.status}
                        </span>
                        <button
                          onClick={() => togglePromotionStatus(promo.id)}
                          className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          {promo.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Discount:</span>
                        <div className="font-medium">
                          {promo.type === 'percentage' ? `${promo.value}%` : `GHS ${promo.value}`}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Usage:</span>
                        <div className="font-medium">
                          {promo.usageCount}{promo.usageLimit ? `/${promo.usageLimit}` : ''}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Valid Until:</span>
                        <div className="font-medium">{new Date(promo.endDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Min Order:</span>
                        <div className="font-medium">GHS {promo.minOrderValue}</div>
                      </div>
                    </div>
                    {promo.description && (
                      <p className="text-sm text-gray-600 mt-2">{promo.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ghana Market Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                🇬🇭 Ghana Market Opportunities
              </h3>
              <p className="text-gray-600 mb-4">
                Tailored marketing strategies for the Ghanaian fashion market, focusing on your brunch outfit niche.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ghanaMarketingIdeas.map((idea, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg">{idea.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(idea.priority)}`}>
                      {idea.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{idea.description}</p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Effort: </span>
                      <span className="font-medium">{idea.effort}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Impact: </span>
                      <span className="font-medium">{idea.impact}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                    Plan Campaign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Social Media Integration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Instagram (@theootd.brand)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Followers:</span>
                      <span className="font-medium">638</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Posts:</span>
                      <span className="font-medium">40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Rate:</span>
                      <span className="font-medium">8.2%</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors">
                    Sync Instagram Shop
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">TikTok (@theootd.brand)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Followers:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Videos:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span className="font-medium">-</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                    Connect TikTok Shop
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Content Ideas for Brunch Fashion</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Brunch Date Outfit Transitions', platform: 'TikTok', engagement: 'High' },
                  { title: 'Styling Tips for Weekend Brunch', platform: 'Instagram', engagement: 'Medium' },
                  { title: 'Customer Brunch Outfit Reviews', platform: 'Instagram Stories', engagement: 'High' },
                  { title: 'Behind the Scenes: Photoshoot', platform: 'TikTok', engagement: 'Medium' },
                  { title: 'Mix & Match Brunch Pieces', platform: 'Instagram Reels', engagement: 'High' },
                  { title: 'Seasonal Brunch Collections', platform: 'Instagram Feed', engagement: 'Medium' }
                ].map((content, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">{content.title}</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Platform: {content.platform}</div>
                      <div>Expected Engagement: {content.engagement}</div>
                    </div>
                    <button className="mt-3 w-full px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors">
                      Create Content
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
