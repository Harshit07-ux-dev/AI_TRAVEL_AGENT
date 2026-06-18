import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent set for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// In-Memory database for saving trips, mock user profiles, and active records to ensure server persistence
let savedUsers: any[] = [
  { id: "u-harshit", name: "Harshit Suryawanshi", email: "suryawanshiharshit777@gmail.com", role: "Traveler Member", avatarColor: "bg-emerald-600", travelerType: "Solo", budgetLevel: "Moderate", interests: ["Culture", "Food"] },
  { id: "u-johndoe", name: "John Doe", email: "johndoe@gmail.com", role: "Standard User", avatarColor: "bg-blue-600", travelerType: "Family", budgetLevel: "Moderate", interests: ["Nature", "Culture"] },
  { id: "u-elena", name: "Elena Rostova", email: "elena@travelz.io", role: "VIP Voyager", avatarColor: "bg-purple-600", travelerType: "Couple", budgetLevel: "Luxury", interests: ["Relaxation", "Food"] }
];

let savedTrips: any[] = [
  {
    id: "trip-tokyo-demo",
    destination: "Tokyo, Japan",
    userId: "u-harshit",
    startDate: "2026-07-10",
    endDate: "2026-07-16",
    durationDays: 6,
    budgetLevel: "Moderate",
    travelerType: "Solo",
    interests: ["Tech", "Food", "Culture"],
    weatherOverview: "Sunny with occasional light summer showers, temperatures around 26°C-31°C.",
    packingSuggestions: ["Lightweight clothing", "Comfortable walking shoes", "Universal travel adapter", "Compact umbrella"],
    budgetBreakdown: {
      flightsEstimate: 850,
      hotelsEstimate: 600,
      activitiesEstimate: 350,
      diningEstimate: 400,
      totalEstimate: 2200
    },
    safetyTips: [
      "Keep cash on hand as some traditional shops do not accept credit cards.",
      "Stand on the left side of escalators in Tokyo.",
      "Get a Suica or Pasmo card for easy train transitions."
    ],
    recommendedHotels: [
      { name: "Shinjuku Granbell Hotel", rating: 4.4, pricePerNight: 120, whyChoose: "Stunning rooftop view and central artistic vibes in Kabukicho.", amenities: ["Free Wi-Fi", "Rooftop Bar", "English speaking staff"] },
      { name: "Hotel Gracery Shinjuku", rating: 4.6, pricePerNight: 160, whyChoose: "Convenient location, guard Godzilla head on the lobby balcony.", amenities: ["Free Wi-Fi", "Cafe", "Premium bedding"] }
    ],
    recommendedFlights: [
      { airline: "All Nippon Airways (ANA)", cost: 890, stops: "Direct", duration: "11h 30m" },
      { airline: "Singapore Airlines", cost: 720, stops: "1 Stop", duration: "14h 10m" }
    ],
    itinerary: [
      {
        day: 1,
        theme: "Arrival and Neon Exploration in Shinjuku",
        activities: [
          { time: "03:00 PM", title: "Hotel Check-in", description: "Arrive at your hotel and freshen up after the flight.", cost: 0, locationName: "Shinjuku Hotel", category: "Transport" },
          { time: "06:00 PM", title: "Omoide Yokocho Food Tour", description: "Walk through Tokyo's nostalgic lantern-lit alleyways and sample fresh Yakitori.", cost: 35, locationName: "Omoide Yokocho", category: "Food" },
          { time: "08:30 PM", title: "Metropolitan Government Building Observatory", description: "Take a fast elevator up to the 45th floor for breathtaking sunset views of Tokyo skyline.", cost: 0, locationName: "Metropolitan Government Building", category: "Sightseeing" }
        ]
      },
      {
        day: 2,
        theme: "Ancestral Calm and Subculture Cool in Harajuku & Shibuya",
        activities: [
          { time: "09:30 AM", title: "Meiji Jingu Shrine stroll", description: "A quiet serene forest oasis dedicated to Emperor Meiji in Shibuya.", cost: 0, locationName: "Meiji Shrine", category: "Culture" },
          { time: "11:30 AM", title: "Takeshita Street Harajuku", description: "Wander down the epicenter of Japanese kawaii subculture and enjoy colorful crêpes.", cost: 15, locationName: "Takeshita Street", category: "Shopping" },
          { time: "03:00 PM", title: "Shibuya Crossing and Hachiko Statue", description: "Cross the busiest pedestrian crossing in the world.", cost: 0, locationName: "Shibuya Crossing", category: "Sightseeing" },
          { time: "07:00 PM", title: "Shibuya Sky Sunset Deck", description: "Enjoy the high-altitude observation deck.", cost: 20, locationName: "Shibuya Sky", category: "Relaxation" }
        ]
      }
    ]
  },
  {
    id: "trip-paris-demo",
    destination: "Paris, France",
    userId: "u-elena",
    startDate: "2026-09-05",
    endDate: "2026-09-10",
    durationDays: 5,
    budgetLevel: "Luxury",
    travelerType: "Couple",
    interests: ["Food", "Culture", "Relaxation"],
    weatherOverview: "Pleasant harvest breeze, average 15°C-21°C. Great for walking by the Seine.",
    packingSuggestions: ["Elegant evening outfits", "Scarves", "Trench coat", "Adaptor Type C/E"],
    budgetBreakdown: {
      flightsEstimate: 1400,
      hotelsEstimate: 1200,
      activitiesEstimate: 600,
      diningEstimate: 800,
      totalEstimate: 4000
    },
    safetyTips: [
      "Be wary of pickpockets near the Eiffel Tower and Sacré-Cœur.",
      "Learn basic greetings like 'Bonjour' and 'Merci' - it gets you great hospitality!"
    ],
    recommendedHotels: [
      { name: "La Clef Louvre Paris", rating: 4.8, pricePerNight: 280, whyChoose: "Bespoke elegance next to Place de la Comédie.", amenities: ["5-star service", "Gym", "Espresso lounge"] }
    ],
    recommendedFlights: [
      { airline: "Air France", cost: 1200, stops: "Direct", duration: "8h 15m" }
    ],
    itinerary: [
      {
        day: 1,
        theme: "Eiffel Majesty and Romantic River Seine",
        activities: [
          { time: "02:00 PM", title: "Check-in at Le Boutique Hotel", description: "Arrive at Paris and settle in.", cost: 0, locationName: "Le Boutique Hotel", category: "Relaxation" },
          { time: "05:00 PM", title: "Eiffel Tower Ascent", description: "Pre-booked lift tickets to the top floor of Eiffel for panoramic sunset views.", cost: 35, locationName: "Eiffel Tower", category: "Sightseeing" },
          { time: "08:00 PM", title: "Seine River Dinner Cruise", description: "Enjoy premium 3-course French fine dining while cruising past illuminated bridges.", cost: 120, locationName: "River Seine", category: "Food" }
        ]
      }
    ]
  }
];

// Helper to keep contact list
let mockContacts: any[] = [];

// Base API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Save a new trip with duplication prevention and user association
app.post("/api/trips", (req, res) => {
  const { trip, userId } = req.body;
  if (!trip) {
    return res.status(400).json({ error: "No trip data provided" });
  }
  const targetId = trip.id || `trip-${Date.now()}`;
  const existingIndex = savedTrips.findIndex(t => t.id === targetId);

  const newTrip = {
    ...trip,
    id: targetId,
    userId: userId || trip.userId || "u-harshit"
  };

  if (existingIndex !== -1) {
    // Update existing trip in-place
    savedTrips[existingIndex] = newTrip;
  } else {
    // Prepend new trip
    savedTrips.unshift(newTrip);
  }

  res.json({ success: true, trip: newTrip });
});

// Get all saved trips (optionally filtered by active user)
app.get("/api/trips", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    // Return trips that belong to this user email/ID, as well as demo trips for exploration
    const filteredTrips = savedTrips.filter(
      t => t.userId === userId || t.id?.includes("demo")
    );
    return res.json({ success: true, trips: filteredTrips });
  }
  res.json({ success: true, trips: savedTrips });
});

// Get user list
app.get("/api/users", (req, res) => {
  res.json({ success: true, users: savedUsers });
});

// Register or create a custom traveler profile
app.post("/api/users", (req, res) => {
  const { name, email, role, travelerType, budgetLevel, interests, avatarColor } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required to register traveler." });
  }
  const existIndex = savedUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (existIndex !== -1) {
    // User already exists, return existing or update
    savedUsers[existIndex] = {
      ...savedUsers[existIndex],
      name,
      role: role || savedUsers[existIndex].role,
      travelerType: travelerType || savedUsers[existIndex].travelerType,
      budgetLevel: budgetLevel || savedUsers[existIndex].budgetLevel,
      interests: interests || savedUsers[existIndex].interests
    };
    return res.json({ success: true, user: savedUsers[existIndex], existing: true });
  }

  const colors = ["bg-emerald-600", "bg-indigo-600", "bg-purple-600", "bg-[#7A7A5A]", "bg-rose-600", "bg-amber-600"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    role: role || "Traveler Member",
    avatarColor: avatarColor || randomColor,
    travelerType: travelerType || "Solo",
    budgetLevel: budgetLevel || "Moderate",
    interests: interests || ["Culture", "Food"]
  };
  savedUsers.push(newUser);
  res.json({ success: true, user: newUser, existing: false });
});

// Delete a saved trip
app.delete("/api/trips/:id", (req, res) => {
  const { id } = paramsWrapper(req);
  savedTrips = savedTrips.filter(t => t.id !== id);
  res.json({ success: true, message: "Trip deleted successfully" });
});

function paramsWrapper(req: express.Request): { id: string } {
  return req.params as { id: string };
}

// Contact form API
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  mockContacts.push({ name, email, message, date: new Date() });
  res.json({ success: true, message: "Thank you! Our agents will contact you shortly." });
});

// Admin stats endpoint with dynamic analytics
app.get("/api/admin/stats", (req, res) => {
  const totalTrips = savedTrips.length;
  
  // Calculate analytics
  const totalSpentForecast = savedTrips.reduce((acc, t) => acc + (t.budgetBreakdown?.totalEstimate || 0), 0);
  const avgDuration = savedTrips.length > 0 ? (savedTrips.reduce((acc, t) => acc + (t.durationDays || 3), 0) / savedTrips.length).toFixed(1) : 0;

  res.json({
    success: true,
    totalTrips,
    usersCount: savedUsers.length,
    totalBudgetVolume: totalSpentForecast,
    averageDays: avgDuration,
    users: savedUsers,
    savedTrips: savedTrips.map(t => ({
      id: t.id,
      destination: t.destination,
      durationDays: t.durationDays,
      budgetLevel: t.budgetLevel,
      travelerType: t.travelerType,
      totalEstimate: t.budgetBreakdown?.totalEstimate || 1500,
      userId: t.userId
    }))
  });
});

// Admin API to clear database
app.post("/api/admin/reset", (req, res) => {
  savedTrips = savedTrips.filter(t => t.id.includes("demo")); // keep demo trips, clear custom ones
  // reset users to default list
  savedUsers = [
    { id: "u-harshit", name: "Harshit Suryawanshi", email: "suryawanshiharshit777@gmail.com", role: "Traveler Member", avatarColor: "bg-emerald-600", travelerType: "Solo", budgetLevel: "Moderate", interests: ["Culture", "Food"] },
    { id: "u-johndoe", name: "John Doe", email: "johndoe@gmail.com", role: "Standard User", avatarColor: "bg-blue-600", travelerType: "Family", budgetLevel: "Moderate", interests: ["Nature", "Culture"] },
    { id: "u-elena", name: "Elena Rostova", email: "elena@travelz.io", role: "VIP Voyager", avatarColor: "bg-purple-600", travelerType: "Couple", budgetLevel: "Luxury", interests: ["Relaxation", "Food"] }
  ];
  res.json({ success: true, message: "Global state reset completed successfully." });
});

// Hotel Live Search mock listings
app.get("/api/hotels/search", (req, res) => {
  const query = (req.query.q || "Tokyo").toString().toLowerCase();
  
  // Curated list of high-quality hotels categorized by major cities
  const mockHotels = [
    { id: "h1", city: "tokyo", name: "Shinjuku Park Hyatt Tokyo", pricePerNight: 350, rating: 4.8, why: "Iconic skyscraper views, classic luxury, famous for movie backdrops.", amenities: ["Indoor Pool", "Premium Spa", "Rooftop Jazz Bar"], src: "shinjuku" },
    { id: "h2", city: "tokyo", name: "Sotetsu Fresa Inn Ginza", pricePerNight: 95, rating: 4.3, why: "Fantastic pocket-friendly location in the premium shopping district.", amenities: ["Free high-speed Wi-Fi", "Self check-in", "Lavazza Coffee Station"], src: "ginza" },
    { id: "h3", city: "tokyo", name: "The Wardrobe Hostel Forest", pricePerNight: 45, rating: 4.1, why: "Cozy library theme with sleeping pockets close to subways.", amenities: ["Luggage locker", "Shared Kitchen", "Lounge Area"], src: "forest" },
    
    { id: "h4", city: "paris", name: "Hôtel Plaza Athénée", pricePerNight: 750, rating: 4.9, why: "World-famous red curtains and stunning Eiffel views.", amenities: ["Michelin-star Dining", "Dior Spa", "Courtyard Garden"], src: "plaza" },
    { id: "h5", city: "paris", name: "Les Piaules Belleville", pricePerNight: 55, rating: 4.2, why: "Artistic modern generator hostel with a sweeping rooftop bar.", amenities: ["Rooftop terrace", "Craft Beer Tavern", "Air Conditioning"], src: "belleville" },
    
    { id: "h6", city: "new york", name: "The Plaza Hotel NY", pricePerNight: 650, rating: 4.8, why: "Historic Fifth Avenue marvel by Central Park.", amenities: ["Champagne Bar", "Butler service", "Todd English Plaza Food Hall"], src: "plaza_ny" },
    { id: "h7", city: "new york", name: "Arlo NoMad", pricePerNight: 160, rating: 4.5, why: "Boutique rooms with floor-to-ceiling glass wrapping Midtown skyline.", amenities: ["Rooftop Bar", "Free Bicycles", "High-tech smart locks"], src: "arlo" },

    { id: "h8", city: "london", name: "The Savoy", pricePerNight: 520, rating: 4.9, why: "British luxury at its ultimate pinnacle overlooking the River Thames.", amenities: ["Personal Butler", "Edwardian Styling", "Classic Afternoon Tea Lounge"], src: "savoy" },
    { id: "h9", city: "london", name: "CitizenM Tower of London", pricePerNight: 140, rating: 4.6, why: "Smart modular luxury rooms directly next to the Tower Bridge.", amenities: ["iPad room control", "24/7 canteenM", "Panoramic views"], src: "citizenm" }
  ];

  const filtered = mockHotels.filter(h => h.city.includes(query) || h.name.toLowerCase().includes(query));
  
  if (filtered.length > 0) {
    return res.json({ success: true, hotels: filtered });
  }

  // Fallback: generate custom mock hotels on the fly for unlisted cities so it always yields gorgeous contents
  const capCity = query.charAt(0).toUpperCase() + query.slice(1);
  const dynamicHotels = [
    { id: `h-${Date.now()}-1`, city: query, name: `${capCity} Grand Royal Resort & Spa`, pricePerNight: 180, rating: 4.7, why: "Spectacular central hotel with sprawling luxury gardens.", amenities: ["Infinity Pool", "Free Breakfast Buffet", "Valet Parking"] },
    { id: `h-${Date.now()}-2`, city: query, name: `Lighthouse Inn ${capCity}`, pricePerNight: 85, rating: 4.3, why: "Cozy scenic bed and breakfast offering delicious local delicacies.", amenities: ["Coastal views", "Bike rentals", "Pet Friendly"] },
    { id: `h-${Date.now()}-3`, city: query, name: `Nomad Urban Backpackers ${capCity}`, pricePerNight: 35, rating: 4.0, why: "Social youth hub with modern co-working pods and weekly mixers.", amenities: ["Free Wi-Fi", "Game Room", "Laundry facilities"] }
  ];
  res.json({ success: true, hotels: dynamicHotels });
});

// Flight Live Search mock listings
app.get("/api/flights/search", (req, res) => {
  const fromCity = (req.query.from || "New York").toString();
  const toCity = (req.query.to || "Tokyo").toString();
  
  // Dynamic mock flight options with realistic schedules & pricing based on input
  const airCarriers = [
    { name: "SkyLink Airways", basePrice: 420, stopover: "Direct", duration: "7h 45m" },
    { name: "Atlas Jet", basePrice: 310, stopover: "1 Stop (LHR)", duration: "11h 20m" },
    { name: "Zenith Executive", basePrice: 980, stopover: "Direct", duration: "6h 50m" },
    { name: "Pacific Pacific Airways", basePrice: 540, stopover: "Direct", duration: "12h 10m" },
    { name: "Stellar Alliance", basePrice: 280, stopover: "2 Stops", duration: "16h 05m" }
  ];

  // Randomize lightly based on seed characters to make searching feel incredibly responsive and realistic
  const lengthFactor = (fromCity.length + toCity.length) * 3.5;
  const flights = airCarriers.map((carrier, index) => {
    const flightPrice = Math.round(carrier.basePrice + lengthFactor + (index * 25));
    return {
      id: `f-${index}-${Date.now()}`,
      airline: carrier.name,
      price: flightPrice,
      duration: carrier.duration,
      stops: carrier.stopover,
      from: fromCity.toUpperCase().substring(0, 3) || "NYC",
      to: toCity.toUpperCase().substring(0, 3) || "TYO",
      departureTime: `${String(8 + index * 3).padStart(2, "0")}:15 AM`,
      arrivalTime: `${String(14 + index * 2).padStart(2, "0")}:30 PM`
    };
  });

  res.json({ success: true, flights });
});

// Helper function to generate high-quality custom fallback travel itinerary
function generateOfflineItinerary(
  destination: string,
  durationDays: number,
  budgetLevel: string = "Moderate",
  travelerType: string = "Solo",
  interests: string[] = ["Sightseeing"]
) {
  const duration = durationDays || 3;
  const capitalizedDest = destination.trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const basePacking = ["Comfortable hiking/walking shoes", "Sunscreen & sunglasses", "Reusable water bottle", "Camera or mobile charger"];
  if (interests && (interests.includes("Nature") || interests.includes("Adventure"))) {
    basePacking.push("Sturdy hiking boots");
    basePacking.push("Backpack & navigation map");
  } else if (interests && (interests.includes("Culture") || interests.includes("Shopping"))) {
    basePacking.push("Casual elegant outfits");
    basePacking.push("Hand sanitizer & tissue packet");
  } else if (interests && interests.includes("Food")) {
    basePacking.push("Acidity relief / digestive mints");
  } else {
    basePacking.push("Light summer jacket");
  }

  let weatherOverview = "";
  const destLower = destination.toLowerCase();
  if (destLower.includes("sedona") || destLower.includes("canyon") || destLower.includes("desert") || destLower.includes("vegas") || destLower.includes("phoenix")) {
    weatherOverview = `Warm desert climate with abundant daily sunshine. Daytime temperatures hover around 28°C-35°C (82°F-95°F), dropping significantly after sunset. Optimal for early morning trail activity.`;
  } else if (destLower.includes("tokyo") || destLower.includes("kyoto") || destLower.includes("japan") || destLower.includes("asia")) {
    weatherOverview = `Mild seasonal weather with pleasant local breezes. Average outdoor temperatures range from 18°C to 26°C. Clear skies and light scattered clouds.`;
  } else if (destLower.includes("paris") || destLower.includes("london") || destLower.includes("rome") || destLower.includes("europe")) {
    weatherOverview = `Temperate continental conditions, delightful walking wind. Average daytime temperatures range from 16°C to 22°C with light refreshing clouds.`;
  } else {
    weatherOverview = `Comfortable and clear seasonal weather in ${capitalizedDest}. Temperatures range from an average of 18°C up to 27°C with pleasant refreshing breezes, perfect for active wanderlust exploration.`;
  }

  let flightCost = 550;
  let hotelCostPerNight = 120;
  let mealCostPerDay = 45;
  let activityCostPerDay = 35;

  if (budgetLevel === "Luxury") {
    flightCost = 1350;
    hotelCostPerNight = 280;
    mealCostPerDay = 120;
    activityCostPerDay = 90;
  } else if (budgetLevel === "Budget" || budgetLevel === "Economy") {
    flightCost = 35; // ₹2,900 for economical local transit / trains
    hotelCostPerNight = 15; // ₹1,200 standard/homestay per night
    mealCostPerDay = 10; // ₹830 meal budget per day
    activityCostPerDay = 5; // ₹415 activity budget per day
  }

  const hotelsEstimate = hotelCostPerNight * duration;
  const activitiesEstimate = activityCostPerDay * duration;
  const diningEstimate = mealCostPerDay * duration;
  const totalEstimate = flightCost + hotelsEstimate + activitiesEstimate + diningEstimate;

  const budgetBreakdown = {
    flightsEstimate: flightCost,
    hotelsEstimate,
    activitiesEstimate,
    diningEstimate,
    totalEstimate
  };

  const recommendedHotels = [
    {
      name: `${capitalizedDest} ${budgetLevel === 'Luxury' ? 'Grand Resort & Spa' : (budgetLevel === 'Budget' || budgetLevel === 'Economy') ? 'Boutique Hostel & Inn' : 'Premium Signature Suites'}`,
      rating: budgetLevel === 'Luxury' ? 4.9 : (budgetLevel === 'Budget' || budgetLevel === 'Economy') ? 4.2 : 4.6,
      pricePerNight: hotelCostPerNight,
      whyChoose: `A superb retreat tailored to your ${budgetLevel} preference. Offers a perfect base designed beautifully for a ${travelerType} traveler looking to enjoy local hospitality.`,
      amenities: budgetLevel === 'Luxury' ? ["5-Star Butler Service", "Rooftop Edge Pool", "Premium Ayurvedic Spa"] : ["Free High-speed Wi-Fi", "Lobby Co-working Space", "Complimentary Breakfast"]
    },
    {
      name: `The Whispering Pines Lodge, ${capitalizedDest}`,
      rating: 4.5,
      pricePerNight: Math.round(hotelCostPerNight * 0.95),
      whyChoose: `A stunning alternative highly recommended by local experts for ${travelerType} groups. Boasts excellent transit connectivity and lovely decor.`,
      amenities: ["Free Outdoor Bicycles", "Express Laundry Desk", "Acoustic Lounge Area"]
    }
  ];

  const recommendedFlights = [
    {
      airline: "Global United Airlines",
      cost: flightCost,
      stops: "Direct",
      duration: "5h 45m"
    },
    {
      airline: "Starways Alliance",
      cost: Math.round(flightCost * 0.85),
      stops: "1 Stop",
      duration: "8h 10m"
    }
  ];

  const themes = [
    "Exploring Landmark Wonders & Heritage Sights",
    "Hidden Secrets, Local Gastronomy & Artisanal Shopping",
    "Scenic Outdoor Escape, Trail Walks & Sunset Views",
    "Artistic Wonders, Cultural Treasures & Craft Museums",
    "Sensory Delights, Healing Relaxation & Leisure Strolls"
  ];

  const sightseeingPool = [
    { title: "Central Historic Promenade", desc: "A majestic walking area rich with regional architectural history and charming stories." },
    { title: "Scenic Horizon Lookout", desc: "Climb to the premier panoramic view to capture breathtaking photos of the valley expanse." },
    { title: "Old Town Craft Quarter", desc: "Wander through centuries-old alleys featuring traditional craftspeople, local designs, and authentic trinkets." },
    { title: "Grand Heritage Sanctuary", desc: "Discover a sacred local monument celebrating the historical essence and beautiful origins of the city." }
  ];

  const foodPool = [
    { title: "Local Gourmet Tavern", desc: "A cozy local gem serving authentic signature dishes, traditional spices, and farm-to-table culinary treats." },
    { title: "Street Food & Spice Bazaar", desc: "Taste local delicacy snacks in an energetic, festive arcade highly recommended by culinary guides." },
    { title: "Sip & Savor Tasting Lounge", desc: "Enjoy a curated regional beverage tasting session paired with freshly baked local appetizers." },
    { title: "The Chef's Secret Pantry", desc: "Indulge in an exquisite dinner menu inspired by heritage recipes passed down for generations." }
  ];

  const relaxationPool = [
    { title: "Botanical Zen Gardens", desc: "Stroll along quiet streams, local exotic vegetation, and serene sitting benches away from city noise." },
    { title: "Sunset River Walk", desc: "Enjoy a slow, refreshing evening walk beside beautiful flowing waters while the sky turns shades of gold and magenta." },
    { title: "Ambient Acoustic Tea-House", desc: "Sip soothing local herbal tea while listening to soft, custom ambient musical loops from local artists." },
    { title: "High-Altitude Panorama Deck", desc: "Sit back and relax in customized lounge chairs with a 360-degree clear view of the peaceful skyline." }
  ];

  const adventurePool = [
    { title: "Eco-Adventure Trail Hike", desc: "Embark on an invigorating trek through nature loops, lush ravines, and scenic pathways." },
    { title: "Secret Caves Exploration", desc: "Equip your gear to explore exciting guided cave trails and unique geological wonders of the local region." },
    { title: "Bicycle Coastline Cruise", desc: "Rent a cozy beach or mountain bike to breeze through beautiful open paths and clean air." },
    { title: "Valley Canopy Canopy Ride", desc: "Check out high-angle scenic platforms with panoramic sweeps of canyon walls and beautiful treetops." }
  ];

  const itineraryDays = [];
  for (let d = 1; d <= duration; d++) {
    const theme = themes[(d - 1) % themes.length];
    
    const mPool = d % 2 === 0 ? adventurePool : sightseeingPool;
    const aPool = foodPool;
    const ePool = relaxationPool;

    const act1 = mPool[(d - 1) % mPool.length];
    const act2 = aPool[(d - 1) % aPool.length];
    const act3 = ePool[(d - 1) % ePool.length];

    itineraryDays.push({
      day: d,
      theme,
      activities: [
        {
          time: "09:30 AM",
          title: `Discover ${act1.title}`,
          description: act1.desc,
          cost: Math.round(activityCostPerDay * 0.3),
          locationName: `${capitalizedDest} ${act1.title.split(" ").slice(-1)[0]} Point`,
          category: d % 2 === 0 ? "Adventure" : "Sightseeing"
        },
        {
          time: "01:00 PM",
          title: `Dine at ${act2.title}`,
          description: act2.desc,
          cost: Math.round(mealCostPerDay * 0.4),
          locationName: `The ${capitalizedDest} ${act2.title.split(" ").slice(-2)[0] || 'Gourmet'} House`,
          category: "Food"
        },
        {
          time: "05:30 PM",
          title: `Wind down at ${act3.title}`,
          description: act3.desc,
          cost: Math.round(activityCostPerDay * 0.1),
          locationName: `${capitalizedDest} Peaceful ${act3.title.split(" ").slice(-1)[0]}`,
          category: "Relaxation"
        }
      ]
    });
  }

  const safetyTips = [
    "Keep standard physical map booklets handy in spotty cell service zones.",
    "Stay thoroughly hydrated throughout daylight excursions, particularly in warm areas.",
    "Always register your daily hiking paths or outline your itinerary with local hotel concierge desks.",
    "Keep travel pass tickets and ID credentials in zipped waist bags during active transitions."
  ];

  return {
    destination: capitalizedDest,
    durationDays: duration,
    weatherOverview,
    packingSuggestions: basePacking,
    budgetBreakdown,
    safetyTips,
    recommendedHotels,
    recommendedFlights,
    itinerary: itineraryDays
  };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CORE API: AI Trip Planner Generator using Gemini
app.post("/api/planner/generate", async (req, res) => {
  const { destination, startDate, endDate, durationDays, budgetLevel, travelerType, interests, customRequest } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  const daysVal = Math.max(1, Math.min(30, parseInt(String(durationDays), 10) || 3));

  const prompt = `You are a professional luxury travel planner agent. Generate an elegant, highly customized, detailed day-by-day travel plan inside the destination: "${destination}".
Context:
- Duration: ${daysVal} days (from ${startDate || "soon"} to ${endDate || "soon"})
- Budget Range: ${budgetLevel || "Moderate"} ${ (budgetLevel === "Budget" || budgetLevel === "Economy") ? "(CRITICAL: This is an ultra-budget trip under ₹10,000 INR / $120 USD. Keep ALL cost estimates extremely low! Put flights/transport cost at $15 - $40 USD, hotel pricePerNight at $10 - $20 USD, meal and activity costs extremely minimal. The totalEstimate must sum up to less than $120 USD so it is under ₹10,000!)" : "" }
- Companion Setup: ${travelerType || "Solo"}
- Interests: ${interests ? interests.join(", ") : "Sightseeing, food, local culture"}
- Special Requests/Notes: ${customRequest || "None"}

Please verify you generate the response in strict JSON format. Do NOT wrap the JSON in markdown blocks like \`\`\`json. Return only raw json.
The generated plan must be robust, visually engaging and detailed. You MUST generate exactly ${daysVal} days of plans under the 'itinerary' array, corresponding to Day 1, Day 2, ..., Day ${daysVal}. DO NOT truncate, do NOT stop at Day 5 or any other limit. If the duration requested is ${daysVal} days, you must write exactly ${daysVal} itinerary entries. Follow this schema:
{
  "destination": "${destination}",
  "durationDays": ${daysVal},
  "weatherOverview": "Summary of typical weather during this travel duration, average temperature.",
  "packingSuggestions": ["List", "of", "4-5", "essential", "packing", "items"],
  "budgetBreakdown": {
    "flightsEstimate": 400, // estimated flight cost in USD
    "hotelsEstimate": 350,   // estimated total hotel cost in USD
    "activitiesEstimate": 250, // estimated total activity cost in USD
    "diningEstimate": 300,    // estimated total dining cost in USD
    "totalEstimate": 1300     // must sum up accurately
  },
  "safetyTips": ["E.g. Watch out for pickpockets", "Keep hydrating"],
  "recommendedHotels": [
    {
      "name": "E.g. Royal Palace Suites",
      "rating": 4.7,
      "pricePerNight": 150,
      "whyChoose": "Describe why this hotel fits their budgetLevel and companion style.",
      "amenities": ["Wi-Fi", "Pool", "Spa"]
    },
    ... (provide 2 hotel options matching budget level)
  ],
  "recommendedFlights": [
    {
      "airline": "E.g. Delta Air Lines",
      "cost": 450,
      "stops": "Direct or 1 Stop",
      "duration": "E.g. 6h 30m"
    },
    ... (provide 2 flight options)
  ],
  "itinerary": [
    {
      "day": 1,
      "theme": "E.g. Cultural Immersion & Ancient Temples",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "E.g. Visit Historic Sanctuary",
          "description": "Engaging description of the spot, tips on what to do.",
          "cost": 25, // estimated cost in USD
          "locationName": "Precise landmark name",
          "category": "Sightseeing" // "Sightseeing" | "Food" | "Relaxation" | "Adventure" | "Transport"
        },
        {
          "time": "01:00 PM",
          "title": "E.g. Local Specialty Tavern",
          "description": "Authentic dining recommendation customized to interests.",
          "cost": 30,
          "locationName": "Restaurant Name",
          "category": "Food"
        },
        {
          "time": "06:00 PM",
          "title": "E.g. Sunset Promenade Walk",
          "description": "Beautiful evening wind down suggestion.",
          "cost": 0,
          "locationName": "Promenade/Scenic area",
          "category": "Relaxation"
        }
      ]
    },
    ... provide entries for each day up to ${daysVal} days (generate min. 3 activities per day). You MUST generate exactly ${daysVal} elements/entries in this array, starting from Day 1 up to Day ${daysVal}. DO NOT truncate.
  ]
}`;

  const config = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      required: ["destination", "durationDays", "weatherOverview", "packingSuggestions", "budgetBreakdown", "safetyTips", "recommendedHotels", "recommendedFlights", "itinerary"],
      properties: {
        destination: { type: Type.STRING },
        durationDays: { type: Type.INTEGER },
        weatherOverview: { type: Type.STRING },
        packingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        budgetBreakdown: {
          type: Type.OBJECT,
          required: ["flightsEstimate", "hotelsEstimate", "activitiesEstimate", "diningEstimate", "totalEstimate"],
          properties: {
            flightsEstimate: { type: Type.INTEGER },
            hotelsEstimate: { type: Type.INTEGER },
            activitiesEstimate: { type: Type.INTEGER },
            diningEstimate: { type: Type.INTEGER },
            totalEstimate: { type: Type.INTEGER }
          }
        },
        safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedHotels: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["name", "rating", "pricePerNight", "whyChoose", "amenities"],
            properties: {
              name: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              pricePerNight: { type: Type.INTEGER },
              whyChoose: { type: Type.STRING },
              amenities: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        recommendedFlights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["airline", "cost", "stops", "duration"],
            properties: {
              airline: { type: Type.STRING },
              cost: { type: Type.INTEGER },
              stops: { type: Type.STRING },
              duration: { type: Type.STRING }
            }
          }
        },
        itinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["day", "theme", "activities"],
            properties: {
              day: { type: Type.INTEGER },
              theme: { type: Type.STRING },
              activities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["time", "title", "description", "cost", "locationName", "category"],
                  properties: {
                    time: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    cost: { type: Type.INTEGER },
                    locationName: { type: Type.STRING },
                    category: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  let lastError: any = null;

  // Dynamic resilient fallback model aliases in priority order to mitigate any transient 503 limits
  const fallbackModels = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview"
  ];

  for (let attempt = 1; attempt <= fallbackModels.length; attempt++) {
    const selectedModel = fallbackModels[attempt - 1];
    try {
      if (attempt > 1) {
        // Backoff dynamically: longer backoffs on higher numbered attempts
        await sleep(500 * attempt);
      }
      console.log(`AI generation attempt ${attempt}/${fallbackModels.length} using ${selectedModel} for ${destination}...`);
      
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: config
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty text received from Gemini AI");
      }

      const jsonPlan = JSON.parse(resultText.trim());
      console.log(`AI generation succeeded on attempt ${attempt} with ${selectedModel}!`);
      return res.json({ success: true, plan: jsonPlan, offlineFallback: false });
    } catch (error: any) {
      console.error(`AI generation attempt ${attempt} (${selectedModel}) failed:`, error.message || error);
      lastError = error;
    }
  }

  // Under normal flow, if all 3 API attempts fail (or we hit a 503 Spike in demand),
  // we do not crash or throw! Instead, we generate an exceptionally high-quality OFFLINE fall-back
  // matching their exact typed destination beautifully!
  console.warn("All GenAI attempts failed or were rate-limited. Serving beautiful localized custom offline fallback...");
  try {
    const offlinePlan = generateOfflineItinerary(destination, daysVal, budgetLevel, travelerType, interests);
    return res.json({
      success: true,
      plan: offlinePlan,
      offlineFallback: true,
      fallbackMessage: "We custom-tailored a luxurious local itinerary for you while Gemini is experiencing a temporary spike in demand! Feel free to hit generate again later. 😊"
    });
  } catch (fallbackError: any) {
    console.error("Critical fallback generator failed:", fallbackError);
    return res.status(500).json({
      error: "AI Generation failed",
      details: lastError?.message || lastError || "Service Unavailable"
    });
  }
});

// AI Travel Concierge Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Construct a conversation system instruction
  const systemInstruction = 
    "You are a friendly, knowledgeable, and professional Travel Concierge. " +
    "You help people plan activities, pack, save money, and find great spots in any vacation spot. " +
    "Keep your answers exciting, elegant, travel-expert focused, and concise (under 120 words). " +
    "Recommend authentic foods, packing wisdom, emergency contacts, local transport secrets, or currency conversions.";

  // Prepare message prompt
  const formattedPrompt = history && history.length > 0 
    ? `Conversation History:\n${history.map((h: any) => `${h.role === 'user' ? 'Traveler' : 'Concierge'}: ${h.text}`).join('\n')}\nTraveler: ${message}\nConcierge:`
    : message;

  let lastError: any = null;

  // Use dynamic fallback model aliases to maximize resilience
  const fallbackModels = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview"
  ];

  // Retry loop with different models
  for (let attempt = 1; attempt <= fallbackModels.length; attempt++) {
    const selectedModel = fallbackModels[attempt - 1];
    try {
      if (attempt > 1) {
        // Backoff dynamically
        await sleep(500 * attempt);
      }
      console.log(`Chatbot generation attempt ${attempt}/${fallbackModels.length} using ${selectedModel}...`);
      
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedPrompt,
        config: {
          systemInstruction,
          temperature: 0.8
        }
      });

      if (response && response.text) {
        console.log(`Chatbot response succeeded on attempt ${attempt} with ${selectedModel}!`);
        return res.json({ success: true, reply: response.text });
      } else {
        throw new Error("Empty text returned from Gemini model");
      }
    } catch (error: any) {
      console.warn(`Chatbot generation attempt ${attempt} (${selectedModel}) failed:`, error.message || error);
      lastError = error;
    }
  }

  // Local fallback: intelligent context-aware local conversational responder
  console.warn("All Chatbot Gemini LLM instances failed or were rate-limited. Activating beautiful local custom responder...");
  try {
    const msgLower = message.toLowerCase();
    let reply = "";

    if (msgLower.includes("weather") || msgLower.includes("rain") || msgLower.includes("temperature") || msgLower.includes("climate") || msgLower.includes("hot") || msgLower.includes("cold")) {
      reply = "For weather-proof travel, I always recommend a simple 'three-layer' system—a highly breathable base layer, an insulating middle layer for cooler times, and a compact wind/waterproof outer shell. In warm climates, natural linen is your absolute best friend to stay ventilated while blocking UV rays!";
    } else if (msgLower.includes("food") || msgLower.includes("eat") || msgLower.includes("dine") || msgLower.includes("dish") || msgLower.includes("restaurant") || msgLower.includes("culinary") || msgLower.includes("local culinary") || msgLower.includes("spice") || msgLower.includes("traditional")) {
      reply = "When seeking authentic food, try skipping the main tourist squares and walk at least two blocks off the beaten path! Look for places crowded with locals that feature clean, simple menus in the native language. That's where you will find authentic local recipes and rich heritage spices prepared beautifully.";
    } else if (msgLower.includes("budget") || msgLower.includes("save") || msgLower.includes("cost") || msgLower.includes("price") || msgLower.includes("cheap") || msgLower.includes("expense") || msgLower.includes("fee") || msgLower.includes("money") || msgLower.includes("rupee") || msgLower.includes("dollar")) {
      reply = "To get the most value, purchase local transit multi-day cards or regional tourist passes—they often group transit and key museum fees at a 40% discount! I also recommend grabbing gourmet local pastries, fresh cheese, and field fruits from open-air markets for an elegant sunset picnic in a public park.";
    } else if (msgLower.includes("pack") || msgLower.includes("luggage") || msgLower.includes("bag") || msgLower.includes("cube") || msgLower.includes("shoe") || msgLower.includes("clothing") || msgLower.includes("jacket") || msgLower.includes("suitcase")) {
      reply = "My premium packing tip is: roll, do not fold, and utilize double-zipper compression packing cubes to divide categories. Always limit yourself to an agile 7-day capsule collection regardless of trip length—nearly all fine lodging places supply express laundry services, giving you unmatched light travel freedom!";
    } else if (msgLower.includes("safety") || msgLower.includes("safe") || msgLower.includes("protect") || msgLower.includes("emergency") || msgLower.includes("contact") || msgLower.includes("lost") || msgLower.includes("id") || msgLower.includes("passport")) {
      reply = "For optimal travel safety, compile digital copies of your passport, booking keys, and medical files in both a cloud backup and an offline secure folder. Keep a highly reliable compact usb battery powerbank so your map navigation remains active, and always let your hotel desk know your general trail route!";
    } else if (msgLower.includes("hello") || msgLower.includes("hey") || msgLower.includes("hi") || msgLower.includes("greetings") || msgLower.includes("how are you")) {
      reply = "Greetings! I am absolute delighted to act as your expert travel guide today. How can I assist you with your travels? Feel free to ask about local weather preparation, packing suggestions, secret cost-saving hacks, or traditional food finds!";
    } else {
      reply = "I am thrilled to help you customize your travel dreams! As a seasoned guide, my top tip is to always plan one key attraction in the refreshing morning when lines are smallest, keep the afternoon completely flexible for local wandering, and celebrate the evening with local gourmet treats.";
    }

    return res.json({
      success: true,
      reply: `${reply} (Note: While Gemini is currently coping with a brief surge in request demand, I’ve activated my high-fidelity offline travel guide to assist you seamlessly!)`
    });
  } catch (fallbackError: any) {
    console.error("Critical chat fallback failed:", fallbackError);
    return res.json({
      success: true,
      reply: "I am your trusty travel coordinator! I recommend visiting key monuments early to enjoy clean morning light, keeping a sturdy travel umbrella, and utilizing local public transport cards to enjoy unmatched savings!"
    });
  }
});

// Mount Vite middleware / static assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
  });
}

start();
