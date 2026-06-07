import { getProductsForSearch } from "@/lib/db";
import SearchClient from "@/components/SearchClient";
import { Search } from "lucide-react";

export const revalidate = 10; // Fast catalog updates

export default async function SearchPage() {
  const formattedProducts = await getProductsForSearch();

  return (
    <div className="space-y-6 pb-6">
      {/* Search Title */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <Search size={22} className="text-primary" />
          Search Catalog
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Instantly filter product titles, materials, categories, and tags.
        </p>
      </div>

      <SearchClient initialProducts={formattedProducts} />
    </div>
  );
}
