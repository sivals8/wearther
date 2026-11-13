"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { getWeatherCondition } from "../lib/weatherConditions";


interface HourlyForecastData {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

interface HourlyForecastProps {
  hourlyWeather: HourlyForecastData[];
  currentHourIndex: number;
}

export default function HourlyForecast({
  hourlyWeather,
  currentHourIndex,
}: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the current hour when the component loads
    const container = scrollRef.current;

    if (container === null) {
      return;
    }

    const currentHourElement = container.children[
      currentHourIndex
    ] as HTMLElement | undefined;

    if (currentHourElement === undefined) {
      return;
    }

    // Place the current hour near the beginning of the card
    container.scrollLeft = currentHourElement.offsetLeft - container.offsetLeft;
  }, [currentHourIndex]);

  return (
    <div className="mt-auto w-full pt-12">
      <div className="liquid-glass relative mx-auto rounded-2xl p-5">

        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-bold">
            Hourly Forecast
          </span>
        </div>

        {/* Scrollable hourly forecast */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3"
        >
          {hourlyWeather.map((hour, index) => {
            const weather = getWeatherCondition(
              hour.weatherCode,
              hour.isDay
            );

            const WeatherIcon = weather.icon;

            const hourNumber = Number(hour.time.substring(11, 13));
            const hourLabel = hourNumber % 12 || 12;
            const period = hourNumber >= 12 ? "PM" : "AM";

            return (
              <div
                key = {hour.time}
                className = {`flex min-w-[54px] shrink-0 flex-col items-center gap-3 rounded-xl px-2 py-3 ${
                  index === currentHourIndex
                    ? "bg-white/20"
                    : ""
                }`}
              >
                <span className = "whitespace-nowrap text-xs">
                  {index === currentHourIndex
                    ? "Now"
                    : `${hourLabel} ${period}`}
                </span>

                <WeatherIcon className="h-6 w-6" />

                <span className="text-sm font-bold">
                  {hour.temperature}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}