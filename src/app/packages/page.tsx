"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, IndianRupee, Star, ArrowRight, Filter, Search, Heart, X } from "lucide-react";
import toast from "react-hot-toast";
import { IPackage } from "@/types";

const RAJASTHAN_LOOP_UNSPLASH = "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80";

const isRajasthanLoopPackage = (pkg: IPackage) => {
  const name = (pkg.name || "").toLowerCase();
  return name.includes("jodhpur") && name.includes("jaisalmer") && name.includes("bikaner") && name.includes("jaipur");
};

const getPackageImage = (pkg: IPackage) => {
  if (isRajasthanLoopPackage(pkg)) return RAJASTHAN_LOOP_UNSPLASH;
  return pkg.image || "/images/tajmahal.jpg";
};

const categories = [
  { key: "", label: "All" },
  { key: "golden-triangle", label: "Golden Triangle" },
  { key: "heritage", label: "Heritage" },
  { key: "adventure", label: "Adventure" },
  { key: "spiritual", label: "Spiritual" },
  { key: "beach", label: "Beach" },
  { key: "cultural", label: "Cultural" },
];

const difficultyLevels = [
  { key: "", label: "All Levels" },
  { key: "easy", label: "Easy" },
  { key: "moderate", label: "Moderate" },
  { key: "challenging", label: "Challenging" },
];

const sortOptions = [
  { key: "featured", label: "Featured" },
  { key: "price-low", label: "Price: Low to High" },
  { key: "price-high", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
  { key: "rating", label: "Top Rated" },
];

// Calculate average rating from actual reviews
const getAverageRating = (reviews?: any[]) => {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};



export default function PackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [durationFilter, setDurationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewPkg, setQuickViewPkg] = useState<IPackage | null>(null);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    fetch(`/api/packages?${params}`)
      .then((r) => r.json())
      .then(setPackages)
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load wishlisted from localStorage
    const wishlistKeys = Object.keys(localStorage).filter(key => key.startsWith("wishlist_"));
    setWishlisted(new Set(wishlistKeys.map(key => key.replace("wishlist_", ""))));
  }, [category]);

  const filteredAndSortedPackages = packages
    .filter((pkg) => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
      const matchesDifficulty = !difficulty || pkg.difficulty?.toLowerCase() === difficulty;
      const matchesDuration = !durationFilter || pkg.durationDays.toString() === durationFilter;
      return matchesSearch && matchesPrice && matchesDifficulty && matchesDuration;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          const ratingA = getAverageRating(a.reviews) || 0;
          const ratingB = getAverageRating(b.reviews) || 0;
          return ratingB - ratingA;
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

  const handleWishlist = (pkg: IPackage) => {
    const key = `wishlist_${pkg._id || pkg.packageId}`;
    const id = pkg._id || pkg.packageId;
    
    if (wishlisted.has(id)) {
      localStorage.removeItem(key);
      setWishlisted(new Set([...wishlisted].filter(w => w !== id)));
      toast.success("Removed from wishlist");
    } else {
      localStorage.setItem(key, "true");
      setWishlisted(new Set([...wishlisted, id]));
      toast.success("Added to wishlist");
    }
  };

  const maxPrice = Math.max(...packages.map(p => p.price), 100000);

  return (
    <div className="min-h-screen pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-black dark:text-white">Tour <span className="text-blue-400 dark:text-yellow-400">Packages</span></h1>
          <p className="mt-4 text-black dark:text-white max-w-2xl mx-auto">Explore our curated collection of travel packages across India</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Search packages by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-yellow-400 outline-none transition text-black dark:text-white"
            />
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black rounded-lg hover:opacity-90 transition font-medium"
          >
            <Filter size={18} /> Filters {Object.values({ category, difficulty, durationFilter }).filter(v => v).length > 0 && `(${Object.values({ category, difficulty, durationFilter }).filter(v => v).length})`}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white outline-none focus:border-blue-500 dark:focus:border-yellow-400 transition cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>

          <div className="flex-1" />

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedPackages.length} packages found
          </span>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 space-y-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-3">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      category === c.key
                        ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black"
                        : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-3">Difficulty Level</label>
              <div className="flex gap-2 flex-wrap">
                {difficultyLevels.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDifficulty(d.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      difficulty === d.key
                        ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black"
                        : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-3">
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-3">Duration (Days)</label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white outline-none focus:border-blue-500 dark:focus:border-yellow-400 transition cursor-pointer"
              >
                <option value="">All Durations</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
          </div>
        )}

        {/* Category Filter Bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scroll-smooth -mx-4 px-4 sm:px-0 sm:mx-0">
          <Filter size={18} className="text-gray-400 mt-2 shrink-0 hidden sm:block" />
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition shrink-0 ${
                category === c.key
                  ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPackages.map((pkg) => {
              const rating = getAverageRating(pkg.reviews);
              const reviewCount = pkg.reviews?.length || 0;
              const discount = pkg.discount || 0;
              const id = pkg._id || pkg.packageId;
              const isWishlisted = wishlisted.has(id);

              return (
                <div
                  key={id}
                  className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={getPackageImage(pkg)}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      {discount > 0 && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          -{discount}%
                        </div>
                      )}
                      {pkg.featured && (
                        <div className="bg-blue-400 dark:bg-yellow-400 text-white dark:text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} /> Featured
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWishlist(pkg);
                      }}
                      className="absolute top-3 left-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-lg transition z-10"
                    >
                      <Heart
                        size={20}
                        className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"}
                      />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {pkg.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-black dark:text-white group-hover:text-blue-400 dark:group-hover:text-yellow-400 transition-colors">
                      {pkg.name}
                    </h3>

                    <p className="text-black dark:text-white text-sm mb-4 line-clamp-2">{pkg.description}</p>

                    {/* Rating */}
                    {rating !== null && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-black dark:text-white">{rating}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex items-center gap-4 text-black dark:text-gray-400 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {pkg.durationDays}D/{pkg.durationNights}N
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {pkg.cities?.length || 0} cities
                      </span>
                    </div>

                    {/* Difficulty Badge */}
                    {pkg.difficulty && (
                      <div className="mb-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            pkg.difficulty.toLowerCase() === "easy"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : pkg.difficulty.toLowerCase() === "moderate"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {pkg.difficulty}
                        </span>
                      </div>
                    )}

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        {discount > 0 ? (
                          <>
                            <p className="text-2xl font-bold text-blue-400 dark:text-yellow-400 flex items-center">
                              <IndianRupee size={18} /> {Math.round(pkg.price * (1 - discount / 100)).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                              ₹{(pkg.price ?? 0).toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-2xl font-bold text-blue-400 dark:text-yellow-400 flex items-center">
                            <IndianRupee size={18} /> {(pkg.price ?? 0).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setQuickViewPkg(pkg)}
                          className="px-3 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm font-medium"
                        >
                          Preview
                        </button>
                        <Link
                          href={`/packages/${pkg.packageId || pkg._id}`}
                          className="flex items-center gap-1 text-blue-400 dark:text-yellow-400 font-medium group-hover:gap-2 transition-all text-sm"
                        >
                          Details <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredAndSortedPackages.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No packages found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategory("");
                setDifficulty("");
                setDurationFilter("");
                setPriceRange([0, maxPrice]);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black rounded-lg hover:opacity-90 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewPkg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black dark:text-white">{quickViewPkg.name}</h3>
              <button
                onClick={() => setQuickViewPkg(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} className="text-black dark:text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-black dark:text-white mb-2">Destination</h4>
                <p className="text-gray-600 dark:text-gray-400">{quickViewPkg.destination}</p>
              </div>

              <div>
                <h4 className="font-bold text-black dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-400">{quickViewPkg.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-black dark:text-white mb-2">Duration</h4>
                  <p className="text-gray-600 dark:text-gray-400">{quickViewPkg.durationDays} Days / {quickViewPkg.durationNights} Nights</p>
                </div>
                <div>
                  <h4 className="font-bold text-black dark:text-white mb-2">Price</h4>
                  {quickViewPkg.discount && quickViewPkg.discount > 0 ? (
                    <div>
                      <p className="text-2xl font-bold text-blue-500 dark:text-yellow-400 flex items-center">
                        <IndianRupee size={18} /> {Math.round(quickViewPkg.price * (1 - quickViewPkg.discount / 100)).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                        ₹{quickViewPkg.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-blue-500 dark:text-yellow-400 flex items-center">
                      <IndianRupee size={18} /> {quickViewPkg.price.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-black dark:text-white mb-2">Highlights</h4>
                <ul className="space-y-1">
                  {quickViewPkg.highlights?.map((h, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-blue-500">•</span> {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/packages/${quickViewPkg.packageId || quickViewPkg._id}`}
                  onClick={() => setQuickViewPkg(null)}
                  className="block w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black py-3 rounded-lg hover:opacity-90 transition font-bold text-center"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
