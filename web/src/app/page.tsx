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


export default async function Home() {

  //fetch weather data (hamilton)
  const latitude = 43.2557;
  const longitude = -79.8711;

  //fetch latest weather data
  const weather = await getWeather(latitude, longitude);

  //extract current info
  const temperature = Math.round(weather.current.temperature_2m);
  const feelsLike = Math.round(weather.current.apparent_temperature);
  const weatherCode = weather.current.weather_code;
  const isDay = weather.current.is_day === 1;
  const currentWeather = getWeatherCondition(weatherCode, isDay);
  const CurrentWeatherIcon = currentWeather.icon;

  //hourly mapping
  const hourlyWeather = weather.hourly.time.slice(0, 24).map((time, index) => {
    return {
      time: time,
      temperature: Math.round(weather.hourly.temperature_2m[index]),
      weatherCode: weather.hourly.weather_code[index],
      isDay: weather.hourly.is_day[index] === 1,
    };
  });

  const currentHour = weather.current.time.substring(0,13);
  const currentHourIndex = hourlyWeather.findIndex((hour) => {
    return hour.time.startsWith(currentHour);
  });

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/rainybg.jpg')",
      }}
    >
      <div className=" relative mx-auto w-full max-w-md flex-col px-6 pt-8 pb-8 lg:max-w-3xl">

        {/*Greeting and Location */}
          <div className = "grid grid-cols-2 items-center place-content-center">
            <h2 className = "flex align-bottom gap-2 text-xl sm:text-2xl">
              Good Morning!
            </h2>
            {/* Location */} 
            <div className="flex place-content-end gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-md font-light tracking-[0.12em] sm:tracking-[0.2em]">Hamilton</span>
            </div>
          </div>
          

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
          <div className = "mt-auto w-full pt-12">
            <div className="liquid-glass relative mx-auto rounded-2xl p-4">
              <div className="flex items-center gap-2 text-white">
                  <CalendarDays className = "h-4 w-4"/>
                  <span className = "text-sm font-bold">
                    Daily Forecast</span>
              </div>
              <div className = "grid grid-rows-7 mt-2 gap-2">
                <div className = "flex line justify-between text-sm text-white">
                  <span>Today</span>
                  <span>12º</span>
                </div>
                <div className = "flex line justify-between text-sm text-white">
                  <span>Saturday</span>
                  <span>6º</span>
                </div>
                <div className = "flex line justify-between text-sm text-white">
                  <span>Sunday</span>
                  <span>8º</span>
                </div>
                <div className = "flex line justify-between text-sm text-white">
                  <span>Monday</span>
                  <span>11º</span>
                </div>
                <div className = "flex line justify-between text-sm text-white">
                  <span>Tuesday</span>
                  <span>14º</span>
                </div>
                <div className = "flex line justify-between text-sm text-white">
                  <span>Wednesday</span>
                  <span>9º</span>
                </div>
                <div className = "flex justify-between text-sm text-white">
                  <span>Thursday</span>
                  <span>13º</span>
                </div>
                
              </div>
              

            </div>
          </div>

          


      </div>
    </main>
  );
}
