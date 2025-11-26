# Implementation Plan - Gemini AI Integration for Dining

This plan outlines the steps to integrate Google's Gemini AI into the Trip Tracker application to provide personalized restaurant recommendations and enhance the data model with a new `category` field.

## User Objectives
- Integrate actual AI (Gemini) for recommendations.
- Add a `category` field to restaurants.
- maintain the "AI aesthetic" while using real AI data.

## Proposed Changes

### 1. Dependencies
- Install `@google/generative-ai` package.

### 2. Data Model
- **Database**: Add `category` column to `restaurants` table (Migration v4 created).
- **Frontend Types**: Update `Restaurant` interface to include `category` (Done).
- **State Management**: Update `useTrip` hook to handle `category` (Done).

### 3. AI Service (`src/services/ai.ts`)
- Create a service to interact with the Gemini API.
- Implement `generateRestaurantRecommendations(location, preferences)` function.
- **Prompt Engineering**: Design a prompt that returns structured JSON data matching our `Restaurant` type, including the new `category` field.

### 4. UI Components (`RestaurantList.tsx`)
- **Interaction**: Replace the current "Auto-Fill" logic with an async call to the AI service.
- **Feedback**: Add a loading state (spinner or skeleton UI) while Gemini is generating.
- **Display**:
    - Show the `category` tag on restaurant cards (e.g., "Fine Dining", "Street Food").
    - Use the AI-generated "Match Score" (we can simulate this or ask AI to generate a score).
- **Customization**: (Optional) Allow users to input specific preferences (e.g., "Vegetarian", "Romantic") before generating.

### 5. Configuration
- User needs to add `VITE_GEMINI_API_KEY` to `.env`.

## Verification Plan
1.  **Install**: Verify package installation.
2.  **Generate**: Click "Generate Recommendations" and verify network request to Gemini.
3.  **Render**: Check that new cards appear with:
    - Real names/descriptions from AI.
    - A visible `category` tag.
    - Correct formatting.
4.  **Persist**: Save a recommendation and verify it persists to Supabase with the `category`.
