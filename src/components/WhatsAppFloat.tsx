"use client";

import React from "react";

const WhatsAppFloat: React.FC = () => {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const message = "Please contact me. I am interested in some tour packages";
  const encoded = encodeURIComponent(message);
  const href = number ? `https://wa.me/${number.replace(/[^0-9+]/g, "")}?text=${encoded}` : `#`;

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Contact on WhatsApp"
        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] ring-2 ring-white dark:ring-gray-900 transition-transform hover:scale-105 hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300 dark:focus-visible:ring-green-700"
        onClick={(e) => {
          if (!number) {
            e.preventDefault();
            alert("WhatsApp number not configured. Please set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local");
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
          <path d="M19.11 17.21c-.28-.14-1.66-.82-1.92-.91-.26-.09-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.17.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.36-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.47.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.5.07-.76.35-.26.28-1 1-1 2.45 0 1.45 1.03 2.85 1.18 3.05.14.19 2.02 3.08 4.91 4.2.69.29 1.23.46 1.65.59.69.22 1.33.19 1.83.12.56-.08 1.66-.68 1.89-1.33.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33M16.05 3h-.01C8.87 3 3.04 8.8 3.04 15.96c0 2.52.73 4.98 2.1 7.1L3 29l6.16-2.03c2.03 1.1 4.31 1.68 6.67 1.68h.01c7.17 0 13-5.81 13-12.97 0-3.47-1.35-6.74-3.79-9.2A12.9 12.9 0 0 0 16.05 3m0 23.44h-.01a10.4 10.4 0 0 1-5.29-1.44l-.38-.22-3.65 1.2 1.22-3.56-.24-.36a10.45 10.45 0 0 1-1.6-5.57c0-5.75 4.67-10.43 10.42-10.43 2.79 0 5.41 1.09 7.38 3.06a10.33 10.33 0 0 1 3.05 7.38c0 5.75-4.67 10.44-10.42 10.44" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppFloat;
