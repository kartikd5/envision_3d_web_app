import Link from "next/link";
import { getCategories, getProducts } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";
import { Compass } from "lucide-react";

export const revalidate = 30; // Quick cache revalidation

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategorySlug = resolvedSearchParams.category || "";

  const [categories, products] = await Promise.all([
    getCategories(true),
    getProducts({ onlyActive: true, categorySlug: activeCategorySlug }),
  ]);

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);
  const isSubCategoryActive = !!(activeCategory && activeCategory.parent_category_id);
  const parentCategory = isSubCategoryActive
    ? categories.find((c) => c.id === activeCategory.parent_category_id)
    : activeCategory;
  const activeParentSlug = parentCategory ? parentCategory.slug : "";

  // Filter lists
  const mainCategories = categories.filter((c) => !c.parent_category_id);
  const subCategories = parentCategory
    ? categories.filter((c) => c.parent_category_id === parentCategory.id)
    : [];

  return (
    <div className="space-y-6 pb-6">
      {/* Title Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <Compass size={22} className="text-primary" />
          Product Catalog
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Explore our collection of custom 3D printed decor items.
        </p>
      </div>

      {/* Category Horizontal Filter Pills (Tier 1) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pb-1 border-b border-white/5">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border snap-start cursor-pointer ${
            activeCategorySlug === ""
              ? "bg-primary border-primary text-black shadow-lg shadow-primary/10"
              : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground"
          }`}
        >
          All Items
        </Link>
        {mainCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border snap-start cursor-pointer ${
              activeParentSlug === cat.slug
                ? "bg-primary border-primary text-black shadow-lg shadow-primary/10"
                : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Sub-category Pills (Tier 2 - rendered only when a main category is selected and has sub-categories) */}
      {parentCategory && subCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pb-2 pt-1 border-b border-white/5 animate-fade-in">
          <Link
            href={`/products?category=${parentCategory.slug}`}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border snap-start cursor-pointer ${
              activeCategorySlug === parentCategory.slug
                ? "bg-primary/20 border-primary/30 text-primary"
                : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            All {parentCategory.name}
          </Link>
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/products?category=${sub.slug}`}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border snap-start cursor-pointer ${
                activeCategorySlug === sub.slug
                  ? "bg-primary/20 border-primary/30 text-primary"
                  : "bg-white/5 border-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid 
        products={products} 
        emptyMessage={activeCategorySlug ? "No products found in this category yet." : "No products defined in the catalog."} 
      />
    </div>
  );
}
