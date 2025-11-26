import React, { useState } from 'react';
import type { Hotel } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import hotelImage from '../assets/hotel.jpg';

interface HotelListProps {
  hotels: Hotel[];
  onAdd: (hotel: Omit<Hotel, 'id' | 'created_at'>) => void;
  onDelete: (id: string) => void;
  tripId: string;
}

export const HotelList: React.FC<HotelListProps> = ({ hotels, onAdd, onDelete, tripId }) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: '',
    address: '',
    price: 0,
    checkIn: '',
    checkOut: '',
    bookingRef: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotel.name || !newHotel.price) return;

    onAdd({
      tripId,
      name: newHotel.name,
      address: newHotel.address || '',
      price: Number(newHotel.price),
      checkIn: newHotel.checkIn || '',
      checkOut: newHotel.checkOut || '',
      bookingRef: newHotel.bookingRef || ''
    });
    setIsAdding(false);
    setNewHotel({ name: '', address: '', price: 0, checkIn: '', checkOut: '', bookingRef: '' });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-6 group">
        <img src={hotelImage} alt="Hotels" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{t('hotels.hero_title')}</h2>
          <p className="text-white/90 font-medium max-w-xs">{t('hotels.hero_subtitle')}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-800/20 hover:bg-slate-900 transition flex items-center gap-2"
        >
          <i className="ph-bold ph-plus"></i> {t('hotels.add_stay')}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-800">{t('hotels.new_stay')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t('hotels.hotel_name')}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-sky-500"
              value={newHotel.name}
              onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder={t('hotels.address')}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-sky-500"
              value={newHotel.address}
              onChange={e => setNewHotel({ ...newHotel, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t('hotels.check_in')}</label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-sky-500"
                value={newHotel.checkIn}
                onChange={e => setNewHotel({ ...newHotel, checkIn: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t('hotels.check_out')}</label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-sky-500"
                value={newHotel.checkOut}
                onChange={e => setNewHotel({ ...newHotel, checkOut: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder={t('hotels.price_per_night')}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-sky-500"
              value={newHotel.price || ''}
              onChange={e => setNewHotel({ ...newHotel, price: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder={t('hotels.booking_ref')}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-sky-500"
              value={newHotel.bookingRef}
              onChange={e => setNewHotel({ ...newHotel, bookingRef: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="bg-sky-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition"
            >
              {t('common.save')}
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
