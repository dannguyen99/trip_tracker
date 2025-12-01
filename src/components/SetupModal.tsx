import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vnd: number, thb: number, startDate: string, endDate: string, isPublic: boolean) => void;
  initialVND: number;
  initialTHB: number;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialIsPublic?: boolean;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, onSave, initialVND, initialTHB, initialStartDate, initialEndDate, initialIsPublic }) => {
  const { t } = useLanguage();
  const [vnd, setVnd] = useState<string>('');
  const [thb, setThb] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setVnd(initialVND > 0 ? initialVND.toString() : '');
      setThb(initialTHB > 0 ? initialTHB.toString() : '');
      setStartDate(initialStartDate || '');
      setEndDate(initialEndDate || '');
      setIsPublic(initialIsPublic || false);
    }
  }, [isOpen, initialVND, initialTHB, initialStartDate, initialEndDate, initialIsPublic]);

  const calculateRate = () => {
    const v = parseFloat(vnd);
    const t = parseFloat(thb);
    if (v > 0 && t > 0) {
      return v / t;
    }
    return 0;
  };

  const handleSave = () => {
    const v = parseFloat(vnd) || 0;
    const thbVal = parseFloat(thb) || 0;

    // Validation:
    // 1. Allow if budget is set (v > 0 && thbVal > 0)
    // 2. OR if dates are set (startDate && endDate)
    const hasBudget = v > 0 && thbVal > 0;
    const hasDates = startDate && endDate;

    if (!hasBudget && !hasDates) {
      alert(t('setup.alert_budget_or_dates'));
      return;
    }

    if (hasDates && startDate > endDate) {
      alert(t('setup.alert_end_date_after_start_date'));
      return;
    }

    onSave(v, thbVal, startDate, endDate, isPublic);
  };

  const rate = calculateRate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-indigo-500"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('setup.title')} 🇹🇭</h2>
        <p className="text-sm text-slate-500 mb-6">{t('setup.desc')}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('setup.vnd_exchanged')}</label>
            <input
              type="number"
              value={vnd}
              onChange={(e) => setVnd(e.target.value)}
              placeholder="e.g. 40000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <div className="flex justify-center text-slate-300 text-xl">⬇️</div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('setup.thb_received')}</label>
            <input
              type="number"
              value={thb}
              onChange={(e) => setThb(e.target.value)}
              placeholder="e.g. 54000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('setup.start_date')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('setup.end_date')}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('setup.public_access')}</label>
              <p className="text-xs text-slate-500">{t('setup.public_access_desc')}</p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-green-500' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isPublic ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>


        <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-sky-700 font-bold">{t('setup.calculated_rate')}:</span>
            <span className="text-sky-900 font-bold">
              {rate > 0 ? `1 THB ≈ ${Math.round(rate)} VND` : '---'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sky-700 font-bold">{t('setup.total_budget')}:</span>
            <span className="text-sky-900 font-bold">
              {vnd ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(vnd)) : '---'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="w-1/3 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">{t('setup.cancel')}</button>
          <button onClick={handleSave} className="w-2/3 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-sky-200 transition-colors">{t('setup.save_settings')}</button>
        </div>
      </div>
    </div>
  );
};
