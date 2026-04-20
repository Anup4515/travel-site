"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 pb-6 sm:pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  src="/images/icons/icon-light.png"
                  alt="AureoTravels icon"
                  fill
                  sizes="2rem"
                  className="object-contain block dark:hidden"
                />
                <Image
                  src="/images/icons/icon-dark.png"
                  alt="AureoTravels icon"
                  fill
                  sizes="2rem"
                  className="object-contain hidden dark:block"
                />
              </div>
              <span><span className="text-white">Aureo</span><span className="text-blue-400 dark:text-yellow-400 transition-colors">Travels</span></span>
            </Link>
            <p className="text-white text-sm leading-relaxed">Explore majestic forts, desert adventures, serene lakes, and vibrant culture across Rajasthan and India.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[{ href: "/packages", label: "Tour Packages" }, { href: "/flights/search", label: "Flights" }, { href: "/hotels/search", label: "Hotels" }, { href: "/cabs", label: "Cab Rental" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-blue-400 dark:hover:text-yellow-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Top Destinations</h3>
            <ul className="space-y-2 text-sm">
              {["jaipur", "udaipur", "jaisalmer", "delhi", "agra"].map((c) => (
                <li key={c}><Link href={`/destinations/${c}`} className="hover:text-blue-400 dark:hover:text-yellow-400 transition-colors capitalize">{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} className="text-blue-400 dark:text-yellow-400 transition-colors" /><span className="text-white">info@aureotravels.com</span></li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-blue-400 dark:text-yellow-400 transition-colors" /><span className="text-white">+91 98765 43210</span></li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-blue-400 dark:text-yellow-400 transition-colors" /><span className="text-white">Jaipur, Rajasthan, India</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-white">
          <p>&copy; {new Date().getFullYear()} AureoTravels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
