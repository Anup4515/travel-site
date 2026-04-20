"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plane, Building2, MapPin, Car, Calendar, Users, IndianRupee, Heart, Trash2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface BookingData {
  flights: Array<{ _id: string; flightNumber: string; departure: string; arrival: string; date: string; passengers: number; price: number; status: string; createdAt: string }>;
  hotels: Array<{ _id: string; hotelName: string; location: string; checkIn: string; checkOut: string; guests: number; price: number; status: string; createdAt: string }>;
  packages: Array<{ _id: string; packageName: string; destination: string; startDate: string; travelers: number; price: number; status: string; createdAt: string }>;
  cabs: Array<{ _id: string; cabName: string; cabType: string; pickupLocation: string; pickupDateTime: string; passengers: number; price: number; status: string; createdAt: string }>;
}

interface WishlistedPackage {
  _id: string;
  packageId?: string;
  name: string;
  destination: string;
  price: number;
  duration: string;
  image?: string;
  description?: string;
}

export default function MyTripsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData | null>(null);
  const [wishlisted, setWishlisted] = useState<WishlistedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"flights" | "hotels" | "packages" | "cabs" | "wishlist">("flights");
  const [cancelModal, setCancelModal] = useState<{ show: boolean; id: string | null; type: string | null; name: string; price: number }>({ show: false, id: null, type: null, name: "", price: 0 });
  const [canceling, setCanceling] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/bookings").then((r) => r.json()).then(setBookings).catch(() => {}).finally(() => setLoading(false));
      
      // Fetch wishlisted packages from localStorage
      const wishlistKeys = Object.keys(localStorage).filter(key => key.startsWith("wishlist_"));
      if (wishlistKeys.length > 0) {
        const packageIds = wishlistKeys.map(key => key.replace("wishlist_", ""));
        Promise.all(packageIds.map(id => fetch(`/api/packages/${id}`).then(r => r.json())))
          .then(packages => setWishlisted(packages.filter(p => !p.error)))
          .catch(() => {});
      }
    }
  }, [status]);

  const handleCancel = async () => {
    if (!cancelModal.id || !cancelModal.type) return;
    
    setCanceling(true);
    try {
      const res = await fetch(`/api/bookings?id=${cancelModal.id}&type=${cancelModal.type}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        const refund = data.refund;

        // Refresh bookings
        fetch("/api/bookings")
          .then((r) => r.json())
          .then(setBookings)
          .catch(() => {});

        toast.success(
          <div>
            <p className="font-bold">Booking Cancelled!</p>
            <p className="text-sm">{refund.reason}</p>
            <p className="text-sm">Refund: ₹{refund.amount.toLocaleString()}</p>
          </div>
        );
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to cancel booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCanceling(false);
      setCancelModal({ show: false, id: null, type: null, name: "", price: 0 });
    }
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center pt-28"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>;

  const tabs = [
    { key: "flights" as const, label: "Flights", icon: Plane, count: bookings?.flights.length || 0 },
    { key: "hotels" as const, label: "Hotels", icon: Building2, count: bookings?.hotels.length || 0 },
    { key: "packages" as const, label: "Packages", icon: MapPin, count: bookings?.packages.length || 0 },
    { key: "cabs" as const, label: "Cabs", icon: Car, count: bookings?.cabs.length || 0 },
    { key: "wishlist" as const, label: "Wishlist", icon: Heart, count: wishlisted.length || 0 },
  ];

  const statusColor = (s: string) => s === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : s === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

  return (
    <div className="min-h-screen pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Trips</h1>

        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-medium transition whitespace-nowrap text-sm sm:text-base ${tab === t.key ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black shadow-lg" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <t.icon size={16} className="sm:w-[18px]" />{t.label} <span className="bg-black/10 dark:bg-white/10 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          {tab === "flights" && bookings?.flights.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-xl shrink-0"><Plane size={18} className="sm:w-6 text-blue-500" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base sm:text-lg">{b.flightNumber}</p>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{b.departure} → {b.arrival}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 py-2">
                <div className="flex items-center gap-1 min-w-0"><Calendar size={14} /><span className="truncate">{b.date}</span></div>
                <div className="flex items-center gap-1"><Users size={14} />{b.passengers}</div>
                <div className="flex items-center gap-1 font-bold text-base sm:text-lg text-gray-900 dark:text-white"><IndianRupee size={14} className="shrink-0" />{b.price.toLocaleString()}</div>
                <span className={`w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
              {b.status !== "cancelled" && (
                <button
                  onClick={() => setCancelModal({ show: true, id: b._id, type: "flight", name: b.flightNumber, price: b.price })}
                  className="w-fit px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-xs font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}

          {tab === "hotels" && bookings?.hotels.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 rounded-xl shrink-0"><Building2 size={18} className="sm:w-6 text-purple-500" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base sm:text-lg">{b.hotelName}</p>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{b.location}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 py-2">
                <div className="truncate"><span className="truncate inline-block">{b.checkIn} → {b.checkOut}</span></div>
                <div className="flex items-center gap-1"><Users size={14} />{b.guests}</div>
                <div className="flex items-center gap-1 font-bold text-base sm:text-lg text-gray-900 dark:text-white"><IndianRupee size={14} className="shrink-0" />{b.price.toLocaleString()}</div>
                <span className={`w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
              {b.status !== "cancelled" && (
                <button
                  onClick={() => setCancelModal({ show: true, id: b._id, type: "hotel", name: b.hotelName, price: b.price })}
                  className="w-fit px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-xs font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}

          {tab === "packages" && bookings?.packages.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-xl shrink-0"><MapPin size={18} className="sm:w-6 text-green-500" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base sm:text-lg">{b.packageName}</p>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{b.destination}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 py-2">
                <div className="flex items-center gap-1 min-w-0"><Calendar size={14} /><span className="truncate">{b.startDate}</span></div>
                <div className="flex items-center gap-1"><Users size={14} />{b.travelers}</div>
                <div className="flex items-center gap-1 font-bold text-base sm:text-lg text-gray-900 dark:text-white"><IndianRupee size={14} className="shrink-0" />{b.price.toLocaleString()}</div>
                <span className={`w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
              {b.status !== "cancelled" && (
                <button
                  onClick={() => setCancelModal({ show: true, id: b._id, type: "package", name: b.packageName, price: b.price })}
                  className="w-fit px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-xs font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}

          {tab === "cabs" && bookings?.cabs.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 sm:p-3 rounded-xl shrink-0"><Car size={18} className="sm:w-6 text-orange-500" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base sm:text-lg">{b.cabName} ({b.cabType})</p>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{b.pickupLocation}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 py-2">
                <div className="flex items-center gap-1"><Users size={14} />{b.passengers}</div>
                <div className="flex items-center gap-1 font-bold text-base sm:text-lg text-gray-900 dark:text-white"><IndianRupee size={14} className="shrink-0" />{b.price.toLocaleString()}</div>
                <span className={`w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
              </div>
              {b.status !== "cancelled" && (
                <button
                  onClick={() => setCancelModal({ show: true, id: b._id, type: "cab", name: b.cabName, price: b.price })}
                  className="w-fit px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-xs font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}

          {tab === "wishlist" && wishlisted.map((pkg) => (
            <Link key={pkg._id || pkg.packageId} href={`/packages/${pkg._id || pkg.packageId}`}>
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 p-3 sm:p-6">
                  {pkg.image && (
                    <div className="md:w-48 h-40 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={pkg.image} alt={pkg.name} width={200} height={150} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">{pkg.name}</p>
                      <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1 mt-1"><MapPin size={14} />{pkg.destination}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar size={14} />{pkg.duration}</span>
                      <span className="flex items-center gap-1 font-bold text-base sm:text-lg text-gray-900 dark:text-white"><IndianRupee size={14} className="shrink-0" />{pkg.price.toLocaleString()}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const key = `wishlist_${pkg._id || pkg.packageId}`;
                          localStorage.removeItem(key);
                          setWishlisted(wishlisted.filter(p => (p._id || p.packageId) !== (pkg._id || pkg.packageId)));
                          toast.success("Removed from wishlist");
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {bookings && tab !== "wishlist" && bookings[tab].length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <p className="text-base sm:text-lg">No {tab} bookings yet</p>
              <p className="text-xs sm:text-sm mt-2">Start exploring and book your next trip!</p>
            </div>
          )}

          {tab === "wishlist" && wishlisted.length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <p className="text-base sm:text-lg">No wishlisted packages yet</p>
              <p className="text-xs sm:text-sm mt-2">Start adding packages to your wishlist!</p>
            </div>
          )}
        </div>

        {/* Cancellation Confirmation Modal */}
        {cancelModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-xl">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Cancel Booking?</h3>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Booking:</p>
                  <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{cancelModal.name}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Original Price:</span>
                    <span className="font-bold">₹{cancelModal.price.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-700 pt-2 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Refund will be based on our cancellation policy:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ Within 7 days: <span className="font-bold text-green-600 dark:text-green-400">100% refund</span></li>
                      <li>✓ 7-30 days: <span className="font-bold text-yellow-600 dark:text-yellow-400">50% refund</span></li>
                      <li>✓ After 30 days: <span className="font-bold text-red-600 dark:text-red-400">No refund</span></li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Are you sure you want to cancel this booking?</p>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex gap-2 sm:gap-3">
                <button
                  onClick={() => setCancelModal({ show: false, id: null, type: null, name: "", price: 0 })}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition font-medium text-sm"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50 text-sm"
                >
                  {canceling ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
