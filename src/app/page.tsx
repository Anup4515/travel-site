"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MapPin, Star, Clock, Users, ArrowRight, ChevronLeft, ChevronRight, ChevronDown, HelpCircle, Car, IndianRupee, X, Lock } from "lucide-react";
import toast from "react-hot-toast";

const heroImages = ["/images/landmarks/amber-fort.png",
  "/images/landmarks/jal-mahal.jpg",
  "/images/landmarks/jaisalmer-fort.png",
  "/images/landmarks/india-gate.jpg",
  "/images/landmarks/qutub-minar.png",
  "/images/landmarks/hawa-mahal.png",];

const destinations = [
  { name: "Jaipur", image: "/images/jaipur/city-palace.png", desc: "The Pink City", href: "/destinations/jaipur" },
  { name: "Udaipur", image: "/images/udaipur/lake-pichola.png", desc: "City of Lakes", href: "/destinations/udaipur" },
  { name: "Kota", image: "/images/kota/kota-garh.png", desc: "Education Hub of India", href: "/destinations/kota" },
  { name: "Ajmer", image: "/images/ajmer/dargah.png", desc: "City of Pilgrimage", href: "/destinations/ajmer" },
  { name: "Jaisalmer", image: "/images/jaisalmer/jaisalmer-fort.png", desc: "The Golden City", href: "/destinations/jaisalmer" },
  { name: "Bikaner", image: "/images/bikaner/lalgarh-palace.png", desc: "Camel Country", href: "/destinations/bikaner" },
];

const featuredPackages = [
  { id: "pkg-rajasthan-01", name: "Rajasthan Explorer", price: 19999, duration: "5 Days / 4 Nights", image: "/images/jaipur.jpg" },
  { id: "pkg-rajasthan-02", name: "Royal Rajasthan", price: 24999, duration: "6 Days / 5 Nights", image: "/images/udaipur/city-palace.png" },
  { id: "pkg-rajasthan-03", name: "Desert & Forts", price: 17999, duration: "4 Days / 3 Nights", image: "/images/jaisalmer/jaisalmer-fort.png" },
];

const cabServices = [
  { id: 1, name: "Sedan", vehicles: "Suzuki Dzire, Toyota Etios", seats: 4, perDay: 2000, perKm: 11, image: "/images/cabs/etios.jpg" },
  { id: 2, name: "SUV", vehicles: "Toyota Innova, Toyota Crysta", seats: 7, perDay: 2400, perKm: 16, image: "/images/cabs/innova.jpg" },
  { id: 3, name: "Premium SUV", vehicles: "Toyota Fortuner", seats: 7, perDay: 6500, perKm: 45, image: "/images/cabs/fortuner.jpg" },
  { id: 4, name: "Group Travel", vehicles: "12+1 & 16+1 Tempo", seats: 16, perDay: 6000, perKm: 26, image: "/images/cabs/tempo12.jpg" },
];

const testimonials = [
  { name: "Priya S.", text: "Amazing experience! The Rajasthan tour was perfectly organized. Every detail was taken care of.", rating: 5 },
  { name: "Rahul M.", text: "Best travel agency for Rajasthan tours. The heritage hotels were breathtaking and the guides were knowledgeable.", rating: 5 },
  { name: "Sarah T.", text: "Our family trip to Jaipur and Udaipur was magical. AureoTravels made it hassle-free and memorable.", rating: 4 },
];

const faqs = [
  {
    question: "What are the best places to visit in Rajasthan?",
    answer:
      "Rajasthan is home to some of India's most iconic destinations including Jaipur (the Pink City), Udaipur (City of Lakes), Jaisalmer (Golden City), Ajmer (spiritual hub), Bikaner (desert heritage), and Kota (modern cultural center). Each city offers a unique blend of history, architecture, and local experiences.",
  },
  {
    question: "How many days are enough to explore Rajasthan?",
    answer:
      "A well-planned Rajasthan trip typically takes 5–10 days depending on the number of cities you want to cover. A 5-day trip can include Jaipur and Udaipur, while a 7–10 day itinerary allows you to explore Jaisalmer, Bikaner, Ajmer, and more in a relaxed way.",
  },
  {
    question: "What is the best time to visit Rajasthan?",
    answer:
      "The best time to visit Rajasthan is from October to March when the weather is pleasant for sightseeing. Winter months are ideal for desert experiences like Jaisalmer. Summers (April–June) can be extremely hot, while monsoon offers a quieter travel experience with fewer crowds.",
  },
  {
    question: "What are the must-see attractions in Rajasthan?",
    answer:
      "Top attractions include Amber Fort and Hawa Mahal in Jaipur, Lake Pichola and City Palace in Udaipur, Jaisalmer Fort and Sam Sand Dunes in Jaisalmer, Ajmer Sharif Dargah in Ajmer, and Junagarh Fort in Bikaner. Each city offers rich cultural and architectural experiences.",
  },
  {
    question: "Is Rajasthan suitable for family trips?",
    answer:
      "Yes, Rajasthan is perfect for families. It offers safe travel routes, diverse attractions, cultural experiences, and comfortable accommodations. From exploring forts to enjoying camel safaris, there’s something for all age groups.",
  },
  {
    question: "What kind of accommodation is available in Rajasthan?",
    answer:
      "Rajasthan offers a wide range of accommodations including budget hotels, luxury resorts, heritage palaces, desert camps, villas, and homestays. Travelers can choose based on their comfort, budget, and experience preferences.",
  },
  {
    question: "Can I customize my Rajasthan travel itinerary?",
    answer:
      "Absolutely! AureoTravels allows fully customizable itineraries where you can choose destinations, duration, accommodations, and experiences based on your preferences.",
  },
  {
    question: "Are Rajasthan trips expensive?",
    answer:
      "Rajasthan trips can fit all budgets. Budget trips can start from ₹10,000–₹15,000, while mid-range packages range between ₹20,000–₹40,000. Luxury experiences with heritage hotels and private tours can go higher depending on customization.",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "Tours & Packages",
    tripDetails: "",
  });

  useEffect(() => {
    // Check localStorage for enquiry form dismissal
    const lastDismissal = localStorage.getItem('enquiryFormDismissed');
    if (lastDismissal) {
      const dismissalTime = parseInt(lastDismissal);
      const now = Date.now();
      const hoursElapsed = (now - dismissalTime) / (1000 * 60 * 60);
      // Only show again if 24 hours have passed
      if (hoursElapsed < 24) {
        setShowEnquiryModal(false);
      }
    }
    
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Periodic toast notification for enquiry form
    const lastDismissal = localStorage.getItem('enquiryFormDismissed');
    const now = Date.now();
    
    // Only show toast if form wasn't dismissed in last 24 hours
    if (!lastDismissal || (now - parseInt(lastDismissal)) > 24 * 60 * 60 * 1000) {
      // First toast after 1.5 minutes
      const initialTimer = setTimeout(() => {
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 flex items-center gap-3 border-l-4 border-blue-500 dark:border-yellow-400">
            <HelpCircle size={20} className="text-blue-500 dark:text-yellow-400 shrink-0" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Need help planning your trip?</span>
            <button
              onClick={() => {
                setShowEnquiryModal(true);
                toast.dismiss(t.id);
              }}
              className="ml-2 text-xs bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-3 py-1 rounded font-semibold hover:opacity-90 shrink-0"
            >
              Quote
            </button>
          </div>
        ), { duration: 6000 });
      }, 90000); // 1.5 minutes

      // Repeat every 3 minutes after initial
      const repeatingTimer = setInterval(() => {
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 flex items-center gap-3 border-l-4 border-blue-500 dark:border-yellow-400">
            <HelpCircle size={20} className="text-blue-500 dark:text-yellow-400 shrink-0" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Get a free quote for your dream trip!</span>
            <button
              onClick={() => {
                setShowEnquiryModal(true);
                toast.dismiss(t.id);
              }}
              className="ml-2 text-xs bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-3 py-1 rounded font-semibold hover:opacity-90 shrink-0"
            >
              Click here
            </button>
          </div>
        ), { duration: 6000 });
      }, 180000); // 3 minutes

      return () => {
        clearTimeout(initialTimer);
        clearInterval(repeatingTimer);
      };
    }
  }, []);

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone || !enquiryForm.tripDetails) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryForm),
      });

      if (response.ok) {
        toast.success("Enquiry sent! We'll contact you within 2 hours.");
        localStorage.setItem('enquiryFormDismissed', Date.now().toString());
        setShowEnquiryModal(false);
        setEnquiryForm({ name: "", email: "", phone: "", serviceType: "Tours & Packages", tripDetails: "" });
      } else {
        toast.error("Failed to send enquiry. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Enquiry error:", error);
    }
  };

  const handleCloseEnquiry = () => {
    localStorage.setItem('enquiryFormDismissed', Date.now().toString());
    setShowEnquiryModal(false);
  };

  return (
    <>
      {/* Enquiry Modal */}
      <AnimatePresence>
        {showEnquiryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-linear-to-b dark:from-gray-900 dark:to-gray-800 rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative p-8 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseEnquiry}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition text-gray-900 dark:text-gray-200"
                >
                  <X size={20} />
                </button>
                <p className="text-xs uppercase tracking-widest text-blue-600 dark:text-yellow-400 font-semibold mb-2">FREE CONSULTATION</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">Plan Your Royal Journey</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">Drop us your details — we'll get back within 2 hours with a custom quote.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleEnquirySubmit} className="p-8 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400 font-semibold mb-2">YOUR NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={enquiryForm.name}
                    onChange={handleEnquiryChange}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400 font-semibold mb-2">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="email"
                    value={enquiryForm.email}
                    onChange={handleEnquiryChange}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400 font-semibold mb-2">PHONE / WHATSAPP</label>
                  <input
                    type="tel"
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    placeholder="+91 98290 00000"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400 font-semibold mb-2">SERVICE TYPE</label>
                  <select
                    name="serviceType"
                    value={enquiryForm.serviceType}
                    onChange={handleEnquiryChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
                  >
                    <option>Tours & Packages</option>
                    <option>Cab Rental</option>
                    <option>Hotel Booking</option>
                    <option>Flight Booking</option>
                    <option>Guided Tours</option>
                    <option>Custom Itinerary</option>
                  </select>
                </div>

                {/* Trip Details */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400 font-semibold mb-2">TELL US ABOUT YOUR TRIP</label>
                  <textarea
                    name="tripDetails"
                    value={enquiryForm.tripDetails}
                    onChange={handleEnquiryChange}
                    placeholder="e.g. 4-day Rajasthan circuit for 2, mid-October, budget around ₹25,000..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all hover:shadow-lg"
                >
                  Send My Enquiry →
                </button>

                {/* Privacy Notice */}
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-1">
                  <Lock size={12} /> We never share your details. No spam, ever.
                </p>

                {/* Company Name */}
                <p className="text-xs text-gray-500 dark:text-gray-600 text-center mt-4">A Unit of AureoTravels Pvt. Ltd.</p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-32">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}>
              <Image src={img} alt="" fill sizes="100vw" className="object-cover" priority={i === 0} />
            </div>
          ))}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/50" />
          <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 md:h-40 bg-linear-to-t from-white/70 dark:from-black to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-4xl md:text-6xl font-extrabold text-black dark:text-white leading-tight tracking-tight">
            Discover the Royal Beauty of Rajasthan with
            <span className="block mt-2 text-4xl md:text-6xl font-extrabold">
              <span className="text-black dark:text-white">Aureo</span><span className="text-blue-400 dark:text-yellow-400">Travels</span>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-gray-600 dark:text-white max-w-3xl mx-auto text-base md:text-lg">
            Explore majestic forts, desert adventures, serene lakes, and vibrant culture — from Jaipur to Udaipur, Jaisalmer to Ajmer, and beyond.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-lg hover:bg-blue-600 dark:hover:bg-yellow-300 hover:text-white">Explore Tour Packages</Link>
            <Link href="/flights/search" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-black dark:text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 transition-all hover:scale-105 hover:text-blue-400 dark:hover:text-yellow-400">Search Flights</Link>
          </motion.div>
          <div className="flex justify-center gap-2 mt-10">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? "bg-blue-400 dark:bg-yellow-400 w-8 shadow-lg" : "bg-white/50"}`} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>

        <button onClick={() => setCurrentSlide((s) => (s - 1 + heroImages.length) % heroImages.length)} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition hidden md:block"><ChevronLeft size={20} className="sm:w-6" /></button>
        <button onClick={() => setCurrentSlide((s) => (s + 1) % heroImages.length)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition hidden md:block"><ChevronRight size={20} className="sm:w-6" /></button>
      </section>

      {/* Destinations */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white">Explore Rajasthan's <span className="text-blue-400 dark:text-yellow-400">Iconic Wonders</span></h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover majestic forts, timeless palaces, desert landscapes, and vibrant culture across Rajasthan.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={d.href} className="group block relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                  <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center gap-2 text-blue-400 dark:text-yellow-400 mb-1"><MapPin size={16} /><span className="text-sm text-white">{d.desc}</span></div>
                    <h3 className="text-2xl font-bold text-white">{d.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white">Featured <span className="text-blue-400 dark:text-yellow-400">Tour Packages</span></h2>
            <p className="mt-4 text-black dark:text-white max-w-2xl mx-auto">Curated experiences for every type of traveler</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, i) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <Link href={`/packages/${pkg.id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative h-56">
                    <Image src={pkg.image} alt={pkg.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-black dark:text-white group-hover:text-blue-400 dark:group-hover:text-yellow-400 transition-colors">{pkg.name}</h3>
                    <div className="flex items-center gap-4 text-black dark:text-gray-400 text-sm mb-4">
                      <span className="flex items-center gap-1"><Clock size={14} />{pkg.duration}</span>
                      <span className="flex items-center gap-1"><Users size={14} />2-10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-400 dark:text-yellow-400">&#8377;{pkg.price.toLocaleString()}</p>
                      <span className="flex items-center gap-1 text-blue-400 dark:text-yellow-400 font-medium group-hover:gap-2 transition-all">View <ArrowRight size={16} /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/packages" className="inline-flex items-center gap-2 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">View All Packages <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Cabs Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white">Professional <span className="text-blue-400 dark:text-yellow-400">Cab Services</span></h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Comfortable and reliable transportation for your Rajasthan journey</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cabServices.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="group bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image src={service.image} alt={service.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-2" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-yellow-400 transition-colors">{service.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.vehicles}</p>
                  
                  <div className="grow space-y-3 mb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                      <Users size={16} className="text-blue-500 dark:text-yellow-400" />
                      <span>Up to {service.seats} seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                      <Clock size={16} className="text-blue-500 dark:text-yellow-400" />
                      <span>Rs {service.perDay.toLocaleString()}/day</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                      <IndianRupee size={16} className="text-blue-500 dark:text-yellow-400" />
                      <span>Rs {service.perKm}/km</span>
                    </div>
                  </div>

                  <Link href="/cabs" className="w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-2 rounded-xl font-semibold text-center hover:opacity-90 transition text-sm">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/cabs" className="inline-flex items-center gap-2 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">View All Cabs <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white">What Our <span className="text-blue-400 dark:text-yellow-400">Travelers Say</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={18} className="fill-blue-400 text-blue-400 dark:fill-yellow-400 dark:text-yellow-400" />)}</div>
                <p className="text-black dark:text-white mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-black dark:text-white">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors">Everything you need to know about Rajasthan Travel</p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
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
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Talk With Our Travel Experts</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 transition-colors">
              Need help planning your dream trip? Our experts are available to help you customize your itinerary, answer questions, and recommend the best experiences in your desired destination.
            </p>

            {/* Buttons - Responsive Layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/packages"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-500 dark:bg-yellow-400 hover:bg-blue-600 dark:hover:bg-yellow-300 text-white dark:text-black font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
              >
                Explore Our Packages
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:bg-opacity-50 font-bold px-8 py-3 rounded-xl transition-all"
              >
                Talk With Us
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Enquiry Button */}
      <button
        onClick={() => setShowEnquiryModal(true)}
        aria-label="Get Free Quote"
        className="fixed right-4 bottom-24 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-blue-600 dark:from-yellow-400 dark:to-yellow-500 text-white dark:text-black shadow-[0_10px_24px_rgba(59,130,246,0.35)] dark:shadow-[0_10px_24px_rgba(250,204,21,0.35)] ring-2 ring-white dark:ring-gray-900 transition-transform hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-yellow-300"
      >
        <HelpCircle size={24} />
      </button>
    </>
  );
}
