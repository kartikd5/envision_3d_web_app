"use client";

import Link from "next/link";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image_url?: string | null;
  };
  subCategories?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function CategoryCard({ category, subCategories }: CategoryCardProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col justify-end aspect-[16/9] w-full rounded-2xl overflow-hidden glass-card"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[#0F1424]">
        <img
          src={category.image_url || fallbackImage}
          alt={category.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80"
          loading="lazy"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent"></div>
      </div>

      {/* Info overlay */}
      <div className="relative p-5 z-10 space-y-1">
        <h3 className="font-display font-extrabold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
          {category.name}
          <svg
            className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </h3>
        {subCategories && subCategories.length > 0 && (
          <p className="text-[9px] text-primary font-bold uppercase tracking-wider line-clamp-1 pb-0.5">
            {subCategories.map((s) => s.name).join("  •  ")}
          </p>
        )}
        {category.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[90%] leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
