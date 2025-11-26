import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Restaurant, Activity } from '../types';

// Initialize Gemini API
// Note: In a real production app, you should use a backend proxy to hide your API key.
// For this demo/prototype, we'll use the client-side key from .env.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const isAIEnabled = () => !!API_KEY;

export const generateRestaurantRecommendations = async (
  location: string,
  preferences: string = ''
): Promise<Partial<Restaurant>[]> => {
  if (!genAI) {
    console.warn('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
    return [];
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    You are a local culinary expert and concierge.
    Recommend 5 top-rated restaurants in ${location}.
    
    User Preferences: ${preferences || 'Mix of local gems and popular spots'}

    Return the response ONLY as a valid JSON array of objects. Do not include markdown formatting or backticks.
    Each object should have the following fields:
    - name (string)
    - cuisine (string)
    - priceRange (string, e.g., "$", "$$", "$$$")
    - rating (number, 0-5, be realistic based on public perception)
    - location (string, short address or area)
    - description (string, short punchy description, max 2 sentences)
    - category (string, e.g., "Casual", "Fine Dining", "Street Food", "Cafe", "Bar")
    
    Example format:
    [
      {
        "name": "Example Resto",
        "cuisine": "Italian",
        "priceRange": "$$",
        "rating": 4.5,
        "location": "Downtown",
        "description": "Amazing pasta.",
        "category": "Casual"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the text if it contains markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const recommendations = JSON.parse(jsonStr);
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

export const generateItinerary = async (
  location: string,
  date: string,
  preferences: string = ''
): Promise<Partial<Activity>[]> => {
  if (!genAI) {
    console.warn('Gemini API Key is missing.');
    return [];
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    You are a professional travel planner.
    Create a 1-day itinerary for ${location} on ${date}.
    
    User Preferences: ${preferences || 'Balanced mix of sightseeing, food, and relaxation'}

    Return the response ONLY as a valid JSON array of objects. Do not include markdown formatting or backticks.
    Each object should have the following fields:
    - name (string, name of the place or activity)
    - description (string, short description)
    - location (string, address or area)
    - startTime (string, ISO 8601 datetime string for ${date}, e.g., "2023-12-25T09:00:00")
    - endTime (string, ISO 8601 datetime string for ${date}, e.g., "2023-12-25T10:30:00")
    - type (string, one of: "food", "activity", "travel", "hotel", "other")
    - notes (string, optional tips)
    
    Ensure the times are logical and sequential for a single day.
    
    Example format:
    [
      {
        "name": "Morning Coffee at The Commons",
        "description": "Start the day with artisan coffee.",
        "location": "Thong Lo",
        "startTime": "2023-12-25T09:00:00",
        "endTime": "2023-12-25T10:00:00",
        "type": "food",
        "notes": "Try the cold brew."
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the text if it contains markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const activities = JSON.parse(jsonStr);
    return activities;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return [];
  }
};
