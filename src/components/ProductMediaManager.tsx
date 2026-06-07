"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadMedia from "./UploadMedia";
import { 
  addProductMediaAction, 
  deleteProductMediaAction, 
  setPrimaryMediaAction 
} from "@/lib/actions";
import { Trash2, Star, Film, Image as ImageIcon, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  display_order: number;
  is_primary: boolean;
}

interface ProductMediaManagerProps {
  productId: string;
  initialMedia: MediaItem[];
}

export default function ProductMediaManager({ productId, initialMedia }: ProductMediaManagerProps) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUploadSuccess = async (url: string, mediaType: "image" | "video") => {
    // Calculate display order
    const nextOrder = mediaList.length > 0 
      ? Math.max(...mediaList.map(m => m.display_order)) + 1 
      : 0;

    const isPrimary = mediaList.length === 0; // First item is primary

    const res = await addProductMediaAction({
      product_id: productId,
      media_type: mediaType,
      media_url: url,
      display_order: nextOrder,
      is_primary: isPrimary,
    });

    if (res.success && res.data) {
      setMediaList((prev) => [...prev, res.data as MediaItem]);
      router.refresh();
    } else {
      alert(res.error || "Failed to link media to product.");
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (confirm("Are you sure you want to delete this media?")) {
      setLoadingId(mediaId);
      const res = await deleteProductMediaAction(mediaId);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
        router.refresh();
      } else {
        alert(res.error || "Failed to delete media.");
      }
      setLoadingId(null);
    }
  };

  const handleSetPrimary = async (mediaId: string) => {
    setLoadingId(mediaId);
    const res = await setPrimaryMediaAction(productId, mediaId);
    if (res.success) {
      setMediaList((prev) =>
        prev.map((m) => ({
          ...m,
          is_primary: m.id === mediaId,
        }))
      );
      router.refresh();
    } else {
      alert(res.error || "Failed to set primary media.");
    }
    setLoadingId(null);
  };

  return (
    <div className="p-6 rounded-2xl glass border border-white/5 space-y-6">
      <div>
        <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
          Product Gallery Media
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1">
          Upload product photos and short demo videos. The primary image is shown in catalogs.
        </p>
      </div>

      {/* Grid of uploaded items */}
      <div className="grid grid-cols-3 gap-4">
        {mediaList
          .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order)
          .map((media) => (
            <div 
              key={media.id} 
              className="relative aspect-square bg-[#101424] rounded-xl overflow-hidden border border-white/5 group"
            >
              {media.media_type === "video" ? (
                <div className="w-full h-full relative">
                  <video src={media.media_url} className="w-full h-full object-cover" muted playsInline />
                  <div className="absolute top-2 left-2 bg-black/60 p-1 rounded text-white">
                    <Film size={12} />
                  </div>
                </div>
              ) : (
                <img src={media.media_url} alt="Product media" className="w-full h-full object-cover" />
              )}

              {/* Badges and overlay buttons */}
              {media.is_primary && (
                <span className="absolute top-2 right-2 bg-primary text-black font-semibold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                  <Star size={8} className="fill-current" />
                  Primary
                </span>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                {loadingId === media.id ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <>
                    {!media.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(media.id)}
                        className="p-1.5 rounded bg-primary text-black hover:bg-primary/95 transition-all text-xs cursor-pointer"
                        title="Set as Primary"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(media.id)}
                      className="p-1.5 rounded bg-destructive text-white hover:bg-destructive/95 transition-all text-xs cursor-pointer"
                      title="Delete Media"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

        {mediaList.length === 0 && (
          <div className="col-span-3 py-6 text-center text-xs text-muted-foreground italic border border-dashed border-white/5 rounded-xl">
            No media uploaded yet.
          </div>
        )}
      </div>

      {/* Upload Box */}
      <div className="pt-2">
        <UploadMedia onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
