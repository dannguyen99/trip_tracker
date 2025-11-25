import { useState, useEffect } from 'react';
import { useTrip } from './hooks/useTrip';
import { Header } from './components/Header';
import { SetupModal } from './components/SetupModal';
import { ExpenseForm } from './components/ExpenseForm';
import { Dashboard } from './components/Dashboard';
import { Settlement } from './components/Settlement';
import { History } from './components/History';
import { UserManagement } from './components/UserManagement';

function App() {
  // Simple URL routing for now: ?trip_id=...
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('trip_id');
    if (id) setTripId(id);
  }, []);

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
    updateTripSettings
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md text-center pop-in">
          <div className="text-6xl mb-4">✈️</div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Trip Tracker</h1>
          <p className="text-slate-400 mb-8">Plan, track, and settle expenses with friends.</p>

          <form onSubmit={handleCreateTrip} className="space-y-4">
            <input
              type="text"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              placeholder="Where are you going?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg font-bold focus:outline-none focus:border-sky-500 transition text-center"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newTripName || isCreating}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Start New Trip'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2">Have a trip code?</p>
            <input
              type="text"
              placeholder="Paste Trip ID here"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-center focus:outline-none focus:border-slate-400"
              onChange={(e) => {
                if (e.target.value.length > 20) {
                  setTripId(e.target.value);
                }
              }}
            />
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
      </main>
    </div>
  );
}
export default App;
