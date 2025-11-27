import React from 'react';
import type { Activity } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isCurrent?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onEdit, onDelete, isCurrent }) => {
  const { t } = useLanguage();

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getTagColorClass = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getTypeColorClass = (type: Activity['type']) => {
    switch (type) {
      case 'food': return 'border-orange-100 text-orange-500';
      case 'travel': return 'border-blue-100 text-blue-500';
      case 'hotel': return 'border-emerald-100 text-emerald-500';
      case 'shopping': return 'border-purple-100 text-purple-500';
      case 'activity': return 'border-yellow-100 text-yellow-600';
      default: return 'border-slate-100 text-slate-400';
    }
  };

  const getTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'food': return 'ph-fork-knife';
      case 'travel': return 'ph-airplane-tilt';
      case 'hotel': return 'ph-bed';
      case 'shopping': return 'ph-bag';
      case 'activity': return 'ph-camera';
      default: return 'ph-star';
    }
  };

  const getTypeBackgroundClass = (type: Activity['type']) => {
    switch (type) {
      case 'hotel': return 'bg-emerald-50 border-emerald-100';
      case 'food': return 'bg-orange-50 border-orange-100';
      case 'travel': return 'bg-blue-50 border-blue-100';
      case 'shopping': return 'bg-purple-50 border-purple-100';
      case 'activity': return 'bg-yellow-50 border-yellow-100';
      default: return 'glass-panel';
    }
  };

  const iconClass = activity.icon || getTypeIcon(activity.type);
  const typeColorClass = getTypeColorClass(activity.type);
  const bgClass = getTypeBackgroundClass(activity.type);

  // Highlight styles for current activity
  const currentStyles = isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 shadow-blue-200 shadow-lg bg-blue-50/50' : '';

  return (
    <div className="flex gap-4 relative z-10 group" id={isCurrent ? 'current-activity' : undefined}>
      <div className={`w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center shrink-0 shadow-sm mt-1 ${typeColorClass} ${isCurrent ? 'animate-pulse' : ''}`}>
        <i className={`ph-fill ${iconClass}`}></i>
      </div>

      <div className={`p-4 rounded-2xl w-full timeline-card relative ${bgClass} ${currentStyles}`}>
        <div className="flex justify-between items-start mb-1">
          <span className="font-bold text-slate-800 text-lg">
            {formatTime(activity.startTime)}
            {activity.endTime && ` - ${formatTime(activity.endTime)}`}
          </span>
          {activity.tag && (
            <span className={`tag ${getTagColorClass(activity.tagColor)}`}>
              {activity.tag}
            </span>
          )}
        </div>

        <h4 className={`font-bold text-xl mb-1 ${activity.type === 'food' ? 'text-orange-700' : 'text-slate-700'}`}>
          {activity.name}
        </h4>

        {activity.description && (
          <p className="text-slate-600 mb-1">{activity.description}</p>
        )}

        {activity.tips && (
          <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
            <i className="ph-bold ph-lightbulb mr-1"></i> {activity.tips}
          </p>
        )}

        {activity.location && (
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <i className="ph-fill ph-map-pin"></i> {activity.location}
          </div>
        )}

        {/* Action Buttons (Visible on Hover) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => onEdit(activity.id)}
            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition"
            title={t('common.edit')}
          >
            <i className="ph-bold ph-pencil-simple"></i>
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
            title={t('common.delete')}
          >
            <i className="ph-bold ph-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
