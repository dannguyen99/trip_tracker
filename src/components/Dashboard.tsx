import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import type { Expense, User } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DashboardProps {
  expenses: Expense[];
  users: User[];
}

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

export const Dashboard: React.FC<DashboardProps> = ({ expenses, users }) => {
  // Category Data
  const catTotals: Record<string, number> = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amountVND;
  });

  const catData = {
    labels: Object.keys(catTotals),
    datasets: [{
      data: Object.values(catTotals),
      backgroundColor: Object.keys(catTotals).map(k => CAT_COLORS[k] || '#CBD5E1'),
      borderWidth: 0,
    }]
  };

  // Spender Data
  const spenderTotals: Record<string, number> = {};
  users.forEach(u => spenderTotals[u.id] = 0);
  expenses.forEach(e => {
    spenderTotals[e.payerId] = (spenderTotals[e.payerId] || 0) + e.amountVND;
  });

  const spendData = {
    labels: users.map(u => u.name),
    datasets: [{
      data: users.map(u => spenderTotals[u.id]),
      backgroundColor: users.map(u => u.color || '#CBD5E1'),
      borderRadius: 4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '75%'
  };

  return (
    <div className="grid grid-cols-2 gap-4 pop-in" style={{ animationDelay: '0.2s' }}>
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Category</h3>
        <div className="relative h-24 w-full">
          {expenses.length > 0 ? (
            <Doughnut data={catData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300 text-sm italic">No data yet</div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Spender</h3>
        <div className="relative h-24 w-full">
          {expenses.length > 0 ? (
            <Bar data={spendData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300 text-sm italic">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};
