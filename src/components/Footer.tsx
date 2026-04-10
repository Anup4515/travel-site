"use client";

import Link from "next/link";
import { Plane, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <Plane className="text-yellow-400" size={24} />
              <span><span className="text-white">Aureo</span><span className="text-yellow-400">Travels</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">Explore majestic forts, desert adventures, serene lakes, and vibrant culture across Rajasthan and India.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[{ href: "/packages", label: "Tour Packages" }, { href: "/flights/search", label: "Flights" }, { href: "/hotels/search", label: "Hotels" }, { href: "/cabs", label: "Cab Rental" }, { href: "/restaurants", label: "Restaurants" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-yellow-400 transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Top Destinations</h3>
            <ul className="space-y-2 text-sm">
              {["jaipur", "udaipur", "jaisalmer", "delhi", "agra"].map((c) => (
                <li key={c}><Link href={`/destinations/${c}`} className="hover:text-yellow-400 transition capitalize">{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} className="text-yellow-400" /><span>info@aureotravels.com</span></li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-yellow-400" /><span>+91 98765 43210</span></li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-yellow-400" /><span>Jaipur, Rajasthan, India</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AureoTravels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
