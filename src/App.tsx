import React, { useState, useEffect } from "react";
import {
  Compass,
  Map,
  Hotel,
  Plane,
  LayoutDashboard,
  Info,
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  Heart,
  FileDown,
  Mail,
  Trash2,
  ListOrdered,
  Sun,
  ShieldCheck,
  Luggage,
  MapPin,
  Send,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Plus,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  Mic,
  MicOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import InteractiveMap from "./components/InteractiveMap";
import BudgetOptimizer from "./components/BudgetOptimizer";
import FloatingChatbot from "./components/FloatingChatbot";
import HotelFlightSearch from "./components/HotelFlightSearch";
import { Trip, BudgetBreakdown } from "./types";

// Helper function to generate high-quality custom fallback travel itinerary on the client-side
function generateOfflineItinerary(
  destination: string,
  durationDays: number,
  budgetLevel: string = "Moderate",
  travelerType: string = "Solo",
  interests: string[] = ["Sightseeing"]
): Omit<Trip, "id"> {
  const duration = durationDays || 3;
  const capitalizedDest = destination.trim()
    ? destination.trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : "Your Scenic Dream Destination";

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
    flightCost = 35; // ₹2,900 for local economical transport
    hotelCostPerNight = 15; // ₹1,200 per night for standard hostels
    mealCostPerDay = 10; // ₹830 meal budget
    activityCostPerDay = 5; // ₹415 activity budget
  }

  const hotelsEstimate = hotelCostPerNight * duration;
  const activitiesEstimate = activityCostPerDay * duration;
  const diningEstimate = mealCostPerDay * duration;
  const totalEstimate = flightCost + hotelsEstimate + activitiesEstimate + diningEstimate;

  const budgetBreakdown: BudgetBreakdown = {
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
    budgetLevel,
    travelerType,
    weatherOverview,
    packingSuggestions: basePacking,
    budgetBreakdown,
    safetyTips,
    recommendedHotels,
    recommendedFlights,
    itinerary: itineraryDays
  };
}

export default function App() {
  // Navigation tabs: "home" | "planner" | "hotels" | "flights" | "dashboard" | "admin" | "about"
  const [activeTab, setActiveTab] = useState<string>("home");

  // Selected currency display state: "usd" | "inr" | "both"
  const [currency, setCurrency] = useState<"usd" | "inr" | "both">("both");
  const USD_TO_INR = 83;

  const formatPrice = (usd: number) => {
    const usdStr = `$${usd.toLocaleString()}`;
    const inrStr = `₹${Math.round(usd * USD_TO_INR).toLocaleString()}`;
    if (currency === "usd") return usdStr;
    if (currency === "inr") return inrStr;
    return `${usdStr} (${inrStr})`;
  };
  
  // Storage for all saved trips
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  // Custom inputs for new AI Itinerary Generation
  const [destination, setDestination] = useState("");
  const [destinationListening, setDestinationListening] = useState(false);
  const [destinationRecognitionRef, setDestinationRecognitionRef] = useState<any>(null);
  const [startDate, setStartDate] = useState("2026-07-15");
  const [endDate, setEndDate] = useState("2026-07-20");
  const [budgetLevel, setBudgetLevel] = useState<string>("Moderate");
  const [travelerType, setTravelerType] = useState<string>("Solo");
  const [interests, setInterests] = useState<string[]>(["Culture", "Food"]);
  const [customRequest, setCustomRequest] = useState("");
  
  // Interactive Day breakdown helper
  const [activeItineraryDay, setActiveItineraryDay] = useState<number>(1);
  
  // UI feedback states
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact page states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  // Admin stats state
  const [adminStats, setAdminStats] = useState<any>(null);

  // Interests bank
  const interestBank = [
    { id: "Culture", label: "🏛️ Culture & Heritage" },
    { id: "Tech", label: "🤖 Science & Tech" },
    { id: "Food", label: "🍕 Food & Local Dining" },
    { id: "Shopping", label: "🛍️ Local Souvenirs & Shopping" },
    { id: "Relaxation", label: "🌸 Relaxation & Spa" },
    { id: "Adventure", label: "🧗 Modern Adventure" },
    { id: "Nature", label: "🌲 Parks & Nature" },
  ];

  // Dynamic travel users state
  const [usersList, setUsersList] = useState<any[]>([
    { id: "u-harshit", name: "Harshit Suryawanshi", email: "suryawanshiharshit777@gmail.com", role: "Traveler Member", avatarColor: "bg-emerald-600", travelerType: "Solo", budgetLevel: "Moderate", interests: ["Culture", "Food"] }
  ]);
  const [activeUser, setActiveUser] = useState<any>({
    id: "u-harshit", 
    name: "Harshit Suryawanshi", 
    email: "suryawanshiharshit777@gmail.com", 
    role: "Traveler Member", 
    avatarColor: "bg-emerald-600",
    travelerType: "Solo",
    budgetLevel: "Moderate",
    interests: ["Culture", "Food"]
  });

  // Profile modal settings states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Standard User");
  const [newUserBudget, setNewUserBudget] = useState("Moderate");
  const [newUserTraveler, setNewUserTraveler] = useState("Solo");

  // Load user profiles from the server with offline local fallback
  const loadUsersList = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsersList(data.users);
        // Sync to local storage
        localStorage.setItem("nomadic_users_list", JSON.stringify(data.users));
        const refreshed = data.users.find((u: any) => u.id === activeUser?.id);
        if (refreshed) {
          setActiveUser(refreshed);
        }
      }
    } catch (err) {
      console.warn("Failed to load users from API, using client-side fallback list:", err);
      // Load from localStorage or use default
      const cachedUsersStr = localStorage.getItem("nomadic_users_list");
      if (cachedUsersStr) {
        try {
          const list = JSON.parse(cachedUsersStr);
          setUsersList(list);
          const refreshed = list.find((u: any) => u.id === activeUser?.id);
          if (refreshed) {
            setActiveUser(refreshed);
          }
        } catch (e) {
          console.error("Failed to parse cached users", e);
        }
      } else {
        // First-time seed of local storage users
        const seedValue = [
          { id: "u-harshit", name: "Harshit Suryawanshi", email: "suryawanshiharshit777@gmail.com", role: "Traveler Member", avatarColor: "bg-emerald-600", travelerType: "Solo", budgetLevel: "Moderate", interests: ["Culture", "Food"] }
        ];
        localStorage.setItem("nomadic_users_list", JSON.stringify(seedValue));
        setUsersList(seedValue);
      }
    }
  };

  // Switch active user and load their preferences and saved trips
  const handleUserSwitch = (user: any) => {
    setActiveUser(user);
    // Apply preferences
    setTravelerType(user.travelerType || "Solo");
    setBudgetLevel(user.budgetLevel || "Moderate");
    if (user.interests && user.interests.length > 0) {
      setInterests(user.interests);
    }
    showToast(`Welcome, ${user.name}! Switched the active traveler profile.`);
    loadSavedTrips(user.id);
  };

  // Register and automatically select a new user traveler profile with offline support
  const registerNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast("⚠️ Dynamic traveler name & email are required!");
      return;
    }

    const localNewUser = {
      id: `u-local-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatarColor: "bg-indigo-600",
      travelerType: newUserTraveler,
      budgetLevel: newUserBudget,
      interests: ["Culture", "Food"]
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          travelerType: newUserTraveler,
          budgetLevel: newUserBudget,
          interests: ["Culture", "Food"]
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setNewUserName("");
        setNewUserEmail("");
        setProfileModalOpen(false);
        await loadUsersList();
        handleUserSwitch(data.user);
      } else {
        throw new Error("Server responded with success: false");
      }
    } catch (err) {
      console.warn("Could not sync profile to backend database. Saving profile locally in browser context:", err);
      // Offline fallback: save user to cached local list
      let cachedUsers: any[] = [];
      const cacheStr = localStorage.getItem("nomadic_users_list");
      if (cacheStr) {
        try {
          cachedUsers = JSON.parse(cacheStr);
        } catch (e) {
          cachedUsers = [];
        }
      }
      if (!Array.isArray(cachedUsers)) {
        cachedUsers = [];
      }
      // Deduplicate email if existing
      const existingIdx = cachedUsers.findIndex(u => u.email.toLowerCase() === newUserEmail.toLowerCase());
      if (existingIdx !== -1) {
        cachedUsers[existingIdx] = {
          ...cachedUsers[existingIdx],
          name: newUserName,
          role: newUserRole,
          travelerType: newUserTraveler,
          budgetLevel: newUserBudget
        };
        const updatedUser = cachedUsers[existingIdx];
        localStorage.setItem("nomadic_users_list", JSON.stringify(cachedUsers));
        setUsersList(cachedUsers);
        setNewUserName("");
        setNewUserEmail("");
        setProfileModalOpen(false);
        handleUserSwitch(updatedUser);
      } else {
        cachedUsers.push(localNewUser);
        localStorage.setItem("nomadic_users_list", JSON.stringify(cachedUsers));
        setUsersList(cachedUsers);
        setNewUserName("");
        setNewUserEmail("");
        setProfileModalOpen(false);
        handleUserSwitch(localNewUser);
      }
    }
  };

  // Load saved trips with offline local fallback
  const loadSavedTrips = async (passedUserId?: string) => {
    const activeId = passedUserId || activeUser?.id || "u-harshit";
    try {
      const res = await fetch(`/api/trips?userId=${encodeURIComponent(activeId)}`);
      const data = await res.json();
      if (data.success && data.trips) {
        setTrips(data.trips);
        // Sync to localStorage
        const existingLocalTripsStr = localStorage.getItem("nomadic_saved_trips") || "[]";
        let existingLocalTrips: any[] = [];
        try {
          existingLocalTrips = JSON.parse(existingLocalTripsStr);
        } catch(e) {}
        if (!Array.isArray(existingLocalTrips)) existingLocalTrips = [];

        // Merge backend trips with local ones (preserving local-only ones)
        const combined = [...data.trips];
        existingLocalTrips.forEach((t: any) => {
          if (!combined.some(bt => bt.id === t.id)) {
            combined.push(t);
          }
        });
        localStorage.setItem("nomadic_saved_trips", JSON.stringify(combined));

        // Default select the first trip
        if (data.trips.length > 0) {
          setSelectedTrip(data.trips[0]);
        } else {
          setSelectedTrip(null);
        }
      } else {
        throw new Error("No success payload");
      }
    } catch (err) {
      console.warn("Failed to load backend trips, using localStorage database fallback:", err);
      const localTripsStr = localStorage.getItem("nomadic_saved_trips");
      if (localTripsStr) {
        try {
          const localTrips = JSON.parse(localTripsStr);
          if (Array.isArray(localTrips)) {
            const userLocalTrips = localTrips.filter((t: any) => t.userId === activeId || t.id?.includes("demo"));
            setTrips(userLocalTrips);
            if (userLocalTrips.length > 0) {
              setSelectedTrip(userLocalTrips[0]);
            } else {
              setSelectedTrip(null);
            }
          }
        } catch (e) {
          console.error("Failed to parse localStorage trips:", e);
        }
      }
    }
  };

  useEffect(() => {
    const initData = async () => {
      await loadUsersList();
      await loadSavedTrips();
    };
    initData();
  }, []);

  // Sync admin stats if the admin panel is visited
  useEffect(() => {
    if (activeTab === "admin") {
      fetchAdminStats();
    }
  }, [activeTab]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setAdminStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // voice assistant for destination search
  const toggleDestinationVoice = () => {
    const SpeechRecog = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecog) {
      showToast("Voice detection is not supported in this browser context. Please use Google Chrome! 🎙️");
      return;
    }

    if (destinationListening) {
      if (destinationRecognitionRef) {
        destinationRecognitionRef.stop();
      }
      setDestinationListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecog();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setDestinationListening(true);
        showToast("🎙️ Listening for destination name... speak now!");
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          // Capitalize first letters elegantly
          const formattedText = transcript.trim().replace(/\b\w/g, (c: string) => c.toUpperCase());
          setDestination(formattedText);
          showToast(`✨ Set Target Destination: "${formattedText}"`);
        }
        setDestinationListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn("Destination Speech Recognition error:", err.error);
        if (err.error === "not-allowed") {
          showToast("⚠️ Microphone blocked. For security inside the iframe, click the circular [Launch/Popout] icon at top-right to run in a fresh native browser tab!");
        } else {
          showToast(`🎙️ Voice assistant ended: ${err.error}`);
        }
        setDestinationListening(false);
      };

      recognition.onend = () => {
        setDestinationListening(false);
      };

      setDestinationRecognitionRef(recognition);
      recognition.start();
    } catch (e) {
      console.error(e);
      setDestinationListening(false);
    }
  };

  // Generate AI customized itinerary
  const generateTrip = async () => {
    if (!destination.trim()) {
      setErrorMessage("Please input a valid vacation destination (e.g. Tokyo, Paris, Rome...)");
      return;
    }
    setErrorMessage(null);
    setGenerating(true);
    setGenerationStep(0);

    // Calculate duration (timezone-safe, inclusive)
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);
    const startMidnight = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate());
    const endMidnight = new Date(endObj.getFullYear(), endObj.getMonth(), endObj.getDate());
    const diffTime = endMidnight.getTime() - startMidnight.getTime();
    let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(diffDays) || diffDays <= 0) {
      diffDays = 3; // fallback default
    }

    // Interactive step loader simulation to keep user engaged during Gemini AI query
    const interval = setInterval(() => {
      setGenerationStep((prev) => Math.min(prev + 1, 4));
    }, 2200);

    try {
      const response = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          durationDays: diffDays,
          budgetLevel,
          travelerType,
          interests,
          customRequest
        })
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success && data.plan) {
        const fullGeneratedTrip: Trip = {
          ...data.plan,
          id: `trip-generated-${Date.now()}`,
          startDate,
          endDate,
          budgetLevel,
          travelerType,
          interests
        };

        setSelectedTrip(fullGeneratedTrip);
        setActiveItineraryDay(1); // reset to day 1
        
        if (data.offlineFallback) {
          setErrorMessage(
            data.fallbackMessage || "We custom-tailored a luxurious local itinerary for you while Gemini is experiencing a temporary spike in demand! Feel free to hit generate again later. 😊"
          );
          showToast("⚠️ API Busy: High-quality local itinerary loaded!");
        } else {
          setErrorMessage(null);
          showToast("✈️ AI Trip successfully developed!");
        }
        
        setActiveTab("planner"); // navigate to display
      } else {
        throw new Error(data.error || "Generation payload error");
      }
    } catch (error: any) {
      clearInterval(interval);
      console.warn("Connection or backend API error. Activating beautiful client-side customized generator fallback:", error);
      try {
        const localOfflinePlan = generateOfflineItinerary(destination, diffDays, budgetLevel, travelerType, interests);
        const fullGeneratedTrip: Trip = {
          ...localOfflinePlan,
          id: `trip-generated-offline-${Date.now()}`,
          startDate,
          endDate,
          budgetLevel,
          travelerType,
          interests
        };
        setSelectedTrip(fullGeneratedTrip);
        setActiveItineraryDay(1);
        setErrorMessage(
          "We custom-generated a localized itinerary for you right inside your browser! (Because this specific link is hosted on a static-only hosting provider like Netlify, the secure server-side AI endpoints are run directly in high-fidelity client-side mode)."
        );
        showToast("✨ Beautiful customized offline plan generated!");
        setActiveTab("planner");
      } catch (fallbackError: any) {
        console.error("Local fallback generator failed:", fallbackError);
        setErrorMessage(
          "We ran into a minor connection glitch, but no worries! We have loaded a luxurious preloaded sample itinerary in your dashboard to explore."
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  // Save active selected trip with robust local fallback
  const saveActiveTrip = async () => {
    if (!selectedTrip) return;
    const activeUserId = activeUser?.id || "u-harshit";
    const tripWithUser = {
      ...selectedTrip,
      userId: activeUserId
    };

    // Keep localStorage fully updated so work is never lost!
    try {
      const existingLocalTripsStr = localStorage.getItem("nomadic_saved_trips") || "[]";
      let existingLocalTrips: any[] = [];
      try {
        existingLocalTrips = JSON.parse(existingLocalTripsStr);
      } catch (e) {
        existingLocalTrips = [];
      }
      if (!Array.isArray(existingLocalTrips)) {
        existingLocalTrips = [];
      }
      const existingIdx = existingLocalTrips.findIndex((t: any) => t.id === tripWithUser.id);
      if (existingIdx !== -1) {
        existingLocalTrips[existingIdx] = tripWithUser;
      } else {
        existingLocalTrips.unshift(tripWithUser);
      }
      localStorage.setItem("nomadic_saved_trips", JSON.stringify(existingLocalTrips));
    } catch (e) {
      console.error("Local storage sync failed:", e);
    }

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          trip: tripWithUser,
          userId: activeUserId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`💾 Saved trip to your profile dashboard, ${activeUser?.name || "Harshit"}!`);
        loadSavedTrips();
      } else {
        throw new Error("Server responded with success: false");
      }
    } catch (err) {
      console.warn("Could not sync with central server database, saved locally to browser storage:", err);
      showToast("💾 Saved trip to local browser vault successfully (Offline Mode)!");
      
      // Update local state directly so UI lists it immediately!
      const activeId = activeUserId;
      const localTripsStr = localStorage.getItem("nomadic_saved_trips");
      if (localTripsStr) {
        try {
          const localTrips = JSON.parse(localTripsStr);
          if (Array.isArray(localTrips)) {
            const userLocalTrips = localTrips.filter((t: any) => t.userId === activeId || t.id?.includes("demo"));
            setTrips(userLocalTrips);
          }
        } catch (e) {}
      }
    }
  };

  // Delete trip with local storage sync
  const deleteTrip = async (id: string) => {
    // Optimistically update local UI states immediately
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (selectedTrip?.id === id) {
      setSelectedTrip((prev) => trips.find((t) => t.id !== id) || null);
    }

    // Clean up from local storage
    try {
      const localTripsStr = localStorage.getItem("nomadic_saved_trips");
      if (localTripsStr) {
        const localTrips = JSON.parse(localTripsStr);
        if (Array.isArray(localTrips)) {
          const filtered = localTrips.filter((t: any) => t.id !== id);
          localStorage.setItem("nomadic_saved_trips", JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.error("Local storage delete failed:", e);
    }

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showToast("🗑️ Saved record deleted.");
        loadSavedTrips();
      }
    } catch (err) {
      console.warn("Server delete bypassed, updated local storage instead:", err);
      showToast("🗑️ Saved record removed successfully!");
    }
  };

  // Reset database state (Admin only)
  const resetGlobalState = async () => {
    if (!confirm("Are you sure you want to restore original default voyages? This will clear all custom plans.")) return;
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast("Database successfully restored to original factory defaults!");
        loadSavedTrips();
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle lodging selection from Separate searches to update current active trip
  const addHotelToTrip = (hotel: any) => {
    if (!selectedTrip) {
      showToast("⚠️ Please select or generate an active travel plan first to attach lodging.");
      return;
    }
    const duration = selectedTrip.durationDays || 3;
    const isLuxury = selectedTrip.budgetLevel === "Luxury";
    const isBudget = selectedTrip.budgetLevel === "Budget" || selectedTrip.budgetLevel === "Economy";
    const fallbackBreakdown = {
      flightsEstimate: isLuxury ? 1000 : isBudget ? 35 : 500,
      hotelsEstimate: 0,
      activitiesEstimate: (isLuxury ? 80 : isBudget ? 5 : 40) * duration,
      diningEstimate: (isLuxury ? 100 : isBudget ? 10 : 50) * duration,
      totalEstimate: 0
    };
    fallbackBreakdown.totalEstimate = fallbackBreakdown.flightsEstimate + fallbackBreakdown.activitiesEstimate + fallbackBreakdown.diningEstimate;

    const currentBreakdown = selectedTrip.budgetBreakdown || fallbackBreakdown;
    const hotelCost = hotel.pricePerNight * duration;
    
    const updatedBreakdown = {
      ...currentBreakdown,
      hotelsEstimate: hotelCost,
      totalEstimate: currentBreakdown.totalEstimate + hotelCost - (currentBreakdown.hotelsEstimate || 0)
    };

    const updated: Trip = {
      ...selectedTrip,
      recommendedHotels: [
        {
          name: hotel.name,
          rating: hotel.rating,
          pricePerNight: hotel.pricePerNight,
          whyChoose: hotel.why,
          amenities: hotel.amenities || []
        },
        ...(selectedTrip.recommendedHotels || [])
      ],
      budgetBreakdown: updatedBreakdown
    };
    setSelectedTrip(updated);
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
    showToast(`🏨 Attached ${hotel.name} to active trip!`);
  };

  const addFlightToTrip = (flight: any) => {
    if (!selectedTrip) {
      showToast("⚠️ Generate an active trip before selecting carrier.");
      return;
    }
    const duration = selectedTrip.durationDays || 3;
    const isLuxury = selectedTrip.budgetLevel === "Luxury";
    const isBudget = selectedTrip.budgetLevel === "Budget" || selectedTrip.budgetLevel === "Economy";
    const fallbackBreakdown = {
      flightsEstimate: 0,
      hotelsEstimate: (isLuxury ? 250 : isBudget ? 15 : 130) * duration,
      activitiesEstimate: (isLuxury ? 80 : isBudget ? 5 : 40) * duration,
      diningEstimate: (isLuxury ? 100 : isBudget ? 10 : 50) * duration,
      totalEstimate: 0
    };
    fallbackBreakdown.totalEstimate = fallbackBreakdown.hotelsEstimate + fallbackBreakdown.activitiesEstimate + fallbackBreakdown.diningEstimate;

    const currentBreakdown = selectedTrip.budgetBreakdown || fallbackBreakdown;
    
    const updatedBreakdown = {
      ...currentBreakdown,
      flightsEstimate: flight.price,
      totalEstimate: currentBreakdown.totalEstimate + flight.price - (currentBreakdown.flightsEstimate || 0)
    };

    const updated: Trip = {
      ...selectedTrip,
      recommendedFlights: [
        {
          airline: flight.airline,
          cost: flight.price,
          stops: flight.stops,
          duration: flight.duration
        },
        ...(selectedTrip.recommendedFlights || [])
      ],
      budgetBreakdown: updatedBreakdown
    };
    setSelectedTrip(updated);
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
    showToast(`✈️ Integrated ${flight.airline} flight booking!`);
  };

  // Dynamic budget calculation updater
  const handleBudgetSync = (newBreakdown: BudgetBreakdown) => {
    if (!selectedTrip) return;
    const updated: Trip = {
      ...selectedTrip,
      budgetBreakdown: newBreakdown
    };
    setSelectedTrip(updated);
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  // Simple copy summary fallback for PDF trigger
  const triggerTextExport = () => {
    if (!selectedTrip) return;
    const cleanStr = `
TRIP PLAN: ${selectedTrip.destination} (${selectedTrip.durationDays} Days)
Budget Category: ${selectedTrip.budgetLevel} | Style: ${selectedTrip.travelerType}
Weather Summary: ${selectedTrip.weatherOverview}
Total Budget: $${selectedTrip.budgetBreakdown?.totalEstimate || 1500}

PACKING GUIDES:
${selectedTrip.packingSuggestions?.map(p => `- ${p}`).join("\n")}

SAFETY SUGGESTIONS:
${selectedTrip.safetyTips?.map(s => `- ${s}`).join("\n")}
    `;
    navigator.clipboard.writeText(cleanStr);
    showToast("📋 Copied full clean itinerary details to your keyboard clipboard!");
  };

  // Submit contact message
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      setContactStatus("All inputs are required.");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMsg })
      });
      const data = await res.json();
      if (data.success) {
        setContactStatus("Message sent successfully!");
        setContactName("");
        setContactEmail("");
        setContactMsg("");
        setTimeout(() => setContactStatus(null), 4000);
      }
    } catch (err) {
      setContactStatus("Could not dispatch.");
    }
  };

  // Loading statements array
  const loadingSteps = [
    "Analyzing historical climate & meteorological records...",
    "Querying local gourmet diners & traditional culinary spots...",
    "Calculating physical coordinates & day-by-day navigation vectors...",
    "Curating premium cost-effective accommodation guidelines...",
    "Finalizing customized travel planner agents dashboard details..."
  ];

  // Helper to pull clean backgrounds for specific cities
  const getCityBackground = (place: string) => {
    const norm = place.toLowerCase().trim();
    if (norm.includes("tokyo") || norm.includes("japan") || norm.includes("kyoto")) {
      return "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("paris") || norm.includes("france")) {
      return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("york") || norm.includes("nyc") || norm.includes("manhattan")) {
      return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("london") || norm.includes("uk") || norm.includes("england")) {
      return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("rome") || norm.includes("italy") || norm.includes("venice") || norm.includes("florence")) {
      return "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("sydney") || norm.includes("australia") || norm.includes("melbourne")) {
      return "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("bali") || norm.includes("indonesia")) {
      return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("dubai") || norm.includes("uae") || norm.includes("abu dhabi")) {
      return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("ujjain")) {
      return "https://images.unsplash.com/photo-1627843685955-46b539aeefed?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("mumbai") || norm.includes("bombay")) {
      return "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("delhi") || norm.includes("new delhi")) {
      return "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("goa")) {
      return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("cairo") || norm.includes("egypt") || norm.includes("pyramids")) {
      return "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("switzerland") || norm.includes("swiss") || norm.includes("alps")) {
      return "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80";
    }
    if (norm.includes("singapore")) {
      return "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80";
    }
    // Dynamic Unsplash Featured source matching the city and standard keywords
    const cleanWord = norm.replace(/[^a-zA-Z0-9\s]/g, "").trim() || "travel";
    return `https://images.unsplash.com/featured/1200x800/?${encodeURIComponent(cleanWord)},landmark,travel`;
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-charcoal flex flex-col font-sans selection:bg-brand-sage selection:text-white">
      {/* Toast Alert Notice */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-sage text-white font-semibold text-xs tracking-wide py-3 px-6 rounded-full shadow-natural flex items-center gap-2 border border-brand-border"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-45 bg-[#f5f5f0]/95 backdrop-blur-md border-b border-brand-border px-4 lg:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
            <div 
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
              title="Navigate to Home"
            >
              <div className="w-9 h-9 bg-[#5A5A40] rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:rotate-45 group-hover:scale-105 animate-fade-in">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-xl sm:text-2xl font-serif italic tracking-tight text-brand-ink font-semibold group-hover:text-brand-sage transition-colors duration-300">
                nomadic
              </span>
            </div>
            
            {/* Live Deployment Link Badge right beside App Name */}
            <a 
              href={typeof window !== "undefined" ? window.location.href : "https://ais-pre-a67e545p2evoj2c7fhvs6f-531496336134.asia-southeast1.run.app"}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all duration-300 cursor-pointer shadow-sm group hover:scale-105 shrink-0"
              title="Open current live app deployment in a new tab"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="hidden xs:inline">LIVE</span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Desktop links - Visible starting from lg screen sizes, avoiding any intermediate wrapping */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 justify-center">
            {[
              { id: "home", label: "Planner HUB", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
              { id: "planner", label: "Itinerary", icon: <Map className="w-3.5 h-3.5" /> },
              { id: "hotels", label: "Destinations", icon: <Hotel className="w-3.5 h-3.5" /> },
              { id: "flights", label: "Flights", icon: <Plane className="w-3.5 h-3.5" /> },
              { id: "admin", label: "Admin Console", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
              { id: "about", label: "Support", icon: <Info className="w-3.5 h-3.5" /> },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 text-[10px] xl:text-[11px] uppercase tracking-widest font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === link.id
                    ? "border-[#5A5A40] text-brand-ink"
                    : "border-transparent text-brand-charcoal opacity-65 hover:opacity-100 hover:border-brand-border"
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Currency selector widget - hidden on small mobile but visible from md up to save space */}
            <div className="hidden md:inline-flex bg-brand-border/40 border border-brand-border p-1 rounded-full text-[10px] font-semibold">
              <button
                onClick={() => {
                  setCurrency("usd");
                  showToast("Switched active view rates to US Dollars ($)");
                }}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  currency === "usd" ? "bg-white text-brand-ink shadow-sm font-bold" : "text-brand-charcoal hover:text-brand-ink"
                }`}
                title="US Dollars"
              >
                USD ($)
              </button>
              <button
                onClick={() => {
                  setCurrency("inr");
                  showToast("Switched active view rates to Indian Rupees (₹)");
                }}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  currency === "inr" ? "bg-white text-brand-ink shadow-sm font-bold" : "text-brand-charcoal hover:text-brand-ink"
                }`}
                title="Indian Rupees"
              >
                INR (₹)
              </button>
              <button
                onClick={() => {
                  setCurrency("both");
                  showToast("Overlaying combined exchange valuations ($ & ₹)");
                }}
                className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  currency === "both" ? "bg-white text-brand-ink shadow-sm font-bold" : "text-brand-charcoal hover:text-brand-ink"
                }`}
                title="Both ($ & ₹)"
              >
                Both
              </button>
            </div>

            {/* Active Traveler Dynamic Profile Switcher Button */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-brand-ink bg-white border border-brand-border hover:bg-[#f5f5f0] transition-all cursor-pointer shadow-sm hover:shadow-md group shrink-0"
              title="Click to Switch or Register multiple travel profiles"
              id="header-user-switcher"
            >
              <div className={`w-5 h-5 rounded-full ${activeUser?.avatarColor || "bg-emerald-600"} text-white text-[9px] font-bold flex items-center justify-center`}>
                {activeUser?.name?.charAt(0) || "U"}
              </div>
              <span className="max-w-[70px] sm:max-w-[120px] truncate text-[10px] font-medium text-brand-ink font-sans">
                {activeUser?.name || "Select Traveler"}
              </span>
              <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-100 hidden xs:inline tracking-wider uppercase">
                {activeUser?.role || "Traveler"}
              </span>
            </button>

            {/* Quick Action - Styled smaller on mobiles to save viewport real estate */}
            <button
              onClick={() => {
                setActiveTab("planner");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 sm:px-5 sm:py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full text-white bg-[#5A5A40] hover:bg-[#4a4a35] transition-all cursor-pointer shadow-sm shrink-0"
            >
              New Voyage
            </button>
            
            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-charcoal hover:text-brand-ink rounded-lg hover:bg-brand-border/60 border border-brand-border focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#f5f5f0] border-b border-brand-border flex flex-col p-4 space-y-3"
          >
            {/* Nav links */}
            <div className="space-y-1">
              {[
                { id: "home", label: "Planner HUB", icon: <LayoutDashboard className="w-4 h-4" /> },
                { id: "planner", label: "Itinerary", icon: <Map className="w-4 h-4" /> },
                { id: "hotels", label: "Destinations", icon: <Hotel className="w-4 h-4" /> },
                { id: "flights", label: "Flights", icon: <Plane className="w-4 h-4" /> },
                { id: "admin", label: "Admin Console", icon: <ShieldCheck className="w-4 h-4 text-brand-sage" /> },
                { id: "about", label: "Support & IDE Setup", icon: <Info className="w-4 h-4" /> },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === link.id ? "bg-[#5A5A40] text-white shadow-sm" : "text-brand-charcoal hover:bg-brand-border/40"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </div>

            {/* Currency Selector widget inside mobile menu drawer for perfect responsiveness */}
            <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase font-extrabold tracking-widest text-[#5A5A40] px-2">Active Currency Rates</span>
              <div className="grid grid-cols-3 bg-brand-border/40 border border-brand-border p-1 rounded-xl text-[10px] font-semibold">
                <button
                  onClick={() => {
                    setCurrency("usd");
                    showToast("Switched rates to US Dollars ($)");
                  }}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currency === "usd" ? "bg-white text-brand-ink shadow-sm font-bold" : "text-brand-charcoal font-medium"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => {
                    setCurrency("inr");
                    showToast("Switched rates to Indian Rupees (₹)");
                  }}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currency === "inr" ? "bg-white text-brand-ink shadow-[#5A5A40]/10 shadow-sm font-bold" : "text-brand-charcoal font-medium"
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => {
                    setCurrency("both");
                    showToast("Overlaying combined exchange valuations ($ & ₹)");
                  }}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currency === "both" ? "bg-white text-brand-ink shadow-sm font-bold" : "text-brand-charcoal font-medium"
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {/* Mobile context indicator */}
            <div className="pt-2 px-2 flex justify-between items-center text-[10px] font-mono text-brand-charcoal/70">
              <span className="truncate max-w-[180px]">Connected: {activeUser?.email || "guest@travel.io"}</span>
              <span className="text-brand-sage font-bold">{activeUser?.name?.split(" ")[0] || "Traveler"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Presentation when on dashboard or landing */}
      {activeTab === "home" && (
        <div className="relative py-16 px-4 border-b border-brand-border bg-white rounded-[48px] mt-8 mx-4 lg:mx-8 shadow-natural relative overflow-hidden">
          <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-brand-sage/5 filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-brand-sage/3 filter blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left intro */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#f5f5f0]/80 px-4 py-1.5 rounded-full border border-brand-border">
                ✦ Premium Travel Agent Suite
              </span>
              <h1 className="text-4xl sm:text-7xl font-serif text-brand-ink leading-tight">
                Where to next, <span className="italic">{activeUser?.name?.split(" ")[0] || "Traveler"}?</span>
              </h1>
              <p className="text-base text-brand-charcoal/80 max-w-md leading-relaxed font-sans">
                Your journey has infinite possibilities. Construct beautifully curated, day-by-day customized travel itineraries backed by our robust generative intelligence.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    const scrollTarget = document.getElementById("planner-form-section");
                    if (scrollTarget) scrollTarget.scrollIntoView({ behavior: "smooth" });
                    else setActiveTab("planner");
                  }}
                  className="px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-full text-white bg-[#5A5A40] hover:bg-[#4a4a35] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Initiate AI Planner
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className="px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-full text-brand-charcoal hover:bg-brand-bg bg-white border border-brand-border transition-colors cursor-pointer"
                >
                  View Services
                </button>
              </div>
            </div>

            {/* Right quick dashboard statistics widgets */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-[#f5f5f0]/50 p-6 rounded-[32px] border border-brand-border space-y-1.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-brand-sage opacity-75 tracking-wider block">Saved voyages</span>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">{trips.length}</p>
                <p className="text-[10px] text-brand-sagelight">Durably synchronized</p>
              </div>
              <div className="bg-[#f5f5f0]/50 p-6 rounded-[32px] border border-brand-border space-y-1.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-brand-sage opacity-75 tracking-wider block">Budget Processed</span>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">
                  ${trips.reduce((acc, t) => acc + (t.budgetBreakdown?.totalEstimate || 1200), 0)}
                </p>
                <p className="text-[10px] text-brand-sagelight">Estimated outlay</p>
              </div>
              <div className="bg-[#f5f5f0]/50 p-6 rounded-[32px] border border-brand-border space-y-1.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-brand-sage opacity-75 tracking-wider block">Active Travelers</span>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">{usersList.length}</p>
                <p className="text-[10px] text-brand-sagelight">{activeUser?.name?.split(" ")[0]} + contributors</p>
              </div>
              <div className="bg-[#f5f5f0]/50 p-6 rounded-[32px] border border-brand-border space-y-1.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-brand-sage opacity-75 tracking-wider block">Avg Trip Length</span>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">
                  {(trips.reduce((acc, t) => acc + t.durationDays, 0) / (trips.length || 1)).toFixed(1)} <span className="text-xs font-sans font-normal text-brand-charcoal/60">days</span>
                </p>
                <p className="text-[10px] text-brand-sagelight">Configured holidays</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main body area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        
        {/* TAB 1: HOME HUB VIEW */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Form & input card */}
            <div id="planner-form-section" className="bg-white border border-brand-border rounded-[32px] p-6 lg:p-10 shadow-natural relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-sage/5 rounded-full filter blur-3xl pointer-events-none" />
              <div className="max-w-3xl space-y-8">
                <div>
                  <h3 className="text-2xl font-serif text-brand-ink font-semibold flex items-center gap-2">
                    Build your custom itinerary
                  </h3>
                  <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                    Input your travel preferences below or use the <strong className="text-brand-sage">🎙️ Voice Assistant mic</strong> to search for a target destination. Let our intelligent engine guide you through every day of your stay, complete with weather forecasts, local secrets, and budget parameters!
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex gap-2 items-center">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  {/* Destination */}
                  <div className="md:col-span-3 space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold flex justify-between items-center">
                      <span>Target Destination</span>
                      {destinationListening && (
                        <span className="text-[9px] text-rose-600 animate-pulse font-mono flex items-center gap-1">
                          ● LISTENING VOICE ASST...
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Tokyo, Japan; Paris, France; Sedona, AZ..."
                        className="w-full bg-white border border-brand-border focus:border-brand-sage focus:outline-none text-[#1a1a1a] rounded-xl py-3 pl-4 pr-12 text-xs font-semibold focus:ring-1 focus:ring-brand-sage placeholder:text-zinc-400 font-sans"
                      />
                      <button
                        type="button"
                        onClick={toggleDestinationVoice}
                        title={destinationListening ? "Listening... Click to STOP" : "Speak to search destination"}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          destinationListening
                            ? "bg-rose-600 text-white animate-pulse"
                            : "bg-[#f5f5f0] hover:bg-brand-border/60 text-[#5A5A40] border border-brand-border"
                        }`}
                      >
                        {destinationListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {/* Quick presets */}
                    <div className="flex gap-1.5 flex-wrap pt-1 select-none">
                      {["Sedona, AZ", "Kyoto, Japan", "Tuscany, Italy", "Banff, Canada"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setDestination(p)}
                          className="text-[9px] text-[#5A5A40] hover:bg-brand-border bg-[#fcfcfa] border border-brand-border rounded px-2.5 py-1 tracking-wide transition-colors cursor-pointer font-sans font-semibold"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="md:col-span-1.5 space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white border border-brand-border focus:border-brand-sage focus:outline-none text-[#1a1a1a] rounded-xl py-3 px-3 text-xs font-semibold"
                    />
                  </div>

                  {/* End Date */}
                  <div className="md:col-span-1.5 space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border border-brand-border focus:border-brand-sage focus:outline-none text-[#1a1a1a] rounded-xl py-3 px-3 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  {/* Budget Level Option */}
                  <div className="md:col-span-3 space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Budget Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Economy", "Moderate", "Luxury"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setBudgetLevel(level)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold tracking-wide border transition-all cursor-pointer ${
                            budgetLevel === level
                              ? "bg-brand-sage text-white border-brand-sage shadow-sm"
                              : "bg-[#fcfcfa] border-brand-border text-brand-charcoal hover:bg-brand-border/40"
                          }`}
                        >
                          {level === "Economy" ? "🎒 Economy" : level === "Moderate" ? "🪙 Moderate" : "✨ Luxury"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Companions */}
                  <div className="md:col-span-3 space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Traveler Companion setup</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Solo", "Couple", "Family", "Friends"].map((companion) => (
                        <button
                          key={companion}
                          type="button"
                          onClick={() => setTravelerType(companion)}
                          className={`py-3 px-1 rounded-xl text-xs font-bold tracking-wide border transition-all cursor-pointer ${
                            travelerType === companion
                              ? "bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm"
                              : "bg-[#fcfcfa] border-brand-border text-brand-charcoal hover:bg-brand-border/40"
                          }`}
                        >
                          {companion === "Solo" ? "👤 Solo" : companion === "Couple" ? "👩‍❤️‍👨 Couple" : companion === "Family" ? "👨‍👩‍👧 Family" : "👋 Friends"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Checklist Interests */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Travel Interests & Focus (Select Multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {interestBank.map((item) => {
                      const has = interests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if (has) {
                              setInterests(interests.filter((i) => i !== item.id));
                            } else {
                              setInterests([...interests, item.id]);
                            }
                          }}
                          className={`text-xs px-4 py-2.5 rounded-full border font-semibold transition-all cursor-pointer select-none ${
                            has
                              ? "bg-brand-sage border-brand-sage text-white"
                              : "bg-[#fcfcfa] border-brand-border text-brand-charcoal hover:bg-brand-border/40"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional notes option */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Custom Requests or Meal Guidelines</label>
                  <textarea
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder="e.g. Vegetarian diet, wheelchair friendly, prefer museum visits on Day 3, avoid long hikes..."
                    rows={2}
                    className="w-full bg-white border border-brand-border focus:border-brand-sage focus:outline-none text-[#1a1a1a] rounded-xl py-3 px-4 text-xs font-semibold focus:ring-1 focus:ring-brand-sage"
                  />
                </div>

                {/* Action builder button */}
                <div className="pt-2 text-left">
                  {generating ? (
                    <div className="space-y-3">
                      <div className="h-1.5 w-full bg-brand-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-brand-sage"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 10, repeat: Infinity }}
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-[#f5f5f0] p-4 rounded-xl border border-brand-border animate-pulse">
                        <Compass className="w-5 h-5 text-brand-sage animate-spin-slow" />
                        <div>
                          <p className="text-xs font-bold text-brand-ink">AI Agent is generating your plan</p>
                          <p className="text-[10px] text-zinc-500 font-mono italic">{loadingSteps[generationStep]}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={generateTrip}
                      className="w-full bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-extrabold py-4 px-6 rounded-full text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse text-white" />
                      Generate Custom AI Itinerary
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Saved Trips section */}
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center pr-1 flex-wrap gap-2">
                <div>
                  <h2 className="text-3xl font-serif text-brand-ink tracking-tight">
                    My Saved Voyages
                  </h2>
                  <p className="text-xs text-brand-charcoal/80 font-sans">Access and review all previously registered trip itineraries</p>
                </div>
                
                {trips.length > 0 && (
                  <button
                    onClick={() => {
                      if (trips.length > 0) {
                        setSelectedTrip(trips[0]);
                        setActiveTab("planner");
                        showToast(`Loaded ${trips[0].destination}!`);
                      }
                    }}
                    className="text-xs font-bold text-brand-sage hover:opacity-80 flex items-center gap-1 cursor-pointer select-none"
                  >
                    Quick-load Active
                    <ArrowRight className="w-3 px-0.5" />
                  </button>
                )}
              </div>

              {trips.length === 0 ? (
                <div className="border border-dashed border-brand-border rounded-[24px] bg-[#fcfcfa] p-10 text-center space-y-3">
                  <MapPin className="w-8 h-8 text-brand-sage opacity-50 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-ink">No custom trips saved yet</h4>
                    <p className="max-w-md text-brand-charcoal/70 text-xs mx-auto">
                      Submit destination requirements in the form above and hit "Generate Itinerary" to get started. You can save your voyages to your local profile.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-brand-border hover:border-[#5A5A40]/40 rounded-[24px] p-6 flex flex-col justify-between transition-all group shadow-sm"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono font-bold text-[#5A5A40] tracking-wider uppercase bg-[#f5f5f0] px-2.5 py-1 rounded-full border border-brand-border">
                            {p.travelerType} Voyage • {p.durationDays} Days
                          </span>
                          <button
                            onClick={() => deleteTrip(p.id)}
                            className="text-brand-charcoal opacity-40 hover:opacity-100 hover:text-rose-600 p-1 rounded hover:bg-brand-bg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div>
                          <h4 className="font-serif font-bold text-brand-ink text-xl group-hover:text-brand-sage transition-colors leading-snug">{p.destination}</h4>
                          <p className="text-brand-charcoal/80 text-xs line-clamp-2 mt-1 leading-relaxed">{p.weatherOverview}</p>
                        </div>

                        <div className="flex justify-between items-center bg-[#fcfcfa] p-3 rounded-xl border border-brand-border text-[11px] font-mono">
                          <span className="text-zinc-500 font-bold">Estimate Budget</span>
                          <span className="text-[#5A5A40] font-bold">{formatPrice(p.budgetBreakdown?.totalEstimate || 1500)}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-brand-border flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedTrip(p);
                            setActiveItineraryDay(1);
                            setActiveTab("planner");
                            showToast(`Loaded details of ${p.destination}`);
                          }}
                          className="flex-1 text-center bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-bold py-2.5 rounded-full text-[11px] uppercase tracking-wider transition-colors cursor-pointer select-none shadow-sm"
                        >
                          Inspect Itinerary
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTrip(p);
                            setActiveTab("dashboard");
                            showToast(`Inspecting budget metrics of ${p.destination}`);
                          }}
                          className="bg-[#fcfcfa] hover:bg-[#eaeae2] text-brand-charcoal border border-brand-border font-semibold p-2.5 rounded-full text-xs transition-colors cursor-pointer flex items-center justify-center min-w-[42px]"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE PLANNER VIEW */}
        {activeTab === "planner" && (
          <div className="space-y-6">
            {!selectedTrip ? (
              <div className="bg-white p-12 rounded-[32px] border border-brand-border text-center space-y-5 shadow-sm">
                <Compass className="w-10 h-10 text-brand-sage mx-auto animate-spin-slow" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-brand-ink">No active voyage selected</h3>
                  <p className="text-brand-charcoal/80 text-xs max-w-sm mx-auto leading-relaxed">
                    You haven't generated or loaded an active voyage plan. Simply return to the dashboard hub to pick a destination.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="px-6 py-3 bg-[#5A5A40] hover:bg-[#4a4a35] rounded-full text-xs font-bold uppercase tracking-widest text-white transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visual Banner of Destination */}
                <div className="relative w-full h-[240px] rounded-[32px] overflow-hidden shadow-sm">
                  <img
                    src={getCityBackground(selectedTrip.destination)}
                    alt={selectedTrip.destination}
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-[1.02] duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null; // prevent infinite loops
                      e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest bg-brand-sage/80 px-3 py-1 rounded-full">
                        {selectedTrip.budgetLevel} Comfort • {selectedTrip.travelerType}
                      </span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-semibold text-white tracking-tight">{selectedTrip.destination}</h2>
                      <div className="flex gap-4 items-center text-xs text-white/95">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {selectedTrip.startDate || "Date flexible"}
                        </span>
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                        <span>{selectedTrip.durationDays} Days</span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={saveActiveTrip}
                        className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Save Trip
                      </button>
                      <button
                        onClick={triggerTextExport}
                        className="flex-1 md:flex-initial bg-brand-sage hover:bg-brand-sagedark text-white py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <FileDown className="w-4 h-4" />
                        Export Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub row - local weather overview & quick advisory facts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 leading-relaxed">
                  {/* Weather Summary */}
                  <div className="md:col-span-4 bg-white p-6 rounded-[24px] border border-brand-border text-left space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      <h4 className="text-sm font-bold text-brand-ink uppercase tracking-wider">Weather Overview</h4>
                    </div>
                    <p className="text-xs text-brand-charcoal/90 leading-relaxed font-sans font-medium">{selectedTrip.weatherOverview}</p>
                    
                    <div className="pt-3 border-t border-brand-border space-y-1">
                      <span className="text-[9px] text-[#5A5A40] uppercase tracking-widest font-mono font-bold block">Safety Status</span>
                      <div className="flex gap-1.5 items-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-brand-charcoal font-semibold">Safe to travel (No major warning)</span>
                      </div>
                    </div>
                  </div>

                  {/* Packing suggestions */}
                  <div className="md:col-span-4 bg-white p-6 rounded-[24px] border border-brand-border text-left space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Luggage className="w-5 h-5 text-brand-sage" />
                      <h4 className="text-sm font-bold text-brand-ink uppercase tracking-wider">Packing Checklist</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedTrip.packingSuggestions?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center text-xs text-brand-charcoal font-sans font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-sage" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety list */}
                  <div className="md:col-span-4 bg-white p-6 rounded-[24px] border border-brand-border text-left space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-brand-sage" />
                      <h4 className="text-sm font-bold text-brand-ink uppercase tracking-wider">Safety Guidelines</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedTrip.safetyTips?.map((tip, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-brand-charcoal font-sans leading-snug font-medium">
                          <span className="text-[#5A5A40] text-[10px] pt-0.5">✔</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Itinerary grid: left side day lists, right interactive map */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column Day activities (7-cols) */}
                  <div className="xl:col-span-6 space-y-5 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-[20px] border border-brand-border">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ink flex items-center gap-2 pl-1.5 py-1">
                        <ListOrdered className="w-4 h-4 text-brand-sage" />
                        Voyage Schedule
                      </h3>
                      <div className="flex bg-[#fcfcfa] p-1 rounded-full border border-brand-border overflow-x-auto max-w-full">
                        {selectedTrip.itinerary?.map((dayObj) => (
                          <button
                            key={dayObj.day}
                            onClick={() => setActiveItineraryDay(dayObj.day)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                              activeItineraryDay === dayObj.day
                                ? "bg-brand-sage text-white shadow-sm"
                                : "text-brand-charcoal hover:bg-brand-border/40"
                            }`}
                          >
                            Day {dayObj.day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedTrip.itinerary?.map((dayObj) => {
                        if (dayObj.day !== activeItineraryDay) return null;
                        return (
                          <motion.div
                            key={dayObj.day}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            className="bg-white p-6 rounded-[24px] border border-brand-border space-y-4 shadow-sm"
                          >
                            <div className="border-b border-brand-border pb-3">
                              <span className="text-[9px] font-mono font-bold text-brand-sage uppercase tracking-widest">Active focus of Day {dayObj.day}</span>
                              <h3 className="text-xl font-serif text-brand-ink leading-tight mt-0.5">{dayObj.theme}</h3>
                            </div>

                            <div className="space-y-3.5">
                              {dayObj.activities.map((act, actIdx) => (
                                <div
                                  key={actIdx}
                                  className="bg-[#fcfcfa] p-4 rounded-xl border border-brand-border flex gap-4 hover:-translate-y-0.5 transition-all"
                                >
                                  <div className="text-center shrink-0 min-w-[64px] border-r border-brand-border pr-4 flex flex-col justify-center">
                                    <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Schedule</span>
                                    <span className="text-xs text-brand-ink font-bold font-mono">{act.time}</span>
                                  </div>
                                  
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[9px] font-mono font-bold text-brand-sage bg-brand-border/40 border border-brand-border px-2 py-0.5 rounded-full">
                                        {act.category || "Sightseeing"}
                                      </span>
                                      <span className="text-[10px] text-brand-charcoal font-semibold font-sans flex items-center gap-0.5">
                                        📍 {act.locationName}
                                      </span>
                                    </div>
                                    <h5 className="font-bold text-brand-ink text-xs md:text-sm">{act.title}</h5>
                                    <p className="text-brand-charcoal/80 text-xs font-sans leading-relaxed pt-0.5">{act.description}</p>
                                  </div>

                                  <div className="text-right shrink-0 min-w-[50px]">
                                    <span className="text-[9px] text-zinc-400 font-mono block uppercase font-bold">Outlay</span>
                                    <span className="text-brand-sage text-xs font-extrabold font-mono">
                                      {act.cost === 0 ? "FREE" : formatPrice(act.cost)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Right Column: Physical vector day routing (5-cols) */}
                  <div className="xl:col-span-6 space-y-4">
                    <InteractiveMap trip={selectedTrip} activeDay={activeItineraryDay} />
                  </div>
                </div>

                {/* Hotels & Flights recommendations slider panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                  {/* Recommended Hotel picks */}
                  <div className="bg-white p-6 rounded-[24px] border border-brand-border text-left space-y-4 shadow-sm">
                    <h4 className="text-sm font-bold text-brand-ink flex items-center gap-2 uppercase tracking-wider">
                      <Hotel className="w-4 h-4 text-brand-sage" />
                      Hotel Recommendations
                    </h4>
                    
                    <div className="space-y-3">
                      {selectedTrip.recommendedHotels?.slice(0, 2).map((h, i) => (
                        <div key={i} className="bg-[#fcfcfa] p-4 rounded-xl border border-brand-border flex justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] text-brand-sage font-bold font-mono">
                              ⭐ {h.rating} / 5
                            </div>
                            <h5 className="font-serif font-bold text-brand-ink text-xs md:text-sm">{h.name}</h5>
                            <p className="text-[11px] text-brand-charcoal/80 line-clamp-2 leading-relaxed font-sans">{h.whyChoose}</p>
                          </div>
                          
                          <div className="text-right shrink-0 flex flex-col justify-between items-end">
                            <div>
                              <span className="text-[9px] text-zinc-400 font-mono block">Estimated</span>
                              <span className="text-brand-sage font-bold font-mono text-xs md:text-sm">{formatPrice(h.pricePerNight)}<span className="text-[10px] text-zinc-400 font-normal font-sans">/nt</span></span>
                            </div>
                            <button
                              onClick={() => addHotelToTrip(h)}
                              className="text-[10px] bg-brand-sage hover:bg-brand-sagedark text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer select-none transition-colors"
                            >
                              Select Lodging
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Flight options */}
                  <div className="bg-white p-6 rounded-[24px] border border-brand-border text-left space-y-4 shadow-sm">
                    <h4 className="text-sm font-bold text-brand-ink flex items-center gap-2 uppercase tracking-wider">
                      <Plane className="w-4 h-4 text-brand-sage" />
                      Flight Connections
                    </h4>

                    <div className="space-y-3">
                      {selectedTrip.recommendedFlights?.slice(0, 2).map((f, i) => (
                        <div key={i} className="bg-[#fcfcfa] p-4 rounded-xl border border-brand-border flex justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-brand-sage bg-[#f5f5f0] px-2.5 py-1 rounded-full border border-brand-border uppercase">
                              {f.airline}
                            </span>
                            <h5 className="font-serif font-bold text-brand-ink text-xs pt-1">{f.stops} Connection</h5>
                            <p className="text-[10px] text-brand-charcoal/85">Duration: {f.duration}</p>
                          </div>

                          <div className="text-right shrink-0 flex flex-col justify-between items-end">
                            <div>
                              <span className="text-[9px] text-zinc-400 font-mono block">Ticket Price</span>
                              <span className="text-brand-sage font-bold font-mono text-xs md:text-sm">{formatPrice(f.cost)}</span>
                            </div>
                            <button
                              onClick={() => addFlightToTrip(f)}
                              className="text-[10px] bg-brand-sage hover:bg-brand-sagedark text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer select-none transition-colors"
                            >
                              Add Flight
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 💰 COMPREHENSIVE OVERALL VOYAGE COST OUTLAY & BREAKDOWN */}
                <div className="bg-white border border-brand-border rounded-[28px] p-6 md:p-8 text-left space-y-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-5">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-brand-sage uppercase tracking-widest bg-brand-border/40 border border-brand-border px-3 py-1 rounded-full">
                        Financial Summary Indicator
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif text-brand-ink mt-2 tracking-tight flex items-center gap-2">
                        <span>💰</span> Comprehensive Voyage Cost Outline
                      </h3>
                    </div>
                    <div className="bg-[#fcfcfa] px-5 py-3 rounded-2xl border border-brand-border text-right">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase block font-bold">Estimated Grand Total</span>
                      <span className="text-xl md:text-2xl font-black text-brand-sage font-mono">
                        {(() => {
                          const flights = Number(selectedTrip.budgetBreakdown?.flightsEstimate) || 0;
                          const hotels = Number(selectedTrip.budgetBreakdown?.hotelsEstimate) || 0;
                          const activities = Number(selectedTrip.budgetBreakdown?.activitiesEstimate) || 0;
                          const dining = Number(selectedTrip.budgetBreakdown?.diningEstimate) || 0;
                          const total = flights + hotels + activities + dining || Number(selectedTrip.budgetBreakdown?.totalEstimate) || 0;
                          return formatPrice(total);
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Segmented Cost Progress Bar and breakdown */}
                    <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink">Outlay Allocation Metrics</h4>
                        
                        {/* Dynamic multi-segment progress bar */}
                        {(() => {
                          const flights = Number(selectedTrip.budgetBreakdown?.flightsEstimate) || 0;
                          const hotels = Number(selectedTrip.budgetBreakdown?.hotelsEstimate) || 0;
                          const activities = Number(selectedTrip.budgetBreakdown?.activitiesEstimate) || 0;
                          const dining = Number(selectedTrip.budgetBreakdown?.diningEstimate) || 0;
                          const total = flights + hotels + activities + dining || Number(selectedTrip.budgetBreakdown?.totalEstimate) || 1;
                          
                          const flightPct = Math.max(2, Math.round((flights / total) * 100));
                          const hotelPct = Math.max(2, Math.round((hotels / total) * 100));
                          const activityPct = Math.max(2, Math.round((activities / total) * 100));
                          const diningPct = Math.max(2, Math.round((dining / total) * 100));

                          return (
                            <div className="space-y-4">
                              <div className="h-5 w-full bg-[#fcfcfa] rounded-full overflow-hidden flex border border-brand-border">
                                <div style={{ width: `${flightPct}%` }} className="bg-sky-500 hover:opacity-90 transition-opacity" title={`Airfare: ${flightPct}%`} />
                                <div style={{ width: `${hotelPct}%` }} className="bg-indigo-500 hover:opacity-90 transition-opacity" title={`Lodging: ${hotelPct}%`} />
                                <div style={{ width: `${activityPct}%` }} className="bg-amber-500 hover:opacity-90 transition-opacity" title={`Attractions: ${activityPct}%`} />
                                <div style={{ width: `${diningPct}%` }} className="bg-emerald-500 hover:opacity-90 transition-opacity" title={`Gastronomy: ${diningPct}%`} />
                              </div>

                              {/* Interactive Legendary values */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fcfcfa] p-4 rounded-xl border border-brand-border">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-ink uppercase">
                                    <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block shrink-0" />
                                    <span>Airfare</span>
                                  </div>
                                  <span className="text-xs font-bold font-mono block pl-4">{formatPrice(flights)} ({flightPct}%)</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-ink uppercase">
                                    <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block shrink-0" />
                                    <span>Lodging</span>
                                  </div>
                                  <span className="text-xs font-bold font-mono block pl-4">{formatPrice(hotels)} ({hotelPct}%)</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-ink uppercase">
                                    <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block shrink-0" />
                                    <span>Attractions</span>
                                  </div>
                                  <span className="text-xs font-bold font-mono block pl-4">{formatPrice(activities)} ({activityPct}%)</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-ink uppercase">
                                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block shrink-0" />
                                    <span>Food</span>
                                  </div>
                                  <span className="text-xs font-bold font-mono block pl-4">{formatPrice(dining)} ({diningPct}%)</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="p-4 bg-[#fcfcfa] rounded-2xl border border-brand-border flex items-center gap-3">
                        <div className="bg-brand-sage/10 p-2.5 rounded-xl shrink-0 text-brand-sage">
                          <Compass className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                          Estimate is calculated dynamically according to your preference for a <strong className="text-brand-ink">{selectedTrip.budgetLevel}</strong> budget tier with custom local coordinates. Toggle preferred currencies at the top right header options anytime.
                        </p>
                      </div>
                    </div>

                    {/* Cost Optimizing Advisory Tip Column */}
                    <div className="lg:col-span-5 bg-[#fafaf7] p-6 rounded-2xl border border-brand-border space-y-4 text-left flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-mono font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full inline-block">
                          Smart Travel Advisor Tip
                        </span>
                        <h4 className="text-sm font-bold text-brand-ink">Optimization Advisory</h4>
                        <p className="text-xs text-brand-charcoal/90 leading-relaxed font-sans font-medium">
                          {selectedTrip.budgetLevel === "Luxury" 
                            ? "You selected a premium style! You can optimize activities outlays by consolidating reservation passes or requesting complimentary resort credits via concierge. Enjoy pristine 5-star access with local privileges."
                            : (selectedTrip.budgetLevel === "Budget" || selectedTrip.budgetLevel === "Economy")
                            ? "Splendid choice! To keep expenses low, utilize shared transit day plans. Our advisor suggests grabbing delightful pastries and open local-food stall specialties to enjoy breathtaking sunset public picnics!"
                            : "A wonderful balanced tier! We recommend selecting key attractions ahead of time during morning strolls while leaving afternoon periods open for exploring nearby valleys or neighborhoods without overhead expense."
                          }
                        </p>
                      </div>

                      <div className="border-t border-brand-border/60 pt-4 flex gap-2">
                        <button 
                          onClick={() => setActiveTab("dashboard")} 
                          className="flex-1 bg-white border border-brand-border text-brand-ink hover:bg-[#fcfcfa] text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                        >
                          💸 Budget Optimizer Link
                        </button>
                        <button
                          onClick={saveActiveTrip}
                          className="flex-1 bg-brand-sage hover:bg-[#4a4a35] text-white text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                        >
                          💾 Save Total Voyage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HOTELS SEARCH VIEW */}
        {activeTab === "hotels" && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="text-3xl font-serif text-brand-ink tracking-tight">Lodging Guides & Explorer</h2>
              <p className="text-xs text-brand-charcoal/80 font-sans mt-0.5">Locate exceptional boutique hotels, luxury rooms or modern youth hostels with local reviews.</p>
            </div>
            <HotelFlightSearch defaultMode="hotels" onAddHotel={addHotelToTrip} currency={currency} />
          </div>
        )}

        {/* TAB 4: FLIGHTS SEARCH VIEW */}
        {activeTab === "flights" && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="text-3xl font-serif text-[#1a1a1a] tracking-tight">Aviation Carrier Search</h2>
              <p className="text-xs text-brand-charcoal/80 font-sans mt-0.5">Compare departures, layovers, direct flights, and secure simulated flight parameters.</p>
            </div>
            <HotelFlightSearch defaultMode="flights" onAddFlight={addFlightToTrip} currency={currency} />
          </div>
        )}

        {/* TAB 5: STATS/BUDGET OPTIMIZER DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 text-left">
            {!selectedTrip ? (
              <div className="bg-white p-12 rounded-[32px] border border-brand-border text-center space-y-4 shadow-sm">
                <Compass className="w-10 h-10 text-brand-sage mx-auto animate-spin-slow" />
                <p className="text-sm text-brand-charcoal/80 font-semibold">Please select or draft an active trip to see detailed custom calculations.</p>
                <button onClick={() => setActiveTab("home")} className="px-5 py-2 bg-brand-sage hover:bg-brand-sagedark rounded-full text-xs font-bold uppercase tracking-wider text-white cursor-pointer select-none">
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-serif text-brand-ink tracking-tight">Active Budget & Cost Matrix Analytics</h2>
                  <p className="text-xs text-brand-charcoal/80 mt-0.5">Inspect cost allocations, adjust category ratios, and maximize savings with simulated metrics.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column interactive slider adjustments (8-cols) */}
                  <div className="xl:col-span-8 space-y-6">
                    <BudgetOptimizer
                      initialBreakdown={
                        selectedTrip.budgetBreakdown || {
                          flightsEstimate: 400,
                          hotelsEstimate: 350,
                          activitiesEstimate: 200,
                          diningEstimate: 300,
                          totalEstimate: 1250
                        }
                      }
                      selectedBudgetLimit={selectedTrip.budgetBreakdown?.totalEstimate || 1500}
                      onUpdateBudget={handleBudgetSync}
                      currency={currency}
                    />
                  </div>

                  {/* Right Column breakdown chart values (4-cols) */}
                  <div className="xl:col-span-4 bg-white p-6 rounded-[24px] border border-brand-border space-y-5 shadow-sm text-left">
                    <h4 className="text-sm font-bold text-brand-ink uppercase tracking-wider">Allocation breakdown</h4>
                    
                    <div className="space-y-4">
                      {/* Bar Allocation values calculated physically */}
                      {[
                        { label: "✈️ Transportation", value: selectedTrip.budgetBreakdown?.flightsEstimate || 400, color: "bg-brand-sage" },
                        { label: "🏨 Accommodation", value: selectedTrip.budgetBreakdown?.hotelsEstimate || 350, color: "bg-[#7A7A5A]" },
                        { label: "🎡 Activities / Parks", value: selectedTrip.budgetBreakdown?.activitiesEstimate || 200, color: "bg-[#9A9A75]" },
                        { label: "🍕 Food & Dining", value: selectedTrip.budgetBreakdown?.diningEstimate || 300, color: "bg-[#5A5A40]" }
                      ].map((bar, bidx) => {
                        const totalBd = (selectedTrip.budgetBreakdown?.totalEstimate || 1);
                        const pct = Math.max(5, Math.ceil((bar.value / totalBd) * 100));
                        return (
                          <div key={bidx} className="space-y-1.5 font-sans">
                            <div className="flex justify-between text-xs">
                              <span className="text-brand-charcoal font-semibold">{bar.label}</span>
                              <span className="text-brand-ink font-bold font-mono">{formatPrice(bar.value)} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#f5f5f0] overflow-hidden border border-brand-border">
                              <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-brand-border space-y-2">
                      <span className="text-[10px] text-[#5A5A40] uppercase tracking-widest font-mono font-bold block">Estimated aggregate daily rate</span>
                      <p className="text-2xl font-bold text-[#5A5A40] font-mono">
                        {formatPrice(Math.round((selectedTrip.budgetBreakdown?.totalEstimate || 1000) / (selectedTrip.durationDays || 3)))}
                        <span className="text-xs font-normal text-brand-charcoal font-sans"> / day</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ADMIN PANEL VIEW */}
        {activeTab === "admin" && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-serif text-brand-ink tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-7 h-7 text-brand-sage" />
                  Traveler Admin Console
                </h2>
                <p className="text-xs text-brand-charcoal/80 font-sans mt-0.5">Global system state manager, user statistics directory, and persistent trip records analyzer.</p>
              </div>
              <button
                onClick={resetGlobalState}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset System State
              </button>
            </div>

            {adminStats ? (
              <div className="space-y-6">
                {/* Stats cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-[24px] border border-brand-border space-y-2 shadow-sm">
                    <span className="text-[9px] text-[#5A5A40] font-mono uppercase tracking-widest font-bold block">Voyage Count</span>
                    <p className="text-3.5xl font-bold text-brand-ink font-mono">{adminStats.totalTrips}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">● Online active cache</p>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-brand-border space-y-2 shadow-sm">
                    <span className="text-[9px] text-[#5A5A40] font-mono uppercase tracking-widest font-bold block">Authorized Users</span>
                    <p className="text-3.5xl font-bold text-brand-sage font-mono">{usersList.length}</p>
                    <p className="text-[10px] text-brand-charcoal/85 mt-1">Active traveler profiles</p>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-brand-border space-y-2 shadow-sm">
                    <span className="text-[9px] text-[#5A5A40] font-mono uppercase tracking-widest font-bold block">Aggregated volume</span>
                    <p className="text-3.5xl font-bold text-brand-ink font-mono">{formatPrice(adminStats.totalBudgetVolume)}</p>
                    <p className="text-[10px] text-brand-charcoal/85 mt-1">Mock currency valuation</p>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-brand-border space-y-2 shadow-sm">
                    <span className="text-[9px] text-[#5A5A40] font-mono uppercase tracking-widest font-bold block">Average holidays</span>
                    <p className="text-3.5xl font-bold text-[#5A5A40] font-mono">{adminStats.averageDays} <span className="text-xs font-sans">days</span></p>
                    <p className="text-[10px] text-brand-charcoal/85 mt-1">Forecast index</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
                  {/* System saved trips list (7-cols) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-[24px] border border-brand-border space-y-4 shadow-sm animate-fade-in">
                    <h4 className="text-base font-serif font-bold text-brand-ink flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#5A5A40]" />
                      System saved record registry
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3 font-sans">
                      {adminStats.savedTrips?.map((st: any) => (
                        <div key={st.id} className="bg-[#fcfcfa] p-4 rounded-xl border border-brand-border flex justify-between items-center z-10 hover:border-[#5A5A40]/40 transition-colors">
                          <div>
                            <h5 className="font-serif font-bold text-brand-ink text-sm">{st.destination}</h5>
                            <span className="text-[10px] text-brand-charcoal font-medium tracking-wider font-mono uppercase block mt-1">
                              Style: {st.travelerType} • duration: {st.durationDays} Days • Class: {st.budgetLevel}
                            </span>
                            <span className="text-[9px] text-[#5A5A40] font-bold block mt-0.5">
                              Owner ID: {st.userId || "Global Demo"}
                            </span>
                          </div>
                          
                          <div className="flex gap-4 items-center">
                            <span className="text-[#5A5A40] font-bold font-mono text-sm">{formatPrice(st.totalEstimate)}</span>
                            <button
                              onClick={() => deleteTrip(st.id)}
                              className="text-brand-charcoal hover:text-rose-600 p-1.5 rounded hover:bg-brand-bg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Active session profiles (5-cols) */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-[24px] border border-brand-border space-y-4 shadow-sm text-left font-medium">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-serif font-bold text-brand-ink flex items-center gap-2">
                        <Users className="w-5 h-5 text-brand-sage" />
                        Voyager profile directory
                      </h4>
                      <button
                        onClick={() => setProfileModalOpen(true)}
                        className="text-[10px] tracking-wider uppercase font-bold text-brand-sage hover:underline cursor-pointer"
                      >
                        + Create Profile
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3.5 font-sans">
                      {usersList?.map((usr: any) => {
                        const isActive = usr.id === activeUser?.id;
                        return (
                          <div 
                            key={usr.id} 
                            className={`p-4 rounded-xl border transition-all flex justify-between items-center ${
                              isActive ? "border-brand-sage bg-emerald-50/20" : "border-brand-border bg-[#fcfcfa] hover:border-brand-border"
                            }`}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={`w-10 h-10 rounded-full ${usr.avatarColor || "bg-indigo-600"} text-white font-bold flex items-center justify-center text-base shadow-sm`}>
                                {usr.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <h5 className="font-bold text-brand-ink text-sm leading-none flex items-center gap-1.5">
                                  {usr.name}
                                  {isActive && (
                                    <span className="text-[8px] font-bold bg-brand-sage text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                      Active
                                    </span>
                                  )}
                                </h5>
                                <p className="text-[10px] text-brand-charcoal/80 mt-1">{usr.email}</p>
                                <span className="text-[8px] font-bold text-brand-sage uppercase tracking-widest font-mono mt-0.5 block">
                                  {usr.role || "Standard User"}
                                </span>
                              </div>
                            </div>

                            {!isActive && (
                              <button
                                onClick={() => handleUserSwitch(usr)}
                                className="px-3 py-1 bg-white border border-brand-border text-[#4a4a35] hover:bg-brand-sage hover:text-white hover:border-brand-sage text-[9px] uppercase font-bold rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-[24px] border border-brand-border animate-pulse text-brand-charcoal font-semibold">
                Sourcing database admin records...
              </div>
            )}
          </div>
        )}

        {/* TAB 7: ABOUT & CONTACT VIEW */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* About platform description (7-cols) */}
            <div className="lg:col-span-7 bg-white p-6 lg:p-8 rounded-[32px] border border-brand-border space-y-6 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-brand-sage uppercase tracking-widest">ABOUT THE PLATFORM</span>
                <h3 className="text-3xl lg:text-4xl font-serif text-brand-ink leading-tight">
                  Smart AI Agent-driven <br />
                  Trip Planning Assistant
                </h3>
              </div>
              
              <p className="text-brand-charcoal text-sm leading-relaxed font-sans font-medium">
                Developed inside the Google AI Studio container, this application connects you directly to the state-of-the-art **Gemini-3.5-flash** generative algorithm. It allows customized vacation construction, budgeting, list management, and localized guidelines dynamically.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#fcfcfa] border border-brand-border space-y-1 font-sans">
                  <h4 className="text-xs font-bold text-brand-ink uppercase">🔒 Secure API proxy</h4>
                  <p className="text-[11px] text-brand-charcoal/80 leading-normal font-medium">
                    All delicate credentials and API secrets are shielded server-side in our express gateway, protecting user secrets.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#fcfcfa] border border-brand-border space-y-1 font-sans">
                  <h4 className="text-xs font-bold text-brand-ink uppercase">🗺️ Interactive Vector Map</h4>
                  <p className="text-[11px] text-brand-charcoal/80 leading-normal font-medium">
                    Plot coordinates organically and inspect Day-by-Day route vectors, landmarks, and admission estimates.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#fcfcfa] border border-brand-border space-y-1 font-sans">
                  <h4 className="text-xs font-bold text-brand-ink uppercase">📊 dynamic Budget Slices</h4>
                  <p className="text-[11px] text-brand-charcoal/80 leading-normal font-medium">
                    Leverage the math calculator tools and balance lodging vs dining expenses with responsive advice warnings.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#fcfcfa] border border-brand-border space-y-1 font-sans">
                  <h4 className="text-xs font-bold text-brand-ink uppercase">🤖 Floating Concierge</h4>
                  <p className="text-[11px] text-brand-charcoal/80 leading-normal font-medium">
                    Call our smart chatbot conversational module for instant rainy packing checklists or currency help.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-border/40 border border-brand-border text-xs text-brand-charcoal leading-relaxed font-sans font-semibold">
                <strong className="block text-brand-ink mb-0.5">Note on simulated parameters:</strong>
                All flights, lodgings, ratings, layovers and newsletter dispatch systems are functional mock services mirroring premium interfaces, enabling instant deployment previews safely.
              </div>

              {/* INTERACTIVE COMPANION: BROWSER & VS CODE ACCESS HUB */}
              <div id="ide-access-hub" className="p-5 rounded-2xl bg-gradient-to-br from-[#fcfcfa] to-white border-2 border-dashed border-[#5A5A40]/30 space-y-4 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-sage/20 flex items-center justify-center text-[#5A5A40] rounded-lg">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-ink text-xs uppercase tracking-wide">Live Deployments & IDE Link Hub</h4>
                    <p className="text-[10px] text-brand-charcoal/70">Access nomadic inside any standalone web browser or inside VS Code editors.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-[#f5f5f0] border border-brand-border rounded-xl flex items-center justify-between gap-3 flex-wrap">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-brand-charcoal uppercase block font-bold">App Live Link</span>
                      <code className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-brand-border text-[#5A5A40] inline-block max-w-[200px] sm:max-w-xs truncate">
                        {typeof window !== "undefined" ? window.location.origin : "https://ais-pre-a67e545p2evoj2c7fhvs6f-531496336134.asia-southeast1.run.app"}
                      </code>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.open(window.location.origin, "_blank", "noopener,noreferrer");
                            showToast("Nomadic opened in new tab! 🗺️");
                          }
                        }}
                        className="px-3 py-1.5 bg-[#5A5A40] text-white hover:bg-[#4a4a35] font-bold uppercase text-[9px] tracking-wide rounded-lg transition-colors cursor-pointer"
                        title="Open nomadic in a fresh standalone browser window"
                      >
                        Launch Url
                      </button>
                      <button
                        onClick={async () => {
                          if (typeof window !== "undefined") {
                            const url = window.location.origin;
                            try {
                              await navigator.clipboard.writeText(url);
                              showToast("Link saved to clipboard! Copy to any browser. 📋");
                            } catch (err) {
                              console.warn("Clipboard blocked by iframe context, falling back to prompt:", err);
                              window.prompt("To bypass browser iframe security blocks, please select and copy this link:", url);
                            }
                          }
                        }}
                        className="px-3 py-1.5 bg-white border border-brand-border text-brand-ink hover:bg-brand-border/40 font-bold uppercase text-[9px] tracking-wide rounded-lg transition-colors cursor-pointer"
                        title="Copy deployment URL"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1.5">
                    <h5 className="font-bold text-sky-950 uppercase text-[10px] tracking-wide flex items-center gap-1.5">
                      💻 Live coding & VS Code Simple Preview Guide
                    </h5>
                    <p className="text-[10px] text-sky-900/80 leading-normal font-medium">
                      To run and preview this travel suite seamlessly inside your **VS Code local host environment** or web containers:
                    </p>
                    <ol className="list-decimal list-inside text-[9.5px] text-sky-900/90 font-medium space-y-1">
                      <li>Copy the live deployment link above.</li>
                      <li>In VS Code, open the Command Palette (<kbd className="font-mono bg-white px-1 py-0.5 rounded border text-slate-600">Ctrl + Shift + P</kbd> / <kbd className="font-mono bg-white px-1 py-0.5 rounded border text-slate-600">Cmd + Shift + P</kbd>).</li>
                      <li>Select <span className="font-bold underline text-sky-950">"Simple Browser: Show"</span> and paste the copied nomadic URL.</li>
                      <li>Nomadic will render directly within VS Code side-by-side with your code!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Support contact forms (5-cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-[32px] border border-brand-border space-y-4 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-brand-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-brand-sage" />
                  Dispatch Agent Feedback
                </h4>
                <p className="text-[11px] text-brand-charcoal/80">Have questions about safety alerts or customized guides? Send a support ticket.</p>
              </div>

              {contactStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${contactStatus.includes("success") ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 text-rose-800 border border-rose-100"}`}>
                  {contactStatus}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs text-left">
                <div className="space-y-1.5">
                  <label className="text-[#5A5A40] font-bold font-mono uppercase text-[9px] tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-[#fcfcfa] border border-brand-border focus:border-brand-sage focus:outline-none text-brand-ink rounded-xl py-3 px-4 font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#5A5A40] font-bold font-mono uppercase text-[9px] tracking-wider block">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="suryawanshiharshit777@gmail.com"
                    className="w-full bg-[#fcfcfa] border border-brand-border focus:border-brand-sage focus:outline-none text-brand-ink rounded-xl py-3 px-4 font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#5A5A40] font-bold font-mono uppercase text-[9px] tracking-wider block">Support Message Detail</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="How can we assist you with your destination itinerary?"
                    className="w-full bg-[#fcfcfa] border border-brand-border focus:border-brand-sage focus:outline-none text-brand-ink rounded-xl py-3 px-4 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-extrabold uppercase rounded-full tracking-widest text-[11px] shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Floating conversational chatbot */}
      <FloatingChatbot />

      {/* Dynamic Profile Management Modal */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileModalOpen(false)}
              className="fixed inset-0 bg-[#1a1a14]/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative z-50 border border-brand-border flex flex-col max-h-[90vh]"
            >
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-serif text-brand-ink font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-brand-sage animate-pulse" />
                      Traveler Profile Hub
                    </h3>
                    <p className="text-xs text-brand-charcoal/80 font-sans mt-1">
                      Manage and switch between active travel profiles. Trips are saved and loaded independently.
                    </p>
                  </div>
                  <button
                    onClick={() => setProfileModalOpen(false)}
                    className="p-1.5 hover:bg-[#f5f5f0] text-brand-charcoal rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left leading-relaxed">
                  
                  {/* Left Column: Switch Profile list */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] font-mono">
                      Switch Traveler ({usersList.length})
                    </h4>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {usersList.map((usrBy) => {
                        const isCurrent = usrBy.id === activeUser?.id;
                        return (
                          <div
                            key={usrBy.id}
                            onClick={() => {
                              handleUserSwitch(usrBy);
                              setProfileModalOpen(false);
                            }}
                            className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                              isCurrent
                                ? "bg-emerald-50/40 border-brand-sage shadow-sm shadow-emerald-700/10"
                                : "bg-[#fcfcfa] border-brand-border hover:border-brand-sage/60 hover:bg-[#f5f5f0]/40"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-full ${usrBy.avatarColor || "bg-indigo-600"} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
                              {usrBy.name?.charAt(0) || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-brand-ink truncate flex items-center gap-1.5">
                                {usrBy.name}
                                {isCurrent && (
                                  <span className="w-2 h-2 rounded-full bg-brand-sage animate-ping" />
                                )}
                              </h5>
                              <p className="text-[10px] text-brand-charcoal/80 truncate font-mono">{usrBy.email}</p>
                              <span className="text-[8.5px] font-bold text-brand-sage uppercase tracking-wider block mt-0.5">
                                {usrBy.role || "Standard User"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Register New Traveler */}
                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-brand-border pt-6 md:pt-0 md:pl-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] font-mono">
                      + Register Traveler
                    </h4>
                    
                    <form onSubmit={registerNewUser} className="space-y-3.5 font-sans text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-brand-charcoal block text-left">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="e.g. Elena Rostova"
                          className="w-full bg-[#fcfcfa] border border-brand-border text-brand-ink rounded-lg py-2 px-3 font-semibold focus:outline-none focus:border-brand-sage text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-brand-charcoal block text-left">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="elena@voyages.com"
                          className="w-full bg-[#fcfcfa] border border-brand-border text-brand-ink rounded-lg py-2 px-3 font-semibold focus:outline-none focus:border-brand-sage text-[11px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-brand-charcoal block">
                            Trip Budget
                          </label>
                          <select
                            value={newUserBudget}
                            onChange={(e) => setNewUserBudget(e.target.value)}
                            className="w-full bg-[#fcfcfa] border border-brand-border text-brand-ink rounded-lg py-2 px-2.5 font-semibold focus:outline-none focus:border-brand-sage text-[10px]"
                          >
                            <option value="Budget">Budget</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Luxury">Luxury</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-[#5A5A40] block">
                            Voyage Style
                          </label>
                          <select
                            value={newUserTraveler}
                            onChange={(e) => setNewUserTraveler(e.target.value)}
                            className="w-full bg-[#fcfcfa] border border-brand-border text-brand-ink rounded-lg py-2 px-2.5 font-semibold focus:outline-none focus:border-brand-sage text-[10px]"
                          >
                            <option value="Solo">Solo</option>
                            <option value="Couple">Couple</option>
                            <option value="Family">Family</option>
                            <option value="Friends">Friends</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-[#5A5A40] block">
                          Profile Role
                        </label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value)}
                          className="w-full bg-[#fcfcfa] border border-brand-border text-brand-ink rounded-lg py-2 px-2.5 font-semibold focus:outline-none focus:border-brand-sage text-[10px]"
                        >
                          <option value="Standard User">Standard User</option>
                          <option value="Traveler Member">Traveler Member</option>
                          <option value="VIP Voyager">VIP Voyager</option>
                          <option value="Elite Adventurer">Elite Adventurer</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-extrabold uppercase rounded-full tracking-widest text-[10px] shadow-sm cursor-pointer transition-colors"
                      >
                        + Create Voyager Profile
                      </button>
                    </form>
                  </div>

                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-[#f5f5f0] border-t border-brand-border p-4 flex justify-end">
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-brand-border text-brand-charcoal hover:bg-brand-bg font-bold uppercase text-[10px] tracking-widest rounded-full cursor-pointer shadow-sm"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* footer section */}
      <footer className="border-t border-brand-border py-10 text-center text-xs text-brand-charcoal space-y-1.5 mt-16">
        <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">© 2026 Smart AI Travel Agent. Powered by Gemini 3.5-Flash</p>
        <p className="max-w-xl mx-auto text-brand-charcoal/70 text-[11px] font-sans font-medium">
          Your travel concierge is open 24/7. Standard itinerary coordinates are mathematically processed for demonstration. Verified secure.
        </p>
      </footer>
    </div>
  );
}
