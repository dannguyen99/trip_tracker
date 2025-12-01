export type Currency = 'VND' | 'THB' | 'USD';
export type ExpenseType = 'SHARED' | 'PERSONAL' | 'SETTLEMENT';
export type Category = 'Food' | 'Transport' | 'Hotel' | 'Fun' | 'Misc' | 'Shopping' | 'Nightlife' | 'Massage' | 'Tours';

export interface User {
  id: string;
  userId?: string; // Links to profiles.id if registered
  name: string;
  avatar: string;
  color: string;
  border: string;
  bg: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amountVND: number;
  originalAmount: number;
  currency: Currency;
  type: ExpenseType;
  description: string;
  category: Category;
  date: string;
  splitTo?: string[]; // IDs of users involved in the split. undefined/null means everyone.
}

export interface Hotel {
  id: string;
  tripId: string;
  name: string;
  address?: string;
  checkIn: string;
  checkOut: string;
  price: number;
  bookingRef?: string;
}

export interface Restaurant {
  id: string;
  tripId: string;
  name: string;
  url?: string;
  notes?: string;
  category?: string;
  isTried: boolean;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  location?: string;
  description?: string;
  imageUrl?: string;
  tiktokUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface Activity {
  id: string;
  tripId: string;
  name: string;
  description?: string;
  location?: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  type: 'food' | 'activity' | 'travel' | 'hotel' | 'shopping' | 'other';
  status: 'planned' | 'done';
  notes?: string;

  // Rich UI fields
  icon?: string; // Phosphor icon class e.g. "ph-airplane-landing"
  tag?: string; // Custom label e.g. "Must Try", "Michelin"
  tagColor?: string; // e.g. "red", "blue", "orange"
  tips?: string; // Helpful tips
  rating?: number; // 1-5
  images?: string[]; // URLs
}

export interface PackingItem {
  id: string;
  tripId: string;
  name: string;
  category: string;
  isChecked: boolean;
  assignedTo?: string; // ID of the trip member
}

export interface TripData {
  id: string;
  name: string;
  totalBudgetVND: number;
  exchangeRate: number; // VND per 1 THB
  startDate: string | null;
  endDate: string | null;
  users: User[];
  expenses: Expense[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  activities: Activity[];
  packingItems: PackingItem[];
  ownerId?: string;
  isPublic?: boolean;
}

export interface AppState {
  trips: TripData[];
  activeTripId: string | null;
}


