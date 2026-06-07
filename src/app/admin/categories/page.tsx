import { getCategories } from "@/lib/db";
import CategoriesManager from "@/components/CategoriesManager";
import { FolderTree } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminCategoriesPage() {
  const categories = await getCategories(false); // Fetch all active and inactive categories

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <FolderTree size={24} className="text-primary" />
          Manage Categories
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Create, edit display orders, upload banners, and toggle active status of categories.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
