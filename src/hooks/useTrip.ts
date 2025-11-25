import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TripData, Expense } from '../types';
import { DEFAULT_USERS } from '../types';

export const useTrip = (tripId: string | null) => {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      setTrip(null);
      return;
    }

    let isMounted = true;

    const fetchTrip = async () => {
      setLoading(true);
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

        if (isMounted) {
          setTrip({
            id: tripData.id,
            name: tripData.name,
            totalBudgetVND: tripData.total_budget_vnd,
            exchangeRate: tripData.exchange_rate,
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
            }))
          });
        }
      } catch (err: any) {
        console.error('Error fetching trip:', err);
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrip();

    // Real-time Subscription
    const channel = supabase
      .channel(`trip:${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `trip_id=eq.${tripId}` }, () => {
        fetchTrip(); // Re-fetch on any expense change (simplest way to keep sync)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${tripId}` }, () => {
        fetchTrip();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` }, () => {
        fetchTrip();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tripId]);

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
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
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
  };

  const updateMember = async (id: string, name: string, avatar: string) => {
    const { error } = await supabase.from('trip_members').update({ name, avatar }).eq('id', id);
    if (error) throw error;
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from('trip_members').delete().eq('id', id);
    if (error) throw error;
  };

  const updateTripSettings = async (totalBudgetVND: number, exchangeRate: number) => {
    if (!tripId) return;
    const { error } = await supabase.from('trips').update({
      total_budget_vnd: totalBudgetVND,
      exchange_rate: exchangeRate
    }).eq('id', tripId);
    if (error) throw error;
  };

  return { trip, loading, error, addExpense, deleteExpense, createTrip, addMember, updateMember, deleteMember, updateTripSettings };
};
