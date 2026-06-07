"use client";

import { useState, useTransition } from "react";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";
import { Sparkles } from "lucide-react";

interface SearchProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  currency: string;
  primary_media_url?: string | null;
  is_customizable: boolean;
  categoryNames: string[];
  tagNames: string[];
}

interface SearchClientProps {
  initialProducts: SearchProduct[];
}

export default function SearchClient({ initialProducts }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Instant local filtering
  const filteredProducts = initialProducts.filter((product) => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return true;

    return (
      product.name.toLowerCase().includes(cleanQuery) ||
      product.sku.toLowerCase().includes(cleanQuery) ||
      (product.short_description || "").toLowerCase().includes(cleanQuery) ||
      (product.description || "").toLowerCase().includes(cleanQuery) ||
      product.categoryNames.some((c) => c.toLowerCase().includes(cleanQuery)) ||
      product.tagNames.some((t) => t.toLowerCase().includes(cleanQuery))
    );
  });

  // Extract all unique tags for quick filter chips
  const allTags = Array.from(
    new Set(initialProducts.flatMap((p) => p.tagNames))
  ).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <SearchBar 
        value={query} 
        onChange={(val) => startTransition(() => setQuery(val))} 
        placeholder="Search names, categories, tags..." 
      />

      {/* Suggested Quick Tag Chips */}
      {allTags.length > 0 && !query && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground pl-1 font-mono">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3.5 py-1.5 bg-[#161D30]/60 border border-white/5 hover:border-primary/30 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between pl-1">
          <p className="text-xs text-muted-foreground">
            Found {filteredProducts.length} matching {filteredProducts.length === 1 ? "item" : "items"}
          </p>
          {filteredProducts.length > 0 && (
            <span className="text-[9px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
              <Sparkles size={10} />
              Instant match
            </span>
          )}
        </div>
      )}

      {/* Results Grid */}
      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        <ProductGrid
          products={filteredProducts}
          emptyMessage={`We couldn't find anything matching "${query}". Try searching for categories like 'Planters' or features like 'customizable'.`}
        />
      </div>
    </div>
  );
}
