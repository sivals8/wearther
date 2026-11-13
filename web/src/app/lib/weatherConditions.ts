import {
    Sun,
    Moon,
    Cloud,
    CloudSun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
    CloudDrizzle,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface WeatherCondition {
    condition: string;
    icon: LucideIcon;
}

export function getWeatherCondition(code: number, isDay: boolean): WeatherCondition {
    if (code === 0) {
      return {
        condition: isDay ? "Clear" : "Clear Night",
        icon: isDay ? Sun : Moon,
      };
    }
  
    if (code === 1 || code === 2) {
      return {
        condition: "Partly Cloudy", 
        icon: isDay ? CloudSun : Cloud,
      };
    }
  
    if (code === 3) {
      return {
        condition: "Cloudy",
        icon: Cloud,
      };
    }
  
    if (code === 45 || code === 48) {
      return {
        condition: "Foggy",
        icon: CloudFog,
      };
    }
  
    if (code === 51 || code === 53 || code === 55) {
      return {
        condition: "Light Rain",
        icon: CloudDrizzle,
      };
    }
  
    if (code === 56 || code === 57 || code === 66 || code === 67 ) {
      return {
        condition: "Freezing Rain",
        icon: CloudRain,
      };
    }
  
    if (code === 61 || code === 63) {
      return {
        condition: "Rain",
        icon: CloudRain,
      };
    }
  
    if (code === 65) {
      return {
        condition: "Heavy Rain",
        icon: CloudRain,
      };
    }
  
    if (code >= 71 && code <= 77) {
      return {
        condition: "Snowy",
        icon: CloudSnow,
      };
    }
  
    if (code >= 80 && code <= 82) {
      return {
        condition: "Rainy",
        icon: CloudRain,
      };
    }
  
    if (code === 85 || code === 86) {
      return {
        condition: "Snowy",
        icon: CloudSnow,
      };
    }
    if (code >= 95 && code <= 99) {
      return {
        condition: "Thunderstorm",
        icon: CloudLightning,
      };
    }
  
    return {
      condition: "Cloudy",
      icon: Cloud,
    };
  
  }