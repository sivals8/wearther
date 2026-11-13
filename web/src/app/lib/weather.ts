
export interface WeatherData {
    current: {
      time: string;
      temperature_2m: number;
      apparent_temperature: number;
      weather_code: number;
      is_day: number;
    };
  
    hourly: {
      time: string[];
      temperature_2m: number[];
      weather_code: number[];
      is_day: number[];
    };
  
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      weather_code: number[];
    };
}

//fetch weather for given location
export async function getWeather(
    latitude: number,
    longitude: number
): Promise<WeatherData> {
    const url = new URL(
        "https://api.open-meteo.com/v1/forecast"
    );

    url.searchParams.set("latitude", latitude.toString());
    url.searchParams.set("longitude", longitude.toString());
    
    url.searchParams.set(
        "current",
        "temperature_2m,apparent_temperature,weather_code,is_day"
    );

    url.searchParams.set(
        "hourly",
        "temperature_2m,weather_code,is_day"
    );

    url.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min,weather_code"
    );

    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "7");

    const response = await fetch(url.toString(), {
        next: { 
            revalidate: 900,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch weather data")
    }

    const data: WeatherData = await response.json();


    return data;
}