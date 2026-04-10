"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plane, Building2, MapPin, Car, Calendar, Users, IndianRupee } from "lucide-react";

interface BookingData {
  flights: Array<{ _id: string; flightNumber: string; departure: string; arrival: string; date: string; passengers: number; price: number; status: string; createdAt: string }>;
  hotels: Array<{ _id: string; hotelName: string; location: string; checkIn: string; checkOut: string; guests: number; price: number; status: string; createdAt: string }>;
  packages: Array<{ _id: string; packageName: string; destination: string; startDate: string; travelers: number; price: number; status: string; createdAt: string }>;
  cabs: Array<{ _id: string; cabName: string; cabType: string; pickupLocation: string; pickupDateTime: string; passengers: number; price: number; status: string; createdAt: string }>;
}

export default function MyTripsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"flights" | "hotels" | "packages" | "cabs">("flights");

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/bookings").then((r) => r.json()).then(setBookings).catch(() => {}).finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>;

  const tabs = [
    { key: "flights" as const, label: "Flights", icon: Plane, count: bookings?.flights.length || 0 },
    { key: "hotels" as const, label: "Hotels", icon: Building2, count: bookings?.hotels.length || 0 },
    { key: "packages" as const, label: "Packages", icon: MapPin, count: bookings?.packages.length || 0 },
    { key: "cabs" as const, label: "Cabs", icon: Car, count: bookings?.cabs.length || 0 },
  ];

  const statusColor = (s: string) => s === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : s === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Trips</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition whitespace-nowrap ${tab === t.key ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black shadow-lg" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <t.icon size={18} />{t.label} <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          {tab === "flights" && bookings?.flights.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl"><Plane size={24} className="text-blue-500" /></div>
                <div>
                  <p className="font-bold text-lg">{b.flightNumber}</p>
                  <p className="text-gray-500 text-sm">{b.departure} → {b.arrival}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={14} />{b.date}</span>
                <span className="flex items-center gap-1"><Users size={14} />{b.passengers}</span>
                <span className="flex items-center gap-1 font-bold text-lg text-gray-900 dark:text-white"><IndianRupee size={14} />{b.price.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}

          {tab === "hotels" && bookings?.hotels.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl"><Building2 size={24} className="text-purple-500" /></div>
                <div><p className="font-bold text-lg">{b.hotelName}</p><p className="text-gray-500 text-sm">{b.location}</p></div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>{b.checkIn} → {b.checkOut}</span>
                <span className="flex items-center gap-1"><Users size={14} />{b.guests}</span>
                <span className="flex items-center gap-1 font-bold text-lg text-gray-900 dark:text-white"><IndianRupee size={14} />{b.price.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}

          {tab === "packages" && bookings?.packages.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl"><MapPin size={24} className="text-green-500" /></div>
                <div><p className="font-bold text-lg">{b.packageName}</p><p className="text-gray-500 text-sm">{b.destination}</p></div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={14} />{b.startDate}</span>
                <span className="flex items-center gap-1"><Users size={14} />{b.travelers}</span>
                <span className="flex items-center gap-1 font-bold text-lg text-gray-900 dark:text-white"><IndianRupee size={14} />{b.price.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}

          {tab === "cabs" && bookings?.cabs.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl"><Car size={24} className="text-orange-500" /></div>
                <div><p className="font-bold text-lg">{b.cabName} ({b.cabType})</p><p className="text-gray-500 text-sm">{b.pickupLocation}</p></div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Users size={14} />{b.passengers}</span>
                <span className="flex items-center gap-1 font-bold text-lg text-gray-900 dark:text-white"><IndianRupee size={14} />{b.price.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}

          {bookings && bookings[tab].length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No {tab} bookings yet</p>
              <p className="text-sm mt-2">Start exploring and book your next trip!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
