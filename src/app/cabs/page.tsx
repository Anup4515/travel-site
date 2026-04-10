"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Car, Users, IndianRupee, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface Cab {
  _id: string; cabName: string; cabType: string; maxSeats: number; pricePerKm: number;
  basePrice: number; extraHourCharges: number; features: string[]; image: string;
}

export default function CabsPage() {
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCab, setSelectedCab] = useState<Cab | null>(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cabs").then((r) => r.json()).then((d) => setCabs(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selectedCab || !pickup || !pickupDate) { toast.error("Please fill all required fields"); return; }
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cab", cabId: selectedCab._id, cabName: selectedCab.cabName, cabType: selectedCab.cabType, pickupLocation: pickup, dropoffLocation: dropoff, pickupDateTime: pickupDate, passengers, price: selectedCab.basePrice }) });
      if (res.ok) { toast.success("Cab booked!"); router.push("/my-trips"); setSelectedCab(null); } else toast.error("Booking failed");
    } catch { toast.error("Something went wrong"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Cab Rental</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Choose from our fleet of comfortable vehicles</p>

        {/* Booking modal */}
        {selectedCab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Book {selectedCab.cabName}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Location *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Airport, Hotel, etc." className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drop-off Location</label>
                  <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Optional" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Date & Time *</label>
                  <input type="datetime-local" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Passengers</label>
                  <input type="number" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value) || 1)} min={1} max={selectedCab.maxSeats} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Base Price</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={18} />{selectedCab.basePrice.toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedCab(null)} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
                  <button onClick={handleBook} className="flex-1 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition">Confirm Booking</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cabs.map((cab) => (
            <div key={cab._id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                <Image src={cab.image} alt={cab.cabName} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">{cab.cabType}</div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">{cab.cabName}</h3>
                <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                  <span className="flex items-center gap-1"><Users size={14} />{cab.maxSeats} seats</span>
                  <span className="flex items-center gap-1"><IndianRupee size={14} />{cab.pricePerKm}/km</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{cab.extraHourCharges}/hr extra</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cab.features.map((f) => (
                    <span key={f} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg text-xs">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={16} />{cab.basePrice.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelectedCab(cab)} className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2">
                    <Car size={16} />Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && cabs.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Car size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No cabs available</p>
            <p className="text-sm mt-2">Please seed the database first</p>
          </div>
        )}
      </div>
    </div>
  );
}
