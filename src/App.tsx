import { useState, useEffect } from 'react';
import { useTrip } from './hooks/useTrip';
import { useAllTrips } from './hooks/useAllTrips';
import heroImage from './assets/landing_hero.png';
import desktopBg from './assets/desktop_bg.png';
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

function App() {
  // Simple URL routing for now: ?trip_id=...
  const [tripId, setTripId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'hotels' | 'dining'>('expenses');

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
    deleteRestaurant
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
      alert('Failed to create trip');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveSetup = async (vnd: number, thb: number) => {
    try {
      await updateTripSettings(vnd, vnd / thb);
      setIsSetupOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-sm">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Trip</h2>
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
      <div
        className="min-h-screen bg-slate-50 bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{ backgroundImage: `url(${desktopBg})` }}
      >
        <div className="w-full max-w-md mx-auto min-h-screen sm:min-h-[85vh] sm:h-auto sm:rounded-[2.5rem] flex flex-col bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden relative sm:my-8 transition-all duration-500">

          {/* Hero Section */}
          <div className="relative h-64 bg-sky-100">
            <img src={heroImage} alt="Travel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
            <div className="absolute bottom-4 left-6">
              <h1 className="text-3xl font-extrabold text-slate-800">Trip Tracker</h1>
              <p className="text-slate-600 font-medium">Where to next?</p>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-6 relative z-10 -mt-6">

            {/* Create New Trip Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Start a New Adventure</h2>
              <form onSubmit={handleCreateTrip} className="space-y-3">
                <input
                  type="text"
                  value={newTripName}
                  onChange={(e) => setNewTripName(e.target.value)}
                  placeholder="Trip Name (e.g. Bali 2025)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold focus:outline-none focus:border-sky-500 transition"
                />
                <button
                  type="submit"
                  disabled={!newTripName || isCreating}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/30 transition transform active:scale-[0.98] disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Trip ✨'}
                </button>
              </form>
            </div>

            {/* Existing Trips List */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">Recent Trips</h3>

              {tripsLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>
              ) : trips.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic">No trips yet. Start one above!</div>
              ) : (
                <div className="space-y-3 pb-8">
                  {trips.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        const newUrl = `${window.location.pathname}?trip_id=${t.id}`;
                        window.history.pushState({ path: newUrl }, '', newUrl);
                        setTripId(t.id);
                      }}
                      className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between group text-left"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition">{t.name}</div>
                        <div className="text-xs text-slate-400 flex gap-2">
                          <span>📅 {new Date(t.created_at).toLocaleDateString()}</span>
                          <span>👥 {t.member_count} members</span>
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
                  <span>Have a Trip ID?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Paste Trip ID here..."
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
        onReset={() => { }} // Reset not implemented yet
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
            alert('Link copied! Send it to your friends.');
          }}
          className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/30 transition flex items-center gap-1"
        >
          <span>🔗</span> Share Trip
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
          />
        )}

        {activeTab === 'dining' && (
          <RestaurantList
            restaurants={trip.restaurants || []}
            onAdd={addRestaurant}
            onToggleTried={toggleRestaurantTried}
            onDelete={deleteRestaurant}
          />
        )}

      </main>
    </div>
  );
}
export default App;
