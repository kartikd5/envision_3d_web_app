"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Sparkles, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { logoutAction } from "@/lib/actions";
import Logo from "./Logo";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Creations", href: "/admin/latest-creations", icon: Sparkles },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      const res = await logoutAction();
      if (res.success) {
        router.push("/admin/login");
        router.refresh();
      }
    }
  };

  return (
    <aside className="w-64 bg-[#121829] border-r border-white/5 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <div>
            <h1 className="font-display font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
              Envision 3D
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono">ADMIN PORTAL</p>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-primary text-black"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                size={14}
                className={`transform transition-transform ${
                  isActive ? "translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
