import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Expense } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ExpenseAnalyticsProps {
  expenses: Expense[];
  exchangeRate: number; // VND per 1 THB
}

type FilterType = 'all' | 'shared' | 'personal';
type DisplayCurrency = 'VND' | 'THB' | 'USD';

// Approximate USD rate (VND per 1 USD) - you may want to make this dynamic
const USD_RATE = 24500;

export const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ expenses, exchangeRate }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('all');
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>('VND');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Convert VND amount to display currency
  const convertAmount = (amountVND: number): number => {
    switch (displayCurrency) {
      case 'THB':
        return amountVND / exchangeRate;
      case 'USD':
        return amountVND / USD_RATE;
      default:
        return amountVND;
    }
  };

  // Filter expenses based on selected filter
  const filteredExpenses = useMemo(() => {
    if (filter === 'all') return expenses;
    if (filter === 'shared') return expenses.filter(e => e.type === 'SHARED');
    return expenses.filter(e => e.type === 'PERSONAL');
  }, [expenses, filter]);

  // Group expenses by date
  const dailyTotals = useMemo(() => {
    const grouped: Record<string, { total: number; expenses: Expense[] }> = {};

    filteredExpenses.forEach(expense => {
      const date = expense.date.split('T')[0]; // Get YYYY-MM-DD
      if (!grouped[date]) {
        grouped[date] = { total: 0, expenses: [] };
      }
      grouped[date].total += expense.amountVND;
      grouped[date].expenses.push(expense);
    });

    // Sort by date descending (most recent first)
    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredExpenses]);

  // Format money based on display currency
  const formatMoney = (amountVND: number) => {
    const converted = convertAmount(amountVND);

    switch (displayCurrency) {
      case 'THB':
        return new Intl.NumberFormat('th-TH', {
          style: 'currency',
          currency: 'THB',
          maximumFractionDigits: 0
        }).format(converted);
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2
        }).format(converted);
      default:
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0
        }).format(converted);
    }
  };

  // Get chart divisor
  const getChartDivisor = () => {
    switch (displayCurrency) {
      case 'THB': return exchangeRate;
      case 'USD': return USD_RATE;
      default: return 1000;
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return t('expenses.today') || 'Today';
    }
    if (dateStr === yesterday.toISOString().split('T')[0]) {
      return t('expenses.yesterday') || 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Chart data - show last 7 days
  const chartData = useMemo(() => {
    const last7Days: string[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const dailyMap = new Map(dailyTotals.map(([date, data]) => [date, data.total]));
    const divisor = getChartDivisor();

    return {
      labels: last7Days.map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [{
        label: t('expenses.daily_spending') || 'Daily Spending',
        data: last7Days.map(d => (dailyMap.get(d) || 0) / divisor),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  }, [dailyTotals, t, displayCurrency, exchangeRate]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => formatMoney(context.raw * getChartDivisor())
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10, weight: 'bold' as const },
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false
        },
        ticks: {
          font: { size: 10 },
          color: '#94a3b8',
          callback: (value: number | string) => {
            if (displayCurrency === 'USD') return `$${value}`;
            if (displayCurrency === 'THB') return `฿${value}`;
            return `${value}K`;
          }
        }
      }
    }
  }), [displayCurrency, exchangeRate]);

  // Calculate totals
  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amountVND, 0);
  const avgPerDay = dailyTotals.length > 0 ? totalFiltered / dailyTotals.length : 0;

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

  const CURRENCY_OPTIONS: { id: DisplayCurrency; label: string; icon: string }[] = [
    { id: 'VND', label: '₫ VND', icon: '🇻🇳' },
    { id: 'THB', label: '฿ THB', icon: '🇹🇭' },
    { id: 'USD', label: '$ USD', icon: '🇺🇸' },
  ];

  if (expenses.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 pop-in" style={{ animationDelay: '0.3s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <i className="ph-fill ph-chart-bar text-lg"></i>
          </div>
          <div>
            <h2 className="font-bold text-slate-800">{t('expenses.daily_breakdown') || 'Daily Breakdown'}</h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
              {t('expenses.spending_analytics') || 'Spending Analytics'}
            </p>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
          {CURRENCY_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => setDisplayCurrency(option.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${displayCurrency === option.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
              title={option.label}
            >
              <span className="text-sm">{option.icon}</span>
              <span className="hidden sm:inline">{option.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${filter === 'all'
            ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
        >
          <i className="ph-bold ph-list mr-1"></i>
          {t('expenses.filter_all') || 'All'}
        </button>
        <button
          onClick={() => setFilter('shared')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${filter === 'shared'
            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
        >
          <i className="ph-bold ph-users mr-1"></i>
          {t('expenses.group_label')}
        </button>
        <button
          onClick={() => setFilter('personal')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${filter === 'personal'
            ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
        >
          <i className="ph-bold ph-user mr-1"></i>
          {t('expenses.personal_label')}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100/50">
          <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1">
            {t('expenses.total_filtered') || 'Total'}
          </div>
          <div className="text-lg font-extrabold text-slate-800">{formatMoney(totalFiltered)}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {filteredExpenses.length} {t('expenses.transactions') || 'transactions'}
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100/50">
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mb-1">
            {t('expenses.avg_per_day') || 'Avg / Day'}
          </div>
          <div className="text-lg font-extrabold text-slate-800">{formatMoney(avgPerDay)}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {dailyTotals.length} {t('expenses.days_with_expenses') || 'days'}
          </div>
        </div>
      </div>

      {/* 7-Day Chart */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">
          {t('expenses.last_7_days') || 'Last 7 Days'}
        </div>
        <div className="h-32" style={{ marginBottom: '-8px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Daily Breakdown List */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">
          {t('expenses.breakdown_by_day') || 'Breakdown by Day'}
        </div>

        {dailyTotals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            {t('expenses.no_transactions_filter') || 'No transactions match the filter'}
          </div>
        ) : (
          dailyTotals.slice(0, 10).map(([date, { total, expenses: dayExpenses }]) => (
            <div key={date} className="rounded-xl overflow-hidden">
              {/* Day Header */}
              <button
                onClick={() => setExpandedDay(expandedDay === date ? null : date)}
                className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 transition rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <i className="ph-bold ph-calendar-blank text-slate-400"></i>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700 text-sm">{formatDate(date)}</div>
                    <div className="text-[10px] text-slate-400">
                      {dayExpenses.length} {dayExpenses.length === 1
                        ? (t('expenses.transaction') || 'transaction')
                        : (t('expenses.transactions') || 'transactions')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{formatMoney(total)}</span>
                  <i className={`ph-bold ph-caret-down text-slate-400 transition-transform ${expandedDay === date ? 'rotate-180' : ''}`}></i>
                </div>
              </button>

              {/* Expanded Transaction List */}
              {expandedDay === date && (
                <div className="bg-white border border-slate-100 rounded-xl mt-1 p-2 space-y-1">
                  {dayExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between py-2 px-3 hover:bg-slate-50 rounded-lg transition">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${CAT_COLORS[expense.category]}20` }}
                        >
                          <i
                            className={`ph-fill ${CAT_ICONS[expense.category] || 'ph-circle'} text-xs`}
                            style={{ color: CAT_COLORS[expense.category] }}
                          ></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">{expense.description}</div>
                          <div className="text-[9px] text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${expense.type === 'SHARED'
                                ? 'bg-sky-100 text-sky-600'
                                : 'bg-violet-100 text-violet-600'
                                }`}
                            >
                              {expense.type === 'SHARED' ? t('expenses.group_label') : t('expenses.personal_label')}
                            </span>
                            <span>•</span>
                            <span>{t(`expenses.categories.${expense.category.toLowerCase()}` as any) || expense.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-800">{formatMoney(expense.amountVND)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {dailyTotals.length > 10 && (
          <div className="text-center py-2 text-xs text-slate-400">
            +{dailyTotals.length - 10} {t('expenses.more_days') || 'more days'}
          </div>
        )}
      </div>
    </section>
  );
};
