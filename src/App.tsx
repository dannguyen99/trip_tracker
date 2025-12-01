import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { UserProfile } from './components/Profile/UserProfile';
import { useTrip } from './hooks/useTrip';
import { useAllTrips } from './hooks/useAllTrips';
import heroImage from './assets/landing_hero.png';

import { Header } from './components/Header';
import { SetupModal } from './components/SetupModal';
import { ExpenseForm } from './components/ExpenseForm';
import { Dashboard } from './components/Dashboard';
import { Settlement } from './components/Settlement';
import { History } from './components/History';
import { UserManagement } from './components/UserManagement';
import { Tabs } from './components/Tabs';
import { HotelList } from './components/HotelList';
import { RestaurantList } from './components/RestaurantList';
import { Itinerary } from './components/Itinerary';
import { PackingList } from './components/PackingList';
import { getForecast, type WeatherData } from './services/weather';

import { LanguageProvider } from './contexts/LanguageContext';

import { useLanguage } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth/Auth';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();
  // Simple URL routing for now: ?trip_id=...
  const [tripId, setTripId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'hotels' | 'dining' | 'itinerary' | 'packing'>('expenses');

  // Sync language from profile on login
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('language')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.language) {
            setLanguage(data.language as 'en' | 'vi');
          }
        });
    }
  }, [user, setLanguage]);
  const [weatherForecast, setWeatherForecast] = useState<WeatherData[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      // Default to Bangkok coordinates
      const data = await getForecast(13.7563, 100.5018);
      setWeatherForecast(data);
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('trip_id');
    if (id) setTripId(id);
  }, []);

  const { trips, loading: tripsLoading } = useAllTrips();
  const {
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
    clearRestaurants,
    addActivity,
    updateActivity,
    deleteActivity,
    addPackingItem,
    updatePackingItem,
    deletePackingItem,
    clearPackingItems,

  } = useTrip(tripId);

  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripName) return;
    setIsCreating(true);
    try {
      const newId = await createTrip(newTripName);
      // Update URL without refresh
      const newUrl = `${window.location.pathname}?trip_id=${newId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      setTripId(newId);
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveSetup = async (vnd: number, thb: number, startDate: string, endDate: string, isPublic: boolean) => {
    try {
      await updateTripSettings(vnd, vnd / thb, startDate, endDate, isPublic);
      setIsSetupOpen(false);
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // If user is not logged in, we only allow access if there is a tripId (Public Access check)
  // If no tripId, force Auth.
  // If tripId exists but access is denied (handled by useTrip error), we might want to show Auth then.
  if (!user && !tripId) {
    return <Auth />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // If we have an error and no user, it likely means access denied to private trip -> Show Auth
  if (error && !user) {
    return <Auth />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-sm">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{t('common.error')}</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = window.location.pathname}
            className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!tripId || !trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto min-h-screen sm:min-h-[85vh] sm:h-auto sm:rounded-[2.5rem] flex flex-col bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden relative sm:my-8 transition-all duration-500">

          {/* Hero Section */}
          <div className="relative h-64 bg-sky-100">
            <img src={heroImage} alt="Travel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
            <div className="absolute bottom-4 left-6">
              <h1 className="text-3xl font-extrabold text-slate-800">{t('hero.title')}</h1>
              <p className="text-slate-600 font-medium">{t('hero.subtitle')}</p>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="bg-white/50 hover:bg-white/80 p-2 rounded-full text-xs font-bold transition flex items-center gap-1"
              >
                <span>👤</span> Profile
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6 relative z-10 -mt-6">

            {/* Create New Trip Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">{t('hero.start_adventure')}</h2>
              <form onSubmit={handleCreateTrip} className="space-y-3">
                <input
                  type="text"
                  value={newTripName}
                  onChange={(e) => setNewTripName(e.target.value)}
                  placeholder={t('hero.trip_name_placeholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold focus:outline-none focus:border-sky-500 transition"
                />
                <button
                  type="submit"
                  disabled={!newTripName || isCreating}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/30 transition transform active:scale-[0.98] disabled:opacity-50"
                >
                  {isCreating ? t('hero.creating') : t('hero.create_trip')}
                </button>
              </form>
            </div>

            {/* Existing Trips List */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">{t('hero.recent_trips')}</h3>

              {tripsLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>
              ) : trips.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic">{t('hero.no_trips')}</div>
              ) : (
                <div className="space-y-3 pb-8">
                  {trips.map(t_item => ( // Renamed t to t_item to avoid conflict with t() function
                    <button
                      key={t_item.id}
                      onClick={() => {
                        const newUrl = `${window.location.pathname}?trip_id=${t_item.id}`;
                        window.history.pushState({ path: newUrl }, '', newUrl);
                        setTripId(t_item.id);
                      }}
                      className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between group text-left"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition">{t_item.name}</div>
                        <div className="text-xs text-slate-400 flex gap-2">
                          <span>📅 {new Date(t_item.created_at).toLocaleDateString()}</span>
                          <span>👥 {t_item.member_count} {t('hero.members')}</span>
                        </div>
                      </div>
                      <div className="text-2xl opacity-50 group-hover:opacity-100 transition">✈️</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Join by ID */}
            <div className="pt-4 border-t border-slate-100">
              <details className="group">
                <summary className="list-none text-xs font-bold text-slate-400 cursor-pointer hover:text-sky-500 transition flex items-center gap-1">
                  <span>{t('hero.have_trip_id')}</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder={t('hero.paste_trip_id')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-400"
                    onChange={(e) => {
                      if (e.target.value.length > 20) {
                        setTripId(e.target.value);
                      }
                    }}
                  />
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Setup Modal */}
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onSave={handleSaveSetup}
        initialVND={trip.totalBudgetVND}
        initialTHB={trip.totalBudgetVND > 0 ? Math.round(trip.totalBudgetVND / trip.exchangeRate) : 0}
        initialStartDate={trip.startDate}
        initialEndDate={trip.endDate}
        initialIsPublic={trip.isPublic}
      />

      {/* User Management */}
      <UserManagement
        isOpen={isUserMgmtOpen}
        onClose={() => setIsUserMgmtOpen(false)}
        users={trip.users}
        onAddUser={addMember}
        onEditUser={updateMember}
        onDeleteUser={deleteMember}
      />

      <Header
        data={trip}
        onOpenSetup={() => setIsSetupOpen(true)}
        onManageUsers={() => setIsUserMgmtOpen(true)}
        onBack={() => {
          setTripId(null);
          window.history.pushState({}, '', window.location.pathname);
        }}
      />

      {/* Share Button */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 mb-6 relative z-20 flex justify-end gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert(t('header.link_copied'));
          }}
          className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/30 transition flex items-center gap-1"
        >
          <span>🔗</span> {t('header.share_trip')}
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 space-y-8 relative z-20 pb-10">

        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'expenses' && (
          <>
            <ExpenseForm
              onAdd={addExpense}
              exchangeRate={trip.exchangeRate}
              users={trip.users}
            />

            <Dashboard expenses={trip.expenses} users={trip.users} />

            <Settlement
              expenses={trip.expenses}
              exchangeRate={trip.exchangeRate}
              users={trip.users}
            />

            <History
              expenses={trip.expenses}
              onDelete={deleteExpense}
              users={trip.users}
            />
          </>
        )}

        {activeTab === 'hotels' && (
          <HotelList
            hotels={trip.hotels || []}
            onAdd={addHotel}
            onDelete={deleteHotel}
            tripId={trip.id}
            onAddExpense={addExpense}
          />
        )}

        {activeTab === 'dining' && (
          <RestaurantList
            restaurants={trip.restaurants || []}
            onAdd={addRestaurant}
            onToggleTried={toggleRestaurantTried}
            onDelete={deleteRestaurant}
            onClear={clearRestaurants}
            tripId={trip.id}
          />
        )}

        {activeTab === 'itinerary' && (
          <Itinerary
            activities={trip.activities || []}
            onAdd={addActivity}
            onUpdate={updateActivity}
            onDelete={deleteActivity}
            tripId={trip.id}
            startDate={trip.startDate}
            endDate={trip.endDate}
            onOpenSetup={() => setIsSetupOpen(true)}
            onAddExpense={addExpense}
          />
        )}

        {activeTab === 'packing' && (
          <PackingList
            items={trip.packingItems || []}
            users={trip.users}
            onAdd={addPackingItem}
            onUpdate={updatePackingItem}
            onDelete={deletePackingItem}
            onClearAll={() => clearPackingItems(tripId!)}
            tripId={tripId!}
            tripData={trip}
            weatherForecast={weatherForecast}
          />
        )}

      </main>
    </div>
  );
}



function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
