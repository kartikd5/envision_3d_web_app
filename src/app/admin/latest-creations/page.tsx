import { getLatestCreations, getProducts } from "@/lib/db";
import CreationsManager from "@/components/CreationsManager";
import { Sparkles } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminLatestCreationsPage() {
  const [creations, products] = await Promise.all([
    getLatestCreations(),
    getProducts({ onlyActive: false }), // Get active + inactive to allow linking
  ]);

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <Sparkles size={24} className="text-primary" />
          Manage Creations Log
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Post visual logs of finished models, printing results, wood/stone finishes, and link them to catalog listings.
        </p>
      </div>

      <CreationsManager initialCreations={creations} products={formattedProducts} />
    </div>
  );
}
