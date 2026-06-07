"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/lib/db";
import { updateSettingsAction } from "@/lib/actions";
import { Settings, Loader2, Save, CheckCircle } from "lucide-react";
import UploadMedia from "@/components/UploadMedia";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setBusinessName(data.business_name || "");
        setWhatsappNumber(data.whatsapp_number || "");
        setWhatsappGroupUrl(data.whatsapp_group_url || "");
        setInstagramUrl(data.instagram_url || "");
        setAboutText(data.about_text || "");
        setLogoUrl(data.logo_url || "");
      } catch (err: any) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    formData.append("logo_url", logoUrl); // Append client logo state

    try {
      const res = await updateSettingsAction(null, formData);
      if (res.success) {
        setSuccess(res.message || "Settings saved successfully.");
      } else {
        setError(res.error || "Failed to save settings.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUploaded = (url: string) => {
    setLogoUrl(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <Settings size={24} className="text-primary" />
          Settings Profile
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Define business brand name, Instagram profile links, WhatsApp number, and group chats.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle size={14} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass border border-white/5 space-y-6">
        {/* Brand */}
        <div className="space-y-4 border-b border-white/5 pb-6">
          <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono text-primary">
            Store Identity
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Business Name *
            </label>
            <input
              type="text"
              name="business_name"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Envision 3D"
              className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Narrative About Text
            </label>
            <textarea
              name="about_text"
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="A paragraph about who you are, what filaments you print with, etc."
              className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Business Logo Image
            </label>
            {logoUrl && (
              <div className="mb-2 flex items-center gap-3">
                <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-cover bg-white/5" />
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove logo
                </button>
              </div>
            )}
            <UploadMedia onUploadSuccess={handleLogoUploaded} allowedTypes={["image/*"]} />
          </div>
        </div>

        {/* Coordinates */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono text-primary">
            Social & Chat Coordinates
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                name="whatsapp_number"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Include country code, e.g. +1234567890"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yourprofile"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              WhatsApp Group Invitation Link (Optional)
            </label>
            <input
              type="url"
              name="whatsapp_group_url"
              value={whatsappGroupUrl}
              onChange={(e) => setWhatsappGroupUrl(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all text-xs font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary/95 text-black font-display font-black py-4 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving settings...
            </>
          ) : (
            <>
              <Save size={14} />
              Save Configuration Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
}
