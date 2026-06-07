import Link from "next/link";
import { getCategories, getProducts, getLatestCreations } from "@/lib/db";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import LatestCreationCard from "@/components/LatestCreationCard";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [allCategories, featuredProducts, creations] = await Promise.all([
    getCategories(true),
    getProducts({ onlyActive: true, onlyFeatured: true }),
    getLatestCreations({ onlyFeatured: true }),
  ]);

  const mainCategories = allCategories.filter((c) => !c.parent_category_id);

  return (
    <div className="space-y-8 pb-6">
      {/* Visual Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden glass p-6 flex flex-col justify-center min-h-[200px] border border-white/5 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
            <Sparkles size={11} className="animate-pulse" />
            Handcrafted & 3D Printed
          </span>
          <h2 className="font-display font-black text-2xl leading-tight text-foreground">
            Sculpting Space with <span className="text-primary bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Creative Geometry</span>
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[90%]">
            Transforming premium bio-plastics into intricate geometric home decor, planters, and ambient light fixtures.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-primary/10 cursor-pointer"
            >
              Explore Catalog
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Swipe Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
            <Compass size={16} className="text-primary" />
            Browse Categories
          </h3>
          <Link href="/categories" className="text-xs font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {mainCategories.slice(0, 4).map((cat) => {
            const subCats = allCategories.filter((c) => c.parent_category_id === cat.id);
            return (
              <div key={cat.id} className="w-[85%] flex-shrink-0 snap-start">
                <CategoryCard category={cat} subCategories={subCats} />
              </div>
            );
          })}
          {mainCategories.length === 0 && (
            <p className="text-xs text-muted-foreground italic pl-1">No categories defined yet.</p>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-base text-foreground">
            Featured Creations
          </h3>
          <Link href="/products" className="text-xs font-semibold text-primary hover:underline">
            See All
          </Link>
        </div>
        <ProductGrid products={featuredProducts.slice(0, 4)} emptyMessage="No featured products currently." />
      </section>

      {/* Showcase Creations */}
      {creations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-foreground">
              Fresh Off the Print Bed
            </h3>
            <Link href="/latest-creations" className="text-xs font-semibold text-primary hover:underline">
              Creations Log
            </Link>
          </div>
          <div className="space-y-4">
            {creations.slice(0, 2).map((item) => (
              <LatestCreationCard key={item.id} creation={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
