import { getProducts, getCategories, getLatestCreations } from "@/lib/db";
import Link from "next/link";
import { Package, FolderTree, Sparkles, Settings, ArrowUpRight } from "lucide-react";

export const revalidate = 5; // Near instant refresh for admin panel

export default async function AdminDashboardPage() {
  const [products, categories, creations] = await Promise.all([
    getProducts({ onlyActive: false }), // Get active + inactive
    getCategories(false),
    getLatestCreations(),
  ]);

  const stats = [
    { label: "Products Catalog", count: products.length, icon: Package, href: "/admin/products", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { label: "Categories", count: categories.length, icon: FolderTree, href: "/admin/categories", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { label: "Latest Creations", count: creations.length, icon: Sparkles, href: "/admin/latest-creations", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground">
          Dashboard Overview
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor your catalog items, category classifications, and WhatsApp social coordinates.
        </p>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 rounded-2xl glass border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <Link
                  href={stat.href}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-display font-black text-foreground">
                  {stat.count}
                </span>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
        <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          Quick Manager Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/products/new"
            className="p-4 bg-white/5 border border-white/5 rounded-xl text-sm font-semibold hover:border-primary/30 transition-all flex items-center justify-between"
          >
            <span>Add New Product Model</span>
            <span className="text-xs text-primary font-mono">+ ADD</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 bg-white/5 border border-white/5 rounded-xl text-sm font-semibold hover:border-primary/30 transition-all flex items-center justify-between"
          >
            <span>Edit Social Channels</span>
            <span className="text-xs text-primary font-mono">EDIT</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
