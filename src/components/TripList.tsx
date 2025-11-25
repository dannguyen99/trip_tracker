import React, { useState } from 'react';
import type { TripData } from '../types';

interface TripListProps {
  trips: TripData[];
  onSelectTrip: (id: string) => void;
  onCreateTrip: (name: string) => void;
  onDeleteTrip: (id: string) => void;
}

export const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip, onCreateTrip, onDeleteTrip }) => {
  const [newTripName, setNewTripName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTripName.trim()) {
      onCreateTrip(newTripName);
      setNewTripName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Your Trips ✈️</h1>
        <p className="text-slate-500 mb-8">Select a trip to manage expenses.</p>

        <div className="space-y-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition flex justify-between items-center group">
              <button
                onClick={() => onSelectTrip(trip.id)}
                className="text-left flex-1"
              >
                <h3 className="font-bold text-lg text-slate-800">{trip.name}</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">
                  {trip.expenses.length} expenses • {trip.users.length} friends
                </p>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip.id); }}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 transition"
                title="Delete Trip"
              >
                🗑️
              </button>
            </div>
          ))}

          {isCreating ? (
            <form onSubmit={handleCreate} className="bg-white p-5 rounded-2xl shadow-lg border-2 border-sky-500 animate-fade-in">
              <input
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Trip Name (e.g. Bangkok 2024)"
                className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2 rounded-xl font-bold text-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl font-bold shadow-lg shadow-sky-200"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50 transition flex items-center justify-center gap-2"
            >
              <span>➕</span> Create New Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
