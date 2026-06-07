import { getCategories } from "@/lib/db";
import CategoryCard from "@/components/CategoryCard";
import { FolderTree } from "lucide-react";

export const revalidate = 60;

export default async function CategoriesPage() {
  const allCategories = await getCategories(true);
  const mainCategories = allCategories.filter((c) => !c.parent_category_id);

  return (
    <div className="space-y-6 pb-6">
      {/* Title Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <FolderTree size={22} className="text-primary" />
          Product Categories
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Explore products organized by category types.
        </p>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {mainCategories.map((cat) => {
          const subCats = allCategories.filter((c) => c.parent_category_id === cat.id);
          return <CategoryCard key={cat.id} category={cat} subCategories={subCats} />;
        })}
        {mainCategories.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center p-8">
            No categories defined yet.
          </p>
        )}
      </div>
    </div>
  );
}
