import React, { useState } from 'react';
import type { Restaurant } from '../types';
import { generateRestaurantRecommendations, isAIEnabled } from '../services/ai';
import { useLanguage } from '../contexts/LanguageContext';
import diningImage from '../assets/dining.jpg';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onAdd: (restaurant: Omit<Restaurant, 'id' | 'created_at'>) => void;
  onToggleTried: (id: string, tried: boolean) => void;
  onDelete: (id: string) => void;
  tripId: string;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, onAdd, onToggleTried, onDelete, tripId }) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    priceRange: '$',
    location: '',
    description: '',
    url: '',
    rating: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name) return;
    onAdd({
      ...newRestaurant,
      tripId,
      isTried: false,
      rating: newRestaurant.rating ? parseFloat(newRestaurant.rating) : undefined
    });
    setNewRestaurant({
      name: '', cuisine: '', priceRange: '$', location: '', description: '', url: '', rating: '', notes: ''
    });
    setIsAdding(false);
  };

  const handleGenerateRecommendations = async () => {
    if (!isAIEnabled()) {
      alert('Please add VITE_GEMINI_API_KEY to your .env file to use AI features.');
      return;
    }

    const location = prompt('Where are you looking for restaurants?', 'Bangkok');
    if (!location) return;

    const preferences = prompt('Any specific preferences? (e.g., Spicy, Cheap, Romantic)', 'Local gems');

    setIsLoading(true);
    try {
      const recommendations = await generateRestaurantRecommendations(location, preferences || '');
      recommendations.forEach(r => onAdd({
        ...r,
        tripId,
        isTried: false,
        name: r.name || 'Unknown Restaurant'
      }));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      alert('Sorry, AI could not generate recommendations at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sort by rating (descending)
  const sortedRestaurants = [...restaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const topPicks = sortedRestaurants.slice(0, 3);
  const otherSpots = sortedRestaurants.slice(3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-8 group">
        <img src={diningImage} alt="Dining" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{t('dining.hero_title')}</h2>
          <p className="text-white/90 font-medium max-w-xs">{t('dining.hero_subtitle')}</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-violet-500/20 backdrop-blur-md border border-violet-500/30 text-violet-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              ✨ {t('dining.ai_powered')}
            </span>
          </div>
        </div>
      </div>

      {/* Add Button & AI Trigger */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-800/20 hover:bg-slate-900 transition flex items-center gap-2"
        >
          <i className="ph-bold ph-plus"></i> {t('dining.add_recommendation')}
        </button>
      </div>

      {/* Empty State with AI Prompt */}
      {restaurants.length === 0 && !isAdding && (
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-3xl p-8 text-center border border-violet-100 dashed-border relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🤖
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('dining.ai_concierge')}</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">{t('dining.ai_concierge_desc')}</p>
            <button
              onClick={handleGenerateRecommendations}
              disabled={isLoading || !isAIEnabled()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? <i className="ph-bold ph-spinner animate-spin"></i> : '✨'}
              {isLoading ? t('dining.generating') : t('dining.generate_recommendations')}
            </button>
          </div>
        </div>
      )}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-800">New Recommendation</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Restaurant Name"
              value={newRestaurant.name}
              onChange={e => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Cuisine (e.g. Thai, Italian)"
              value={newRestaurant.cuisine}
              onChange={e => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <select
              value={newRestaurant.priceRange}
              onChange={e => setNewRestaurant({ ...newRestaurant, priceRange: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">Price</option>
              <option value="$">$ (Cheap)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Expensive)</option>
            </select>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Rating (0-5)"
              value={newRestaurant.rating}
              onChange={e => setNewRestaurant({ ...newRestaurant, rating: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Area / Location"
              value={newRestaurant.location}
              onChange={e => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <textarea
            placeholder="Description (Short & Punchy)"
            value={newRestaurant.description}
            onChange={e => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 min-h-[60px]"
          />

          <input
            type="url"
            placeholder="Google Maps Link"
            value={newRestaurant.url}
            onChange={e => setNewRestaurant({ ...newRestaurant, url: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 bg-slate-100 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition"
            >
              Save Spot
            </button>
          </div>
        </form>
      )}

      {/* Top Picks Section */}
      {topPicks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-xl">✨</span> AI Top Picks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPicks.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="bg-white p-5 rounded-2xl shadow-lg shadow-indigo-500/5 border border-indigo-50 relative group hover:-translate-y-1 transition duration-300"
              >
                {/* AI Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-t-2xl"></div>

                <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white z-10 text-xs">
                  #{index + 1}
                </div>

                <div className="mb-3 mt-2">
                  <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-indigo-100">
                      🤖 9{9 - index}% Match
                    </span>
                    {restaurant.category && (
                      <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold border border-orange-100">
                        {restaurant.category}
                      </span>
                    )}
                    <span className="text-slate-400 font-mono">{restaurant.priceRange}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 mb-3 h-[3.6em]">
                  {restaurant.description || "No description available."}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                  <button
                    onClick={() => onToggleTried(restaurant.id, !restaurant.isTried)}
                    className={`text - xs font - bold px - 3 py - 2 rounded - xl transition flex items - center gap - 1.5 ${restaurant.isTried
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                      } `}
                  >
                    {restaurant.isTried ? (
                      <>
                        <i className="ph-fill ph-check-circle text-sm"></i> Tried
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-check-circle text-sm"></i> Mark Tried
                      </>
                    )}
                  </button>

                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-indigo-500 transition p-1"
                    >
                      <i className="ph-fill ph-map-pin text-xl"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Spots Section */}
      {otherSpots.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-8 mb-2">More Gems</h3>
          <div className="grid grid-cols-1 gap-3">
            {otherSpots.map(restaurant => (
              <div
                key={restaurant.id}
                className={`bg - white p - 4 rounded - xl shadow - sm border transition flex items - start gap - 4 group ${restaurant.isTried ? 'border-green-200 bg-green-50/30' : 'border-slate-100 hover:shadow-md'
                  } `}
              >
                <button
                  onClick={() => onToggleTried(restaurant.id, !restaurant.isTried)}
                  className={`w - 6 h - 6 rounded - full border - 2 flex items - center justify - center mt - 1 transition ${restaurant.isTried
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 text-transparent hover:border-green-400'
                    } `}
                >
                  <i className="ph-bold ph-check text-xs"></i>
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font - bold text - base ${restaurant.isTried ? 'text-slate-500 line-through' : 'text-slate-800'} `}>
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        {restaurant.rating && <span className="text-orange-500 font-bold">⭐ {restaurant.rating}</span>}
                        {restaurant.category && <span>• {restaurant.category}</span>}
                        {restaurant.cuisine && <span>• {restaurant.cuisine}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => onDelete(restaurant.id)}
                      className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <i className="ph-bold ph-trash"></i>
                    </button>
                  </div>

                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-500 mt-2 hover:underline"
                    >
                      <i className="ph-bold ph-map-pin"></i> View Map
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};
