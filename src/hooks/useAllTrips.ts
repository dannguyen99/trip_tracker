import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TripSummary {
  id: string;
  name: string;
  created_at: string;
  total_budget_vnd: number;
  member_count: number;
}

export const useAllTrips = () => {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      // Fetch trips and count members
      const { data, error } = await supabase
        .from('trips')
        .select(`
          id,
          name,
          created_at,
          total_budget_vnd,
          owner_id,
          trip_members (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTrips = data.map((t: any) => ({
        id: t.id,
        name: t.name,
        created_at: t.created_at,
        total_budget_vnd: t.total_budget_vnd,
        owner_id: t.owner_id,
        member_count: t.trip_members[0]?.count || 0
      }));

      setTrips(formattedTrips);
    } catch (err: any) {
      console.error('Error fetching trips:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();

    // Subscribe to new trips
    const channel = supabase
      .channel('public:trips')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => {
        fetchTrips();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { trips, loading, error, refreshTrips: fetchTrips };
};
