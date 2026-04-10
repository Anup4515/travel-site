"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Plane, User, ChevronDown, ChevronRight, LogOut, Briefcase, UserCircle, Sun, Moon, Shield } from "lucide-react";
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

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 shadow-lg backdrop-blur-md" : "bg-black/90 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center gap-4">
        <Link href="/" className="text-xl md:text-2xl font-bold flex items-center gap-2 shrink-0">
          <Plane className="text-blue-400 dark:text-yellow-400 transition-colors" size={24} />
          <span className="hidden sm:inline">
            <span className="text-white">Aureo</span>
            <span className="text-blue-400 dark:text-yellow-400 transition-colors">Travels</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-white font-medium items-center shrink-0">
          <li>
            <Link href="/" className={isActive("/") ? "text-blue-400 dark:text-yellow-400 font-semibold" : "hover:text-blue-400 dark:hover:text-yellow-400 transition-colors"}>Home</Link>
          </li>

          {/* Destinations Dropdown */}
          <li className="relative py-2" onMouseEnter={() => setDestOpen(true)} onMouseLeave={() => { setTimeout(() => { setDestOpen(false); setHoveredCategory(null); }, 150); }}>
            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-400 dark:hover:text-yellow-400 transition-colors">
              <span>Destinations</span>
              <ChevronDown size={16} />
            </div>
            {destOpen && (
              <div className="absolute top-full left-0 mt-0 pt-2 flex bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
                <div className="w-48 border-r border-gray-200 dark:border-gray-700">
                  {(["rajasthan", "goldenTriangle"] as Category[]).map((cat) => (
                    <div key={cat} onMouseEnter={() => setHoveredCategory(cat)}
                      className={`flex justify-between items-center px-4 py-3 cursor-pointer transition-colors ${hoveredCategory === cat ? "bg-blue-500 dark:bg-yellow-400 text-white dark:text-black" : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                      <span>{cat === "rajasthan" ? "Rajasthan" : "Golden Triangle"}</span>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
                {hoveredCategory && (
                  <div className="w-56 p-4 grid grid-cols-2 gap-2">
                    {destinationsMenu[hoveredCategory].map((city) => (
                      <Link key={city} href={`/destinations/${city}`} className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-yellow-400 transition capitalize">{city}</Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>

          {navLinks.slice(1).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`transition-colors text-sm ${isActive(link.href) ? "text-blue-400 dark:text-yellow-400 border-b-2 border-blue-400 dark:border-yellow-400 pb-1 font-semibold" : "hover:text-blue-400 dark:hover:text-yellow-400"}`}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2 py-1 rounded-full hover:opacity-95 transition">
                {isAdmin && <Shield size={16} className="text-red-400" />}
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold shadow-sm text-sm">{initials}</div>
                <ChevronDown size={16} className="text-white/90" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
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
              <Link href="/login" className="text-white hover:text-blue-400 dark:hover:text-yellow-400 px-4 py-2 text-sm font-medium transition-colors">Login</Link>
              <Link href="/signup" className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-5 py-2 rounded-xl font-semibold hover:bg-blue-600 dark:hover:bg-yellow-300 transition text-sm">Sign Up</Link>
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
