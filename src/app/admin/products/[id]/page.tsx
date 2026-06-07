import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { getCategories } from "@/lib/db";
import ProductForm from "@/components/ProductForm";
import ProductMediaManager from "@/components/ProductMediaManager";

export const revalidate = 0; // Dynamic rendering

interface AdminEditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Fetch product
  const { data: product, error: prodErr } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (prodErr || !product) {
    notFound();
  }

  // 2. Fetch all categories
  const categories = await getCategories(false);

  // 3. Fetch linked category IDs
  const { data: catJoins } = await supabaseAdmin
    .from("product_categories")
    .select("category_id")
    .eq("product_id", id);
  const linkedCategoryIds = (catJoins || []).map((c: any) => c.category_id);

  // 4. Fetch linked tags
  const { data: tagJoins } = await supabaseAdmin
    .from("product_tags")
    .select("tags (name)")
    .eq("product_id", id);
  const linkedTags = (tagJoins || []).map((t: any) => t.tags?.name).filter(Boolean);

  // 5. Fetch media
  const { data: media } = await supabaseAdmin
    .from("product_media")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  const formattedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="space-y-8">
      {/* Product Information Form */}
      <ProductForm
        categories={categories}
        initialData={formattedProduct}
        linkedCategoryIds={linkedCategoryIds}
        linkedTags={linkedTags}
      />

      {/* Product Media Manager Panel */}
      <div className="border-t border-white/5 pt-8">
        <ProductMediaManager productId={id} initialMedia={media || []} />
      </div>
    </div>
  );
}
