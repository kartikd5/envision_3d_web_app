"use client";

import { useState } from "react";
import { X, MessageSquare, Image, Loader2 } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    sku: string;
    name: string;
  };
  whatsappNumber: string;
}

export default function QuoteModal({ isOpen, onClose, product, whatsappNumber }: QuoteModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 4.5 * 1024 * 1024) {
        setError("Image size must be less than 4.5MB.");
        return;
      }
      setFile(selected);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    let uploadedImageUrl = "";

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await uploadMediaAction(formData);
        if (uploadRes.success && uploadRes.url) {
          uploadedImageUrl = uploadRes.url;
        } else {
          throw new Error(uploadRes.error || "Failed to upload image.");
        }
      }

      // Generate WhatsApp message
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
      
      let message = `Hello,\n\nI want customization for:\n`;
      message += `Product: ${product.name}\n`;
      message += `Product ID: ${product.sku}\n\n`;
      
      message += `Customer Name: ${name}\n`;
      if (phone) message += `Phone: ${phone}\n`;
      
      message += `Customization Notes:\n${notes || "None specified."}\n`;

      if (uploadedImageUrl) {
        message += `\nReference Image URL: ${uploadedImageUrl}\n`;
      }

      message += `\nPlease share pricing.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

      // Reset form states
      setName("");
      setPhone("");
      setNotes("");
      setFile(null);
      onClose();

      // Open WhatsApp
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      {/* Modal overlay to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal content bottom sheet */}
      <div className="relative w-full max-w-md bg-[#121829] border-t border-white/10 rounded-t-3xl p-6 shadow-2xl z-10 transition-transform duration-300 transform translate-y-0 pb-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header indicator bar for swipe down mock */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-extrabold text-lg text-foreground flex items-center gap-2">
              <MessageSquare className="text-primary w-5 h-5" />
              Customize Quote
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              for {product.name} ({product.sku})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/15 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-[#1A2238] border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary/50 text-foreground transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Contact Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 234 567 890"
              className="w-full px-4 py-3 bg-[#1A2238] border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary/50 text-foreground transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Customization Notes *
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe color preferences, sizing, textures or filament finish (e.g. Matte, Silky, Wood, Glow-in-the-dark)..."
              className="w-full px-4 py-3 bg-[#1A2238] border border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary/50 text-foreground transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Reference Image (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A2238] border border-dashed border-white/20 hover:border-primary/50 rounded-xl text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-all flex-1">
                <Image size={16} />
                {file ? file.name : "Choose Photo (Max 4.5MB)"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full mt-2 bg-primary hover:bg-primary-hover text-black py-4 rounded-xl font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing & Uploading...
              </>
            ) : (
              <>
                Continue on WhatsApp
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.431 2.5 1.157 3.476L6.87 18.986l3.665-1.121a5.728 5.728 0 001.496.208c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.765-5.768-5.765zm2.748 7.971c-.134-.067-.803-.396-.927-.442-.124-.045-.215-.068-.306.068-.09.135-.35.442-.43.518-.08.077-.16.086-.294.019-.134-.067-.566-.208-1.077-.665-.398-.354-.666-.792-.744-.927-.08-.134-.008-.207.059-.273.061-.06.134-.158.202-.237.067-.08.09-.135.134-.225.045-.09.022-.169-.011-.236-.034-.068-.306-.738-.419-1.011-.11-.265-.222-.229-.306-.233-.08-.004-.17-.004-.26-.004-.09 0-.237.034-.361.169-.124.135-.474.463-.474 1.129 0 .665.485 1.307.553 1.397.067.09 1.549 2.366 3.753 3.32.524.227.933.362 1.253.464.526.167 1.004.144 1.382.087.42-.063 1.294-.529 1.474-1.037.18-.508.18-.944.126-1.035-.055-.09-.202-.135-.337-.202z" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
