import React, { useState } from 'react';
import type { Hotel } from '../types';

interface HotelListProps {
  hotels: Hotel[];
  onAdd: (hotel: any) => void;
  onDelete: (id: string) => void;
}

export const HotelList: React.FC<HotelListProps> = ({ hotels, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    checkIn: '',
    checkOut: '',
    price: '',
    bookingRef: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotel.name || !newHotel.checkIn || !newHotel.checkOut) return;
    onAdd({
      ...newHotel,
      price: Number(newHotel.price) || 0
    });
    setNewHotel({ name: '', address: '', checkIn: '', checkOut: '', price: '', bookingRef: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold hover:border-sky-400 hover:text-sky-500 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Add Hotel Booking
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-800">New Hotel Booking</h3>
          <input
            type="text"
            placeholder="Hotel Name"
            value={newHotel.name}
            onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-sky-500"
            required
          />
          <input
            type="text"
            placeholder="Address (Optional)"
            value={newHotel.address}
            onChange={e => setNewHotel({ ...newHotel, address: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1">Check-in</label>
              <input
                type="date"
                value={newHotel.checkIn}
                onChange={e => setNewHotel({ ...newHotel, checkIn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1">Check-out</label>
              <input
                type="date"
                value={newHotel.checkOut}
                onChange={e => setNewHotel({ ...newHotel, checkOut: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price (Total)"
              value={newHotel.price}
              onChange={e => setNewHotel({ ...newHotel, price: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500"
            />
            <input
              type="text"
              placeholder="Booking Ref"
              value={newHotel.bookingRef}
              onChange={e => setNewHotel({ ...newHotel, bookingRef: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 bg-slate-100 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-sky-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition"
            >
              Save Booking
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {hotels.map(hotel => (
          <div key={hotel.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group">
            <button
              onClick={() => onDelete(hotel.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            >
              <i className="ph-bold ph-trash"></i>
            </button>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-500 flex items-center justify-center text-2xl">
                🏨
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{hotel.name}</h3>
                {hotel.address && <p className="text-xs text-slate-400 mb-2">{hotel.address}</p>}

                <div className="flex gap-4 text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg inline-flex">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Check-in</div>
                    <div className="font-bold">{new Date(hotel.checkIn).toLocaleDateString()}</div>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Check-out</div>
                    <div className="font-bold">{new Date(hotel.checkOut).toLocaleDateString()}</div>
                  </div>
                </div>

                {(hotel.bookingRef || hotel.price > 0) && (
                  <div className="mt-3 flex gap-4 text-xs">
                    {hotel.bookingRef && (
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                        Ref: {hotel.bookingRef}
                      </span>
                    )}
                    {hotel.price > 0 && (
                      <span className="font-bold text-slate-700">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {hotels.length === 0 && !isAdding && (
          <div className="text-center py-10 text-slate-400 italic">No hotels booked yet.</div>
        )}
      </div>
    </div>
  );
};
