"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import VideoModal from "@/components/VideoModal";

type PlaceCard = { title: string; image: string };
type VideoCard = { title: string; youtubeId: string };

type CityPageData = {
  name: string;
  heading: string;
  intro: string;
  banner: string;
  sightseeing: PlaceCard[];
  cuisine: PlaceCard[];
  heritage: PlaceCard[];
  videos: VideoCard[];
};

const cityData: Record<string, CityPageData> = {
  delhi: {
    name: "Delhi",
    heading: "Discover the Heart of India - Delhi",
    intro: "Delhi is India's capital city blending Mughal heritage, colonial architecture, and modern culture.",
    banner: "/images/delhi/india-gate.jpg",
    sightseeing: [
      { title: "India Gate", image: "/images/delhi/india-gate.jpg" },
      { title: "Red Fort", image: "/images/delhi/red-fort.png" },
      { title: "Qutub Minar", image: "/images/delhi/qutub-minar.png" },
      { title: "Lotus Temple", image: "/images/delhi/lotus-temple.png" },
      { title: "Humayun's Tomb", image: "/images/delhi/humayun-tomb.png" },
    ],
    cuisine: [
      { title: "Chole Bhature", image: "/images/delhi/cuisines/chole-bhature.png" },
      { title: "Paratha", image: "/images/delhi/cuisines/paratha.png" },
      { title: "Butter Chicken", image: "/images/delhi/cuisines/butter-chicken.png" },
      { title: "Jalebi", image: "/images/delhi/cuisines/jalebi.png" },
    ],
    heritage: [
      { title: "Mughal Architecture", image: "/images/delhi/humayun-tomb2.png" },
      { title: "Old Delhi Bazaars", image: "/images/delhi/chandni-chowk.png" },
      { title: "Colonial Landmarks", image: "/images/delhi/india-gate.jpg" },
    ],
    videos: [
      { title: "Destination - Delhi | India", youtubeId: "AoLiXe05-Z8" },
      { title: "Exploring Old Delhi", youtubeId: "jkndb-gBce4" },
    ],
  },
  agra: {
    name: "Agra",
    heading: "Experience the Timeless Beauty of Agra",
    intro: "Agra is a heritage city on the Yamuna river, celebrated for timeless Mughal monuments and artistic legacy.",
    banner: "/images/agra/agra-fort.png",
    sightseeing: [
      { title: "Taj Mahal", image: "/images/agra/taj-mahal.png" },
      { title: "Agra Fort", image: "/images/agra/agra-fort.png" },
      { title: "Mehtab Bagh", image: "/images/agra/mehtab-bagh.png" },
      { title: "Fatehpur Sikri", image: "/images/agra/fatehpur-sikri.png" },
    ],
    cuisine: [
      { title: "Petha", image: "/images/agra/cuisines/petha.png" },
      { title: "Mughlai Korma", image: "/images/agra/cuisines/mughlai-korma.png" },
      { title: "Bedai and Aloo Sabzi", image: "/images/agra/cuisines/bedai-aloo-sabzi.png" },
      { title: "Mughlai Fine Platter", image: "/images/agra/cuisines/mughlai-fine-platter.png" },
    ],
    heritage: [
      { title: "Mughal Empire History", image: "/images/agra/jama-masjid.png" },
      { title: "UNESCO Heritage Sites", image: "/images/agra/taj-mahal.png" },
      { title: "Persian-Indian Art Fusion", image: "/images/agra/diwan-i-khas.png" },
    ],
    videos: [
      { title: "Taj Mahal Travel Guide", youtubeId: "6rTpDK1ea0s" },
      { title: "Agra City Tour", youtubeId: "WMI489s3l8E" },
    ],
  },
  jaipur: {
    name: "Jaipur",
    heading: "Step Into Royal Rajasthan - Jaipur",
    intro: "Jaipur, the Pink City of Rajasthan, is known for Rajput forts, colorful markets, and regal traditions.",
    banner: "/images/jaipur/hawa-mahal.png",
    sightseeing: [
      { title: "Amber Fort", image: "/images/jaipur/amber-fort.png" },
      { title: "Hawa Mahal", image: "/images/jaipur/hawa-mahal.png" },
      { title: "City Palace", image: "/images/jaipur/city-palace.png" },
      { title: "Jal Mahal", image: "/images/jaipur/jal-mahal.jpg" },
      { title: "Jantar Mantar", image: "/images/jaipur/jantar-mantar.png" },
    ],
    cuisine: [
      { title: "Dal Baati Churma", image: "/images/jaipur/cuisines/dal-baati-churma.png" },
      { title: "Laal Maas", image: "/images/jaipur/cuisines/laal-maas.png" },
      { title: "Ghewar", image: "/images/jaipur/cuisines/ghewar.png" },
      { title: "Pyaaz Kachori", image: "/images/jaipur/cuisines/pyaaz-kachori.png" },
    ],
    heritage: [
      { title: "Rajput Architecture", image: "/images/jaipur/amber-fort.png" },
      { title: "Pink City Traditions", image: "/images/jaipur/pink-city-traditions.png" },
      { title: "Royal Craftsmanship", image: "/images/jaipur/royal-craftsmanship.png" },
    ],
    videos: [
      { title: "Jaipur Travel Guide", youtubeId: "kRZLUCWswlw" },
      { title: "Amber Fort Jaipur Tour", youtubeId: "zJSe2urMURE" },
    ],
  },
  udaipur: {
    name: "Udaipur",
    heading: "Experience Romance & Royalty - Udaipur",
    intro: "Udaipur, the City of Lakes, is known for romantic landscapes, palaces, and serene waters.",
    banner: "/images/udaipur/monsoon-palace.png",
    sightseeing: [
      { title: "Lake Pichola", image: "/images/udaipur/lake-pichola.png" },
      { title: "Fateh Sagar Lake", image: "/images/udaipur/fatehsagar-lake.png" },
      { title: "Jag Mandir", image: "/images/udaipur/jag-mandir.png" },
      { title: "Bagore Ki Haveli", image: "/images/udaipur/bagore-ki-haveli.png" },
      { title: "Sajjangarh Palace (Monsoon Palace)", image: "/images/udaipur/monsoon-palace.png" },
      { title: "Jagdish Temple", image: "/images/udaipur/jagdish-temple.png" },
      { title: "Saheliyon Ki Bari", image: "/images/udaipur/saheliyon-ki-bari.png" },
      { title: "Shilpgram", image: "/images/udaipur/shilpgram.png" },
      { title: "Doodh Talai", image: "/images/udaipur/doodh-talai.png" },
    ],
    cuisine: [
      { title: "Dal Baati Churma", image: "/images/udaipur/cuisines/dal-baati-churma.png" },
      { title: "Gatte Ki Sabzi", image: "/images/udaipur/cuisines/gatte-ki-sabzi.png" },
      { title: "Laal Maas", image: "/images/udaipur/cuisines/laal-maas.png" },
      { title: "Daal Kachori", image: "/images/udaipur/cuisines/daal-kachori.png" },
      { title: "Mirchi Bada", image: "/images/udaipur/cuisines/mirchi-bada.png" },
      { title: "Malpua", image: "/images/udaipur/cuisines/malpua.png" },
    ],
    heritage: [
      { title: "Royal Mewar Legacy", image: "/images/udaipur/city-palace.png" },
      { title: "Lake-Centric Architecture", image: "/images/udaipur/lake-pichola.png" },
      { title: "Art, Culture & Folk Traditions", image: "/images/udaipur/bagore-ki-haveli.png" },
      { title: "Handicrafts & Local Art", image: "/images/udaipur/shilpgram.png" },
    ],
    videos: [
      { title: "Udaipur Travel Guide", youtubeId: "4-o-uQnIK6w" },
      { title: "Udaipur in 4K - Lake City,Udaipur", youtubeId: "awbSDvDCc_M" },
    ],
  },
  bikaner: {
    name: "Bikaner",
    heading: "Explore Royal Forts & Desert Heritage - Bikaner",
    intro: "Bikaner is a vibrant desert city known for its grand forts, royal palaces, and rich cultural heritage. Located in the heart of the Thar Desert, it offers a unique blend of history, architecture, and authentic Rajasthani experiences.",
    banner: "/images/bikaner/vesta-palace.png",
    sightseeing: [
      { title: "Junagarh Fort", image: "/images/bikaner/junagarh-fort.png" },
      { title: "Karni Mata Temple", image: "/images/bikaner/karni-mata.png" },
      { title: "Lalgarh Palace", image: "/images/bikaner/lalgarh-palace.png" },
      { title: "Rampuria Havelis", image: "/images/bikaner/rampuria-haveli.png" },
      { title: "National Research Centre on Camel", image: "/images/bikaner/camel-centre.png" },
      { title: "Gajner Palace", image: "/images/bikaner/gajner-palace.png" },
      { title: "Bikaner Camel Festival Grounds", image: "/images/bikaner/camel-festival.png" },
      { title: "Prachina Museum", image: "/images/bikaner/prachina-museum.png" },
    ],
    cuisine: [
      { title: "Bikaneri Bhujia", image: "/images/bikaner/cuisines/bikaneri-bhujia.png" },
      { title: "Bikaneri Rasgulla", image: "/images/bikaner/cuisines/rasgulla.png" },
      { title: "Ghewar", image: "/images/bikaner/cuisines/ghewar.png" },
      { title: "Kachori", image: "/images/bikaner/cuisines/kachori.png" },
      { title: "Dal Baati Churma", image: "/images/bikaner/cuisines/dal-baati-churma.png" },
      { title: "Papad Ki Sabzi", image: "/images/bikaner/cuisines/papad-ki-sabzi.png" },
    ],
    heritage: [
      { title: "Desert Kingdom Legacy", image: "/images/bikaner/junagarh-fort.png" },
      { title: "Architectural Grandeur", image: "/images/bikaner/lalgarh-palace.png" },
      { title: "Camel Culture & Traditions", image: "/images/bikaner/camel-centre.png" },
      { title: "Festivals & Cultural Vibrance", image: "/images/bikaner/camel-festival.png" },
    ],
    videos: [
      { title: "Bikaner Travel Guide", youtubeId: "rD62i15h1Vc" },
      { title: "Explore Junagarh Fort Bikaner", youtubeId: "p7pUhTM2048" },
      { title: "Bikaner Camel Festival Experience", youtubeId: "Rz1akAD2hks" },
    ],
  },
  ajmer: {
    name: "Ajmer",
    heading: "Experience Spiritual Serenity & Heritage - Ajmer",
    intro: "Ajmer is one of India's most important spiritual destinations, known for the revered Ajmer Sharif Dargah and its rich blend of Rajput and Mughal heritage. Surrounded by the Aravalli hills, the city offers a peaceful yet culturally vibrant travel experience.",
    banner: "/images/ajmer/dargah.png",
    sightseeing: [
      { title: "Ajmer Sharif Dargah", image: "/images/ajmer/dargah.png" },
      { title: "Ana Sagar Lake", image: "/images/ajmer/ana-sagar-lake.png" },
      { title: "Taragarh Fort", image: "/images/ajmer/taragarh-fort.png" },
      { title: "Akbar Palace & Museum", image: "/images/ajmer/akbar-palace.png" },
      { title: "Nareli Jain Temple", image: "/images/ajmer/narelli-jain.png" },
      { title: "Adhai Din Ka Jhonpra", image: "/images/ajmer/adhai-din-ka-jhonpra.png" },
      { title: "Varun Sagar Lake", image: "/images/ajmer/varun-sagar-lake.png" },
      { title: "Daulat Bagh", image: "/images/ajmer/daulat-bagh.png" },
    ],
    cuisine: [
      { title: "Ajmeri Kachori", image: "/images/ajmer/cuisines/ajmeri-kachori.png" },
      { title: "Sohan Halwa", image: "/images/ajmer/cuisines/sohan-halwa.png" },
      { title: "Kadhi Kachori", image: "/images/ajmer/cuisines/kadhi-kachori.png" },
      { title: "Mawa Kachori", image: "/images/ajmer/cuisines/mawa-kachori.png" },
      { title: "Daal Pakwan", image: "/images/ajmer/cuisines/daal-pakwan.png" },
      { title: "Rabri", image: "/images/ajmer/cuisines/rabri.png" },
      { title: "Paneer Tikka (Local Style)", image: "/images/ajmer/cuisines/paneer-tikka.png" },
    ],
    heritage: [
      { title: "Spiritual Significance", image: "/images/ajmer/dargah.png" },
      { title: "Mughal & Rajput Influence", image: "/images/ajmer/akbar-palace.png" },
      { title: "Ancient Architecture", image: "/images/ajmer/adhai-din-ka-jhonpra.png" },
      { title: "Cultural Harmony", image: "/images/ajmer/ana-sagar-lake.png" },
    ],
    videos: [
      { title: "Ajmer Travel Guide", youtubeId: "piCg3OAiPQM" },
      { title: "Ajmer Sharif Dargah Experience", youtubeId: "C6YJCa2vQ7E" },
      { title: "Top Places to Visit in Ajmer", youtubeId: "rFkgLp5c_vM" },
    ],
  },
  kota: {
    name: "Kota",
    heading: "Explore Heritage, Rivers & Hidden Gems - Kota",
    intro: "Kota is a unique blend of royal heritage, scenic river landscapes, and modern culture. Located along the Chambal River, it offers historic palaces, gardens, and peaceful attractions beyond typical tourist crowds.",
    banner: "/images/kota/chambal-garden.png",
    sightseeing: [
      { title: "Kota Garh", image: "/images/kota/kota-garh.png" },
      { title: "Chambal River Front", image: "/images/kota/chambal-river.png" },
      { title: "Seven Wonders Park", image: "/images/kota/seven-wonders.png" },
      { title: "Chambal Garden", image: "/images/kota/chambal-garden.png" },
      { title: "Jagmandir Palace (Kota)", image: "/images/kota/jagmandir-palace.png" },
      { title: "Kishore Sagar Lake", image: "/images/kota/kishore-sagar.png" },
      { title: "Garadia Mahadev Temple", image: "/images/kota/garadia-mahadev.png" },
      { title: "City Park Kota", image: "/images/kota/city-park.png" },
    ],
    cuisine: [
      { title: "Kota Kachori", image: "/images/kota/cuisines/kota-kachori.png" },
      { title: "Rabdi", image: "/images/kota/cuisines/kota-rabdi.png" },
      { title: "Besan Chakki", image: "/images/kota/cuisines/besan-chakki.png" },
      { title: "Mawa Jalebi", image: "/images/kota/cuisines/mawa-jalebi.png" },
      { title: "Poha with Sev", image: "/images/kota/cuisines/poha-sev.png" },
      { title: "Aloo Tikki Chaat", image: "/images/kota/cuisines/aloo-tikki-chaat.png" },
    ],
    heritage: [
      { title: "Rajput Royal Heritage", image: "/images/kota/kota-garh.png" },
      { title: "Chambal River Civilization", image: "/images/kota/chambal-river.png" },
      { title: "Architectural Blend", image: "/images/kota/jagmandir-palace.png" },
      { title: "Modern Cultural Identity", image: "/images/kota/city-park.png" },
    ],
    videos: [
      { title: "Kota Travel Guide", youtubeId: "nSk60EJY7Go" },
      { title: "Garadia Mahadev Viewpoint Kota", youtubeId: "UYAPTy1aEXU" },
      { title: "Chambal Riverfront Kota Experience", youtubeId: "uVAwKPcXs40" },
    ],
  },
  jaisalmer: {
    name: "Jaisalmer",
    heading: "Experience the Golden Desert & Royal Forts - Jaisalmer",
    intro: "Jaisalmer, known as the Golden City, is a mesmerizing desert destination famous for its sandstone architecture, vast sand dunes, and rich cultural heritage. Located in the heart of the Thar Desert, it offers unforgettable experiences like camel safaris, desert camps, and royal forts.",
    banner: "/images/jaisalmer/camel-safari.png",
    sightseeing: [
      { title: "Jaisalmer Fort", image: "/images/jaisalmer/jaisalmer-fort.png" },
      { title: "Sam Sand Dunes", image: "/images/jaisalmer/sam-sand-dunes.png" },
      { title: "Patwon Ki Haveli", image: "/images/jaisalmer/patwon-ki-haveli.png" },
      { title: "Gadisar Lake", image: "/images/jaisalmer/gadisar-lake.png" },
      { title: "Salim Singh Ki Haveli", image: "/images/jaisalmer/salim-singh-haveli.png" },
      { title: "Nathmal Ki Haveli", image: "/images/jaisalmer/nathmal-haveli.png" },
      { title: "Jaisalmer Jain Temples", image: "/images/jaisalmer/jain-temple.png" },
      { title: "Kuldhara Village", image: "/images/jaisalmer/kuldhara-village.png" },
      { title: "Bada Bagh", image: "/images/jaisalmer/bada-bagh.png" },
    ],
    cuisine: [
      { title: "Ker Sangri", image: "/images/jaisalmer/cuisines/ker-sangri.png" },
      { title: "Bajre Ki Roti with Lehsun Chutney", image: "/images/jaisalmer/cuisines/bajra-roti.png" },
      { title: "Panchkuta", image: "/images/jaisalmer/cuisines/panchkuta.png" },
      { title: "Makhaniya Lassi", image: "/images/jaisalmer/cuisines/makhaniya-lassi.png" },
      { title: "Ghotua Ladoo", image: "/images/jaisalmer/cuisines/ghotua-ladoo.png" },
      { title: "Kadi Pakoda (Desert Style)", image: "/images/jaisalmer/cuisines/kadhi-pakoda.png" },
    ],
    heritage: [
      { title: "Golden Desert Legacy", image: "/images/jaisalmer/desert-camp.png" },
      { title: "Living Fort Culture", image: "/images/jaisalmer/jaisalmer-fort.png" },
      { title: "Desert Traditions", image: "/images/jaisalmer/thar-desert.png" },
      { title: "Sandstone Architecture", image: "/images/jaisalmer/patwon-ki-haveli.png" },
    ],
    videos: [
      { title: "Jaisalmer Travel Guide", youtubeId: "lfGAuwuoXjQ" },
      { title: "Jaisalmer Desert Safari Experience", youtubeId: "WkSUEyeT288" },
      { title: "Top Places to Visit in Jaisalmer", youtubeId: "gr-MS4dUnN4" },
    ],
  },
};

export default function DestinationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const data = cityData[city.toLowerCase()];
  const [activeVideo, setActiveVideo] = useState<VideoCard | null>(null);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center pt-28">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Destination not found</h1>
        <Link href="/" className="text-blue-500 dark:text-yellow-400 hover:underline">Go back home</Link>
      </div>
    </div>
  );

  // prepare heading parts to highlight city name when present
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingContainsName = data.heading.toLowerCase().includes(data.name.toLowerCase());
  const headingParts = headingContainsName
    ? data.heading.split(new RegExp(`(${escapeRegExp(data.name)})`, "i"))
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <div className="relative h-80 md:h-125">
        <Image src={data.banner} alt={data.name} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/55" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-black/70 dark:text-white/70">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-black dark:text-white hover:underline hover:text-blue-400 dark:hover:text-yellow-400 transition-colors">Home</Link>
              </li>
              <li className="text-black/40 dark:text-white/40">/</li>
              <li className="text-black dark:text-white hover:text-blue-400 dark:hover:text-yellow-400 transition-colors" aria-current="page">{data.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white leading-tight">
            {headingParts ? (
              headingParts.map((part, i) => {
                const isName = part.toLowerCase() === data.name.toLowerCase();
                return isName ? (
                  <span key={i} className="text-blue-400 dark:text-yellow-400">{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                );
              })
            ) : (
              <>
                {data.heading}
                <span className="ml-2 text-blue-400 dark:text-yellow-400">{data.name}</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-black dark:text-white text-base md:text-lg max-w-3xl">{data.intro}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Sightseeing */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8">Signature Sights of <span className="text-blue-400 dark:text-yellow-400">{data.name}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.sightseeing.map((place) => (
              <article key={place.title} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <div className="relative h-52">
                  <Image src={place.image} alt={place.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-blue-400 dark:group-hover:text-yellow-400 transition-colors">{place.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cuisine */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8">Flavors You Must Try in <span className="text-blue-400 dark:text-yellow-400">{data.name}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.cuisine.map((dish) => (
              <article key={dish.title} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <div className="relative h-52">
                  <Image src={dish.image} alt={dish.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-blue-400 dark:group-hover:text-yellow-400 transition-colors">{dish.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Heritage */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8">Living Heritage of <span className="text-blue-400 dark:text-yellow-400">{data.name}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.heritage.map((item) => (
              <article key={item.title} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <div className="relative h-52">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-black dark:text-white group-hover:text-blue-400 dark:group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Videos */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8">Watch <span className="text-blue-400 dark:text-yellow-400">{data.name}</span> in Motion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.videos.map((video) => (
              <button
                key={video.youtubeId}
                type="button"
                onClick={() => setActiveVideo(video)}
                className="group text-left bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={`${video.title} thumbnail`}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg ring-2 ring-white/70 transition-transform duration-300 group-hover:scale-110">
                      <Play size={22} fill="currentColor" />
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-blue-400 dark:group-hover:text-yellow-400 transition-colors">{video.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-500 dark:bg-yellow-400 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white dark:text-black mb-4">Plan Your Trip to {data.name}</h2>
          <p className="text-white/90 dark:text-black/80 mb-6 max-w-2xl mx-auto">Discover curated packages, local experiences, and seamless itineraries designed for your perfect journey.</p>
          <Link href="/packages" className="inline-flex items-center gap-2 bg-white dark:bg-black text-blue-500 dark:text-yellow-400 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            View Packages <ArrowRight size={18} />
          </Link>
        </section>
      </div>

      <VideoModal
        isOpen={Boolean(activeVideo)}
        videoId={activeVideo?.youtubeId || ""}
        title={activeVideo?.title || "Destination Video"}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
