import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItineraryResponse, SubSpot, CreativeSolution, TravelInput } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Generates the main itinerary based on user inputs.
 */
export const generateItinerary = async (
  input: TravelInput
): Promise<ItineraryResponse> => {
  
  const langInstruction = input.language === 'zh' ? "Output strictly in Simplified Chinese." : "Output strictly in English.";
  
  const paceInstruction = input.pace === 'busy' 
    ? "Pace: Busy (Special Forces Style). Start day at 6:00 AM. Maximize attractions. End late." 
    : input.pace === 'lazy' 
    ? "Pace: Lazy/Relaxed. Start day at 10:00 AM. Minimal walking. Leisurely meals." 
    : "Pace: Moderate. Start day at 9:00 AM. Balanced walking and resting.";

  const interestInstruction = input.interests.length > 0
    ? `Prioritize these interests: ${input.interests.join(', ')}.`
    : "";

  const foodInstruction = input.interests.includes('food') 
    ? "CRITICAL: For meals, you MUST recommend restaurants from the 'Dianping Must-Eat List' (大众点评必吃榜) or famous local snack streets. Mention 'Must-Eat List' in the description if applicable." 
    : "";

  const prompt = `
    Plan a detailed travel itinerary for ${input.destination} from ${input.startDate} to ${input.endDate} with a budget of ${input.budget} (excluding arrival tickets).
    
    Context:
    ${langInstruction}
    ${paceInstruction}
    ${interestInstruction}
    ${foodInstruction}
    
    Requirements:
    1. Weather: Consider historical/forecast weather. Give clothing advice.
    2. Route: Connect locations logically.
    3. Cost: You MUST estimate the specific cost for EACH activity (ticket price) and meal (avg per person). Also estimate transport costs.
    4. Accommodation: You MUST recommend a specific hotel/hostel for EACH night based on the budget. Include the estimated cost per night.
    5. Transport: Provide 'transportToNext' detailing how to get to the *next* activity (Mode, Duration, Cost).
    
    Return a JSON object following the schema.
  `;

  const transportSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, description: "Transport mode (Taxi, Walk, Metro)" },
      duration: { type: Type.STRING, description: "Estimated duration (e.g. 15 mins)" },
      cost: { type: Type.STRING, description: "Estimated cost (e.g. 20 CNY)" },
      description: { type: Type.STRING, description: "Brief details (e.g. Line 1 to X Station)" }
    }
  };

  const activitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Unique UUID" },
      name: { type: Type.STRING },
      type: { type: Type.STRING, enum: ['Attraction', 'Restaurant', 'Shopping', 'Entertainment'] },
      description: { type: Type.STRING, description: "Brief overview" },
      recommendedDuration: { type: Type.STRING },
      cost: { type: Type.STRING, description: "Estimated cost (e.g. 150 CNY Ticket or 80 CNY Meal)" },
      transportToNext: { ...transportSchema, nullable: true }
    },
    required: ["id", "name", "type", "description", "cost"]
  };

  const accommodationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      cost: { type: Type.STRING, description: "Cost per night (e.g. 600 CNY)" },
      locationContext: { type: Type.STRING, description: "Area (e.g. Near West Lake)" }
    },
    required: ["name", "cost", "description"]
  };

  const daySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      dayNumber: { type: Type.INTEGER },
      date: { type: Type.STRING },
      weatherForecast: { type: Type.STRING },
      weatherAdvice: { type: Type.STRING },
      activities: { type: Type.ARRAY, items: activitySchema },
      accommodation: accommodationSchema
    },
    required: ["dayNumber", "activities", "weatherForecast", "accommodation"]
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      tripTitle: { type: Type.STRING },
      summary: { type: Type.STRING },
      days: { type: Type.ARRAY, items: daySchema }
    },
    required: ["tripTitle", "days"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as ItineraryResponse;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

/**
 * Generates detailed "Sub-spots" (Tour Guide Mode).
 */
export const generateSpotDetails = async (
  locationName: string,
  destinationContext: string,
  language: 'zh' | 'en'
): Promise<SubSpot[]> => {
  const langInstruction = language === 'zh' ? "Output strictly in Simplified Chinese." : "Output strictly in English.";
  
  const prompt = `
    The user is currently at "${locationName}" in "${destinationContext}".
    Act as a professional, engaging tour guide.
    Break this location down into 3-6 specific "Sub-spots" or key views.
    ${langInstruction}
    
    For each sub-spot:
    1. Provide a name.
    2. Write an immersive, emotionally resonant narration script (like an audio guide) explaining the history, culture, or beauty.
    3. Suggest a best photo angle.
    
    Return valid JSON.
  `;

  const subSpotSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING, description: "Immersive narration text" },
      bestPhotoSpot: { type: Type.STRING }
    },
    required: ["name", "description"]
  };

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: subSpotSchema
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as SubSpot[];
  } catch (error) {
    console.error("Error generating spot details:", error);
    return [];
  }
};

/**
 * Creative Track: Generates solutions for arbitrary travel problems.
 */
export const generateCreativeSolution = async (
  query: string,
  destination: string,
  language: 'zh' | 'en'
): Promise<CreativeSolution> => {
  const langInstruction = language === 'zh' ? "Output strictly in Simplified Chinese." : "Output strictly in English.";

  const prompt = `
    Context: A user is traveling to ${destination}.
    User Request: ${query}
    ${langInstruction}
    
    Provide a creative, practical solution.
    Return JSON.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING, description: "Detailed Markdown-formatted answer" }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    if (!response.text) throw new Error("No response");
    return JSON.parse(response.text) as CreativeSolution;
  } catch (error) {
    return { title: "Error", content: "Could not generate a solution at this time." };
  }
};