import React from 'react';

interface TabsProps {
  activeTab: 'expenses' | 'hotels' | 'dining';
  onChange: (tab: 'expenses' | 'hotels' | 'dining') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
        <button
          onClick={() => onChange('expenses')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'expenses' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          Expenses
        </button>
        <button
          onClick={() => onChange('hotels')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'hotels' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          Hotels
        </button>
        <button
          onClick={() => onChange('dining')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'dining' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          Dining
        </button>
      </div>
    </div>
  );
};
