"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createLatestCreationAction, 
  updateLatestCreationAction,
  deleteLatestCreationAction 
} from "@/lib/actions";
import { Sparkles, Trash2, Pencil, Loader2, Link as LinkIcon, Film, Image as ImageIcon } from "lucide-react";
import UploadMedia from "./UploadMedia";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface LatestCreation {
  id: string;
  title: string;
  description?: string | null;
  product_id?: string | null;
  media_url: string;
  media_type: "image" | "video";
  is_featured: boolean;
  display_order: number;
  created_at: string;
  product?: {
    name: string;
    slug: string;
    sku: string;
  } | null;
}

interface CreationsManagerProps {
  initialCreations: LatestCreation[];
  products: Product[];
}

export default function CreationsManager({ initialCreations, products }: CreationsManagerProps) {
  const router = useRouter();
  const [creations, setCreations] = useState<LatestCreation[]>(initialCreations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setProductId("");
    setMediaUrl("");
    setMediaType("image");
    setIsFeatured(true);
    setDisplayOrder(0);
    setError("");
  };

  const handleEditClick = (item: LatestCreation) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setProductId(item.product_id || "");
    setMediaUrl(item.media_url);
    setMediaType(item.media_type);
    setIsFeatured(item.is_featured);
    setDisplayOrder(item.display_order ?? 0);
    setError("");
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete creation entry "${name}"?`)) {
      setLoading(true);
      const res = await deleteLatestCreationAction(id);
      if (res.success) {
        setCreations((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        alert(res.error || "Failed to delete creation.");
      }
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!mediaUrl) {
      setError("Please upload a media file first.");
      setLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      product_id: productId || undefined,
      media_url: mediaUrl,
      media_type: mediaType,
      is_featured: isFeatured,
      display_order: Number(displayOrder) || 0,
    };

    try {
      let res;
      if (editingId) {
        res = await updateLatestCreationAction(editingId, payload);
      } else {
        res = await createLatestCreationAction(null, payload);
      }
      
      if (res.success) {
        resetForm();
        router.refresh();
        // Since database revalidation runs on layout, let's refresh page
        window.location.reload();
      } else {
        setError(res.error || "Failed to save creation.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save creation.");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUploaded = (url: string, type: "image" | "video") => {
    setMediaUrl(url);
    setMediaType(type);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left side: Creations list */}
      <div className="col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {creations.map((item) => (
            <div key={item.id} className="rounded-2xl glass border border-white/5 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-[#101424] overflow-hidden">
                {item.media_type === "video" ? (
                  <video src={item.media_url} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                )}
                
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  <span className="bg-black/60 px-2 py-1 rounded text-white text-[10px] flex items-center gap-1 font-mono uppercase">
                    {item.media_type === "video" ? <Film size={10} /> : <ImageIcon size={10} />}
                    {item.media_type}
                  </span>
                  <span className="bg-black/60 px-2 py-1 rounded text-white text-[10px] flex items-center gap-1 font-mono">
                    Order: {item.display_order ?? 0}
                  </span>
                </div>

                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => handleEditClick(item)}
                    disabled={loading}
                    className="p-1.5 rounded bg-primary/80 hover:bg-primary text-black hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer"
                    title="Edit creation entry"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={loading}
                    className="p-1.5 rounded bg-destructive/80 hover:bg-destructive text-white hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer"
                    title="Delete creation entry"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                  {item.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                </div>

                {item.product && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <LinkIcon size={10} />
                      Model: {item.product.sku}
                    </span>
                    <span className="font-semibold text-primary">{item.product.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {creations.length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground italic text-xs glass border border-white/5 rounded-2xl">
              No creations posted yet. Use the form to submit.
            </div>
          )}
        </div>
      </div>

      {/* Right side: Form editor */}
      <div className="space-y-4">
        <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
          <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
            {editingId ? "Edit Creation Entry" : "New Creation Entry"}
          </h3>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Creation Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. First wood-fill prints done!"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Creations Log Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Story about filament used, printing struggles or details"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none text-xs leading-normal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Link to Product Model (Optional)
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans cursor-pointer text-xs"
              >
                <option value="">-- No Link --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Showcase Media File *
              </label>
              {mediaUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-[#101424]">
                  {mediaType === "video" ? (
                    <video src={mediaUrl} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img src={mediaUrl} alt="Uploaded media" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => setMediaUrl("")}
                    className="absolute top-2 right-2 bg-destructive text-white p-1 rounded text-xs"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <UploadMedia onUploadSuccess={handleMediaUploaded} />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                required
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                placeholder="e.g. 0"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all text-xs"
              />
            </div>

            <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold cursor-pointer">
              <span>Is Featured (Shows on Home)?</span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
            </label>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-black font-display font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingId ? "Saving changes..." : "Publishing entry..."}
                  </>
                ) : (
                  editingId ? "Save Changes" : "Publish Creation Entry"
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-display font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
