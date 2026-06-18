import React, { useState, useEffect } from "react";
import { DollarSign, Percent, TrendingUp, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { BudgetBreakdown } from "../types";

interface BudgetOptimizerProps {
  initialBreakdown?: BudgetBreakdown;
  selectedBudgetLimit?: number;
  onUpdateBudget: (newBreakdown: BudgetBreakdown) => void;
  currency?: "usd" | "inr" | "both";
}

export default function BudgetOptimizer({
  initialBreakdown = { flightsEstimate: 450, hotelsEstimate: 350, activitiesEstimate: 120, diningEstimate: 200, totalEstimate: 1120 },
  selectedBudgetLimit = 1500,
  onUpdateBudget,
  currency = "both",
}: BudgetOptimizerProps) {
  const USD_TO_INR = 83;
  const formatPrice = (usd: number) => {
    const usdStr = `$${usd.toLocaleString()}`;
    const inrStr = `₹${Math.round(usd * USD_TO_INR).toLocaleString()}`;
    if (currency === "usd") return usdStr;
    if (currency === "inr") return inrStr;
    return `${usdStr} (${inrStr})`;
  };
  const [flights, setFlights] = useState(initialBreakdown.flightsEstimate);
  const [hotels, setHotels] = useState(initialBreakdown.hotelsEstimate);
  const [activities, setActivities] = useState(initialBreakdown.activitiesEstimate);
  const [dining, setDining] = useState(initialBreakdown.diningEstimate);
  const [limit, setLimit] = useState(selectedBudgetLimit);

  useEffect(() => {
    setFlights(initialBreakdown.flightsEstimate);
    setHotels(initialBreakdown.hotelsEstimate);
    setActivities(initialBreakdown.activitiesEstimate);
    setDining(initialBreakdown.diningEstimate);
    setLimit(selectedBudgetLimit);
  }, [
    initialBreakdown.flightsEstimate,
    initialBreakdown.hotelsEstimate,
    initialBreakdown.activitiesEstimate,
    initialBreakdown.diningEstimate,
    selectedBudgetLimit
  ]);

  const total = flights + hotels + activities + dining;
  const isOverBudget = total > limit;
  const percentage = Math.round((total / limit) * 100) || 0;

  // Recalculate and propagate changes
  const handleSliderChange = (type: "flights" | "hotels" | "activities" | "dining", value: number) => {
    let updatedFlights = flights;
    let updatedHotels = hotels;
    let updatedActivities = activities;
    let updatedDining = dining;

    if (type === "flights") updatedFlights = value;
    if (type === "hotels") updatedHotels = value;
    if (type === "activities") updatedActivities = value;
    if (type === "dining") updatedDining = value;

    const updatedTotal = updatedFlights + updatedHotels + updatedActivities + updatedDining;

    onUpdateBudget({
      flightsEstimate: updatedFlights,
      hotelsEstimate: updatedHotels,
      activitiesEstimate: updatedActivities,
      diningEstimate: updatedDining,
      totalEstimate: updatedTotal,
    });
  };

  // Generate responsive advice depending on total cost
  const getAIAdvice = () => {
    if (percentage > 100) {
      return {
        style: "bg-rose-50 border-rose-200 text-rose-900",
        icon: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
        title: "Over-Budget alert!",
        text: "You are exceeding your targeted limit by " + (total - limit) + " USD. Consider shifting hotels to alternate options, choosing budget local eateries, or prioritizing selected sightseeing features.",
      };
    } else if (percentage > 85) {
      return {
        style: "bg-amber-50 border-amber-200 text-amber-900",
        icon: <TrendingUp className="w-5 h-5 text-amber-750 shrink-0" />,
        title: "Nearing budget limit (Goldilocks Zone)",
        text: "You are at " + percentage + "% of your budget cap. This provides balanced flight comforts and solid mid-range lodging. Little cushion is left, stay alert on spontaneous shopping!",
      };
    } else {
      return {
        style: "bg-emerald-50 border-emerald-250 text-emerald-950",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />,
        title: "Optimal Cushion Zone",
        text: "Excellent budget buffer of " + (limit - total) + " USD remains! This lets you purchase souvenir gifts, try a gourmet luxury dinner, or book a premium tour extension on the fly.",
      };
    }
  };

  const advice = getAIAdvice();

  return (
    <div className="bg-white border border-brand-border rounded-[24px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-serif text-brand-ink tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-sage" />
            AI Budget Optimizer
          </h3>
          <p className="text-xs text-brand-charcoal/80 mt-0.5">Balance your expenses and fine-tune your vacation goals</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#5A5A40] font-mono block uppercase tracking-widest font-bold">Target Cap</span>
          <div className="flex items-center gap-1.5 justify-end">
            <DollarSign className="w-3.5 h-3.5 text-[#5A5A40]" />
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Math.max(100, parseInt(e.target.value) || 0))}
              className="w-22 bg-[#fcfcfa] border border-brand-border focus:border-brand-sage text-brand-ink rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-sage font-mono"
            />
          </div>
          {currency !== "usd" && (
            <span className="block text-[9px] font-mono font-bold text-brand-sage mt-1">
              ≈ ₹{Math.round(limit * USD_TO_INR).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Area (8 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Flights */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-brand-charcoal font-semibold font-sans">✈️ Airline / Transport</span>
              <span className="text-brand-ink font-mono font-bold">{formatPrice(flights)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="50"
              value={flights}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFlights(val);
                handleSliderChange("flights", val);
              }}
              className="w-full h-1.5 rounded-lg bg-[#f5f5f0] accent-brand-sage border border-brand-border cursor-pointer"
            />
          </div>

          {/* Lodging */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-brand-charcoal font-semibold font-sans">🏨 Hotels / Accommodations</span>
              <span className="text-brand-ink font-mono font-bold">{formatPrice(hotels)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="50"
              value={hotels}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setHotels(val);
                handleSliderChange("hotels", val);
              }}
              className="w-full h-1.5 rounded-lg bg-[#f5f5f0] accent-[#7A7A5A] border border-brand-border cursor-pointer"
            />
          </div>

          {/* Dining */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-brand-charcoal font-semibold font-sans">🍣 Food, Fine dining & Drinks</span>
              <span className="text-brand-ink font-mono font-bold">{formatPrice(dining)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              step="20"
              value={dining}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setDining(val);
                handleSliderChange("dining", val);
              }}
              className="w-full h-1.5 rounded-lg bg-[#f5f5f0] accent-[#5A5A40] border border-brand-border cursor-pointer"
            />
          </div>

          {/* Activities */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-brand-charcoal font-semibold font-sans">🎡 Tours, Safaris & Admissions</span>
              <span className="text-brand-ink font-mono font-bold">{formatPrice(activities)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              step="20"
              value={activities}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setActivities(val);
                handleSliderChange("activities", val);
              }}
              className="w-full h-1.5 rounded-lg bg-[#f5f5f0] accent-[#9A9A75] border border-brand-border cursor-pointer"
            />
          </div>
        </div>

        {/* Visual gauge area (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center border-l border-brand-border pl-0 lg:pl-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="58" strokeWidth="8" stroke="#f5f5f0" fill="transparent" />
              <motion.circle
                cx="72"
                cy="72"
                r="58"
                strokeWidth="8"
                stroke={isOverBudget ? "#dc2626" : percentage > 85 ? "#d97706" : "#4A7055"}
                fill="transparent"
                strokeDasharray="364"
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * Math.min(percentage, 100)) / 100 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute text-center">
              <h4 className="text-3xl font-bold text-brand-ink font-mono block">
                {percentage}%
              </h4>
              <span className="text-[10px] text-brand-charcoal uppercase tracking-widest font-mono">Consumed</span>
            </div>
          </div>

          <div className="text-center mt-3 space-y-0.5 font-sans">
            <p className="text-xs text-brand-charcoal">Total Simulated Expenses</p>
            <p className="text-xl font-bold text-brand-ink font-mono">
              {formatPrice(total)} <span className="text-xs font-normal text-brand-charcoal">/ {formatPrice(limit)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Advice Alert Panel */}
      <div className={`mt-6 p-4 rounded-xl border flex gap-3 items-start transition-all ${advice.style}`}>
        {advice.icon}
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider">{advice.title}</h4>
          <p className="text-xs text-brand-ink leading-relaxed font-sans font-medium">{advice.text}</p>
        </div>
      </div>
    </div>
  );
}
