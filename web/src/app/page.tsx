import {
  CalendarDays,
  CloudSun,
  MapPin,
  PlusCircle,
  Shirt,
  CloudSunRain,
  CloudRain,
  CloudRainWind,
  Clock,
} from "lucide-react";

import { getWeather } from "./lib/weather";
import { getWeatherCondition} from "./lib/weatherConditions";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import LocationMenu from "./components/LocationMenu";
import Link from "next/link";

//fetch weather data based on search
interface HomeProps {
  searchParams: Promise<{
    lat?: string;
    lon?: string;
    city?: string;
  }>;
}

export default async function Home({searchParams}: HomeProps) {

  //fetch latest weather data
  const params = await searchParams;

  //if no location selected, default to hammy for now, live location weather later
  const latitude = params.lat ? Number(params.lat) : 43.2557;
  const longitude = params.lon ? Number(params.lon) : -79.8711;
  const cityName = params.city || "Hamilton";

  const weather = await getWeather(latitude, longitude);

  //extract current info
  const temperature = Math.round(weather.current.temperature_2m);
  const feelsLike = Math.round(weather.current.apparent_temperature);
  const weatherCode = weather.current.weather_code;
  const isDay = weather.current.is_day === 1;
  const currentWeather = getWeatherCondition(weatherCode, isDay);
  const CurrentWeatherIcon = currentWeather.icon;

  //hourly mapping
  const currentHour = weather.current.time.substring(0,13);
  const currentHourIndex = weather.hourly.time.findIndex((time) => {
    return time.startsWith(currentHour);
  });

  const hourlyWeather = weather.hourly.time.slice(0, currentHourIndex === -1 ? 24 : currentHourIndex + 13).map((time, index) => {
    return {
      time: time,
      temperature: Math.round(weather.hourly.temperature_2m[index]),
      weatherCode: weather.hourly.weather_code[index],
      isDay: weather.hourly.is_day[index] === 1,
    };
  });

  const dailyWeather = weather.daily.time.map((time, index) => {
    return {
      time: time,
      maxTemperature: Math.round(weather.daily.temperature_2m_max[index]),
      minTemperature: Math.round(weather.daily.temperature_2m_min[index]),
      weatherCode: weather.daily.weather_code[index],
    };
  })


  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/rainybg.jpg')",
      }}
    >
      <div>
        {/*location */}
        <div className="relative mx-auto w-full max-w-md flex-col pt-4 lg:max-w-3xl">
          <div className="flex min-w-0 items-center justify-center gap-2">
            <div className = "relative z-30 shrink-0">
            <LocationMenu cityName= {cityName} />
            </div>
            
          </div>
          
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-md flex-col px-6 pt-4 pb-8 lg:max-w-3xl">
          
          {/*Greeting */}
          <h2 className="text-xl sm:text-2xl">
            Good Morning!
          </h2>
          {/* Temperature */}
          <div>
            <p className="text-sm mt-2 font-medium">Today's Weather</p>

            <h3 className="mt-2 text-[100px] text-shadow-lg text-shadow-orange-100 font-light leading-none">
              {temperature}º
            </h3>

            <p className="mt-3 text-xl font-bold">
              {currentWeather.condition}
            </p>

            <p className="mt-2 text-lg">
              Feels like: {feelsLike}°
            </p>
          </div>

          {/*Hourly Forecast*/}
          <HourlyForecast
            hourlyWeather={hourlyWeather}
            currentHourIndex={currentHourIndex}
          />

          {/* Outfit Recommendation */}
          <div className = "mt-auto w-full pt-12">
            <div className="liquid-glass relative mx-auto rounded-2xl p-5">
              <div className="flex items-center gap-2 text-white">
                  <Shirt className = "h-5 w-5"/>
                  <span className = "text-md font-bold">
                    What Should I Wear?</span>
              </div>
              <div className = "mt-3 text-xl font-bold text-pink-200">
                Hoodie + Light Jacket
              </div>
              <div className = "mt-2 text-sm font-light text-white">
                You wore a hoodie and light jacket at 10ºC last week and rated it comfortable.
              </div>

            </div>
          </div>

          {/*Buttons at Bottom*/}
          <div className = "grid grid-cols-2 pt-6 gap-4">
            <div className = "liquid-glass button grid grid-rows-2 place-items-center gap-2 rounded-3xl text-white active:scale-95 active:brightness-120 transition-all duration-200">
              <PlusCircle className = "w-5 h-5  text-white"/>
              <span className = "text-sm  text-white">Log Outfit</span>

            </div>
            <div className = "liquid-glass button grid grid-rows-2 place-items-center gap-2 rounded-3xl text-white active:scale-95 active:brightness-120 transition-all duration-200">
              <CalendarDays className = "w-5 h-5  text-white"/>
              <span className = "text-sm  text-white">Past Days</span>

            </div>
          </div>

          {/*Daily Forecast */}
          <DailyForecast dailyWeather={dailyWeather} />

      </div>
    </main>
  );
}
