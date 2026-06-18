import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Compass, Star, Camera, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Trip, Activity } from "../types";

interface InteractiveMapProps {
  trip?: Trip;
  activeDay?: number;
}

export default function InteractiveMap({ trip, activeDay = 1 }: InteractiveMapProps) {
  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "satellite">("map");

  // Generate simulated but fixed coordinates for locations in the itinerary so the pins look structured and neat
  const generatePinsForItinerary = (): any[] => {
    if (!trip || !trip.itinerary) return [];
    
    const pins: any[] = [];
    trip.itinerary.forEach((dayData) => {
      // Filter activities per day
      dayData.activities.forEach((act, idx) => {
        // Deterministic placement using name hash codes so the locations remain stable for each city
        const code = act.locationName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const x = 15 + ((code % 65) + (dayData.day * 12)) % 75; // stay inside 15% - 90%
        const y = 20 + ((code * idx) % 55 + (dayData.day * 7)) % 70; // stay inside 20% - 90%
        
        pins.push({
          id: `${dayData.day}-${idx}`,
          day: dayData.day,
          title: act.title,
          locationName: act.locationName,
          time: act.time,
          cost: act.cost,
          category: act.category,
          description: act.description,
          x,
          y
        });
      });
    });
    return pins;
  };

  const pins = generatePinsForItinerary();
  const currentDayPins = pins.filter((p) => p.day === activeDay);

  // Auto-select the first pin of the day when active day changes
  useEffect(() => {
    if (currentDayPins.length > 0) {
      setSelectedPin(currentDayPins[0]);
    } else {
      setSelectedPin(null);
    }
  }, [activeDay, trip]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-slate-900 text-white">
      {/* Background layer */}
      {viewMode === "map" ? (
        <div className="absolute inset-0 bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          {/* Mock physical contours */}
          <div className="absolute top-[10%] left-[20%] w-[320px] h-[320px] rounded-full bg-indigo-500/5 filter blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] rounded-full bg-cyan-700/5 filter blur-3xl" />
          <div className="absolute top-[40%] right-[30%] w-[180px] h-[180px] rounded-full bg-emerald-600/5 filter blur-3xl" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-zinc-950">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')" }} />
          <div className="absolute inset-0 bg-[radial-gradient(#334155_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-40" />
        </div>
      )}

      {/* Grid Overlay lines to look like premium navigation tech */}
      <div className="absolute inset-0 pointer-events-none opacity-20 border border-white/5">
        <div className="absolute left-[33%] top-0 bottom-0 border-l border-white/10 border-dashed" />
        <div className="absolute left-[66%] top-0 bottom-0 border-l border-white/10 border-dashed" />
        <div className="absolute left-0 right-0 top-[33%] border-t border-white/10 border-dashed" />
        <div className="absolute left-0 right-0 top-[66%] border-t border-white/10 border-dashed" />
      </div>

      {/* Travel Path Path Connecting Line of active day items */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {currentDayPins.length > 1 && (
          <motion.path
            d={`M ${currentDayPins.map(p => `${(p.x / 100) * 400} ${(p.y / 100) * 400}`).join(" L ")}`}
            fill="none"
            stroke="url(#gradient-line)"
            strokeWidth="3"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </svg>

      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-lg">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-400 animate-spin-slow" />
          <div>
            <h4 className="text-sm font-semibold tracking-wide">
              {trip?.destination || "Interactive Global Map"}
            </h4>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
              Day {activeDay} Route Breakdown
            </p>
          </div>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1 text-xs border border-white/5">
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "map" ? "bg-sky-500 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            Vector Map
          </button>
          <button
            onClick={() => setViewMode("satellite")}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "satellite" ? "bg-sky-500 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Pins Render */}
      <div className="absolute inset-0 z-15">
        {pins.map((pin) => {
          const isActive = pin.day === activeDay;
          const isSelected = selectedPin?.id === pin.id;
          
          if (!isActive) return null;

          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none"
            >
              <div className="relative flex items-center justify-center">
                {/* Dynamic Ripple Echo */}
                {isSelected && (
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-sky-400/30 animate-ping" />
                )}
                
                {/* Visual pin icon */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all shadow-md ${
                    isSelected
                      ? "bg-gradient-to-tr from-sky-500 to-indigo-500 border-white text-white scale-110 z-30"
                      : "bg-slate-800/90 border-sky-400 text-sky-400 hover:bg-sky-500 hover:text-white hover:scale-105"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Micro tooltip label */}
                <span className="absolute top-9 left-2/3 whitespace-nowrap bg-slate-900/90 backdrop-blur-md text-[10px] px-2 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-medium tracking-wide">
                  {pin.locationName} ({pin.time})
                </span>
                
                {/* Pin order number */}
                <div className="absolute -top-3 -right-3 bg-indigo-500 text-[9px] font-mono h-4 w-4 rounded-full flex items-center justify-center border border-white/10 shadow shadow-black">
                  {pin.day}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Landmark details slide-in pane */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md rounded-xl p-4 border border-white/15 shadow-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider font-mono text-sky-400 px-2 py-0.5 bg-sky-500/10 rounded border border-sky-500/15">
                  {selectedPin.category || "Sightseeing"}
                </span>
                <span className="text-zinc-400 font-mono text-xs">{selectedPin.time}</span>
              </div>
              <h5 className="font-semibold text-white text-sm md:text-base">
                {selectedPin.locationName}
              </h5>
              <p className="text-zinc-300 text-xs line-clamp-2 md:line-clamp-1">
                {selectedPin.description}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto border-t border-white/5 pt-3 md:pt-0 md:border-t-0">
              <div className="text-right">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Estimate cost</p>
                <p className="font-semibold text-indigo-400 font-mono text-sm md:text-base">
                  {selectedPin.cost === 0 ? "FREE" : `$${selectedPin.cost}`}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedPin.locationName} ${trip?.destination}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute right-4 bottom-20 md:bottom-auto md:top-20 z-10 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg p-2.5 text-[10px] space-y-1">
        <p className="text-zinc-400 uppercase tracking-widest font-mono text-[8px] mb-1.5">Map Categories</p>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Sightseeing / Park
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Traditional Food
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Relax / Leisure
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> High Adventure
        </div>
      </div>
    </div>
  );
}
