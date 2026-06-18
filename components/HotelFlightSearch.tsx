import React, { useState } from "react";
import { Search, Star, DollarSign, Hotel, Plane, Tag, Compass, Sparkles, Filter, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HotelFlightSearchProps {
  onAddHotel?: (hotel: any) => void;
  onAddFlight?: (flight: any) => void;
  defaultMode?: "hotels" | "flights";
  currency?: "usd" | "inr" | "both";
}

export default function HotelFlightSearch({
  onAddHotel,
  onAddFlight,
  defaultMode = "hotels",
  currency = "both",
}: HotelFlightSearchProps) {
  const USD_TO_INR = 83;
  const formatPrice = (usd: number) => {
    const usdStr = `$${usd.toLocaleString()}`;
    const inrStr = `₹${Math.round(usd * USD_TO_INR).toLocaleString()}`;
    if (currency === "usd") return usdStr;
    if (currency === "inr") return inrStr;
    return `${usdStr} (${inrStr})`;
  };
  const [activeTab, setActiveTab] = useState<"hotels" | "flights">(defaultMode);
  // Search state
  const [city, setCity] = useState("Tokyo");
  const [fromCity, setFromCity] = useState("New York");
  const [toCity, setToCity] = useState("Tokyo");
  
  // Results
  const [hotels, setHotels] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedItem, setBookedItem] = useState<string | null>(null);

  // Filters
  const [maxPrice, setMaxPrice] = useState(600);
  const [starRating, setStarRating] = useState(1);

  const searchHotels = async () => {
    setLoading(true);
    setBookedItem(null);
    try {
      const res = await fetch(`/api/hotels/search?q=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.success) {
        setHotels(data.hotels);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchFlights = async () => {
    setLoading(true);
    setBookedItem(null);
    try {
      const res = await fetch(`/api/flights/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`);
      const data = await res.json();
      if (data.success) {
        setFlights(data.flights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executeSearch = () => {
    if (activeTab === "hotels") {
      searchHotels();
    } else {
      searchFlights();
    }
  };

  // Run initial mock lookup so the tabs already display beautiful preloaded data on visual arrival
  React.useEffect(() => {
    executeSearch();
  }, [activeTab]);

  const handleBook = (item: any, type: "hotel" | "flight") => {
    setBookedItem(item.id);
    setTimeout(() => {
      setBookedItem(null);
    }, 2000);

    if (type === "hotel" && onAddHotel) {
      onAddHotel(item);
    } else if (type === "flight" && onAddFlight) {
      onAddFlight(item);
    }
  };

  // Filtered lists
  const filteredHotels = hotels.filter(
    (h) => h.pricePerNight <= maxPrice && h.rating >= starRating
  );
  
  const filteredFlights = flights.filter((f) => f.price <= maxPrice);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-white/5 pb-4 justify-between items-center flex-wrap gap-4">
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => {
              setActiveTab("hotels");
              setBookedItem(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "hotels"
                ? "bg-sky-500 text-white shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Hotel className="w-4 h-4" />
            Lodging Guides
          </button>
          <button
            onClick={() => {
              setActiveTab("flights");
              setBookedItem(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "flights"
                ? "bg-sky-500 text-white shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Plane className="w-4 h-4" />
            Flight Searchengines
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-slate-950/60 border border-white/5 py-1.5 px-3 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          Realtime pricing updates enabled
        </div>
      </div>

      {/* Input query modules */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
        {activeTab === "hotels" ? (
          <div className="md:col-span-10">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Destination City</label>
            <div className="relative mt-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchHotels()}
                placeholder="Where are you staying? (e.g. Paris, Tokyo, London...)"
                className="w-full bg-slate-900 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="md:col-span-5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Origin Location</label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Departure city"
                className="mt-1 w-full bg-slate-900 border border-white/10 text-white rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Destination Target</label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFlights()}
                placeholder="Arrival city"
                className="mt-1 w-full bg-slate-900 border border-white/10 text-white rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </>
        )}
        <div className="md:col-span-2 flex items-end">
          <button
            onClick={executeSearch}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            Explore
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left column filters */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            Refine Filters
          </h4>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400 font-mono">
              <span>Max budget per item</span>
              <span className="text-white font-medium">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="30"
              max="1000"
              step="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 accent-sky-500 rounded-lg cursor-pointer"
            />
          </div>

          {activeTab === "hotels" && (
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 font-mono block">Minimum Quality</span>
              <div className="flex gap-1.5">
                {[1, 3, 4, 4.5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setStarRating(stars)}
                    className={`flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-md border transition-all ${
                      starRating === stars
                        ? "bg-indigo-500 text-white border-indigo-400"
                        : "bg-slate-900 text-zinc-400 border-white/5 hover:text-white"
                    }`}
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {stars}+
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3 text-[10px] text-indigo-300">
              <span className="font-bold uppercase tracking-wider block mb-1">AI Savings Guarantee</span>
              All bookings are simulated using dynamic standard averages protecting your data.
            </div>
          </div>
        </div>

        {/* Right column listings results */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 bg-slate-800 rounded w-1/3" />
                    <div className="h-5 bg-slate-800 rounded w-1/5" />
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-4 bg-slate-800 rounded w-16" />
                    <div className="h-4 bg-slate-800 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "hotels" ? (
            filteredHotels.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-slate-950/20">
                <Compass className="w-8 h-8 text-zinc-500 mx-auto mb-2 animate-bounce" />
                <p className="text-zinc-400 text-xs">No matching lodging plans found below {formatPrice(maxPrice)}. Try widening your budget.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHotels.map((h) => (
                  <div
                    key={h.id}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-white/25 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">{h.city} Rating</span>
                        <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded text-xs font-semibold text-amber-400 border border-white/5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {h.rating}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-white tracking-tight text-sm md:text-base leading-snug">{h.name}</h4>
                      <p className="text-zinc-400 text-xs line-clamp-2 md:line-clamp-3 leading-relaxed">{h.why}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {h.amenities?.map((am: string, i: number) => (
                          <span key={i} className="text-[9px] bg-slate-950 border border-white/5 py-0.5 px-2 rounded font-mono text-zinc-300">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono uppercase block">Nightly Price</span>
                        <span className="text-base font-bold text-emerald-400 font-mono">{formatPrice(h.pricePerNight || h.price || 0)}</span>
                      </div>
                      <button
                        onClick={() => handleBook(h, "hotel")}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          bookedItem === h.id
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800 hover:bg-sky-500 text-white cursor-pointer"
                        }`}
                      >
                        {bookedItem === h.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Booked!
                          </>
                        ) : (
                          "Select & Book"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredFlights.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-slate-950/20">
                <Compass className="w-8 h-8 text-zinc-500 mx-auto mb-2 animate-bounce" />
                <p className="text-zinc-400 text-xs">No matching airline carriers found below {formatPrice(maxPrice)}. Try widening your budget.</p>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                {filteredFlights.map((f) => (
                  <div
                    key={f.id}
                    className="bg-slate-900/60 border border-white/10 hover:border-white/25 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/10 uppercase tracking-widest">{f.airline}</span>
                        <span className="text-zinc-400 font-mono text-xs">{f.stops} stopover</span>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-1.5">
                        <div>
                          <p className="text-xs text-white font-semibold">{f.departureTime}</p>
                          <p className="text-[10px] text-zinc-500 font-mono uppercase">{f.from}</p>
                        </div>
                        <div className="flex-1 max-w-[120px] relative flex items-center justify-center">
                          <div className="w-full border-t border-dashed border-white/20" />
                          <Plane className="w-3.5 h-3.5 text-zinc-400 rotate-90 absolute bg-slate-900/80 px-0.5" />
                          <span className="absolute -bottom-4 text-[9px] text-zinc-500 font-mono whitespace-nowrap">{f.duration}</span>
                        </div>
                        <div>
                          <p className="text-xs text-white font-semibold">{f.arrivalTime}</p>
                          <p className="text-[10px] text-zinc-500 font-mono uppercase">{f.to}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0 gap-4">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase block">Total Cost</span>
                        <span className="text-base font-bold text-emerald-400 font-mono">{formatPrice(f.price)}</span>
                      </div>
                      <button
                        onClick={() => handleBook(f, "flight")}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all w-full md:w-auto justify-center ${
                          bookedItem === f.id
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800 hover:bg-sky-500 text-white cursor-pointer"
                        }`}
                      >
                        {bookedItem === f.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Selected!
                          </>
                        ) : (
                          "Select Flight"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
