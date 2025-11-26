import React, { useState } from 'react';
import type { Restaurant } from '../types';
import { RECOMMENDED_RESTAURANTS } from '../data/recommendations';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onAdd: (restaurant: any) => void;
  onToggleTried: (id: string, isTried: boolean) => void;
  onDelete: (id: string) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, onAdd, onToggleTried, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    priceRange: '',
    rating: '',
    location: '',
    description: '',
    url: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name) return;
    onAdd({
      ...newRestaurant,
      rating: newRestaurant.rating ? parseFloat(newRestaurant.rating) : undefined
    });
    setNewRestaurant({ name: '', cuisine: '', priceRange: '', rating: '', location: '', description: '', url: '', notes: '' });
    setIsAdding(false);
  };

  const handleAutoFill = () => {
    if (confirm('Add 10 recommended spots to your list?')) {
      RECOMMENDED_RESTAURANTS.forEach(r => onAdd(r));
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold hover:border-orange-400 hover:text-orange-500 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Add Recommendation
        </button>
      ) : (
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

      <div className="grid grid-cols-1 gap-4">
        {restaurants.map(restaurant => (
          <div
            key={restaurant.id}
            className={`bg-white p-5 rounded-2xl shadow-sm border transition relative group ${restaurant.isTried ? 'border-green-200 bg-green-50/30' : 'border-slate-100 hover:shadow-md'
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${restaurant.isTried ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {restaurant.name}
                  </h3>
                  {restaurant.rating && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      ⭐ {restaurant.rating}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {restaurant.cuisine && <span className="font-semibold text-slate-600">{restaurant.cuisine}</span>}
                  {restaurant.cuisine && restaurant.priceRange && <span>•</span>}
                  {restaurant.priceRange && <span className="font-mono text-slate-400">{restaurant.priceRange}</span>}
                  {(restaurant.cuisine || restaurant.priceRange) && restaurant.location && <span>•</span>}
                  {restaurant.location && <span>📍 {restaurant.location}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onToggleTried(restaurant.id, !restaurant.isTried)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${restaurant.isTried
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-200 text-slate-300 hover:border-green-400 hover:text-green-400'
                    }`}
                  title={restaurant.isTried ? "Mark as not tried" : "Mark as tried"}
                >
                  <i className="ph-bold ph-check"></i>
                </button>
                <button
                  onClick={() => onDelete(restaurant.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <i className="ph-bold ph-trash"></i>
                </button>
              </div>
            </div>

            {restaurant.description && (
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                {restaurant.description}
              </p>
            )}

            {restaurant.notes && (
              <div className="text-xs text-slate-400 italic mb-3 bg-slate-50 p-2 rounded">
                📝 Note: {restaurant.notes}
              </div>
            )}

            {restaurant.url && (
              <a
                href={restaurant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-500 hover:underline"
              >
                <i className="ph-bold ph-map-pin"></i> View on Google Maps
              </a>
            )}
          </div>
        ))}
        {restaurants.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-slate-800 font-bold mb-1">Hungry?</h3>
            <p className="text-slate-400 text-sm mb-4">Add some restaurant recommendations!</p>
            <button
              onClick={handleAutoFill}
              className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-sky-500 transition"
            >
              ✨ Auto-Fill Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
