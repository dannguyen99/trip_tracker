import React from 'react';
import type { Activity } from '../types';
import { WeatherWidget } from './WeatherWidget';
import type { WeatherData } from '../services/weather';
import { ActivityCard } from './ActivityCard';

interface DayViewProps {
  dayId: string;
  date: Date;
  dayIndex: number;
  activities: Activity[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  currentActivityId?: string | null;
  weather?: WeatherData;
}

import { useLanguage } from '../contexts/LanguageContext';

export const DayView: React.FC<DayViewProps> = ({ dayId, date, dayIndex, activities, onEdit, onDelete, onAdd, currentActivityId, weather }) => {
  const { t, language } = useLanguage();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
  };

  const getDayTitle = () => {
    return formatDate(date);
  };

  return (
    <section id={dayId} className="scroll-mt-36">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${dayIndex % 3 === 0 ? 'bg-blue-600 shadow-blue-600/20' :
            dayIndex % 3 === 1 ? 'bg-orange-600 shadow-orange-600/20' :
              'bg-emerald-600 shadow-emerald-600/20'
            }`}>
            {dayIndex + 1}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{getDayTitle()}</h2>
            <p className="text-sm font-medium text-slate-500">{activities.length} {t('itinerary.activities_planned')}</p>
          </div>
        </div>
        <WeatherWidget weather={weather} />
      </div>

      <div className="relative pl-4 md:pl-6 space-y-6">
        <div className="timeline-line"></div>

        {activities.length === 0 ? (
          <div className="relative z-10 pl-8">
            <div className="bg-white p-4 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm italic">
              {t('itinerary.no_activities_day')}
            </div>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={onEdit}
              onDelete={onDelete}
              isCurrent={activity.id === currentActivityId}
            />
          ))
        )}

        <div className="relative z-10 pl-14">
          <button
            className="text-sm font-bold text-slate-400 hover:text-blue-500 flex items-center gap-2 transition"
            onClick={onAdd}
          >
            <i className="ph-bold ph-plus-circle text-lg"></i> {t('itinerary.add_activity')}
          </button>
        </div>

      </div>
    </section>
  );
};
