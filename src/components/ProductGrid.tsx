"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  short_description?: string | null;
  price: number;
  currency: string;
  primary_media_url?: string | null;
  is_customizable: boolean;
}

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 glass rounded-2xl border border-white/5 space-y-3 my-4">
        <svg
          className="w-12 h-12 text-muted-foreground stroke-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0120.25 21.75H3.75a2.25 2.25 0 01-2.25-2.25v-4.5a2.25 2.25 0 012.25-2.25zM13.5 3h.008v.008H13.5V3zm0 3.75h.008v.008H13.5V6.75zM11 3.75h.008v.008H11V3.75z"
          />
        </svg>
        <p className="text-muted-foreground text-sm font-medium">
          {emptyMessage || "No products found in this category."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductGridItem key={product.id} product={product} />
      ))}
    </div>
  );
}

// Wrapper to cast types if necessary
function ProductGridItem({ product }: { product: any }) {
  return <ProductCard product={product} />;
}
