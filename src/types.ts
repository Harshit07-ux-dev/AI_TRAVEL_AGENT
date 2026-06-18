export interface Activity {
  time: string;
  title: string;
  description: string;
  cost: number;
  locationName: string;
  category: "Sightseeing" | "Food" | "Relaxation" | "Adventure" | "Transport" | string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  whyChoose: string;
  amenities: string[];
}

export interface Flight {
  airline: string;
  cost: number;
  stops: string;
  duration: string;
}

export interface BudgetBreakdown {
  flightsEstimate: number;
  hotelsEstimate: number;
  activitiesEstimate: number;
  diningEstimate: number;
  totalEstimate: number;
}

export interface Trip {
  id: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  budgetLevel: "Economy" | "Moderate" | "Luxury" | string;
  travelerType: "Solo" | "Couple" | "Family" | "Friends" | string;
  interests?: string[];
  weatherOverview?: string;
  packingSuggestions?: string[];
  budgetBreakdown?: BudgetBreakdown;
  safetyTips?: string[];
  recommendedHotels?: Hotel[];
  recommendedFlights?: Flight[];
  itinerary?: ItineraryDay[];
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
