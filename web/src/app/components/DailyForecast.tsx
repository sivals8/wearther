
"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, Shirt } from "lucide-react";
import { getWeatherCondition } from "../lib/weatherConditions";

// weather info passed from page.tsx
interface DailyWeather {
  time: string;
  maxTemperature: number;
  minTemperature: number;
  weatherCode: number;
}

interface DailyForecastProps {
  dailyWeather: DailyWeather[];
}

// temporary outfit suggestions based on daily temperatures
function getOutfitRecommendation(high: number, low: number): string {
  if (high <= 5) {
    return "Winter coat + warm sweater + long pants";
  }

  if (high <= 12) {
    return "Warm jacket + hoodie + jeans";
  }

  if (high <= 20) {
    return "Light jacket + T-shirt + jeans";
  }

  return "T-shirt + shorts + comfortable shoes";
}

export default function DailyForecast({ dailyWeather }: DailyForecastProps) {
  // store the currently expanded day
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  function handleDayClick(index: number) {
    // close the day if it is already expanded
    if (selectedDay === index) {
      setSelectedDay(null);
    } else {
      setSelectedDay(index);
    }
  }

  return (
    <div className="mt-auto w-full pt-12">
      <div className="liquid-glass relative mx-auto rounded-2xl p-4">

        {/* forecast heading */}
        <div className="flex items-center gap-2 text-white">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm font-bold">Daily Forecast</span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {dailyWeather.map((day, index) => {
            // format the date
            const date = new Date(day.time + "T12:00:00");

            const dayName =
              index === 0
                ? "Today"
                : date.toLocaleDateString("en-US", {
                    weekday: "long",
                  });

            // get appropriate weather icon
            const dailyCondition = getWeatherCondition(
              day.weatherCode,
              true
            );

            const WeatherIcon = dailyCondition.icon;
            const isExpanded = selectedDay === index;

            return (
              <div
                key={day.time}
                className={`rounded-xl transition-colors ${
                  isExpanded || index === 0 ? "bg-white/15" : ""
                }`}
              >
                {/* forecast that can be clicked */}
                <button
                  type="button"
                  onClick={() => handleDayClick(index)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm text-white"
                >
                  <span className="w-24 text-left">{dayName}</span>

                  <WeatherIcon className="h-5 w-5" />

                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {day.maxTemperature}°
                    </span>

                    <span className="text-white/60">
                      {day.minTemperature}°
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-250 ease-in-out ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* expanded details regarding high lows and recommendation */}
                
                <div className={`grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.45,0.25,0.40,0.65)] ${
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}>

                <div className = "min-h-0 overflow-hidden">

                <div
                    className={`px-3 text-white transition-all duration-500 ease-[cubic-bezier(0.45,0.25,0.40,0.65))] ${
                        isExpanded ? "pt-2 pb-1 opacity-100" : "pt-0 pb-0 opacity-0"
                    }`}
                >
                    

                        <div className="border-t border-white/20 pt-3">

                            {/* high and low temperatures */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-white/60">
                                    High
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {day.maxTemperature}°C
                                </p>
                                </div>

                                <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-white/60">
                                    Low
                                </p>
                                <p className="mt-1 text-2xl font-bold">
                                    {day.minTemperature}°C
                                </p>
                                </div>
                            </div>

                            {/* fit recommendation */}
                            <div className="flex items-center mt-3 rounded-xl bg-white/10 p-3 mb-3 gap-2">
                                <div>
                                    <Shirt className=" h-4 w-4" />
                                </div>
                                <p className="text-sm text-pink-200">
                                    {getOutfitRecommendation(
                                        day.maxTemperature,
                                        day.minTemperature
                                    )}
                                </p>

            
                            </div>

                        </div>

                    </div>
                </div>
                </div>
                
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
