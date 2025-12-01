import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TripData, PackingItem } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY || "");

export interface AISuggestion {
  name: string;
  category: string;
  reason: string;
}

export const generatePackingSuggestions = async (
  trip: TripData,
  existingItems: PackingItem[],
  language: 'en' | 'vi' = 'en'
): Promise<AISuggestion[]> => {
  if (!API_KEY) {
    console.error("Gemini API Key is missing");
    throw new Error("Gemini API Key is missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

  const existingNames = existingItems.map(i => i.name).join(", ");

  const prompt = `
    You are a helpful travel packing assistant.
    
    Trip Details:
    - Destination: ${trip.hotels[0]?.address || "Unknown"}
    - Start Date: ${trip.startDate || "Unknown"}
    - End Date: ${trip.endDate || "Unknown"}
    - Activities: ${trip.activities.map(a => a.name).join(", ")}
    
    Existing Items (DO NOT Suggest these): ${existingNames}
    
    Task:
    Suggest 5-10 essential packing items that are missing from the list, specifically tailored to the destination, weather (infer from date/location), and activities.
    
    IMPORTANT: Respond in ${language === 'vi' ? 'Vietnamese' : 'English'}.
    
    Return ONLY a valid JSON array with objects containing:
    - name: string (item name in ${language === 'vi' ? 'Vietnamese' : 'English'})
    - category: string (one of: Essentials, Clothing, Toiletries, Tech, Documents, Misc)
    - reason: string (short explanation why it's needed in ${language === 'vi' ? 'Vietnamese' : 'English'})
    
    Example JSON:
    [
      { "name": "${language === 'vi' ? 'Giày leo núi' : 'Hiking Boots'}", "category": "Clothing", "reason": "${language === 'vi' ? 'Cần thiết cho hoạt động leo núi' : 'Required for Mountain Trek activity'}" }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const suggestions: AISuggestion[] = JSON.parse(jsonString);
    return suggestions;
  } catch (error) {
    console.error("Error generating packing suggestions:", error);
    throw error;
  }
};

// --- Restaurant AI Features ---

export const isAIEnabled = () => !!API_KEY;

export interface AIRestaurantSuggestion {
  name: string;
  cuisine: string;
  reason: string;
  location: string;
}

export const generateRestaurantRecommendations = async (
  location: string,
  preferences: string
): Promise<AIRestaurantSuggestion[]> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing");

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

  const prompt = `
    You are a local food guide.
    
    Location: ${location}
    Preferences: ${preferences}
    
    Task:
    Suggest 3-5 must-try restaurants or street food spots matching the location and preferences.
    
    Return ONLY a valid JSON array with objects containing:
    - name: string
    - cuisine: string
    - reason: string (why it's good)
    - location: string (approximate area)
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating restaurant suggestions:", error);
    throw error;
  }
};
