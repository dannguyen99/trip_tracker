import React, { useState, useMemo } from 'react';
import type { PackingItem, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { type WeatherData } from '../services/weather';
import { generatePackingSuggestions, type AISuggestion } from '../services/ai';
import type { TripData } from '../types';
import packingHero from '../assets/packing_hero.png';
import emptyPacking from '../assets/empty_packing.png';

interface PackingListProps {
  items: PackingItem[];
  users: User[];
  onAdd: (item: Omit<PackingItem, 'id' | 'created_at'>) => void;
  onUpdate: (id: string, updates: Partial<PackingItem>) => void;

  onDelete: (id: string) => void;
  onClearAll: () => void;
  tripId: string;
  tripData: TripData; // Need full trip data for AI context
  weatherForecast?: WeatherData[];
}

const CATEGORIES = ['All', 'Essentials', 'Clothing', 'Toiletries', 'Tech', 'Documents', 'Misc'];

export const PackingList: React.FC<PackingListProps> = ({ items, users, onAdd, onUpdate, onDelete, onClearAll, tripId, tripData, weatherForecast }) => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [newItemName, setNewItemName] = useState('');
  const [filterMyItems, setFilterMyItems] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // AI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  // Mock current user ID for demo purposes (usually would come from auth context)
  const currentUserId = "0"; // Assuming "Duy Bảo" is the current user

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesUser = filterMyItems ? (item.assignedTo === currentUserId || !item.assignedTo) : true;
      return matchesCategory && matchesUser;
    });
  }, [items, activeCategory, filterMyItems]);

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

  const handleClearAll = () => {
    if (items.length === 0) return;
    if (confirm(t('packing.confirm_clear'))) {
      onClearAll();
    }
  };

  const handleAskAI = async () => {
    setIsAIModalOpen(true);
    setIsGenerating(true);
    setAiSuggestions([]);
    setSelectedSuggestions(new Set());

    try {
      const suggestions = await generatePackingSuggestions(tripData, items, language);
      setAiSuggestions(suggestions);
      // Auto-select all by default
      setSelectedSuggestions(new Set(suggestions.map(s => s.name)));
    } catch (error) {
      alert(t('packing.ai.error'));
      setIsAIModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSelectedSuggestions = () => {
    const toAdd = aiSuggestions.filter(s => selectedSuggestions.has(s.name));
    toAdd.forEach(s => {
      onAdd({
        tripId,
        name: s.name,
        category: s.category,
        isChecked: false
      });
    });
    setIsAIModalOpen(false);
  };

  const toggleSuggestionSelection = (name: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(name)) {
      newSelected.delete(name);
    } else {
      newSelected.add(name);
    }
    setSelectedSuggestions(newSelected);
  };

  return (
    <div className="pb-20 max-w-3xl mx-auto px-4 pt-8">
      {/* AI Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-xl">✨</div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">{t('packing.ai.title')}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('packing.ai.subtitle')}</p>
                </div>
              </div>
              <button onClick={() => setIsAIModalOpen(false)} className="w-8 h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition">
                <i className="ph-bold ph-x"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {isGenerating ? (
                <div className="py-12 text-center space-y-4">
                  <div className="animate-spin text-4xl">🔮</div>
                  <p className="text-slate-500 font-medium animate-pulse">{t('packing.ai.analyzing')}</p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 mb-4">{t('packing.ai.found_items').replace('{{count}}', aiSuggestions.length.toString())}</p>
                  {aiSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleSuggestionSelection(suggestion.name)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-start gap-3 ${selectedSuggestions.has(suggestion.name)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${selectedSuggestions.has(suggestion.name)
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'border-slate-300'
                        }`}>
                        {selectedSuggestions.has(suggestion.name) && <i className="ph-bold ph-check text-xs"></i>}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{suggestion.name}</div>
                        <div className="text-xs font-bold text-purple-600 bg-purple-100 inline-block px-2 py-0.5 rounded-md my-1">{suggestion.category}</div>
                        <p className="text-xs text-slate-500">{suggestion.reason}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>{t('packing.ai.no_suggestions')}</p>
                </div>
              )}
            </div>

            {!isGenerating && aiSuggestions.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsAIModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition"
                >
                  {t('packing.ai.cancel')}
                </button>
                <button
                  onClick={handleAddSelectedSuggestions}
                  disabled={selectedSuggestions.size === 0}
                  className="px-6 py-2 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-800/20"
                >
                  {t('packing.ai.add_items').replace('{{count}}', selectedSuggestions.size.toString())}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-8 shadow-lg group">
        <img src={packingHero} alt="Packing Essentials" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-black mb-1">{t('packing.title')}</h1>
          <p className="text-white/90 font-medium text-sm flex items-center gap-2">
            <i className="ph-fill ph-suitcase-rolling"></i>
            {t('packing.items_count').replace('{{count}}', items.length.toString())} • {t('packing.packed').replace('{{percent}}', progress.toString())}
          </p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-auto">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleImportTemplate('city')}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
              >
                <i className="ph-bold ph-buildings text-lg"></i> {t('packing.import_city')}
              </button>
              <button
                onClick={() => handleImportTemplate('beach')}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
              >
                <i className="ph-bold ph-waves text-lg"></i> {t('packing.import_beach')}
              </button>
              <button
                onClick={handleAskAI}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-600 font-bold hover:bg-purple-100 transition text-sm"
              >
                <i className="ph-bold ph-sparkle text-lg"></i> {t('packing.ask_ai')}
              </button>
              <button
                onClick={handleWeatherSuggestions}
                className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition text-sm"
              >
                <i className="ph-bold ph-cloud-sun text-lg"></i> {t('packing.weather')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 rounded-lg text-sm font-bold bg-red-50 text-red-500 hover:bg-red-100 transition mr-2"
              >
                {t('packing.clear_all')}
              </button>
            )}
            <span className="text-sm font-bold text-slate-500">{t('packing.show_label')}</span>
            <button
              onClick={() => setFilterMyItems(false)}
              className={`px-3 py-1 rounded-lg text-sm font-bold transition ${!filterMyItems ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {t('packing.all')}
            </button>
            <button
              onClick={() => setFilterMyItems(true)}
              className={`px-3 py-1 rounded-lg text-sm font-bold transition ${filterMyItems ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {t('packing.my_items')}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                {t('packing.progress')}
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
            {/* @ts-ignore */}
            {t(`packing.categories.${cat}`) || cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {/* Add Item */}
        {activeCategory !== 'All' && (
          <form onSubmit={handleAddItem} className="p-4 border-b border-slate-100 flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={t('packing.add_placeholder').replace('{{category}}', t(`packing.categories.${activeCategory}`) || activeCategory)}
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
        )}

        {/* Items */}
        <div className="divide-y divide-slate-50">
          {filteredItems.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
              <img src={emptyPacking} alt="Empty Suitcase" className="w-48 h-48 object-contain mb-4 opacity-80" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">{t('packing.empty_title')}</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                {t('packing.empty_desc').replace('{{category}}', activeCategory === 'All' ? '' : (t(`packing.categories.${activeCategory}`) || activeCategory))}
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
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

                {/* Assignee Avatar */}
                <div className="relative mr-2">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                    className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm hover:bg-slate-200 transition overflow-hidden"
                  >
                    {item.assignedTo ? (
                      (() => {
                        const user = users.find(u => u.id === item.assignedTo);
                        if (!user) return null;
                        const isImage = user.avatar.startsWith('http') || user.avatar.startsWith('data:');
                        return isImage ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span title={user.name}>{user.avatar}</span>
                        );
                      })()
                    ) : (
                      <i className="ph-bold ph-user-plus text-slate-400"></i>
                    )}
                  </button>

                  {/* Dropdown */}
                  {openDropdownId === item.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                      <div className={`absolute right-0 z-20 min-w-[200px] bg-white rounded-xl shadow-xl border border-slate-100 p-2 ${index >= filteredItems.length - 2 && filteredItems.length > 2 ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}>
                        <div className="text-xs font-bold text-slate-400 px-2 py-1 uppercase">{t('packing.assign_to')}</div>
                        <button
                          onClick={() => {
                            onUpdate(item.id, { assignedTo: undefined });
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-600 flex items-center gap-3"
                        >
                          <span className="w-6 text-center flex justify-center">🚫</span> {t('packing.none')}
                        </button>
                        {users.map(user => {
                          const isImage = user.avatar.startsWith('http') || user.avatar.startsWith('data:');
                          return (
                            <button
                              key={user.id}
                              onClick={() => {
                                onUpdate(item.id, { assignedTo: user.id });
                                setOpenDropdownId(null);
                              }}
                              className={`w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-3 ${item.assignedTo === user.id ? 'bg-sky-50 text-sky-600' : 'text-slate-700'}`}
                            >
                              <span className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                                {isImage ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-sm">{user.avatar}</span>
                                )}
                              </span>
                              <span className="truncate">{user.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => onDelete(item.id)}
                  className="text-slate-300 hover:text-red-500 p-2 transition"
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
