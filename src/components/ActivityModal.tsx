import React, { useState, useEffect } from 'react';
import type { Activity } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id' | 'created_at'>) => void;
  initialActivity?: Activity;
  tripId: string;
  defaultDate?: Date;
  onAddExpense?: (expense: any) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSave, initialActivity, tripId, defaultDate, onAddExpense }) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    type: 'activity',
    status: 'planned',
    tagColor: 'blue'
  });
  const [addToExpense, setAddToExpense] = useState(false);
  const [cost, setCost] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialActivity) {
        setFormData(initialActivity);
      } else {
        setFormData({
          tripId,
          type: 'activity',
          status: 'planned',
          startTime: defaultDate ? defaultDate.toISOString() : new Date().toISOString(),
          tagColor: 'blue'
        });
        setAddToExpense(false);
        setCost('');
      }
    }
  }, [isOpen, initialActivity, tripId, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Activity, 'id' | 'created_at'>);

    if (addToExpense && onAddExpense && cost) {
      onAddExpense({
        id: Date.now().toString(),
        description: formData.name || 'Activity',
        amountVND: Number(cost),
        originalAmount: Number(cost),
        currency: 'VND',
        payerId: "1", // Default to first user again, ideally passed in
        type: 'SHARED',
        category: 'Activity',
        date: formData.startTime || new Date().toISOString()
      });
    }
    onClose();
  };

  const handleChange = (field: keyof Activity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to handle time input which returns "HH:MM"
  const handleTimeChange = (field: 'startTime' | 'endTime', timeStr: string) => {
    if (!timeStr) return;

    const currentIso = formData[field] || (defaultDate ? defaultDate.toISOString() : new Date().toISOString());
    const date = new Date(currentIso);
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes);

    handleChange(field, date.toISOString());
  };

  const getTimeString = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">
            {initialActivity ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <i className="ph-bold ph-x text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Activity Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="e.g. Dinner at Somboon Seafood"
              value={formData.name || ''}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>

          {/* Type & Icon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.type || 'activity'}
                onChange={e => handleChange('type', e.target.value)}
              >
                <option value="activity">Activity</option>
                <option value="food">Food</option>
                <option value="hotel">Hotel</option>
                <option value="travel">Travel</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Icon (Phosphor)</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="ph-star"
                value={formData.icon || ''}
                onChange={e => handleChange('icon', e.target.value)}
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={getTimeString(formData.startTime)}
                onChange={e => handleTimeChange('startTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={getTimeString(formData.endTime)}
                onChange={e => handleTimeChange('endTime', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
            <div className="relative">
              <i className="ph-bold ph-map-pin absolute left-4 top-3.5 text-slate-400"></i>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Siam Paragon"
                value={formData.location || ''}
                onChange={e => handleChange('location', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder="Details about the activity..."
              value={formData.description || ''}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          {/* Tags & Tips */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tag Label</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Must Try"
                value={formData.tag || ''}
                onChange={e => handleChange('tag', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tag Color</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.tagColor || 'blue'}
                onChange={e => handleChange('tagColor', e.target.value)}
              >
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </div>

          {/* Cost & Expense */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="addExpense"
                  checked={addToExpense}
                  onChange={e => setAddToExpense(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="addExpense" className="font-bold text-slate-700 text-sm">Add to Expenses</label>
              </div>
            </div>

            {addToExpense && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Cost (VND)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 500000"
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-1">* Will be added as a Shared expense paid by you</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tips</label>
            <div className="relative">
              <i className="ph-bold ph-lightbulb absolute left-4 top-3.5 text-yellow-500"></i>
              <textarea
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                placeholder="Helpful advice..."
                value={formData.tips || ''}
                onChange={e => handleChange('tips', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              {initialActivity ? 'Save Changes' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
