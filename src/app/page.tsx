"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MapPin, Star, Clock, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const heroImages = ["/images/jaipur1.jpg", "/images/agra1.jpg", "/images/delhi/india-gate.jpg", "/images/udaipur/city-palace.png", "/images/ladakh1.jpg"];

const destinations = [
  { name: "Jaipur", image: "/images/jaipur1.jpg", desc: "The Pink City", href: "/destinations/jaipur" },
  { name: "Udaipur", image: "/images/udaipur/lake-pichola.png", desc: "City of Lakes", href: "/destinations/udaipur" },
  { name: "Delhi", image: "/images/delhi/red-fort.png", desc: "India's Capital", href: "/destinations/delhi" },
  { name: "Agra", image: "/images/agra1.jpg", desc: "Home of Taj Mahal", href: "/destinations/agra" },
  { name: "Jaisalmer", image: "/images/jaisalmer1.jpg", desc: "The Golden City", href: "/destinations/jaisalmer" },
  { name: "Bikaner", image: "/images/bikaner1.jpg", desc: "Camel Country", href: "/destinations/bikaner" },
];

const featuredPackages = [
  { id: "gt-classic", name: "Golden Triangle Classic", price: 14999, duration: "4 Days / 3 Nights", image: "/images/tajmahal.jpg", rating: 4.8 },
  { id: "gt-heritage", name: "Golden Triangle Heritage", price: 22999, duration: "5 Days / 4 Nights", image: "/images/jaipur.jpg", rating: 4.9 },
  { id: "gt-luxury", name: "Golden Triangle Luxury", price: 45999, duration: "6 Days / 5 Nights", image: "/images/indiagate.jpg", rating: 5.0 },
];

const testimonials = [
  { name: "Priya S.", text: "Amazing experience! The Golden Triangle tour was perfectly organized. Every detail was taken care of.", rating: 5 },
  { name: "Rahul M.", text: "Best travel agency for Rajasthan tours. The heritage hotels were breathtaking and the guides were knowledgeable.", rating: 5 },
  { name: "Sarah T.", text: "Our family trip to Jaipur and Udaipur was magical. AureoTravels made it hassle-free and memorable.", rating: 4 },
];

const faqs = [
  { q: "What is the best time to visit Rajasthan?", a: "October to March is the best time. The weather is pleasant and perfect for sightseeing." },
  { q: "Are the tour packages customizable?", a: "Yes! All our packages can be customized based on your preferences, budget, and duration." },
  { q: "What is included in the Golden Triangle tour?", a: "Our tours include accommodation, breakfast, AC vehicle transfers, guide, and monument entry fees." },
  { q: "How do I book a tour package?", a: "You can book directly through our website by selecting a package and clicking 'Book Now'." },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}>
              <Image src={img} alt="" fill className="object-cover" priority={i === 0} />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-4xl md:text-7xl font-bold text-white leading-tight">
            Discover the Royal Beauty of <span className="text-yellow-400">Rajasthan</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-gray-200 max-w-2xl mx-auto text-lg md:text-xl">
            Explore majestic forts, desert adventures, serene lakes, and vibrant culture with AureoTravels
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-lg">Explore Tour Packages</Link>
            <Link href="/flights/search" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 transition-all hover:scale-105">Search Flights</Link>
          </motion.div>
          <div className="flex justify-center gap-2 mt-10">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? "bg-yellow-400 w-8" : "bg-white/50"}`} />
            ))}
          </div>
        </div>

        <button onClick={() => setCurrentSlide((s) => (s - 1 + heroImages.length) % heroImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition hidden md:block"><ChevronLeft size={24} /></button>
        <button onClick={() => setCurrentSlide((s) => (s + 1) % heroImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition hidden md:block"><ChevronRight size={24} /></button>
      </section>

      {/* Destinations */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold">Popular <span className="text-blue-500 dark:text-yellow-400">Destinations</span></h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explore the most beautiful cities across Rajasthan and India</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={d.href} className="group block relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                  <Image src={d.image} alt={d.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1"><MapPin size={16} /><span className="text-sm">{d.desc}</span></div>
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
            <h2 className="text-3xl md:text-5xl font-bold">Featured <span className="text-blue-500 dark:text-yellow-400">Tour Packages</span></h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Curated experiences for every type of traveler</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, i) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <Link href={`/packages/${pkg.id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative h-56">
                    <Image src={pkg.image} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1"><Star size={14} />{pkg.rating}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 dark:group-hover:text-yellow-400 transition-colors">{pkg.name}</h3>
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <span className="flex items-center gap-1"><Clock size={14} />{pkg.duration}</span>
                      <span className="flex items-center gap-1"><Users size={14} />2-10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400">&#8377;{pkg.price.toLocaleString()}</p>
                      <span className="flex items-center gap-1 text-blue-500 dark:text-yellow-400 font-medium group-hover:gap-2 transition-all">View <ArrowRight size={16} /></span>
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

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold">What Our <span className="text-blue-500 dark:text-yellow-400">Travelers Say</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={18} className="fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold">Frequently Asked <span className="text-blue-500 dark:text-yellow-400">Questions</span></h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left font-semibold hover:text-blue-500 dark:hover:text-yellow-400 transition">
                  <span>{faq.q}</span>
                  <ChevronRight size={20} className={`transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-gray-600 dark:text-gray-400">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
