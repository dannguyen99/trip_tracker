import React from 'react';
import type { Expense, User } from '../types';
import { exportToCSV, exportToExcel } from '../utils/export';

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

import { useLanguage } from '../contexts/LanguageContext';

import { Avatar } from './Avatar';

export const History: React.FC<HistoryProps> = ({ expenses, onDelete, users }) => {
  const { t } = useLanguage();
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 pop-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
            <i className="ph-fill ph-clock-counter-clockwise text-lg"></i>
          </div>
          <h2 className="font-bold text-slate-800">{t('expenses.history_title')}</h2>
        </div>

        {expenses.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV(expenses, users)}
              className="text-xs font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 transition"
              title="Export to CSV"
            >
              <i className="ph-bold ph-file-csv"></i>
              {t('expenses.export_csv')}
            </button>
            <button
              onClick={() => exportToExcel(expenses, users)}
              className="text-xs font-bold text-slate-500 hover:text-green-600 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 transition"
              title="Export to Excel"
            >
              <i className="ph-bold ph-file-xls"></i>
              {t('expenses.export_excel')}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm opacity-50">{t('expenses.empty_history')}</div>
        ) : (
          expenses.map((exp) => {
            const user = users.find(u => u.id === exp.payerId);
            if (!user) return null;
            const isTHB = exp.currency === 'THB';

            // Determine Icon and Color based on Type/Category
            let iconClass = CAT_ICONS[exp.category] || 'ph-circle';
            let color = CAT_COLORS[exp.category];
            let typeLabel = exp.type === 'SHARED' ? t('expenses.group_label') : t('expenses.personal_label');

            if (exp.type === 'SETTLEMENT') {
              iconClass = 'ph-hand-coins';
              color = '#10B981'; // Emerald
              typeLabel = t('expenses.settlement_label') || 'Settlement';
            }

            // Determine Subtitle (Split details)
            let subtitle = `${typeLabel} • ${t(`expenses.categories.${exp.category.toLowerCase()}` as any) || exp.category}`;
            if (exp.type === 'SETTLEMENT' && exp.splitTo && exp.splitTo.length > 0) {
              const receiver = users.find(u => u.id === exp.splitTo![0]);
              subtitle = `${t('expenses.paid_to_label') || 'Paid to'} ${receiver?.name || 'Unknown'}`;
            } else if (exp.type === 'SHARED' && exp.splitTo && exp.splitTo.length > 0) {
              subtitle = `${t('expenses.split_with_label') || 'Split with'} ${exp.splitTo.length} ${t('expenses.people_label') || 'people'}`;
            }

            return (
              <div key={exp.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar avatar={user.avatar} name={user.name} size="md" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <i className={`ph-fill ${iconClass} text-xs`} style={{ color }}></i>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 text-sm leading-tight">{exp.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                      {subtitle}
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
