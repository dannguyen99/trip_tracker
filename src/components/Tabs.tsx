import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TabsProps {
  activeTab: 'expenses' | 'hotels' | 'dining' | 'itinerary' | 'packing';
  onChange: (tab: 'expenses' | 'hotels' | 'dining' | 'itinerary' | 'packing') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
        <button
          onClick={() => onChange('expenses')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'expenses' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {t('tabs.expenses')}
        </button>
        <button
          onClick={() => onChange('hotels')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'hotels' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {t('tabs.hotels')}
        </button>
        <button
          onClick={() => onChange('dining')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'dining' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {t('tabs.dining')}
        </button>
        <button
          onClick={() => onChange('itinerary')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'itinerary' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {t('tabs.itinerary')}
        </button>
        <button
          onClick={() => onChange('packing')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'packing' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {t('tabs.packing')}
        </button>
      </div>
    </div>
  );
};
