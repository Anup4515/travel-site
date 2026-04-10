"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, IndianRupee, Star, ArrowRight, Filter } from "lucide-react";
import { IPackage } from "@/types";

const categories = [
  { key: "", label: "All" },
  { key: "golden-triangle", label: "Golden Triangle" },
  { key: "heritage", label: "Heritage" },
  { key: "adventure", label: "Adventure" },
  { key: "spiritual", label: "Spiritual" },
  { key: "beach", label: "Beach" },
  { key: "cultural", label: "Cultural" },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    fetch(`/api/packages?${params}`).then((r) => r.json()).then(setPackages).catch(() => {}).finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold">Tour <span className="text-blue-500 dark:text-yellow-400">Packages</span></h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explore our curated collection of travel packages across India</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center">
          <Filter size={18} className="text-gray-400 mt-2 shrink-0" />
          {categories.map((c) => (
            <button key={c.key} onClick={() => setCategory(c.key)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${category === c.key ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{c.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Link key={pkg._id || pkg.packageId} href={`/packages/${pkg.packageId || pkg._id}`}
                className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative h-56">
                  <Image src={pkg.image || "/images/tajmahal.jpg"} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {pkg.featured && <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star size={12} />Featured</div>}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">{pkg.category}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 dark:group-hover:text-yellow-400 transition-colors">{pkg.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                    <span className="flex items-center gap-1"><Clock size={14} />{pkg.duration}</span>
                    <span className="flex items-center gap-1"><Users size={14} />{pkg.cities?.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400 flex items-center"><IndianRupee size={18} />{(pkg.price ?? 0).toLocaleString()}</p>
                    <span className="flex items-center gap-1 text-blue-500 dark:text-yellow-400 font-medium group-hover:gap-2 transition-all">Details <ArrowRight size={16} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && packages.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No packages found for this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
