import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const JoinTrip: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripDetails, setTripDetails] = useState<{
    trip_id: string;
    trip_name: string;
    owner_name: string;
    owner_avatar: string;
  } | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!token) return;
      try {
        const { data, error } = await supabase.rpc('get_trip_details_by_invite', { invite_token: token });
        if (error) throw error;
        if (data && data.length > 0) {
          setTripDetails(data[0]);
        } else {
          setError('Invalid or expired invite link.');
        }
      } catch (err: any) {
        console.error('Error fetching trip details:', err);
        setError(err.message || 'Failed to load trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [token]);

  const handleJoin = async () => {
    if (!user) {
      // Redirect to login, preserving the join URL to redirect back after login?
      // For now, just tell them to login.
      // Better: The Auth component should handle this if we wrap this in a protected route,
      // but we want the landing page to be visible even if not logged in.
      // So we'll just show a "Sign in to Join" button if not logged in.
      return;
    }

    setLoading(true);
    try {
      const { data: tripId, error } = await supabase.rpc('join_trip_via_invite', { invite_token: token });
      if (error) throw error;
      navigate(`/trip/${tripId}`);
    } catch (err: any) {
      console.error('Error joining trip:', err);
      setError(err.message || 'Failed to join trip.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin text-4xl">🌍</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-100 to-transparent"></div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full relative z-10">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          ✈️
        </div>

        <h1 className="text-2xl font-black text-slate-800 mb-2">You're invited!</h1>
        <p className="text-slate-500 mb-8">
          <span className="font-bold text-slate-700">{tripDetails?.owner_name}</span> invited you to join:
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{tripDetails?.trip_name}</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {tripDetails?.owner_avatar && (
              <img src={tripDetails.owner_avatar} alt={tripDetails.owner_name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
            )}
            <span className="text-sm font-bold text-slate-400">Trip Owner</span>
          </div>
        </div>

        {user ? (
          <button
            onClick={handleJoin}
            className="w-full py-4 rounded-xl font-bold text-lg bg-slate-800 text-white hover:bg-black hover:scale-[1.02] transition shadow-xl shadow-slate-800/20"
          >
            Join Trip
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-2">Sign in to accept this invitation</p>
            <button
              onClick={() => navigate('/login', { state: { from: `/join/${token}` } })}
              className="w-full py-3 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition shadow-lg shadow-purple-600/20"
            >
              Sign In / Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
