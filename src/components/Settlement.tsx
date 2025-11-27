import React from 'react';
import type { Expense, User } from '../types';
import { calculateDebts } from '../utils/debt';

interface SettlementProps {
  expenses: Expense[];
  exchangeRate: number;
  users: User[];
}

import { useLanguage } from '../contexts/LanguageContext';

export const Settlement: React.FC<SettlementProps> = ({ expenses, exchangeRate, users }) => {
  const { t } = useLanguage();
  const debts = calculateDebts(users, expenses);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 pop-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
          <i className="ph-fill ph-scales text-lg"></i>
        </div>
        <h2 className="font-bold text-slate-800">{t('expenses.settlement_title')}</h2>
      </div>

      <div className="space-y-3">
        {debts.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-4">{t('expenses.balanced_message')}</div>
        ) : (
          debts.map((debt, idx) => {
            const fromUser = users.find(u => u.id === debt.from);
            const toUser = users.find(u => u.id === debt.to);
            if (!fromUser || !toUser) return null;

            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-xl">
                      {fromUser.avatar.startsWith('data:') ? <img src={fromUser.avatar} className="w-6 h-6 rounded-full" /> : fromUser.avatar}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{t('expenses.pays_label')}</div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl">
                      {toUser.avatar.startsWith('data:') ? <img src={toUser.avatar} className="w-6 h-6 rounded-full" /> : toUser.avatar}
                    </span>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="font-bold text-indigo-600 text-sm block">{formatMoney(debt.amount)}</span>
                  <span className="text-[10px] text-slate-400 font-bold">≈ {Math.round(debt.amount / exchangeRate).toLocaleString()} THB</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
