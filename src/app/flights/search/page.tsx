"use client";

import { useState } from "react";
import { Search, ShieldCheck, TimerReset } from "lucide-react";
import FlightSearchModal from "@/components/FlightSearchModal";

export default function FlightSearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white px-6 pb-16 pt-32 dark:from-gray-950 dark:to-black">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur md:p-10 dark:border-gray-800 dark:bg-gray-900/80">
            <h1 className="text-3xl font-bold md:text-4xl">Find &amp; Book Flights</h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-300">
              Search live fares and availability with our partner-powered booking engine. Open the flights widget to compare routes, prices, and timings in one place.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-gray-700 md:grid-cols-3 dark:text-gray-200">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-yellow-500/20 dark:text-yellow-300">
                    <Search size={16} />
                  </div>
                  <span>Real-time search results</span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-yellow-500/20 dark:text-yellow-300">
                    <TimerReset size={16} />
                  </div>
                  <span>Multi-city and flexible options</span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-yellow-500/20 dark:text-yellow-300">
                    <ShieldCheck size={16} />
                  </div>
                  <span>Secure booking flow</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-300"
              >
                <Search size={18} />
                Start Searching Flights
              </button>
            </div>
          </div>
        </div>
      </div>

      <FlightSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
