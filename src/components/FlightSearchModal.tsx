"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import FlightWidgetFrame from "@/components/FlightWidgetFrame";

type FlightSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FlightSearchModal({ isOpen, onClose }: FlightSearchModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    console.log("FlightSearchModal: opened, adding keyboard listener");

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-2 md:p-6 flex items-end md:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Search flights"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
            <motion.div
              className="mx-auto h-[95vh] md:h-[85vh] w-full max-w-7xl overflow-hidden rounded-t-2xl md:rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 flex flex-col"
              onClick={(event) => event.stopPropagation()}
              initial={{ y: 24, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 md:px-6 md:py-3 dark:border-gray-700 shrink-0">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">Search Flights</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label="Close flights search"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-gray-50 p-0 dark:bg-gray-950">
                <FlightWidgetFrame />
              </div>
            </motion.div>
          </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
