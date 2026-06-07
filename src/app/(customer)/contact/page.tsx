import { getSettings } from "@/lib/db";
import { MessageCircle, ExternalLink, Calendar } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSettings();
  const cleanNumber = settings.whatsapp_number?.replace(/[^0-9]/g, "") || "";

  return (
    <div className="space-y-6 pb-6">
      {/* Title */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <MessageCircle size={22} className="text-primary" />
          Get In Touch
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Have a custom idea or bulk order? Connect with us directly.
        </p>
      </div>

      {/* Primary Contact Buttons */}
      <section className="space-y-4">
        {/* Direct Chat */}
        {settings.whatsapp_number && (
          <a
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-[#25D366] text-white rounded-full">
                <MessageCircle size={20} className="fill-current" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">Direct WhatsApp Chat</h4>
                <p className="text-[11px] text-muted-foreground">Inquire about print times & materials</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-all" />
          </a>
        )}

        {/* WhatsApp Group */}
        {settings.whatsapp_group_url && (
          <a
            href={settings.whatsapp_group_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all group"
          >
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-primary text-black rounded-full shadow-lg shadow-primary/10">
                <MessageCircle size={20} className="fill-current" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">Join Creations Group</h4>
                <p className="text-[11px] text-muted-foreground">Get updates on raw batch prints & restocks</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-all" />
          </a>
        )}

        {/* Instagram Profile */}
        {settings.instagram_url && (
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all group"
          >
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-white/5 text-foreground rounded-full">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">Instagram Feed</h4>
                <p className="text-[11px] text-muted-foreground">Follow our print timelapses and releases</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-all" />
          </a>
        )}
      </section>

      {/* Operating info card */}
      <section className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          Lead Times
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Standard catalog prints are processed within 2–4 business days. Custom CAD adjustments or color requests are quoted individually and scheduled as printer beds clear.
        </p>
      </section>
    </div>
  );
}
