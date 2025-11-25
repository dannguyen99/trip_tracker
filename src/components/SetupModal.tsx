import React, { useState, useEffect } from 'react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vnd: number, thb: number) => void;
  initialVND: number;
  initialTHB: number;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, onSave, initialVND, initialTHB }) => {
  const [vnd, setVnd] = useState<string>('');
  const [thb, setThb] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setVnd(initialVND > 0 ? initialVND.toString() : '');
      setThb(initialTHB > 0 ? initialTHB.toString() : '');
    }
  }, [isOpen, initialVND, initialTHB]);

  const calculateRate = () => {
    const v = parseFloat(vnd);
    const t = parseFloat(thb);
    if (v > 0 && t > 0) {
      return v / t;
    }
    return 0;
  };

  const handleSave = () => {
    const v = parseFloat(vnd);
    const t = parseFloat(thb);
    if (v > 0 && t > 0) {
      onSave(v, t);
    }
  };

  const rate = calculateRate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-indigo-500"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Trip Setup 🇹🇭</h2>
        <p className="text-sm text-slate-500 mb-6">Enter your exchange details to calibrate the budget.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Total VND Exchanged</label>
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
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Total THB Received</label>
            <input
              type="number"
              value={thb}
              onChange={(e) => setThb(e.target.value)}
              placeholder="e.g. 54000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-sky-700 font-bold">Calculated Rate:</span>
            <span className="text-sky-900 font-bold">
              {rate > 0 ? `1 THB ≈ ${Math.round(rate)} VND` : '---'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sky-700 font-bold">Total Budget:</span>
            <span className="text-sky-900 font-bold">
              {vnd ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(vnd)) : '---'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="w-1/3 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
          <button onClick={handleSave} className="w-2/3 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-sky-200 transition-colors">Set Budget</button>
        </div>
      </div>
    </div>
  );
};
