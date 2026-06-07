"use client";

import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    short_description?: string | null;
    price: number;
    currency: string;
    primary_media_url?: string | null;
    is_customizable: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  const fallbackImage = "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800";

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden glass-card h-full"
    >
      {/* Media container */}
      <div className="relative aspect-square w-full bg-[#101424] overflow-hidden">
        <img
          src={product.primary_media_url || fallbackImage}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.is_customizable && (
          <span className="absolute top-3 left-3 bg-primary/95 text-black font-display font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-lg">
            Customizable
          </span>
        )}
      </div>

      {/* Description container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
            {product.sku}
          </div>
          <h3 className="font-display font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="font-display font-extrabold text-base text-primary">
            {formattedPrice}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
            View details
            <svg
              className="w-3 h-3 transform transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
