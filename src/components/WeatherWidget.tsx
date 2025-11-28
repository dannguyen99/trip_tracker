import React from 'react';
import type { WeatherData } from '../services/weather';

interface WeatherWidgetProps {
  weather?: WeatherData;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="flex items-center bg-blue-50/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm animate-fade-in">
      <span className="text-2xl mr-2">{weather.icon}</span>
      <div className="flex flex-col leading-none">
        <span className="font-bold text-slate-700 text-sm">{Math.round(weather.maxTemp)}°C</span>
        <span className="text-[10px] text-slate-500 capitalize font-medium">{weather.description}</span>
      </div>
    </div>
  );
};
