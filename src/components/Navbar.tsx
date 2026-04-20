"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu, X, User, ChevronDown, ChevronRight, LogOut, Briefcase, UserCircle, Sun, Moon, Shield, MapPin, Landmark } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type Category = "rajasthan" | "goldenTriangle";

const destinationsMenu: Record<Category, string[]> = {
  rajasthan: ["jaipur", "udaipur", "jaisalmer", "bikaner", "ajmer", "kota"],
  goldenTriangle: ["delhi", "agra", "jaipur"],
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/flights/search", label: "Flights" },
  { href: "/hotels/search", label: "Hotels" },
  { href: "/cabs", label: "Cabs" },
  { href: "/guide", label: "Guide" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    setProfileOpen(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  const initials = user?.name
    ? user.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("")
    : "";

  const navbarIconLight = "/images/icons/icon-light.png";
  const navbarIconDark = "/images/icons/icon-dark.png";

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-black shadow-lg backdrop-blur-md" : "bg-black backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center gap-6">
        <Link href="/" className="shrink-0 flex items-center gap-4 hover:opacity-90 transition-opacity">
          {/* Icon */}
          <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0">
            <Image
              src={navbarIconLight}
              alt="AureoTravels icon"
              fill
              priority
              sizes="(max-width: 768px) 4rem, 5rem"
              className="object-contain block dark:hidden"
            />
            <Image
              src={navbarIconDark}
              alt="AureoTravels icon"
              fill
              priority
              sizes="(max-width: 768px) 4rem, 5rem"
              className="object-contain hidden dark:block"
            />
          </div>
          {/* Branding text */}
          <div className="hidden sm:flex flex-col leading-tight">
            <div className="text-2xl md:text-3xl font-bold">
              <span className="text-white">Aureo</span>
              <span className="text-blue-400 dark:text-yellow-400">Travels</span>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              <span>EXPLORE MORE. </span>
              <span className="text-blue-400 dark:text-yellow-400">TRAVEL BETTER.</span>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-white font-medium items-center shrink-0">
          <li>
            <Link href="/" className={isActive("/") ? "text-blue-400 dark:text-yellow-400 font-semibold" : "hover:text-blue-400 dark:hover:text-yellow-400 transition-colors"}>Home</Link>
          </li>

          {/* Destinations Dropdown */}
          <li className="relative py-2" onMouseEnter={() => { if (destRef.current) clearTimeout(destRef.current); setDestOpen(true); }} onMouseLeave={() => { destRef.current = setTimeout(() => { setDestOpen(false); setHoveredCategory(null); }, 400); }}>
            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-400 dark:hover:text-yellow-400 transition-colors">
              <span>Destinations</span>
              <ChevronDown size={16} className={`transition-transform ${destOpen ? "rotate-180" : ""}`} />
            </div>
            {destOpen && (
              <div className="absolute top-full left-0 mt-2 max-w-[calc(100vw-2rem)] flex flex-col sm:flex-row gap-0 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
                {/* Categories */}
                <div className="w-full sm:w-56 bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-r-0 sm:border-r border-b sm:border-b-0 border-gray-200 dark:border-gray-700 py-4">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 px-6 mb-3 uppercase tracking-wide">Categories</p>
                  {(["rajasthan", "goldenTriangle"] as Category[]).map((cat) => (
                    <div key={cat} onMouseEnter={() => setHoveredCategory(cat)}
                      className={`relative flex items-center justify-between px-6 py-3 cursor-pointer transition-all duration-200 ${hoveredCategory === cat ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-all ${hoveredCategory === cat ? "bg-blue-500 dark:bg-yellow-400" : "bg-gray-200 dark:bg-gray-700"}`}>
                          {cat === "rajasthan" ? <MapPin size={18} className={hoveredCategory === cat ? "text-white dark:text-black" : "text-gray-600 dark:text-gray-300"} /> : <Landmark size={18} className={hoveredCategory === cat ? "text-white dark:text-black" : "text-gray-600 dark:text-gray-300"} />}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${hoveredCategory === cat ? "text-blue-600 dark:text-yellow-400" : "text-gray-800 dark:text-gray-200"}`}>{cat === "rajasthan" ? "Rajasthan" : "Golden Triangle"}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{cat === "rajasthan" ? "6 cities" : "3 cities"}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`transition-all ${hoveredCategory === cat ? "text-blue-500 dark:text-yellow-400 translate-x-1" : "text-gray-400"}`} />
                    </div>
                  ))}
                </div>
                {/* Cities Grid */}
                {hoveredCategory && (
                  <div className="w-full sm:w-72 p-6 bg-white dark:bg-gray-900">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">{hoveredCategory === "rajasthan" ? "Rajasthan Cities" : "Golden Triangle Cities"}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {destinationsMenu[hoveredCategory].map((city) => (
                        <Link key={city} href={`/destinations/${city}`} className="group relative px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-yellow-400 transition-all duration-200 overflow-hidden">
                          <div className="absolute inset-0 bg-linear-to-r from-blue-500 dark:from-yellow-400 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                          <p className="relative font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-yellow-400 capitalize text-sm">{city}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </li>

          {navLinks.slice(1).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`transition-colors text-base ${isActive(link.href) ? "text-blue-400 dark:text-yellow-400 border-b-2 border-blue-400 dark:border-yellow-400 pb-1 font-semibold" : "hover:text-blue-400 dark:hover:text-yellow-400"}`}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2 py-1 rounded-full hover:opacity-95 transition">
                {isAdmin && <Shield size={16} className="text-red-400" />}
                <div className="bg-yellow-400 dark:bg-blue-500 text-black dark:text-white px-3 py-1 rounded-full font-semibold shadow-sm text-base">{initials}</div>
                <ChevronDown size={16} className="text-white/90" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-medium text-base">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition">
                      <Shield size={18} /><span>Admin Panel</span>
                    </Link>
                  )}
                  <Link href="/my-trips" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-500/20 hover:text-blue-400 transition">
                    <Briefcase size={18} /><span>My Trips</span>
                  </Link>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-500/20 hover:text-blue-400 transition">
                    <UserCircle size={18} /><span>Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/20 hover:text-red-400 transition w-full text-left border-t border-gray-700">
                    <LogOut size={18} /><span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-white hover:text-blue-400 dark:hover:text-yellow-400 px-4 py-2 text-base font-medium transition-colors">Login</Link>
              <Link href="/signup" className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-5 py-2 rounded-xl font-semibold hover:bg-blue-600 dark:hover:bg-yellow-300 transition text-base">Sign Up</Link>
            </div>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all" aria-label="Toggle theme" type="button">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col py-4 px-6 space-y-3 text-white font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`block py-2 ${isActive(link.href) ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}>{link.label}</Link>
              </li>
            ))}
            {user ? (
              <>
                {isAdmin && <li><Link href="/admin" className="flex items-center gap-3 py-2 text-red-400"><Shield size={18} />Admin Panel</Link></li>}
                <li><Link href="/my-trips" className="flex items-center gap-3 py-2 hover:text-yellow-400"><Briefcase size={18} />My Trips</Link></li>
                <li><Link href="/profile" className="flex items-center gap-3 py-2 hover:text-yellow-400"><UserCircle size={18} />Profile</Link></li>
                <li><button onClick={handleLogout} className="flex items-center gap-3 py-2 hover:text-red-400 w-full text-left"><LogOut size={18} />Logout</button></li>
              </>
            ) : (
              <>
                <li><Link href="/login" className="block bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold text-center">Login</Link></li>
                <li><Link href="/signup" className="block bg-gray-800 text-white px-5 py-2 rounded-xl font-semibold text-center border border-blue-500">Sign Up</Link></li>
              </>
            )}
            <li className="pt-2 border-t border-gray-800">
              <button onClick={toggleTheme} className="flex items-center gap-3 py-2 text-white">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
