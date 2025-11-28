export type Currency = 'VND' | 'THB' | 'USD';
export type ExpenseType = 'SHARED' | 'PERSONAL';
export type Category = 'Food' | 'Transport' | 'Hotel' | 'Fun' | 'Misc' | 'Shopping' | 'Nightlife' | 'Massage' | 'Tours';

export interface User {
  id: string;
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
}

export interface AppState {
  trips: TripData[];
  activeTripId: string | null;
}

export const DEFAULT_USERS: User[] = [
  { id: "0", name: "Duy Bảo", avatar: "👨🏻", color: "#3B82F6", border: "border-blue-500", bg: "bg-blue-100" },
  { id: "1", name: "Linh Trang", avatar: "👩🏻", color: "#EC4899", border: "border-pink-500", bg: "bg-pink-100" },
  { id: "2", name: "Đức Dân", avatar: "👨🏼", color: "#8B5CF6", border: "border-purple-500", bg: "bg-purple-100" },
  { id: "3", name: "Phương Anh", avatar: "👩🏼", color: "#F97316", border: "border-orange-500", bg: "bg-orange-100" }
];
