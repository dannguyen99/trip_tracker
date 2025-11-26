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
  isTried: boolean;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  location?: string;
  description?: string;
  imageUrl?: string;
}

export interface TripData {
  id: string;
  name: string;
  totalBudgetVND: number;
  exchangeRate: number; // VND per 1 THB
  users: User[];
  expenses: Expense[];
  hotels: Hotel[];
  restaurants: Restaurant[];
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
