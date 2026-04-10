"use client";

import { useState, useEffect } from "react";
import { Plane, Building2, MapPin, Car, IndianRupee } from "lucide-react";

interface Booking {
  _id: string; type: string; price: number; status: string; createdAt: string;
  userId?: { name?: string; email?: string } | string;
  flightNumber?: string; departure?: string; arrival?: string; date?: string;
  hotelName?: string; location?: string; checkIn?: string; checkOut?: string;
  packageName?: string; destination?: string; startDate?: string; travelers?: number;
  cabName?: string; pickupLocation?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/bookings").then((r) => r.json()).then(setBookings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.type === filter);

  const typeIcon: Record<string, React.ReactNode> = {
    flight: <Plane size={18} className="text-blue-500" />,
    hotel: <Building2 size={18} className="text-purple-500" />,
    package: <MapPin size={18} className="text-green-500" />,
    cab: <Car size={18} className="text-orange-500" />,
  };

  const statusColor = (s: string) => s === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : s === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
  const getUserInfo = (b: Booking) => {
    if (typeof b.userId === "object" && b.userId) return { name: b.userId.name || "Unknown", email: b.userId.email || "" };
    return { name: "Unknown", email: "" };
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Bookings</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "flight", "hotel", "package", "cab"].map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition capitalize ${filter === t ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-100"}`}>{t === "all" ? "All" : `${t}s`}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((b) => {
          const user = getUserInfo(b);
          return (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">{typeIcon[b.type]}</div>
                <div>
                  <p className="font-bold">{b.flightNumber || b.hotelName || b.packageName || b.cabName || "Booking"}</p>
                  <p className="text-gray-500 text-sm">{user.name} &middot; {user.email}</p>
                  <p className="text-gray-400 text-xs">{new Date(b.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg flex items-center"><IndianRupee size={14} />{b.price?.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium capitalize">{b.type}</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500"><p className="text-lg">No bookings found</p></div>
        )}
      </div>
    </div>
  );
}
