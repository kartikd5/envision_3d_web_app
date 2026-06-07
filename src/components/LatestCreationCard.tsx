"use client";

import Link from "next/link";
import { Sparkles, ShoppingBag } from "lucide-react";

interface LatestCreationCardProps {
  creation: {
    id: string;
    title: string;
    description?: string | null;
    media_url: string;
    media_type: "image" | "video";
    created_at: string;
    product?: {
      name: string;
      slug: string;
      sku: string;
    } | null;
  };
}

export default function LatestCreationCard({ creation }: LatestCreationCardProps) {
  const formattedDate = new Date(creation.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden glass-card">
      {/* Media Content */}
      <div className="relative aspect-[4/5] bg-[#0E1220] overflow-hidden">
        {creation.media_type === "video" ? (
          <video
            src={creation.media_url}
            className="object-cover w-full h-full"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={creation.media_url}
            alt={creation.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        )}

        {/* Floating sparkles tag */}
        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-primary/20">
          <Sparkles size={10} className="fill-current" />
          Creations
        </span>

        {/* Date tag */}
        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/80 px-2.5 py-1 rounded-full text-[9px] font-medium tracking-wide">
          {formattedDate}
        </span>
      </div>

      {/* Details Section */}
      <div className="p-5 space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-display font-extrabold text-lg text-foreground">
            {creation.title}
          </h3>
          {creation.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {creation.description}
            </p>
          )}
        </div>

        {/* Linked Product Reference */}
        {creation.product && (
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground">
                Model: {creation.product.sku}
              </div>
              <div className="text-xs font-semibold text-foreground">
                {creation.product.name}
              </div>
            </div>
            <Link
              href={`/products/${creation.product.slug}`}
              className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-black font-display font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag size={12} />
              Inquire
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
