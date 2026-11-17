import Link from "next/link";
import {getWeather} from "../../lib/weather";
import { getWeatherCondition } from "../../lib/weatherConditions";
import { ArrowLeft, MapPin } from "lucide-react";


//take date from url path thats getting passed on
//coords come from the url quert parameters

interface ForecastPageProps {
    params: Promise<{
        date:string;
    
    }>;

    searchParams: Promise<{
        lat?: string;
        lon?: string;
        city?: string;
    }>;
}

export default async function ForecastPage({
    params,
    searchParams,
}: ForecastPageProps) {
    //read the selected date from daily forecast and the current location
    const {date} = await params;
    const location = await searchParams;

    //default to hammy for now if missing/invalid
    const parsedLatitude = Number(location.lat);
    const parsedLongitude = Number(location.lon);

    const latitude = 
        location.lat !== undefined &&
        Number.isFinite(parsedLatitude) &&
        parsedLatitude >=-90 &&
        parsedLatitude <= 90
        ? parsedLatitude
        : 43.2557;

    const longitude = 
        location.lon !== undefined &&
        Number.isFinite(parsedLongitude) &&
        parsedLongitude >=-90 &&
        parsedLongitude <= 90
        ? parsedLongitude
        : 43.2557;

    const cityName = location.city || "Hamilton";

    //fetch the citys weather
    const weather = await getWeather(latitude, longitude);

    //find the selected date in the daily forecast
    const dayIndex = weather.daily.time.findIndex((day) => {
        return day === date;
    });

    //preserve the location we go back to dashboard
    const query = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        city: cityName,
    });

    const backUrl = `/?${query.toString()}`;

    //handle dates that are not in the available forecast
    if (dayIndex == -1) {
        return (
            <main className = "flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6">
                <h1 className = "text-2xl font-bold">Forecast Unavailable</h1>

                <p className = "text-center text-white/70">
                    Weather data is not available for this date.
                </p>

                <Link href = {backUrl} className = "underline">
                    Back to Dashboard
                </Link>
            </main>
        );
    }

     // extract the selected day's weather
    const maxTemperature = Math.round(
        weather.daily.temperature_2m_max[dayIndex]
    );

    const minTemperature = Math.round(
        weather.daily.temperature_2m_min[dayIndex]
    );

    const weatherCode = weather.daily.weather_code[dayIndex];
    
    //get weather condtion + icons u need
    const dailyCondition = getWeatherCondition(weatherCode, true);
    const WeatherIcon = dailyCondition.icon;

    //format the date into readable heading
    const formattedDate = new Date(
        date + "T12:00:00"
    ).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    
    return (
        <main 
            className = "min-h-screen bg-cover bg-enter bg-no-repeat text-white"
            style={{
                backgroundImage: "url('/images/rainybg.jpg')",
            }}
        >
            <div className = "mx-auto min-h-screen w-full max-w-md px-6 pt-8 pb-10 lg:max-w-3xl">
                {/*Back Button */}
                <Link
                    href = {backUrl}
                    className = "inline-flex items-center gap-2 text-sm text-white"
                >
                    <ArrowLeft className = "h-5 w-5" />
                    Back
                </Link>

                {/* date and location */}
                <div className = "mt-10">
                    <div className = "flex items-center gap-2">
                        <MapPin className = "h-5 w-5" />
                        <span className = "text-sm">{cityName}</span>
                    </div>

                    <h1 className = "mt-4 text-3xl font-bold">
                        {formattedDate}
                    </h1>
                </div>

                {/*Selected Days weather */}
                <div className = "liquid-glass mt-8 rounded-2xl p-6">
                    <div className = "flex items-center justify-between">
                        <div>
                            <p className = "text-lg font-bold">
                                {dailyCondition.condition}
                            </p>

                            <p className = "mt-2 text-sm text-white/70">
                                Daily Forecast
                            </p>
                        </div>

                        <WeatherIcon className = "h-12 w-12" />


                        {/*High and low temps */}
                        <div className = "mt-8 grid grid-cols-2 gap-4">
                            <div className = "rounded-xl bg-white/10 p-4">
                                <p className = "text-sm text-white/70">High</p>
                                <p className = "mt-2 text-3xl font-bold">
                                    {maxTemperature}º
                                </p>
                            </div>

                            <div className = "rounded-xl bg-white/10 p-4">
                                <p className = "text-sm text-white/70">Low</p>
                                <p className = "mt-2 text-3xl font-bold">
                                    {minTemperature}º
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
    
    
}