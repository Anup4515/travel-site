"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Star, MapPin, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface Restaurant {
  name: string; rating: number | null; reviewCount: number; address: string;
  distance: string; photo: string; mapsLink: string; isOpen: boolean | null;
}

const cities = ["Delhi", "Agra", "Jaipur"];
const popularDishes: Record<string, string[]> = {
  Delhi: ["Butter Chicken", "Chole Bhature", "Paratha", "Jalebi", "Biryani"],
  Agra: ["Petha", "Bedai", "Jalebi", "Mughlai Cuisine", "Dalmoth"],
  Jaipur: ["Dal Baati Churma", "Laal Maas", "Ghevar", "Pyaaz Kachori", "Gatte Ki Sabzi"],
};

export default function RestaurantsPage() {
  const [city, setCity] = useState("");
  const [dish, setDish] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !dish) { toast.error("Please select a city and dish"); return; }
    setLoading(true);
    setSearched(true);
    try {
      const slug = dish.toLowerCase().replace(/\s+/g, "-");
      const res = await fetch(`/api/restaurants?city=${city.toLowerCase()}&dish=${slug}`);
      setRestaurants(await res.json());
    } catch { toast.error("Failed to search"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Find Restaurants</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Discover the best places to eat across Delhi, Agra, and Jaipur</p>

        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <select value={city} onChange={(e) => { setCity(e.target.value); setDish(""); }} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select City</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dish / Cuisine</label>
              <select value={dish} onChange={(e) => setDish(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Dish</option>
                {city && popularDishes[city]?.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={loading} className="w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                <Search size={18} />{loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((r, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                <Image src={r.photo} alt={r.name} fill className="object-cover" />
                {r.isOpen !== null && (
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${r.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {r.isOpen ? "Open" : "Closed"}
                  </div>
                )}
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-bold text-lg mb-1">{r.name}</h3>
                {r.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-sm font-bold">
                      <Star size={12} />{r.rating}
                    </div>
                    <span className="text-gray-500 text-sm">({r.reviewCount} reviews)</span>
                  </div>
                )}
                <p className="text-gray-500 text-sm flex items-start gap-1 mb-2"><MapPin size={14} className="shrink-0 mt-0.5" />{r.address}</p>
                <p className="text-gray-500 text-sm mb-3">{r.distance} from city center</p>
                <a href={r.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 dark:text-yellow-400 text-sm font-medium hover:underline">
                  View on Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {searched && !loading && restaurants.length === 0 && (
          <div className="text-center py-16 text-gray-500"><p className="text-lg">No restaurants found</p></div>
        )}
        {!searched && (
          <div className="text-center py-16 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Select a city and dish to find restaurants</p>
          </div>
        )}
      </div>
    </div>
  );
}
