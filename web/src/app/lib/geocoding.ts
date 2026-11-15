//city search api helper!

//the structure of a city when its returned by open-meteo
export interface City {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

//structure of response
interface GeoCodingResponse {
    results?: City[];
}

//search for cities using open-meteo geocoding api
export async function searchCities(query: string): Promise<City[]> {
    //only search after min of three letters have been entered
    if (query.trim().length < 3) {
        return [];
    }

    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

    url.searchParams.set("name", query.trim());
    url.searchParams.set("count", "5");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString());

    if(!response.ok) {
        throw new Error("Failed to search for cities");
    }

    const data: GeoCodingResponse = await response.json();

    return data.results ?? [];


}