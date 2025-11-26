import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { TripData, Expense } from '../types';
import { DEFAULT_USERS } from '../types';

export const useTrip = (tripId: string | null) => {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchTrip = useCallback(async (showLoading = true) => {
    if (!tripId) {
      if (isMounted.current) setTrip(null);
      return;
    }

    if (showLoading && isMounted.current) setLoading(true);

    try {
      // 1. Fetch Trip Details
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // 2. Fetch Members
      const { data: membersData, error: membersError } = await supabase
        .from('trip_members')
        .select('*')
        .eq('trip_id', tripId);

      if (membersError) throw membersError;

      // 3. Fetch Expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      // 4. Fetch Hotels
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotels')
        .select('*')
        .eq('trip_id', tripId)
        .order('check_in', { ascending: true });

      if (hotelsError) throw hotelsError;

      // 5. Fetch Restaurants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (restaurantsError) throw restaurantsError;

      // 6. Fetch Activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('trip_id', tripId)
        .order('start_time', { ascending: true });

      if (activitiesError) throw activitiesError;

      if (isMounted.current) {
        setTrip({
          id: tripData.id,
          name: tripData.name,
          totalBudgetVND: tripData.total_budget_vnd,
          exchangeRate: tripData.exchange_rate,
          startDate: tripData.start_date,
          endDate: tripData.end_date,
          users: membersData.map((m: any) => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            color: m.color,
            bg: m.bg,
            border: m.border
          })),
          expenses: expensesData.map((e: any) => ({
            id: e.id,
            payerId: e.payer_id,
            amountVND: e.amount_vnd,
            originalAmount: e.original_amount,
            currency: e.currency,
            type: e.type,
            description: e.description,
            category: e.category,
            date: e.date
          })),
          hotels: hotelsData.map((h: any) => ({
            id: h.id,
            tripId: h.trip_id,
            name: h.name,
            address: h.address,
            checkIn: h.check_in,
            checkOut: h.check_out,
            price: h.price,
            bookingRef: h.booking_ref
          })),
          restaurants: restaurantsData.map((r: any) => ({
            id: r.id,
            tripId: r.trip_id,
            name: r.name,
            url: r.url,
            notes: r.notes,
            category: r.category,
            isTried: r.is_tried,
            cuisine: r.cuisine,
            priceRange: r.price_range,
            rating: r.rating,
            location: r.location,
            description: r.description,
            imageUrl: r.image_url
          })),
          activities: activitiesData.map((a: any) => ({
            id: a.id,
            tripId: a.trip_id,
            name: a.name,
            description: a.description,
            location: a.location,
            startTime: a.start_time,
            endTime: a.end_time,
            type: a.type,
            status: a.status,
            notes: a.notes
          }))
        });
      }
    } catch (err: any) {
      console.error('Error fetching trip:', err);
      if (isMounted.current) setError(err.message);
    } finally {
      if (showLoading && isMounted.current) setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip(true);

    // Real-time Subscription
    const channel = supabase
      .channel(`trip:${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `trip_id=eq.${tripId}` }, () => fetchTrip(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${tripId}` }, () => fetchTrip(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` }, () => fetchTrip(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hotels', filter: `trip_id=eq.${tripId}` }, () => fetchTrip(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants', filter: `trip_id=eq.${tripId}` }, () => fetchTrip(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities', filter: `trip_id=eq.${tripId}` }, () => fetchTrip(false))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, fetchTrip]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!tripId) return;
    const { error } = await supabase.from('expenses').insert({
      trip_id: tripId,
      payer_id: expense.payerId,
      description: expense.description,
      amount_vnd: expense.amountVND,
      original_amount: expense.originalAmount,
      currency: expense.currency,
      type: expense.type,
      category: expense.category,
      date: expense.date
    });
    if (error) throw error;
    fetchTrip(false);
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  // Hotel Methods
  const addHotel = async (hotel: any) => {
    if (!tripId) return;
    const { error } = await supabase.from('hotels').insert({
      trip_id: tripId,
      name: hotel.name,
      address: hotel.address,
      check_in: hotel.checkIn,
      check_out: hotel.checkOut,
      price: hotel.price,
      booking_ref: hotel.bookingRef
    });
    if (error) throw error;
    fetchTrip(false);
  };

  const deleteHotel = async (id: string) => {
    const { error } = await supabase.from('hotels').delete().eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  // Restaurant Methods
  const addRestaurant = async (restaurant: any) => {
    if (!tripId) return;
    const { error } = await supabase.from('restaurants').insert({
      trip_id: tripId,
      name: restaurant.name,
      url: restaurant.url,
      notes: restaurant.notes,
      category: restaurant.category,
      cuisine: restaurant.cuisine,
      price_range: restaurant.priceRange,
      rating: restaurant.rating,
      location: restaurant.location,
      description: restaurant.description,
      image_url: restaurant.imageUrl
    });
    if (error) throw error;
    fetchTrip(false);
  };

  const toggleRestaurantTried = async (id: string, isTried: boolean) => {
    const { error } = await supabase.from('restaurants').update({ is_tried: isTried }).eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  const deleteRestaurant = async (id: string) => {
    const { error } = await supabase.from('restaurants').delete().eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  const createTrip = async (name: string) => {
    // 1. Create Trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({ name, total_budget_vnd: 0, exchange_rate: 740 })
      .select()
      .single();

    if (tripError) throw tripError;

    // 2. Add Default Members
    const members = DEFAULT_USERS.map(u => ({
      trip_id: trip.id,
      name: u.name,
      avatar: u.avatar,
      color: u.color,
      bg: u.bg,
      border: u.border
    }));

    const { error: membersError } = await supabase.from('trip_members').insert(members);
    if (membersError) throw membersError;

    return trip.id;
  };

  const addMember = async (name: string, avatar: string) => {
    if (!tripId) return;
    // Generate random color style
    const colors = ["#3B82F6", "#EC4899", "#8B5CF6", "#F97316", "#10B981", "#F59E0B"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const colorMap: Record<string, { bg: string, border: string }> = {
      "#3B82F6": { bg: "bg-blue-100", border: "border-blue-500" },
      "#EC4899": { bg: "bg-pink-100", border: "border-pink-500" },
      "#8B5CF6": { bg: "bg-purple-100", border: "border-purple-500" },
      "#F97316": { bg: "bg-orange-100", border: "border-orange-500" },
      "#10B981": { bg: "bg-green-100", border: "border-green-500" },
      "#F59E0B": { bg: "bg-yellow-100", border: "border-yellow-500" },
    };
    const style = colorMap[randomColor] || colorMap["#3B82F6"];

    const { error } = await supabase.from('trip_members').insert({
      trip_id: tripId,
      name,
      avatar,
      color: randomColor,
      bg: style.bg,
      border: style.border
    });
    if (error) throw error;
    fetchTrip(false);
  };

  const updateMember = async (id: string, name: string, avatar: string) => {
    const { error } = await supabase.from('trip_members').update({ name, avatar }).eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from('trip_members').delete().eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  const updateTripSettings = async (totalBudgetVND: number, exchangeRate: number, startDate?: string | null, endDate?: string | null) => {
    if (!tripId) return;
    const updates: any = {
      total_budget_vnd: totalBudgetVND,
      exchange_rate: exchangeRate
    };
    if (startDate !== undefined) updates.start_date = startDate;
    if (endDate !== undefined) updates.end_date = endDate;

    const { error } = await supabase.from('trips').update(updates).eq('id', tripId);
    if (error) throw error;
    fetchTrip(false);
  };

  // Activity Methods
  const addActivity = async (activity: any) => {
    if (!tripId) return;
    const { error } = await supabase.from('activities').insert({
      trip_id: tripId,
      name: activity.name,
      description: activity.description,
      location: activity.location,
      start_time: activity.startTime,
      end_time: activity.endTime,
      type: activity.type,
      status: activity.status,
      notes: activity.notes
    });
    if (error) throw error;
    fetchTrip(false);
  };

  const updateActivity = async (id: string, updates: any) => {
    // Convert camelCase to snake_case for DB
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.startTime) dbUpdates.start_time = updates.startTime;
    if (updates.endTime) dbUpdates.end_time = updates.endTime;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.notes) dbUpdates.notes = updates.notes;

    const { error } = await supabase.from('activities').update(dbUpdates).eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
    fetchTrip(false);
  };

  return {
    trip,
    loading,
    error,
    addExpense,
    deleteExpense,
    createTrip,
    addMember,
    updateMember,
    deleteMember,
    updateTripSettings,
    addHotel,
    deleteHotel,
    addRestaurant,
    toggleRestaurantTried,
    deleteRestaurant,
    addActivity,
    updateActivity,
    deleteActivity
  };
};
