import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProducts, getCategories } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 30;

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  if (!category) return {};
  return {
    title: `${category.name} | Envision 3D`,
    description: category.description || `Browse ${category.name} custom 3D printed items.`,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryDetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const activeSubCategorySlug = resolvedSearchParams.sub || "";

  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  // Get child sub-categories of this category
  const allCategories = await getCategories(true);
  const subCategories = allCategories.filter((c) => c.parent_category_id === category.id);

  // If a sub-category slug is active, query only that sub-category. Otherwise query the parent (which returns both).
  const products = await getProducts({
    onlyActive: true,
    categorySlug: activeSubCategorySlug || category.slug,
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Back to Categories */}
      <div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all py-1"
        >
          <ChevronLeft size={16} />
          All Categories
        </Link>
      </div>

      {/* Category Info Header */}
      <div className="p-6 rounded-2xl glass border border-white/5 space-y-2">
        <h1 className="font-display font-black text-xl text-foreground">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Sub-category pills horizontal scroll */}
      {subCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pb-1 border-b border-white/5">
          <Link
            href={`/categories/${category.slug}`}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border snap-start cursor-pointer ${
              activeSubCategorySlug === ""
                ? "bg-primary border-primary text-black shadow-lg shadow-primary/10"
                : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            All {category.name}
          </Link>
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/categories/${category.slug}?sub=${sub.slug}`}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border snap-start cursor-pointer ${
                activeSubCategorySlug === sub.slug
                  ? "bg-primary border-primary text-black shadow-lg shadow-primary/10"
                  : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono pl-1">
          Products in Category ({products.length})
        </h3>
        <ProductGrid products={products} emptyMessage="No products in this category yet." />
      </div>
    </div>
  );
}
