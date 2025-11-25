import { useState, useEffect } from 'react';
import type { TripData, AppState, Expense, User } from './types';
import { DEFAULT_USERS } from './types';
import { Header } from './components/Header';
import { SetupModal } from './components/SetupModal';
import { ExpenseForm } from './components/ExpenseForm';
import { Dashboard } from './components/Dashboard';
import { Settlement } from './components/Settlement';
import { History } from './components/History';
import { UserManagement } from './components/UserManagement';
import { TripList } from './components/TripList';

const INITIAL_TRIP: TripData = {
  id: 'default',
  name: 'My Trip',
  expenses: [],
  totalBudgetVND: 0,
  exchangeRate: 740,
  users: DEFAULT_USERS,
};

const INITIAL_STATE: AppState = {
  trips: [],
  activeTripId: null,
};

function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('thaibaht_v5_data');
    if (saved) {
      return JSON.parse(saved);
    }

    // Migration from v4
    const v4Data = localStorage.getItem('thaibaht_v4_data');
    if (v4Data) {
      const parsed = JSON.parse(v4Data);
      const migratedTrip: TripData = {
        ...parsed,
        id: 'migrated_' + Date.now(),
        name: 'Migrated Trip',
        users: parsed.users || DEFAULT_USERS
      };
      return {
        trips: [migratedTrip],
        activeTripId: migratedTrip.id // Set the migrated trip as active
      };
    }

    return INITIAL_STATE;
  });

  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('thaibaht_v5_data', JSON.stringify(state));
  }, [state]);

  // Trip Management
  const handleCreateTrip = (name: string) => {
    const newTrip: TripData = {
      ...INITIAL_TRIP,
      id: Date.now().toString(),
      name,
      users: DEFAULT_USERS
    };
    setState(prev => ({
      ...prev,
      trips: [...prev.trips, newTrip],
      activeTripId: newTrip.id
    }));
    setIsSetupOpen(true);
  };

  const handleDeleteTrip = (id: string) => {
    if (confirm("Delete this trip permanently?")) {
      setState(prev => ({
        ...prev,
        trips: prev.trips.filter(t => t.id !== id),
        activeTripId: prev.activeTripId === id ? null : prev.activeTripId
      }));
    }
  };

  const activeTrip = state.trips.find(t => t.id === state.activeTripId);

  // Active Trip Handlers
  const updateActiveTrip = (updater: (trip: TripData) => TripData) => {
    if (!state.activeTripId) return;
    setState(prev => ({
      ...prev,
      trips: prev.trips.map(t => t.id === prev.activeTripId ? updater(t) : t)
    }));
  };

  const handleSaveSetup = (vnd: number, thb: number) => {
    updateActiveTrip(trip => ({
      ...trip,
      totalBudgetVND: vnd,
      exchangeRate: vnd / thb
    }));
    setIsSetupOpen(false);
  };

  const handleAddExpense = (expense: Expense) => {
    updateActiveTrip(trip => ({
      ...trip,
      expenses: [expense, ...trip.expenses]
    }));
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm("Delete this expense?")) {
      updateActiveTrip(trip => ({
        ...trip,
        expenses: trip.expenses.filter(e => e.id !== id)
      }));
    }
  };

  const handleResetTrip = () => {
    if (confirm("⚠️ Clear ALL data for this trip?")) {
      updateActiveTrip(trip => ({
        ...INITIAL_TRIP,
        id: trip.id,
        name: trip.name
      }));
      setIsSetupOpen(true);
    }
  };

  // User Management Handlers
  const handleAddUser = (name: string, avatar: string) => {
    if (!activeTrip) return;
    const newId = activeTrip.users.length > 0 ? Math.max(...activeTrip.users.map(u => u.id)) + 1 : 0;
    const colors = ["#3B82F6", "#EC4899", "#8B5CF6", "#F97316", "#10B981", "#F59E0B"];
    const randomColor = colors[newId % colors.length];

    const colorMap: Record<string, { bg: string, border: string }> = {
      "#3B82F6": { bg: "bg-blue-100", border: "border-blue-500" },
      "#EC4899": { bg: "bg-pink-100", border: "border-pink-500" },
      "#8B5CF6": { bg: "bg-purple-100", border: "border-purple-500" },
      "#F97316": { bg: "bg-orange-100", border: "border-orange-500" },
      "#10B981": { bg: "bg-green-100", border: "border-green-500" },
      "#F59E0B": { bg: "bg-yellow-100", border: "border-yellow-500" },
    };
    const style = colorMap[randomColor] || colorMap["#3B82F6"];

    const newUser: User = {
      id: newId,
      name,
      avatar,
      color: randomColor,
      bg: style.bg,
      border: style.border
    };

    updateActiveTrip(trip => ({
      ...trip,
      users: [...trip.users, newUser]
    }));
  };

  const handleEditUser = (id: number, name: string, avatar: string) => {
    updateActiveTrip(trip => ({
      ...trip,
      users: trip.users.map(u => u.id === id ? { ...u, name, avatar } : u)
    }));
  };

  const handleDeleteUser = (id: number) => {
    if (!activeTrip) return;
    const hasExpenses = activeTrip.expenses.some(e => e.payerId === id);
    if (hasExpenses) {
      alert("Cannot delete user who has paid for expenses. Please delete their expenses first.");
      return;
    }

    if (confirm("Delete this friend?")) {
      updateActiveTrip(trip => ({
        ...trip,
        users: trip.users.filter(u => u.id !== id)
      }));
    }
  };

  if (!activeTrip) {
    return (
      <TripList
        trips={state.trips}
        onSelectTrip={(id) => setState(prev => ({ ...prev, activeTripId: id }))}
        onCreateTrip={handleCreateTrip}
        onDeleteTrip={handleDeleteTrip}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onSave={handleSaveSetup}
        initialVND={activeTrip.totalBudgetVND}
        initialTHB={activeTrip.totalBudgetVND > 0 ? Math.round(activeTrip.totalBudgetVND / activeTrip.exchangeRate) : 0}
      />

      <UserManagement
        isOpen={isUserMgmtOpen}
        onClose={() => setIsUserMgmtOpen(false)}
        users={activeTrip.users}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <Header
        data={activeTrip}
        onOpenSetup={() => setIsSetupOpen(true)}
        onReset={handleResetTrip}
        onBack={() => setState(prev => ({ ...prev, activeTripId: null }))}
      />

      {/* Manage Friends Button */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 mb-6 relative z-20 flex justify-end">
        <button
          onClick={() => setIsUserMgmtOpen(true)}
          className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/30 transition flex items-center gap-1"
        >
          <span>👥</span> Manage Friends
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 space-y-8 relative z-20 pb-10">
        <ExpenseForm
          onAdd={handleAddExpense}
          exchangeRate={activeTrip.exchangeRate}
          users={activeTrip.users}
        />

        <Dashboard expenses={activeTrip.expenses} users={activeTrip.users} />

        <Settlement
          expenses={activeTrip.expenses}
          exchangeRate={activeTrip.exchangeRate}
          users={activeTrip.users}
        />

        <History
          expenses={activeTrip.expenses}
          onDelete={handleDeleteExpense}
          users={activeTrip.users}
        />
      </main>
    </div>
  );
}
export default App;
