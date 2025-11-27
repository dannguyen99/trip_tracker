import React, { useMemo } from 'react';
import type { Activity } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TripStatsProps {
  activities: Activity[];
  startDate?: string | null;
  endDate?: string | null;
  onClear?: () => void;
}

export const TripStats: React.FC<TripStatsProps> = ({ activities, startDate, endDate, onClear }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    // ... (logic remains same)
    // 1. Duration
    let durationDays = 0;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    // 2. Type Breakdown
    const typeCounts: Record<string, number> = {};
    activities.forEach(a => {
      typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    });

    const total = activities.length;
    const typePercentages = Object.entries(typeCounts)
      .map(([type, count]) => ({
        type,
        count,
        percent: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // 3. Busy Days
    const activitiesPerDay: Record<string, number> = {};
    activities.forEach(a => {
      const dateKey = new Date(a.startTime).toDateString();
      activitiesPerDay[dateKey] = (activitiesPerDay[dateKey] || 0) + 1;
    });
    const busyDayCount = Object.keys(activitiesPerDay).length;
    const avgPerDay = busyDayCount > 0 ? (total / busyDayCount).toFixed(1) : 0;

    return {
      durationDays,
      totalActivities: total,
      typePercentages,
      avgPerDay
    };
  }, [activities, startDate, endDate]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food': return 'bg-orange-500';
      case 'travel': return 'bg-blue-500';
      case 'hotel': return 'bg-emerald-500';
      case 'shopping': return 'bg-purple-500';
      case 'activity': return 'bg-yellow-500';
      default: return 'bg-slate-400';
    }
  };

  const getTypeLabel = (type: string) => {
    // Use translations for categories if available, or fallback to capitalized type
    // Assuming t(`expenses.categories.${type}`) might exist or we add generic ones
    // For now, let's try to map to existing category keys or just capitalize
    // Actually, let's use the keys we added to expenses.categories which cover most
    return t(`expenses.categories.${type}`) || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (activities.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mb-8 max-w-4xl mx-auto relative z-20 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="ph-fill ph-chart-pie-slice text-blue-500"></i>
          Trip Analysis
        </h3>
        {onClear && (
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-red-500 text-sm font-bold flex items-center gap-1.5 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            title={t('itinerary.clear_all')}
          >
            <i className="ph-bold ph-trash"></i>
            <span className="hidden sm:inline">{t('itinerary.clear_all')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-slate-50 rounded-2xl text-center">
          <div className="text-3xl font-black text-slate-800 mb-1">{stats.durationDays || '-'}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('itinerary.days')}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl text-center">
          <div className="text-3xl font-black text-slate-800 mb-1">{stats.totalActivities}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('itinerary.activities')}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl text-center">
          <div className="text-3xl font-black text-slate-800 mb-1">{stats.avgPerDay}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('itinerary.avg_per_day')}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl text-center">
          <div className="text-3xl font-black text-slate-800 mb-1">{stats.typePercentages.length}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('itinerary.categories')}</div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
          <span>{t('itinerary.trip_vibe')}</span>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{t('itinerary.based_on_activity')}</span>
        </h4>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex mb-4 ring-1 ring-slate-100">
          {stats.typePercentages.map((item) => (
            <div
              key={item.type}
              style={{ width: `${item.percent}%` }}
              className={`h-full ${getTypeColor(item.type)} border-r-2 border-white last:border-0`}
              title={`${getTypeLabel(item.type)}: ${item.count}`}
            ></div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {stats.typePercentages.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <div className={`w-2.5 h-2.5 rounded-full ${getTypeColor(item.type)}`}></div>
              <span>{getTypeLabel(item.type)} <span className="text-slate-400 font-normal">({Math.round(item.percent)}%)</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
