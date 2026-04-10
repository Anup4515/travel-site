"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Plane, Clock, IndianRupee, Users } from "lucide-react";
import toast from "react-hot-toast";

interface Flight {
  _id: string; flightNumber: string; airline: string; airlineLogo: string; from: string; to: string;
  departureTime: string; arrivalTime: string; duration: string; price: number; stops: number; class: string;
}

export default function FlightSearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flights, setFlights] = useState<Flight[]>([]);
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
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await fetch(`/api/flights?${params}`);
      const data = await res.json();
      setFlights(data);
    } catch { toast.error("Failed to search flights"); } finally { setLoading(false); }
  };

  const handleBook = async (flight: Flight) => {
    if (!session) { router.push("/login"); return; }
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "flight", flightNumber: flight.flightNumber, departure: flight.from, arrival: flight.to, date: date || new Date().toISOString().split("T")[0], passengers, price: flight.price * passengers }) });
      if (res.ok) { toast.success("Flight booked successfully!"); router.push("/my-trips"); }
      else toast.error("Booking failed");
    } catch { toast.error("Something went wrong"); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Flights</h1>

        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="New Delhi" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Mumbai" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Passengers</label>
              <input type="number" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value) || 1)} min={1} max={9} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={loading} className="w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50">
                <Search size={18} />{loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-4">
          {flights.map((f) => (
            <div key={f._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 relative shrink-0">
                  <Image src={f.airlineLogo} alt={f.airline} fill className="object-contain" />
                </div>
                <div>
                  <p className="font-bold">{f.airline}</p>
                  <p className="text-gray-500 text-sm">{f.flightNumber} &middot; {f.class}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-center">
                <div><p className="text-2xl font-bold">{f.departureTime}</p><p className="text-gray-500 text-sm">{f.from}</p></div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} />{f.duration}</p>
                  <div className="w-24 h-px bg-gray-300 dark:bg-gray-700 my-1 relative">
                    <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 dark:text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-500">{f.stops === 0 ? "Non-stop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}</p>
                </div>
                <div><p className="text-2xl font-bold">{f.arrivalTime}</p><p className="text-gray-500 text-sm">{f.to}</p></div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={18} />{f.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1"><Users size={12} />per person</p>
                </div>
                <button onClick={() => handleBook(f)} className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">Book</button>
              </div>
            </div>
          ))}

          {searched && !loading && flights.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Plane size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No flights found</p>
              <p className="text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          )}

          {!searched && (
            <div className="text-center py-16 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Search for flights</p>
              <p className="text-sm mt-2">Enter your travel details above to find available flights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
