"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filter out empty strings and invalid URLs
  const validImages = images.filter((img) => img && img.trim());

  if (!validImages || validImages.length === 0) {
    return null;
  }

  // Auto-play carousel - advance every 7 seconds (only if multiple images)
  useEffect(() => {
    if (validImages.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
        setIsTransitioning(false);
      }, 1000); // Smooth 1 second transition duration
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, [validImages.length]);

  return (
    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
      {validImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img}
            alt={`${alt} - ${idx + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}
    </div>
  );
}
