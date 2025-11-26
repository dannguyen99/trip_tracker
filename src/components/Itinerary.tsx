import React from 'react';
import type { Activity } from '../types';
import { BangkokPlan } from './BangkokPlan';

interface ItineraryProps {
  activities: Activity[];
  onAdd: (activity: Omit<Activity, 'id' | 'created_at'>) => void;
  onUpdate?: (id: string, updates: Partial<Activity>) => void;
  onDelete: (id: string) => void;
  tripId: string;
  startDate?: string | null;
  endDate?: string | null;
}

export const Itinerary: React.FC<ItineraryProps> = () => {
  return <BangkokPlan />;
};
