"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, Search, User } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();

  // If the path starts with /admin, we do not show the customer bottom navigation
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Catalog", href: "/products", icon: Compass },
    { label: "Creations", href: "/latest-creations", icon: Sparkles },
    { label: "Search", href: "/search", icon: Search },
    { label: "About", href: "/about", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 md:pb-6 pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto glass-nav rounded-full px-6 py-3 flex justify-between items-center shadow-xl border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center space-y-1 relative group"
            >
              <div
                className={`p-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-black scale-110 shadow-lg shadow-primary/20"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
