export interface TravelInput {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  language: 'zh' | 'en';
  pace: 'busy' | 'moderate' | 'lazy';
  interests: string[];
}

export interface TransportLeg {
  type: string;
  duration: string;
  cost: string; // e.g., "20 CNY"
  description: string;
}

export interface SubSpot {
  name: string;
  description: string;
  bestPhotoSpot?: string;
}

export interface LocationCard {
  id: string;
  name: string;
  type: 'Attraction' | 'Restaurant' | 'Hotel' | 'Shopping' | 'Entertainment';
  description: string;
  recommendedDuration: string;
  cost: string; // e.g., "150 CNY (Ticket)" or "80 CNY (Avg. per person)"
  transportToNext?: TransportLeg;
  subSpots?: SubSpot[]; 
}

export interface Accommodation {
  name: string;
  description: string;
  cost: string; // e.g., "600 CNY / night"
  locationContext: string; // e.g. "Near West Lake"
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  weatherForecast: string;
  weatherAdvice: string;
  activities: LocationCard[];
  accommodation: Accommodation;
}

export interface ItineraryResponse {
  tripTitle: string;
  summary: string;
  days: DayItinerary[];
}

export interface CreativeSolution {
  title: string;
  content: string;
}