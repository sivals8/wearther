"use client";

import { useEffect, useState } from "react";
import { Menu, MapPin, Search } from "lucide-react";
import { searchCities, type City } from "../lib/geocoding";
import { useRouter } from "next/navigation";

//button not working when opened on phone
import { createPortal } from "react-dom";

// Props passed from the homepage
interface LocationMenuProps {
  cityName: string;
}

export default function LocationMenu({cityName}: LocationMenuProps) {
  // Track whether the menu is open
  const [isOpen, setIsOpen] = useState(false);
  //store what they type
  const [query, setQuery] = useState("");
  //store matching ciies that open-meteo
  const [cities, setCities] = useState<City[]>([]);
  
  //track if search is actually loading
  const [isLoading,setIsLoading] = useState(false);

  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  

  useEffect(()=> {
    //don't search when menu closed or search len too short
    if (!isOpen || query.trim().length < 3) {
        return;
    }

    let cancelled = false;

    //wait 300ms adter typing before making request
    const timeout = setTimeout(async () => {
        setIsLoading(true);
        try {
            const results = await searchCities(query);

            //only update results if this search is still current
            if (!cancelled) {
                setCities(results);
            }
        } catch (error) {
            console.error("Error searching cities:", error);

            if(!cancelled) {
                setCities([]);
            }  
        } finally {
            if (!cancelled) {
                setIsLoading(false);
            }
        }
    }, 300);

    //cancel the previous search 
    return () => {
        cancelled = true;
        clearTimeout(timeout);
    };
  }, [query, isOpen]);

  //city selection handling
    function handleCitySelect(city: City) {
      //store the selected city's information in the URL
      const params = new URLSearchParams();

      params.set("lat", city.latitude.toString());
      params.set("lon", city.longitude.toString());
      params.set("city", city.name);

      //close menu clear searck they made
      setIsOpen(false);
      setQuery("");
      setCities([]);

      // navigate to the dashboard with the selected location
      router.push(`/?${params.toString()}`);
      
    }

  return (
    <div>
      {/* switch location button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center text-white active:scale-95 liquid-glass rounded-xl p-2 gap-1"
        aria-label="Open location menu"
        aria-expanded={isOpen}
      >
        <div>
          <MapPin className = "h-3.5 w-3.5" />
        </div>
        <span className="min-w-0 truncate text-right text-xs font-light tracking-widest">
          {cityName}
        </span>
        
      </button>

      {/* Only display the overlay when the menu is open */}
      {isOpen && (
        <div className="fixed inset-0 z-50">

          {/* Background overlay: tap outside to close */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Location panel covering the top half of the screen */}
          <div className="liquid-glass-light absolute inset-x-0 top-0 z-10 flex h-[50dvh] flex-col overflow-hidden rounded-b-3xl p-6 text-white shadow-2xl">

            <h2 className="mt-8 text-2xl font-bold">
              Locations
            </h2>

            {/* City search */}
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3">
              <Search className="h-5 w-5" />

              <input
                type="text"
                value = {query}
                onChange = {(event) => {
                    const newQuery = event.target.value;

                    setQuery(newQuery);
                    setCities([]);

                    if (newQuery.trim().length < 3) {
                        setIsLoading(false);
                    }
                }}
                placeholder="Search for a city..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
              />
            </div>


            {/*Search Results */}
            <div className = "mt-3 max-h-48 space-y-2 overflow-y-auto overscroll-contain">
                {/*show loading message */}
                {isLoading && (
                    <p className = "text-sm text-white/60">
                        Searching...
                    </p>
                )}

                {/*display matching cities */}
                {!isLoading && cities.map((city) => {
                    return (
                        <button 
                        key = {city.id}
                        type = "button"
                        onClick={() => handleCitySelect(city)}
                        className = "flex w-full items-center gap-3 rounded-xl bg-white/10 p-3 text-left text-white hover:bg-white/20"
                        >
                            <MapPin className = "h-4 w-4 shrink-0" />

                            <div>
                                <p className = "text-sm font-medium">{city.name}</p>
                                <p className = "text-xs text-white/60">
                                    {city.admin1 ? `${city.admin1}, ` : ""}
                                    {city.country}
                                </p>
                            </div>
                        </button>
                    );
                    
                })}

                {/*if theres no matching cities */}
                {!isLoading && query.trim().length >= 3 && cities.length === 0 && (
                    <p className = "text-sm text-white/60">
                        No locations found.
                    </p>
                )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}