import { getLatestCreations } from "@/lib/db";
import LatestCreationCard from "@/components/LatestCreationCard";
import { Sparkles } from "lucide-react";

export const revalidate = 10; // Rapid refresh of creations log

export default async function CreationsLogPage() {
  const creations = await getLatestCreations();

  return (
    <div className="space-y-6 pb-6">
      {/* Title Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <Sparkles size={22} className="text-primary" />
          Creations Log
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          A live feed of custom designs fresh off the 3D printers.
        </p>
      </div>

      {/* Creations Feed */}
      <div className="space-y-6">
        {creations.map((item) => (
          <LatestCreationCard key={item.id} creation={item} />
        ))}
        {creations.length === 0 && (
          <div className="text-center p-12 glass rounded-2xl border border-white/5 text-muted-foreground text-sm">
            No creations have been posted yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
