"use client";

import { useState, useEffect } from "react";
import { Users, Package, CalendarCheck, IndianRupee, Plane, Building2, MapPin, Car } from "lucide-react";

interface Stats {
  users: number;
  packages: number;
  totalBookings: number;
  totalRevenue: number;
  bookingBreakdown: { flights: number; hotels: number; packages: number; cabs: number };
  recentBookings: Array<{ _id: string; type: string; price: number; status: string; createdAt: string; flightNumber?: string; hotelName?: string; packageName?: string }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" /></div>;

  const cards = [
    { label: "Total Users", value: stats?.users || 0, icon: Users, color: "bg-blue-500", iconBg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Packages", value: stats?.packages || 0, icon: Package, color: "bg-green-500", iconBg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: CalendarCheck, color: "bg-purple-500", iconBg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: "bg-yellow-500", iconBg: "bg-yellow-100 dark:bg-yellow-900/30" },
  ];

  const typeIcons: Record<string, React.ReactNode> = {
    flight: <Plane size={16} className="text-blue-500" />,
    hotel: <Building2 size={16} className="text-purple-500" />,
    package: <MapPin size={16} className="text-green-500" />,
    cab: <Car size={16} className="text-orange-500" />,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${c.iconBg} p-3 rounded-xl`}><c.icon size={24} className={c.color.replace("bg-", "text-")} /></div>
            </div>
            <p className="text-gray-500 text-sm">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Booking Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Booking Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: "Flights", count: stats?.bookingBreakdown.flights || 0, icon: Plane, color: "bg-blue-500" },
              { label: "Hotels", count: stats?.bookingBreakdown.hotels || 0, icon: Building2, color: "bg-purple-500" },
              { label: "Packages", count: stats?.bookingBreakdown.packages || 0, icon: MapPin, color: "bg-green-500" },
              { label: "Cabs", count: stats?.bookingBreakdown.cabs || 0, icon: Car, color: "bg-orange-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={item.color.replace("bg-", "text-")} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className={`${item.color} rounded-full h-2`} style={{ width: `${Math.min(100, (item.count / Math.max(1, stats?.totalBookings || 1)) * 100)}%` }} />
                  </div>
                  <span className="font-bold w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {stats?.recentBookings.length === 0 && <p className="text-gray-500 text-sm">No bookings yet</p>}
            {stats?.recentBookings.map((b) => (
              <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  {typeIcons[b.type]}
                  <div>
                    <p className="font-medium text-sm">{b.flightNumber || b.hotelName || b.packageName || "Booking"}</p>
                    <p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-bold text-sm">₹{b.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
