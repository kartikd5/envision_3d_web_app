import { getProducts, getCategories } from "@/lib/db";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import AdminProductsTable from "@/components/AdminProductsTable";

export const revalidate = 5;

export default async function AdminProductsPage() {
  const products = await getProducts({ onlyActive: false }); // Get all products
  const categories = await getCategories(false); // Get all categories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
            <Package size={24} className="text-primary" />
            Manage Products
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Create, modify details, manage photos, and toggle active status of products.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary/95 text-black px-4 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-primary/10 transition-all cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Product
        </Link>
      </div>

      {/* Interactive Products Table */}
      <AdminProductsTable products={products} categories={categories} />
    </div>
  );
}
