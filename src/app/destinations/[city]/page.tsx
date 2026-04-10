"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const cityData: Record<string, { name: string; tagline: string; description: string; heroImage: string; attractions: Array<{ name: string; image: string; description: string }>; bestTime: string }> = {
  jaipur: {
    name: "Jaipur", tagline: "The Pink City", heroImage: "/images/jaipur1.jpg",
    description: "Jaipur, the capital of Rajasthan, is known for its stunning pink-hued architecture, majestic forts, and vibrant culture. A key part of the Golden Triangle circuit.",
    bestTime: "October to March",
    attractions: [
      { name: "Amber Fort", image: "/images/jaipur1.jpg", description: "Majestic hilltop fort with stunning views and intricate mirror work." },
      { name: "City Palace", image: "/images/jaipur2.jpg", description: "A splendid blend of Rajasthani and Mughal architecture." },
      { name: "Hawa Mahal", image: "/images/jaipur3.jpg", description: "The iconic Palace of Winds with 953 small windows." },
    ],
  },
  udaipur: {
    name: "Udaipur", tagline: "City of Lakes", heroImage: "/images/udaipur/city-palace.png",
    description: "Often called the Venice of the East, Udaipur is famous for its beautiful lakes, palaces, and romantic ambiance.",
    bestTime: "September to March",
    attractions: [
      { name: "City Palace", image: "/images/udaipur/city-palace.png", description: "A magnificent palace complex overlooking Lake Pichola." },
      { name: "Lake Pichola", image: "/images/udaipur/lake-pichola.png", description: "A serene artificial lake surrounded by hills and palaces." },
      { name: "Jagdish Temple", image: "/images/udaipur/jagdish-temple.png", description: "A stunning Indo-Aryan style temple in the heart of the city." },
    ],
  },
  delhi: {
    name: "Delhi", tagline: "India's Capital", heroImage: "/images/delhi/red-fort.png",
    description: "Delhi, India's capital, blends ancient history with modern vibrancy. From Mughal monuments to bustling markets, it's a city that never sleeps.",
    bestTime: "October to March",
    attractions: [
      { name: "Red Fort", image: "/images/delhi/red-fort.png", description: "UNESCO World Heritage Site, a symbol of Mughal power." },
      { name: "India Gate", image: "/images/delhi/india-gate.jpg", description: "The war memorial standing tall in the heart of New Delhi." },
      { name: "Qutub Minar", image: "/images/delhi/qutub-minar.png", description: "The tallest brick minaret in the world." },
    ],
  },
  agra: {
    name: "Agra", tagline: "Home of Taj Mahal", heroImage: "/images/agra1.jpg",
    description: "Agra is world-famous for the Taj Mahal, one of the seven wonders of the world. It's a city steeped in Mughal history.",
    bestTime: "October to March",
    attractions: [
      { name: "Taj Mahal", image: "/images/agra1.jpg", description: "The iconic monument of love, a UNESCO World Heritage Site." },
      { name: "Agra Fort", image: "/images/agra2.jpg", description: "A massive red sandstone fortress on the banks of the Yamuna." },
      { name: "Fatehpur Sikri", image: "/images/agra3.jpg", description: "The abandoned Mughal capital, a masterpiece of architecture." },
    ],
  },
  jaisalmer: {
    name: "Jaisalmer", tagline: "The Golden City", heroImage: "/images/jaisalmer1.jpg",
    description: "Rising from the Thar Desert, Jaisalmer is known for its golden sandstone architecture, desert safaris, and rich Rajasthani culture.",
    bestTime: "October to March",
    attractions: [
      { name: "Jaisalmer Fort", image: "/images/jaisalmer1.jpg", description: "A living fort with shops, restaurants, and residences within." },
      { name: "Sam Sand Dunes", image: "/images/jaisalmer2.jpg", description: "Experience camel safaris and desert camping under the stars." },
      { name: "Patwon Ki Haveli", image: "/images/jaisalmer3.jpg", description: "A cluster of five ornately decorated havelis." },
    ],
  },
  bikaner: {
    name: "Bikaner", tagline: "Camel Country", heroImage: "/images/bikaner1.jpg",
    description: "Bikaner is famous for its camel breeding farm, the magnificent Junagarh Fort, and its unique snack culture.",
    bestTime: "October to March",
    attractions: [
      { name: "Junagarh Fort", image: "/images/bikaner1.jpg", description: "An impressive fort that was never conquered." },
      { name: "Karni Mata Temple", image: "/images/bikaner2.jpg", description: "The famous Rat Temple, home to thousands of sacred rats." },
      { name: "Camel Research Centre", image: "/images/bikaner3.jpg", description: "Learn about camel breeding and enjoy camel milk products." },
    ],
  },
  ajmer: {
    name: "Ajmer", tagline: "City of Pilgrimage", heroImage: "/images/ajmer1.jpg",
    description: "Ajmer is a major pilgrimage center, home to the shrine of Sufi saint Khwaja Moinuddin Chishti and the sacred Pushkar Lake nearby.",
    bestTime: "October to March",
    attractions: [
      { name: "Dargah Sharif", image: "/images/ajmer1.jpg", description: "The revered shrine attracting millions of pilgrims annually." },
      { name: "Ana Sagar Lake", image: "/images/ajmer2.jpg", description: "A beautiful artificial lake with gardens along its banks." },
      { name: "Pushkar", image: "/images/ajmer3.jpg", description: "The holy town with the only Brahma temple in the world." },
    ],
  },
  kota: {
    name: "Kota", tagline: "Education Hub of India", heroImage: "/images/kota1.jpg",
    description: "Beyond its reputation as an education hub, Kota has beautiful palaces, gardens, and the Chambal River running through it.",
    bestTime: "October to March",
    attractions: [
      { name: "City Palace", image: "/images/kota1.jpg", description: "A stunning palace with Rajput miniature paintings." },
      { name: "Chambal Gardens", image: "/images/kota2.jpg", description: "Beautiful gardens along the Chambal River." },
      { name: "Jagmandir Palace", image: "/images/kota3.jpg", description: "A palace built in the middle of Kishore Sagar Lake." },
    ],
  },
};

export default function DestinationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const data = cityData[city.toLowerCase()];

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Destination not found</h1>
        <Link href="/" className="text-blue-500 dark:text-yellow-400 hover:underline">Go back home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-80 md:h-[500px]">
        <Image src={data.heroImage} alt={data.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16">
          <div className="flex items-center gap-2 text-yellow-400 mb-2"><MapPin size={18} /><span>{data.tagline}</span></div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">{data.name}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* About */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">About {data.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl">{data.description}</p>
          <p className="mt-4 text-sm text-gray-500">Best time to visit: <span className="font-semibold text-blue-500 dark:text-yellow-400">{data.bestTime}</span></p>
        </div>

        {/* Attractions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Top Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.attractions.map((a) => (
              <div key={a.name} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
                <div className="relative h-56">
                  <Image src={a.image} alt={a.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{a.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-500 dark:bg-yellow-400 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white dark:text-black mb-4">Plan Your Trip to {data.name}</h2>
          <p className="text-white/80 dark:text-black/70 mb-6 max-w-xl mx-auto">Explore our curated packages and book your perfect getaway today.</p>
          <Link href="/packages" className="inline-flex items-center gap-2 bg-white dark:bg-black text-blue-500 dark:text-yellow-400 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            View Packages <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
