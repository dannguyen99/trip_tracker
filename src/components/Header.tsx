import React from 'react';
import type { TripData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  data: TripData;
  onOpenSetup: () => void;
  onManageUsers: () => void;
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ data, onOpenSetup, onManageUsers, onBack }) => {
  const { t } = useLanguage();

  const totalSpent = data.expenses.reduce((sum, e) => sum + e.amountVND, 0);
  const remaining = data.totalBudgetVND - totalSpent;
  const percent = data.totalBudgetVND > 0 ? Math.min((totalSpent / data.totalBudgetVND) * 100, 100) : 0;



  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <header className="travel-header text-white pt-8 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative z-0">
      <div className="max-w-md mx-auto relative">

        {/* Top Nav */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-0">
          <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition text-white"
              title="Back to Dashboard"
            >
              <i className="ph-bold ph-arrow-left text-lg"></i>
            </button>

            <button
              onClick={onManageUsers}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition text-white"
              title="Trip Members"
            >
              <i className="ph-bold ph-users"></i>
            </button>

            <div onClick={onOpenSetup} className="cursor-pointer group text-left ml-2 flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Journey Logo" className="w-10 h-10 rounded-xl shadow-lg" />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none">{data.name}</h1>
                <div className="flex items-center gap-2 text-xs font-medium text-sky-200/80 group-hover:text-white transition">
                  <i className="ph ph-currency-circle-dollar text-lg"></i>
                  <span>1 THB ≈ {Math.round(data.exchangeRate)} VND</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
            <div className="text-center relative w-full md:w-auto">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest mb-2">
                {t('header.remaining_budget')}
              </div>
              <div className={`text-4xl md:text-5xl font-extrabold mb-1 tracking-tight ${remaining < 0 ? 'text-red-300' : 'text-white'}`}>
                {formatMoney(remaining)}
              </div>
              <div className="text-sm opacity-80">{t('header.spent')}: {formatMoney(totalSpent)}</div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full md:static md:w-auto md:mt-6 h-1.5 md:h-2 bg-slate-900/30 rounded-full overflow-hidden backdrop-blur-sm md:hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${percent > 90 ? 'bg-red-500' : 'bg-sky-400'}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
