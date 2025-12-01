import React, { useState, useMemo, useEffect } from 'react';
import type { Activity } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { DayView } from './DayView';
import { getBangkokPlan } from '../utils/importBangkokPlan';
import { ActivityModal } from './ActivityModal';
import { TripStats } from './TripStats';
import { getForecast, getWeatherForDate, type WeatherData } from '../services/weather';

interface ItineraryProps {
  activities: Activity[];
  onAdd: (activity: Omit<Activity, 'id' | 'created_at'>) => void;
  onUpdate?: (id: string, updates: Partial<Activity>) => void;
  onDelete: (id: string) => void;
  tripId: string;
  startDate?: string | null;
  endDate?: string | null;
  onOpenSetup: () => void;
  onAddExpense?: (expense: any) => void;
}

export const Itinerary: React.FC<ItineraryProps> = ({ activities, onAdd, onUpdate, onDelete, tripId, startDate, endDate, onOpenSetup, onAddExpense }) => {
  const { t } = useLanguage();
  const [activeDay, setActiveDay] = useState<string>('day1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);
  const [modalDefaultDate, setModalDefaultDate] = useState<Date | undefined>(undefined);
  const [forecast, setForecast] = useState<WeatherData[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      // Default to Bangkok coordinates
      const data = await getForecast(13.7563, 100.5018);
      setForecast(data);
    };
    fetchWeather();
  }, []);

  // Calculate days based on date range
  const days = useMemo(() => {
    if (!startDate || !endDate) {
      // Default to 3 days starting today if no dates set
      const today = new Date();
      return [
        new Date(today),
        new Date(today.setDate(today.getDate() + 1)),
        new Date(today.setDate(today.getDate() + 1))
      ];
    }

    // Parse as local date to avoid UTC shifts
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    const list = [];
    const current = new Date(start);
    while (current <= end) {
      list.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return list;
  }, [startDate, endDate]);

  const getActivitiesForDate = (date: Date) => {
    return activities.filter(a => {
      const aDate = new Date(a.startTime);
      // Compare year, month, date explicitly to avoid timezone issues with full ISO strings
      return aDate.getFullYear() === date.getFullYear() &&
        aDate.getMonth() === date.getMonth() &&
        aDate.getDate() === date.getDate();
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    const headerOffset = 180; // Adjusted for sticky nav
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveDay(id);
    }
  };

  const handleImportBangkok = () => {
    if (confirm(t('itinerary.confirm_import'))) {
      // Use trip start date if available, otherwise default to today
      let importDate = new Date();
      if (startDate) {
        const [y, m, d] = startDate.split('-').map(Number);
        importDate = new Date(y, m - 1, d);
      }

      const plan = getBangkokPlan(tripId, importDate);
      plan.forEach(activity => {
        onAdd(activity);
      });
    }
  };

  const handleClearAll = () => {
    if (confirm(t('itinerary.confirm_clear').replace('{count}', activities.length.toString()))) {
      activities.forEach(a => onDelete(a.id));
    }
  };

  const handleAddActivity = (date: Date) => {
    setEditingActivity(undefined);
    setModalDefaultDate(date);
    setIsModalOpen(true);
  };

  const handleEditActivity = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      setEditingActivity(activity);
      setModalDefaultDate(undefined);
      setIsModalOpen(true);
    }
  };

  const handleSaveActivity = (activityData: Omit<Activity, 'id' | 'created_at'>) => {
    if (editingActivity && onUpdate) {
      onUpdate(editingActivity.id, activityData);
    } else {
      onAdd(activityData);
    }
    setIsModalOpen(false);
  };

  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);

  useEffect(() => {
    // Check for current activity every minute
    const checkCurrentActivity = () => {
      const now = new Date();
      const current = activities.find(a => {
        const start = new Date(a.startTime);
        const end = a.endTime ? new Date(a.endTime) : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
        return now >= start && now <= end;
      });
      setCurrentActivityId(current?.id || null);
    };

    checkCurrentActivity();
    const interval = setInterval(checkCurrentActivity, 60000);
    return () => clearInterval(interval);
  }, [activities]);

  const handleJumpToNow = () => {
    if (currentActivityId) {
      scrollToId(currentActivityId); // Scroll to specific activity if found
      // Also expand the day?
      const activity = activities.find(a => a.id === currentActivityId);
      if (activity) {
        // Find day index logic if needed, or just rely on ID scrolling if we add IDs to cards
        // For now, let's scroll to the day containing it
        // Actually, let's try to scroll to the specific card if we can give it an ID
        const element = document.getElementById('current-activity');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      // If no current activity, scroll to today
      const today = new Date();
      const dayIndex = days.findIndex(d =>
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
      if (dayIndex !== -1) {
        scrollToId(`day${dayIndex + 1}`);
      } else {
        alert(t('itinerary.no_activities_now'));
      }
    }
  };

  return (
    <div className="pb-20 text-slate-800 font-sans relative">
      {/* Floating Jump Button */}
      <button
        onClick={handleJumpToNow}
        className="fixed bottom-24 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-transform hover:scale-110 active:scale-95"
        title={t('itinerary.jump_to_now')}
      >
        <i className="ph-bold ph-clock-countdown text-xl"></i>
      </button>

      {/* HEADER */}
      <header className="header-bg-bangkok text-white pt-12 pb-32 px-4 rounded-b-[3rem] shadow-xl relative mb-[-6rem]">
        <div className="max-w-3xl mx-auto text-center">
          <div
            onClick={onOpenSetup}
            className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4 border border-white/20 shadow-sm cursor-pointer hover:bg-black/40 transition"
            title="Click to set trip dates"
          >
            {startDate && endDate ? (
              <>
                <i className="ph-fill ph-calendar-check text-orange-300"></i>
                {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
              </>
            ) : (
              <>
                <i className="ph-bold ph-calendar-plus text-orange-300"></i>
                <span>Set Trip Dates</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight drop-shadow-lg">
            Trip Itinerary
          </h1>
          <p className="text-lg text-white/90 font-medium mb-8 drop-shadow-md flex items-center justify-center gap-2">
            Let the adventure begin! 🇹🇭
          </p>

          {activities.length === 0 && (
            <button
              onClick={handleImportBangkok}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <i className="ph-bold ph-download-simple"></i> {t('itinerary.import_bangkok')}
            </button>
          )}

          {/* Stats Section - Merged into Header */}
          {activities.length > 0 && (
            <div className="text-left text-slate-800">
              <TripStats
                activities={activities}
                startDate={startDate}
                endDate={endDate}
                onClear={handleClearAll}
              />
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-12">

        {/* DATE NAVIGATION */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-4 px-4 sticky top-24 z-30 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent pt-4">
          {days.map((day, index) => {
            const dayId = `day${index + 1}`;
            const isActive = activeDay === dayId;
            const dateStr = day.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });

            return (
              <button
                key={dayId}
                onClick={() => scrollToId(dayId)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm border ${isActive
                  ? 'bg-orange-600 text-white border-orange-600 shadow-orange-200 scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
              >
                Day {index + 1} ({dateStr})
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="space-y-16">

          {days.length === 0 && startDate && endDate ? (
            <div className="text-center py-12 bg-red-50 rounded-3xl border border-red-100">
              <i className="ph-bold ph-warning text-4xl text-red-400 mb-2"></i>
              <h3 className="text-lg font-bold text-red-600">{t('itinerary.invalid_date_range')}</h3>
              <p className="text-red-500">{t('itinerary.invalid_date_range_desc')}</p>
              <button onClick={onOpenSetup} className="mt-4 px-6 py-2 bg-white text-red-500 font-bold rounded-full shadow-sm hover:bg-red-50 transition">
                {t('itinerary.fix_dates')}
              </button>
            </div>
          ) : (
            days.map((day, index) => {
              const dayId = `day${index + 1}`;
              const dayActivities = getActivitiesForDate(day);

              return (
                <DayView
                  key={dayId}
                  dayId={dayId}
                  date={day}
                  dayIndex={index}
                  activities={dayActivities}
                  onEdit={handleEditActivity}
                  onDelete={onDelete}
                  onAdd={() => handleAddActivity(day)}
                  currentActivityId={currentActivityId}
                  weather={getWeatherForDate(day, forecast)}
                />
              );
            })
          )}
        </div>
      </main>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        initialActivity={editingActivity}
        tripId={tripId}
        defaultDate={modalDefaultDate}
        onAddExpense={onAddExpense}
      />
    </div>
  );
};
