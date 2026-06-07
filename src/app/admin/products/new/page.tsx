import { getCategories } from "@/lib/db";
import ProductForm from "@/components/ProductForm";

export const revalidate = 0; // Dynamic rendering

export default async function AdminNewProductPage() {
  const categories = await getCategories(false); // Fetch all active and inactive categories

  return <ProductForm categories={categories} />;
}
