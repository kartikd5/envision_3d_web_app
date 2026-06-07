import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getSettings } from "@/lib/db";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDetailActions from "@/components/ProductDetailActions";
import { ChevronLeft, Ruler, Hammer, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 10; // Keep details fresh

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return {};
  return {
    title: `${product.name} - Envision 3D Custom Shop`,
    description: product.short_description || `Get custom quotes and order the 3D printed ${product.name} home decor.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(resolvedParams.slug),
    getSettings(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <div className="flex items-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all py-1"
        >
          <ChevronLeft size={16} />
          Back to Catalog
        </Link>
      </div>

      {/* Media Gallery / Carousel */}
      <div className="overflow-hidden rounded-3xl border border-white/5 shadow-xl bg-[#101424]">
        <ProductCarousel mediaList={product.media} productName={product.name} />
      </div>

      {/* Specs / Badges */}
      <div className="space-y-4 px-1">
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            {product.is_customizable && (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full">
                Custom Options Available
              </span>
            )}
            {product.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground px-3 py-1 rounded-full"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <h1 className="font-display font-black text-2xl text-foreground">
            {product.name}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            SKU: {product.sku}
          </p>
        </div>

        {/* Description Section */}
        <div className="space-y-2 border-t border-white/5 pt-4">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">
            Description
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description || product.short_description || "No description provided."}
          </p>
        </div>

        {/* Material & Dimensions Specifications */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
          {product.material && (
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-2.5">
              <Hammer size={16} className="text-primary mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block font-mono">
                  Materials
                </span>
                <span className="text-xs text-foreground font-semibold">
                  {product.material}
                </span>
              </div>
            </div>
          )}
          
          {product.dimensions && (
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-2.5">
              <Ruler size={16} className="text-primary mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block font-mono">
                  Dimensions
                </span>
                <span className="text-xs text-foreground font-semibold">
                  {product.dimensions}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Print Quality Guarantee */}
        <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3 items-start">
          <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-foreground">Print Guarantee</h4>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Each piece is individually printed with premium layer adhesion and inspected for structural density and surface quality before packing.
            </p>
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md font-mono"
                >
                  #{tag.slug}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar (Client details wrapper) */}
      <ProductDetailActions
        product={{
          sku: product.sku,
          name: product.name,
          price: Number(product.price),
          currency: product.currency,
          is_customizable: product.is_customizable,
        }}
        whatsappNumber={settings.whatsapp_number || ""}
      />
    </div>
  );
}
