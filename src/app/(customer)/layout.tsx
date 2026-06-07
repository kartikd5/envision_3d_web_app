import { getSettings } from "@/lib/db";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import Link from "next/link";

import Logo from "@/components/Logo";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="w-full min-h-screen bg-[#0B0F19] text-foreground flex justify-center">
      {/* Mobile-first centered shell wrapper */}
      <div className="w-full max-w-md min-h-screen bg-[#0D111E] flex flex-col relative shadow-2xl md:border-x md:border-white/5 pb-28">
        
        {/* Sleek Translucent Header */}
        <header className="sticky top-0 z-30 w-full glass px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="w-7 h-7 group-hover:scale-105 transition-transform" />
            <span className="font-display font-extrabold text-sm tracking-wide text-foreground group-hover:text-primary transition-colors">
              {settings.business_name || "Envision 3D"}
            </span>
          </Link>

          {/* Social Links header */}
          <div className="flex items-center gap-3">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                aria-label="Instagram Link"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            )}
            <Link
              href="/contact"
              className="text-[11px] font-semibold tracking-wider text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary hover:text-black transition-all uppercase"
            >
              Contact
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 px-4 pt-4">
          {children}
        </main>

        {/* Reusable Client Components */}
        <BottomNavigation />
        <FloatingWhatsAppButton 
          number={settings.whatsapp_number || ""} 
          businessName={settings.business_name || "Envision 3D"} 
        />
      </div>
    </div>
  );
}
