"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Building2, Star, IndianRupee, MapPin, Wifi, Car, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";

interface Hotel {
  _id: string; name: string; location: string; city: string; image: string; rating: number;
  amenities: string[]; pricePerNight: number; description: string;
}

export default function HotelSearchPage() {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (city) params.set("city", city);
      const res = await fetch(`/api/hotels?${params}`);
      setHotels(await res.json());
    } catch { toast.error("Failed to search hotels"); } finally { setLoading(false); }
  };

  const handleBook = async (hotel: Hotel) => {
    if (!session) { router.push("/login"); return; }
    if (!checkIn || !checkOut) { toast.error("Please select check-in and check-out dates"); return; }
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) { toast.error("Check-out must be after check-in"); return; }
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "hotel", hotelName: hotel.name, location: hotel.location, checkIn, checkOut, guests, price: hotel.pricePerNight * nights * guests }) });
      if (res.ok) { toast.success("Hotel booked!"); router.push("/my-trips"); } else toast.error("Booking failed");
    } catch { toast.error("Something went wrong"); }
  };

  const amenityIcon = (a: string) => {
    if (a.toLowerCase().includes("wi-fi") || a.toLowerCase().includes("wifi")) return <Wifi size={14} />;
    if (a.toLowerCase().includes("parking")) return <Car size={14} />;
    if (a.toLowerCase().includes("gym")) return <Dumbbell size={14} />;
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Hotels</h1>

        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Jaipur" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guests</label>
              <input type="number" value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} min={1} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={loading} className="w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                <Search size={18} />{loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((h) => (
            <div key={h._id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="relative h-48">
                <Image src={h.image || "/images/mumbai2.jpg"} alt={h.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Star size={12} />{h.rating}</div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{h.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-3"><MapPin size={14} />{h.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {h.amenities.slice(0, 4).map((a) => (
                    <span key={a} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg text-xs flex items-center gap-1">{amenityIcon(a)}{a}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={16} />{h.pricePerNight.toLocaleString()}<span className="text-xs text-gray-500 font-normal ml-1">/night</span></p>
                  <button onClick={() => handleBook(h)} className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {searched && !loading && hotels.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No hotels found</p>
          </div>
        )}
        {!searched && (
          <div className="text-center py-16 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Search for hotels</p>
            <p className="text-sm mt-2">Enter your destination to find available hotels</p>
          </div>
        )}
      </div>
    </div>
  );
}
