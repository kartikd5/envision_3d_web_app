"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Do not wrap login screen in sidebar dashboard layout
  if (pathname === "/admin/login") {
    return <div className="w-full min-h-screen bg-[#0B0F19]">{children}</div>;
  }

  return (
    <div className="flex w-full min-h-screen bg-[#090C15] text-foreground">
      {/* Persistent Admin Dashboard Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
