import React, { useState, useMemo } from 'react';
import type { PackingItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { type WeatherData } from '../services/weather';
import packingHero from '../assets/packing_hero.png';
import emptyPacking from '../assets/empty_packing.png';

interface PackingListProps {
  items: PackingItem[];
  onAdd: (item: Omit<PackingItem, 'id' | 'created_at'>) => void;
  onUpdate: (id: string, updates: Partial<PackingItem>) => void;
  onDelete: (id: string) => void;
  tripId: string;
  weatherForecast?: WeatherData[];
}

const CATEGORIES = ['Essentials', 'Clothing', 'Toiletries', 'Tech', 'Documents', 'Misc'];

export const PackingList: React.FC<PackingListProps> = ({ items, onAdd, onUpdate, onDelete, tripId, weatherForecast }) => {
  const { } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Essentials');
  const [newItemName, setNewItemName] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    const checked = items.filter(i => i.isChecked).length;
    return Math.round((checked / items.length) * 100);
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAdd({
      tripId,
      name: newItemName.trim(),
      category: activeCategory,
      isChecked: false
    });
    setNewItemName('');
  };

  const handleImportTemplate = (type: 'city' | 'beach') => {
    const templates = {
      city: [
        { name: 'Walking Shoes', category: 'Clothing' },
        { name: 'Power Bank', category: 'Tech' },
        { name: 'Umbrella', category: 'Essentials' },
        { name: 'Daypack', category: 'Essentials' }
      ],
      beach: [
        { name: 'Swimsuit', category: 'Clothing' },
        { name: 'Sunscreen', category: 'Toiletries' },
        { name: 'Beach Towel', category: 'Essentials' },
        { name: 'Sunglasses', category: 'Essentials' }
      ]
    };

    if (confirm(`Import ${type} template?`)) {
      templates[type].forEach(item => {
        onAdd({
          tripId,
          name: item.name,
          category: item.category,
          isChecked: false
        });
      });
    }
  };

  const handleWeatherSuggestions = () => {
    if (!weatherForecast || weatherForecast.length === 0) {
      alert('No weather data available to make suggestions.');
      return;
    }

    const suggestions: { name: string; category: string; reason: string }[] = [];

    // Check for rain
    const hasRain = weatherForecast.some(d => d.weatherCode >= 51);
    if (hasRain) {
      suggestions.push({ name: 'Umbrella', category: 'Essentials', reason: 'Rain is forecast' });
      suggestions.push({ name: 'Rain Jacket', category: 'Clothing', reason: 'Rain is forecast' });
    }

    // Check for sun/heat
    const isHot = weatherForecast.some(d => d.maxTemp > 25);
    if (isHot) {
      suggestions.push({ name: 'Sunscreen', category: 'Toiletries', reason: 'It will be hot' });
      suggestions.push({ name: 'Hat', category: 'Clothing', reason: 'It will be hot' });
    }

    // Check for cold
    const isCold = weatherForecast.some(d => d.maxTemp < 15);
    if (isCold) {
      suggestions.push({ name: 'Jacket', category: 'Clothing', reason: 'It will be cold' });
    }

    if (suggestions.length === 0) {
      alert('No specific weather-based suggestions found.');
      return;
    }

    const message = suggestions.map(s => `- ${s.name} (${s.reason})`).join('\n');
    if (confirm(`Add suggested items based on weather?\n\n${message}`)) {
      suggestions.forEach(s => {
        // Avoid duplicates
        if (!items.some(i => i.name === s.name)) {
          onAdd({
            tripId,
            name: s.name,
            category: s.category,
            isChecked: false
          });
        }
      });
    }
  };

  return (
    <div className="pb-20 max-w-3xl mx-auto px-4 pt-8">
      {/* Hero Section */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-8 shadow-lg group">
        <img src={packingHero} alt="Packing Essentials" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-black mb-1">Packing List</h1>
          <p className="text-white/90 font-medium text-sm flex items-center gap-2">
            <i className="ph-fill ph-suitcase-rolling"></i>
            {items.length} items • {progress}% packed
          </p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-auto">
            <div className="flex gap-2">
              <button
                onClick={() => handleImportTemplate('city')}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
              >
                <i className="ph-bold ph-buildings text-lg"></i> City
              </button>
              <button
                onClick={() => handleImportTemplate('beach')}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
              >
                <i className="ph-bold ph-waves text-lg"></i> Beach
              </button>
              <button
                onClick={handleWeatherSuggestions}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition text-sm"
              >
                <i className="ph-bold ph-magic-wand text-lg"></i> Smart Add
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition ${activeCategory === cat
              ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20'
              : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {/* Add Item */}
        <form onSubmit={handleAddItem} className="p-4 border-b border-slate-100 flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`Add to ${activeCategory}...`}
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-200 transition"
          />
          <button
            type="submit"
            disabled={!newItemName.trim()}
            className="bg-slate-800 text-white px-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition"
          >
            <i className="ph-bold ph-plus"></i>
          </button>
        </form>

        {/* Items */}
        <div className="divide-y divide-slate-50">
          {filteredItems.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
              <img src={emptyPacking} alt="Empty Suitcase" className="w-48 h-48 object-contain mb-4 opacity-80" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">Your bag is empty</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Start adding items to your {activeCategory} list or use a template to get started!
              </p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="flex items-center p-4 hover:bg-slate-50 transition group">
                <button
                  onClick={() => onUpdate(item.id, { isChecked: !item.isChecked })}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition ${item.isChecked
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 text-transparent hover:border-green-500'
                    }`}
                >
                  <i className="ph-bold ph-check text-xs"></i>
                </button>
                <span className={`flex-1 font-medium ${item.isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.name}
                </span>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition"
                >
                  <i className="ph-bold ph-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
