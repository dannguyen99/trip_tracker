import { en } from './en';
import { vi } from './vi';

export const translations = { en, vi };
export type Language = keyof typeof translations;
