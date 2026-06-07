"use client";

import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface MediaItem {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url?: string | null;
}

interface ProductCarouselProps {
  mediaList: MediaItem[];
  productName: string;
}

export default function ProductCarousel({ mediaList, productName }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultMedia: MediaItem[] = [
    {
      id: "fallback",
      media_type: "image",
      media_url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const items = mediaList.length > 0 ? mediaList : defaultMedia;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollWidth = scrollRef.current.clientWidth;
    const scrollLeft = scrollRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / scrollWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const scrollWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: index * scrollWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full aspect-square bg-[#0E1220] overflow-hidden rounded-t-3xl">
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollBehavior: "auto" }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-full h-full snap-start relative flex items-center justify-center"
          >
            {item.media_type === "video" ? (
              <video
                src={item.media_url}
                className="object-cover w-full h-full"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={item.media_url}
                alt={`${productName} media ${idx + 1}`}
                className="object-cover w-full h-full"
                loading="eager"
              />
            )}
          </div>
        ))}
      </div>

      {/* Media Indicator Number */}
      <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-foreground border border-white/10">
        {activeIndex + 1} / {items.length}
      </div>

      {/* Carousel dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "bg-primary w-6" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
