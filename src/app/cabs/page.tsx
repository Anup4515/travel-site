"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Users, IndianRupee, MapPin, Clock, HelpCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface Cab {
  _id: string; cabName: string; cabType: string; maxSeats: number; pricePerKm: number;
  basePrice: number; extraHourCharges: number; features: string[]; image: string;
}

const cabsFaqs = [
  {
    question: "What is the cost of a car rental in Rajasthan?",
    answer: "Our car rental prices in Rajasthan are competitive and flexible. The cost starts from Rs 2000 for sedans like Suzuki Dzire and Toyota Etios for a full day (8 hours/80 km), going up to Rs 6500 for premium vehicles like Toyota Fortuner. Additional charges apply for extra hours (Rs 200-700 per hour) and extra kilometers (Rs 11-45 per km). All prices are transparent with no hidden charges.",
  },
  {
    question: "Do you offer driver-assisted car rentals in Rajasthan?",
    answer: "Yes! All our cabs come with professional, experienced, and courteous chauffeurs. Our drivers are trained, knowledgeable about Rajasthan's routes, and committed to your safety and comfort. They provide reliable transportation whether you're on a city tour, inter-city journey, or desert safari. This ensures you can relax and enjoy your vacation without the stress of driving.",
  },
  {
    question: "Can I book a car rental for a Rajasthan tour?",
    answer: "Absolutely! We offer flexible car rental packages perfect for Rajasthan tours. Whether you need a vehicle for a few hours, a full day, or multiple days, we can customize the rental period to match your itinerary. From exploring Jaipur's palaces to Udaipur's lakes or Jaisalmer's golden sands, our cabs are equipped to handle all types of journeys.",
  },
  {
    question: "What cars are available for rent in Rajasthan?",
    answer: "We have a diverse fleet to suit all needs: economy cars like Suzuki Dzire and Toyota Etios (4 seats), mid-range SUVs like Toyota Innova (7 seats), premium vehicles like Toyota Crysta (8 seats) and Toyota Fortuner (7 seats), and group vehicles like 12+1 and 16+1 Tempo Travellers. Each vehicle is well-maintained, sanitized, and equipped with modern amenities.",
  },
  {
    question: "How do I book a car rental in Rajasthan?",
    answer: "Booking with AureoTravels is simple! Browse our car options above, select your desired vehicle, and click 'Book'. Fill in your pickup location, drop-off location, date/time, and number of passengers. Login to your account (or create one) and confirm your booking. You'll receive a confirmation with pricing details, and our team will coordinate directly with you.",
  },
  {
    question: "Is airport pickup and drop-off available in Rajasthan?",
    answer: "Yes! We provide airport pickup and drop-off services at major airports including Jaipur International Airport (JAI), Udaipur Airport (UDR), and others. Simply mention your airport in the pickup/drop-off location when booking, along with your flight details. Our drivers will be ready to meet you as per your arrival time.",
  },
];

export default function CabsPage() {
  const today = new Date().toISOString().split("T")[0];
  const minPickupDateTime = `${today}T00:00`;
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCab, setSelectedCab] = useState<Cab | null>(null);
  const [generalBookingOpen, setGeneralBookingOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Cab | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [generalPickup, setGeneralPickup] = useState("");
  const [generalDropoff, setGeneralDropoff] = useState("");
  const [generalPickupDate, setGeneralPickupDate] = useState("");
  const [generalPassengers, setGeneralPassengers] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cabs").then((r) => r.json()).then((d) => setCabs(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleGeneralBook = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selectedVehicle || !generalPickup || !generalPickupDate) { toast.error("Please fill all required fields"); return; }
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cab", cabId: selectedVehicle._id, cabName: selectedVehicle.cabName, cabType: selectedVehicle.cabType, pickupLocation: generalPickup, dropoffLocation: generalDropoff, pickupDateTime: generalPickupDate, passengers: generalPassengers, price: selectedVehicle.basePrice }) });
      if (res.ok) { toast.success("Cab booked!"); router.push("/my-trips"); setGeneralBookingOpen(false); resetGeneralForm(); } else toast.error("Booking failed");
    } catch { toast.error("Something went wrong"); }
  };

  const resetGeneralForm = () => {
    setSelectedVehicle(null);
    setGeneralPickup("");
    setGeneralDropoff("");
    setGeneralPickupDate("");
    setGeneralPassengers(1);
  };

  const handleBook = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selectedCab || !pickup || !pickupDate) { toast.error("Please fill all required fields"); return; }
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cab", cabId: selectedCab._id, cabName: selectedCab.cabName, cabType: selectedCab.cabType, pickupLocation: pickup, dropoffLocation: dropoff, pickupDateTime: pickupDate, passengers, price: selectedCab.basePrice }) });
      if (res.ok) { toast.success("Cab booked!"); router.push("/my-trips"); setSelectedCab(null); } else toast.error("Booking failed");
    } catch { toast.error("Something went wrong"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-28"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-10 sm:pt-15">      {/* General Booking Modal */}
      {generalBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Book Your Cab</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Select Vehicle *</label>
                <select value={selectedVehicle?._id || ""} onChange={(e) => { const cab = cabs.find(c => c._id === e.target.value); setSelectedVehicle(cab || null); }} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-900 dark:text-white">
                  <option value="">Choose a vehicle...</option>
                  {cabs.map((cab) => (
                    <option key={cab._id} value={cab._id}>{cab.cabName} - Rs {cab.basePrice}/day</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Pickup Location *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={generalPickup} onChange={(e) => setGeneralPickup(e.target.value)} placeholder="Airport, Hotel, etc." className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Drop-off Location</label>
                <input type="text" value={generalDropoff} onChange={(e) => setGeneralDropoff(e.target.value)} placeholder="Optional" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Pickup Date & Time *</label>
                <input type="datetime-local" min={minPickupDateTime} value={generalPickupDate} onChange={(e) => setGeneralPickupDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Passengers</label>
                <input type="number" value={generalPassengers} onChange={(e) => setGeneralPassengers(parseInt(e.target.value) || 1)} min={1} max={selectedVehicle?.maxSeats || 7} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-gray-900 dark:text-white" />
              </div>
              {selectedVehicle && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Base Price</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={18} />{selectedVehicle.basePrice.toLocaleString()}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setGeneralBookingOpen(false); resetGeneralForm(); }} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
                <button onClick={handleGeneralBook} className="flex-1 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition">Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}      <section className="relative isolate overflow-hidden">
        <div className="relative h-105 md:h-130">
          <Image
            src="/images/cabs/cabs-hero.png"
            alt="AureoTravels cab services hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/45 dark:bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/30 dark:from-black/20 dark:via-black/30 dark:to-black/70" />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-4xl text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-black dark:text-white">
                Aureo<span className="text-blue-500 dark:text-yellow-400">Travels</span> Cab Services
              </h1>
              <p className="mt-5 text-base md:text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
                Safe, sanitized, and professional car rentals for your Rajasthan journey.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('cab-listings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Book Now
                </button>
                <button
                  onClick={() => document.getElementById('cab-pricing-table')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Cab Services Information */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
            Professional Cab Rental Services in Rajasthan
          </h2>

          <div className="space-y-5 text-gray-700 dark:text-gray-300">
            <p>
              Discovering the majestic landscapes, historic forts, and vibrant culture of Rajasthan is 
              best experienced with comfortable, reliable transportation. At AureoTravels, we offer 
              premium cab rental services tailored to meet the diverse needs of travelers exploring 
              Rajasthan, the Golden Triangle, and beyond. Our fleet of well-maintained vehicles ensures 
              that your journey is not only safe but also comfortable, allowing you to focus on the 
              experiences and memories you're creating.
            </p>
            <p>
              Whether you're planning a solo adventure, a romantic getaway, a family vacation, or a 
              large group tour, we have the perfect vehicle for your needs. Our cab services are 
              designed with flexibility in mind, offering various pricing options based on the 
              duration of your rental and the distance you travel. From budget-friendly compact cars 
              to spacious SUVs and group-friendly tempo travelers, every vehicle in our fleet is 
              professionally maintained and driven by courteous, experienced chauffeurs.
            </p>

            {/* Cab Pricing Table */}
            <div id="cab-pricing-table" className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 overflow-hidden w-full max-w-full my-6 sm:my-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Cab Fares &amp; Pricing</h3>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Vehicle Rates</h4>
              <div className="overflow-x-auto md:overflow-visible pb-1 md:pb-0" style={{ WebkitOverflowScrolling: "touch" }}>
                <table className="w-full text-left border-collapse text-sm sm:text-base" style={{ minWidth: "600px" }}>
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 pr-4 font-semibold">Vehicle</th>
                    <th className="py-3 pr-4 font-semibold">Per Day 08 Hours/80 km</th>
                    <th className="py-3 pr-4 font-semibold">Extra Hour Charges</th>
                    <th className="py-3 font-semibold">Extra Km Charges</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">Suzuki Dzire</td>
                    <td className="py-3 pr-4">Rs 2000</td>
                    <td className="py-3 pr-4">Rs 200</td>
                    <td className="py-3">Rs 11/- Per Km</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">Toyota Etios</td>
                    <td className="py-3 pr-4">Rs 2000</td>
                    <td className="py-3 pr-4">Rs 200</td>
                    <td className="py-3">Rs 11/- Per Km</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">Toyota Innova</td>
                    <td className="py-3 pr-4">Rs 2400</td>
                    <td className="py-3 pr-4">Rs 300</td>
                    <td className="py-3">Rs 16/- Per Km</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">Toyota Crysta</td>
                    <td className="py-3 pr-4">Rs 3000</td>
                    <td className="py-3 pr-4">Rs 350</td>
                    <td className="py-3">Rs 18/- Per Km</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">Toyota Fortuner</td>
                    <td className="py-3 pr-4">Rs 6500</td>
                    <td className="py-3 pr-4">Rs 700</td>
                    <td className="py-3">Rs 45/- Per Km</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">12+1 Tempo Traveller</td>
                    <td className="py-3 pr-4">Rs 6000</td>
                    <td className="py-3 pr-4">Rs 450</td>
                    <td className="py-3">Rs 24/- per Km</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">16+1 Tempo Traveller</td>
                    <td className="py-3 pr-4">Rs 6000</td>
                    <td className="py-3 pr-4">Rs 500</td>
                    <td className="py-3">Rs 26/- per Km</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Understanding Our Cab Pricing Structure
              </h3>
              <p>
                Our cab rental pricing is transparent and affordable, with rates based on three key 
                factors: the base per-day charge (covering 8 hours of travel), extra hour charges for 
                travel beyond the standard duration, and per-kilometer charges for additional distances. 
                This flexible pricing model ensures that you pay only for what you use, with no hidden 
                fees or surprise costs at the end of your journey.
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Per Day Charges (8 Hours/80 km)
              </h3>
              <p>
                The per-day rate includes up to 8 hours of driving time and up to 80 kilometers of 
                travel within Rajasthan. This is ideal for city tours, sightseeing trips, or 
                point-to-point transfers. If your journey extends beyond these limits, additional 
                charges apply based on the extra hours and additional kilometers traveled.
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Extra Hour and Extra Kilometer Charges
              </h3>
              <p>
                For those requiring more flexibility or embarking on longer journeys, we offer 
                additional charges for extra hours beyond the standard 8-hour package and for 
                kilometers beyond 80 km. This ensures that whether you're planning a full-day desert 
                safari, a multi-city tour, or a longer inter-state journey, our pricing adapts to 
                your specific needs.
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Why Choose AureoTravels for Cab Rentals?
              </h3>
              <p>
                At AureoTravels, we believe that reliable transportation is the foundation of a great 
                travel experience. All our vehicles are regularly serviced, sanitized, and equipped 
                with modern amenities. Our drivers are trained, courteous professionals who know the 
                roads well and are committed to your safety and comfort. Whether you need a quick city 
                transfer or an extended multi-day journey, we deliver professional service at 
                competitive rates.
              </p>
            </div>

            <ul className="list-disc pl-6 space-y-2 pt-2 text-gray-800 dark:text-gray-200">
              <li>Well-maintained fleet of sedans, SUVs, and group vehicles</li>
              <li>Professional, courteous, and experienced chauffeurs</li>
              <li>Transparent and flexible pricing with no hidden charges</li>
              <li>Services available across Rajasthan and Golden Triangle</li>
              <li>24/7 customer support for all your cab booking needs</li>
            </ul>
          </div>
        </section>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Ride in Comfort, Travel with Confidence</h2>
          <p className="text-gray-600 dark:text-gray-400">Discover our fleet of reliable, chauffeur-driven cabs tailored for every journey.</p>
        </div>

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
                  <input type="datetime-local" min={minPickupDateTime} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
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

        <div id="cab-listings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cabs.map((cab) => (
            <div key={cab._id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                <Image src={cab.image} alt={cab.cabName} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
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

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 bg-white dark:bg-black transition-colors">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-8 h-8 text-blue-500 dark:text-yellow-400 transition-colors" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors">
              Frequently Asked <span className="text-blue-500 dark:text-yellow-400 transition-colors">Questions</span>
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors">Everything you need to know about our cab rental services</p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {cabsFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-yellow-400 transition-all shadow-md hover:shadow-lg"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
              >
                <span className="text-gray-900 dark:text-white font-semibold text-lg pr-8 group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-500 dark:text-yellow-400 shrink-0 transition-transform duration-300 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">Still have questions?</p>

          {/* Expert Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Get in Touch With Our Team</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 transition-colors">
              Have more questions about our cab services? Contact us directly for personalized assistance with your Rajasthan travel plans.
            </p>

            {/* Buttons - Responsive Layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setGeneralBookingOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-500 dark:bg-yellow-400 hover:bg-blue-600 dark:hover:bg-yellow-300 text-white dark:text-black font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
              >
                Book Your Cab Now
              </button>
              <a
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:bg-opacity-50 font-bold px-8 py-3 rounded-xl transition-all"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
