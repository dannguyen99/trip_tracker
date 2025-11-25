import React from 'react';
import type { Expense, User } from '../types';

interface HistoryProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  users: User[];
}

const CAT_ICONS: Record<string, string> = {
  'Food': 'ph-bowl-food',
  'Transport': 'ph-taxi',
  'Hotel': 'ph-bed',
  'Shopping': 'ph-shopping-bag-open',
  'Nightlife': 'ph-martini',
  'Massage': 'ph-sparkle',
  'Tours': 'ph-ticket',
  'Misc': 'ph-dots-three-circle'
};

const CAT_COLORS: Record<string, string> = {
  'Food': '#F59E0B',
  'Transport': '#3B82F6',
  'Hotel': '#64748B',
  'Shopping': '#EC4899',
  'Nightlife': '#8B5CF6',
  'Massage': '#10B981',
  'Tours': '#F97316',
  'Misc': '#94A3B8'
};

export const History: React.FC<HistoryProps> = ({ expenses, onDelete, users }) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 pop-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
          <i className="ph-fill ph-clock-counter-clockwise text-lg"></i>
        </div>
        <h2 className="font-bold text-slate-800">History</h2>
      </div>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm opacity-50">Trip is empty. Add something!</div>
        ) : (
          expenses.map((exp) => {
            const user = users.find(u => u.id === exp.payerId);
            if (!user) return null;
            const isTHB = exp.currency === 'THB';
            const iconClass = CAT_ICONS[exp.category] || 'ph-circle';
            const color = CAT_COLORS[exp.category];

            return (
              <div key={exp.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-slate-50 border border-slate-100 shadow-sm relative">
                    {user.avatar.startsWith('data:') ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.avatar
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <i className={`ph-fill ${iconClass} text-xs`} style={{ color }}></i>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 text-sm leading-tight">{exp.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                      {exp.type === 'SHARED' ? 'Group' : 'Personal'} • {exp.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800 text-sm">
                    {exp.originalAmount.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{exp.currency}</span>
                  </div>
                  {isTHB && (
                    <div className="text-[10px] text-slate-400 font-medium">≈ {formatMoney(exp.amountVND)}</div>
                  )}
                  <button
                    onClick={() => onDelete(exp.id)}
                    className="text-[10px] text-slate-300 hover:text-red-400 transition ml-2 opacity-0 group-hover:opacity-100"
                  >
                    <i className="ph-bold ph-trash"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
