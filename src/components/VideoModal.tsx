"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type VideoModalProps = {
  isOpen: boolean;
  videoId: string;
  title: string;
  onClose: () => void;
};

export default function VideoModal({ isOpen, videoId, title, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!isOpen) return;

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:text-blue-400 dark:hover:text-yellow-400 transition-colors"
          aria-label="Close video modal"
        >
          <X size={18} />
        </button>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

