"use client";

import { useState, useEffect, use, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, Users, IndianRupee, Check, X, Calendar, ArrowRight, Heart, Share2, Copy, MessageCircle, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { IPackage, IReview } from "@/types";
import ImageGallery from "@/components/ImageGallery";
import RelatedPackages from "@/components/RelatedPackages";
import ReviewSection from "@/components/ReviewSection";
import PackageFAQ from "@/components/PackageFAQ";
import { getPackageFAQs } from "@/lib/packageFAQs";

const RAJASTHAN_LOOP_UNSPLASH = "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80";

const getPackageImage = (pkg: IPackage) => {
  const name = (pkg.name || "").toLowerCase();
  const isRajasthanLoop = name.includes("jodhpur") && name.includes("jaisalmer") && name.includes("bikaner") && name.includes("jaipur");
  if (isRajasthanLoop) return RAJASTHAN_LOOP_UNSPLASH;
  return pkg.image || "/images/tajmahal.jpg";
};

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const today = new Date().toISOString().split("T")[0];
  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedPackages, setRelatedPackages] = useState<IPackage[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showShareMenu]);

  useEffect(() => {
    fetch(`/api/packages/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setPkg(d);
          setReviews(d.reviews || []);
          // Check if wishlisted
          const wishlisted = localStorage.getItem(`wishlist_${d._id || d.packageId}`);
          setIsWishlisted(!!wishlisted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch related packages
    fetch(`/api/packages?limit=6`)
      .then((r) => r.json())
      .then((pkgs) => setRelatedPackages(pkgs || []))
      .catch(() => {});
  }, [id]);

  const handleBook = async () => {
    if (!session) { router.push("/login"); return; }
    if (!startDate) { toast.error("Please select a start date"); return; }
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "package", packageId: pkg?.packageId || pkg?._id, packageName: pkg?.name, destination: pkg?.destination, startDate, travelers, price: (pkg?.price || 0) * travelers }) });
      const data = await res.json();
      if (res.ok) { toast.success("Package booked!"); router.push("/my-trips"); } else toast.error(data.error || "Booking failed");
    } catch (err) { toast.error((err as Error).message || "Something went wrong"); } finally { setBooking(false); }
  };

  const handleWishlist = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!pkg) return;
    const key = `wishlist_${pkg._id || pkg.packageId}`;
    if (isWishlisted) {
      localStorage.removeItem(key);
      toast.success("Removed from wishlist");
    } else {
      localStorage.setItem(key, "true");
      toast.success("Added to wishlist");
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleRefreshPackage = async () => {
    try {
      const res = await fetch(`/api/packages/${id}`);
      const updatedPkg = await res.json();
      if (!updatedPkg.error) {
        setPkg(updatedPkg);
        setReviews(updatedPkg.reviews || []);
      }
    } catch (err) {
      console.error("Failed to refresh package:", err);
    }
  };

  const handleShare = (platform: string) => {
    const packageUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this amazing package: ${pkg?.name}`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(packageUrl);
        toast.success("Link copied!");
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + packageUrl)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(packageUrl)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(packageUrl)}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(packageUrl)}`);
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-28"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" /></div>;
  if (!pkg) return <div className="min-h-screen flex items-center justify-center pt-28"><p className="text-gray-500 text-lg">Package not found</p></div>;

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Hero with Image Gallery */}
      <div className="bg-white dark:bg-gray-900 pt-28 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          {pkg && pkg.images && pkg.images.length > 0 ? (
            <ImageGallery images={pkg.images} alt={pkg.name} />
          ) : (
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
              <Image src={getPackageImage(pkg)} alt={pkg.name} fill sizes="100vw" className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Title Section - Overlay below gallery */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
            {pkg?.name}
          </h1>
          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-300 text-sm">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {pkg?.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">About This Tour</h2>
            <p className="text-black dark:text-white leading-relaxed">{pkg.description}</p>
          </div>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><Check size={16} className="text-blue-400 dark:text-yellow-400" /></div>
                    <span className="font-medium text-black dark:text-white">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border-l-4 border-blue-500 dark:border-yellow-400">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-4 h-10 min-w-22 rounded-full flex items-center justify-center font-bold text-sm">Day-{day.day || idx + 1}</span>
                      <h3 className="text-lg font-bold text-black dark:text-white">{day.title}</h3>
                    </div>
                    <p className="text-black dark:text-white mb-3">{day.description}</p>
                    {day.highlights && day.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {day.highlights.map((h, j) => (
                          <span key={j} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">{h}</span>
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 border border-green-200 dark:border-green-900/50 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-500/20 dark:bg-green-400/20 p-2 rounded-lg">
                    <Check size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-xl text-green-700 dark:text-green-400">What&apos;s Included</h3>
                </div>
                <ul className="space-y-3">
                  {pkg.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="bg-green-500 rounded-full p-0.5 mt-1 shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.excluded && pkg.excluded.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-2xl p-8 border border-red-200 dark:border-red-900/50 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-500/20 dark:bg-red-400/20 p-2 rounded-lg">
                    <X size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-bold text-xl text-red-700 dark:text-red-400">Not Included</h3>
                </div>
                <ul className="space-y-3">
                  {pkg.excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="bg-red-500 rounded-full p-0.5 mt-1 shrink-0">
                        <X size={14} className="text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{item}</span>
                    </li>
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
                  <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
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

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

              {/* Share Buttons */}
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
                >
                  <Share2 size={18} />
                  Share Package
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <MessageCircle size={14} />
                      </div>
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        f
                      </div>
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                        X
                      </div>
                      Twitter/X
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        in
                      </div>
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center gap-3 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white">
                        <Copy size={14} />
                      </div>
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <RelatedPackages
            packages={relatedPackages}
            currentPackageId={pkg?._id || pkg?.packageId || ""}
          />
        </div>
      )}

      {/* Review Section */}
      <ReviewSection
        packageId={pkg?.packageId || pkg?._id || id}
        reviews={reviews}
        onReviewAdded={(newReview) => {
          setReviews([...reviews, newReview]);
        }}
        onRefresh={handleRefreshPackage}
      />

      {/* FAQ Section */}
      <PackageFAQ faqs={getPackageFAQs(pkg?.destination)} />
    </div>
  );
}
