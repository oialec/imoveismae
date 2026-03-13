"use client";

import { useState } from "react";
import { getSupabaseImageUrl } from "@/lib/utils";

export default function FotoGaleria({
  fotos,
  titulo,
}: {
  fotos: string[];
  titulo: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-cinza-claro flex items-center justify-center">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.startX = String(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = Number((e.currentTarget as HTMLElement).dataset.startX);
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < fotos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div className="relative bg-black">
      {/* Main image */}
      <div
        className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={getSupabaseImageUrl(fotos[currentIndex])}
          alt={`${titulo} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm py-1 px-3 rounded-full">
          {currentIndex + 1} / {fotos.length}
        </div>

        {/* Arrows (desktop) */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-md transition-colors"
              disabled={currentIndex === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex(Math.min(fotos.length - 1, currentIndex + 1))}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-md transition-colors"
              disabled={currentIndex === fotos.length - 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {fotos.length > 1 && fotos.length <= 10 && (
        <div className="flex justify-center gap-2 py-3 bg-black">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-laranja w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails (desktop, more than 1 photo) */}
      {fotos.length > 1 && (
        <div className="hidden md:flex gap-2 p-3 bg-black overflow-x-auto">
          {fotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                i === currentIndex ? "border-laranja" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={getSupabaseImageUrl(foto)}
                alt={`Miniatura ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
