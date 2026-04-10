"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, Users, IndianRupee, MapPin, Check, X, Calendar, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { IPackage } from "@/types";

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [booking, setBooking] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/packages/${id}`).then((r) => r.json()).then((d) => { if (!d.error) setPkg(d); }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!session) { router.push("/login"); return; }
    if (!startDate) { toast.error("Please select a start date"); return; }
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "package", packageId: pkg?.packageId || pkg?._id, packageName: pkg?.name, destination: pkg?.destination, startDate, travelers, price: (pkg?.price || 0) * travelers }) });
      if (res.ok) { toast.success("Package booked!"); router.push("/my-trips"); } else toast.error("Booking failed");
    } catch { toast.error("Something went wrong"); } finally { setBooking(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>;
  if (!pkg) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="text-gray-500 text-lg">Package not found</p></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-80 md:h-96">
        <Image src={pkg.image || "/images/tajmahal.jpg"} alt={pkg.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        <div className="absolute bottom-0 left-0 p-8 max-w-4xl">
          <div className="flex items-center gap-2 text-yellow-400 mb-2"><MapPin size={16} /><span className="text-sm">{pkg.destination}</span></div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{pkg.name}</h1>
          <div className="flex items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Clock size={14} />{pkg.duration}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{pkg.cities?.join(" → ")}</span>
            <span className="text-2xl font-bold text-yellow-400 flex items-center"><IndianRupee size={18} />{pkg.price.toLocaleString()}<span className="text-sm text-white/60 ml-1">/person</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{pkg.description}</p>
          </div>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><Check size={16} className="text-blue-500" /></div>
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border-l-4 border-blue-500 dark:border-yellow-400">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">D{day.day}</span>
                      <h3 className="text-lg font-bold">{day.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{day.description}</p>
                    {day.highlights && day.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {day.highlights.map((h, j) => (
                          <span key={j} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">{h}</span>
                        ))}
                      </div>
                    )}
                    {(day.meals || day.travel) && (
                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        {day.meals && <span>Meals: {day.meals}</span>}
                        {day.travel && <span>Travel: {day.travel}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included / Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pkg.included && pkg.included.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-green-700 dark:text-green-400">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {pkg.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><Check size={16} className="text-green-500 mt-0.5 shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.excluded && pkg.excluded.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-red-700 dark:text-red-400">Not Included</h3>
                <ul className="space-y-2">
                  {pkg.excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><X size={16} className="text-red-500 mt-0.5 shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg sticky top-24">
            <h3 className="text-xl font-bold mb-6">Book This Tour</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Travelers</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" value={travelers} onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={10} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Price per person</span><span className="flex items-center"><IndianRupee size={14} />{pkg.price.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Travelers</span><span>x {travelers}</span></div>
                <div className="border-t border-gray-300 dark:border-gray-700 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span><span className="text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={16} />{(pkg.price * travelers).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handleBook} disabled={booking} className="w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50">
                {booking ? "Booking..." : <><span>Book Now</span><ArrowRight size={18} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
