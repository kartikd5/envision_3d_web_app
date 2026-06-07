"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/lib/actions";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    short_description?: string | null;
    description?: string | null;
    price: number;
    currency: string;
    material?: string | null;
    dimensions?: string | null;
    is_customizable: boolean;
    is_featured: boolean;
    is_active: boolean;
  };
  linkedCategoryIds?: string[];
  linkedTags?: string[];
}

export default function ProductForm({ categories, initialData, linkedCategoryIds = [], linkedTags = [] }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price.toString() || "0");
  const [currency, setCurrency] = useState(initialData?.currency || "INR");
  const [material, setMaterial] = useState(initialData?.material || "");
  const [dimensions, setDimensions] = useState(initialData?.dimensions || "");
  const [isCustomizable, setIsCustomizable] = useState(initialData?.is_customizable ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(linkedCategoryIds);
  const [tagsInput, setTagsInput] = useState(linkedTags.join(", "));

  // Helper to generate slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  const handleCategoryToggle = (cid: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate category selection
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      setLoading(false);
      return;
    }

    const tagNames = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      slug: slug.trim(),
      short_description: shortDesc.trim(),
      description: desc.trim(),
      price: parseFloat(price) || 0,
      currency,
      material: material.trim(),
      dimensions: dimensions.trim(),
      is_customizable: isCustomizable,
      is_featured: isFeatured,
      is_active: isActive,
      categoryIds: selectedCategories,
      tagNames,
    };

    try {
      let res;
      if (initialData) {
        res = await updateProductAction(null, { id: initialData.id, ...payload });
      } else {
        res = await createProductAction(null, payload);
      }

      if (res.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(res.error || "Failed to save product.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header action back */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display font-black text-xl text-foreground">
            {initialData ? `Edit: ${initialData.name}` : "Create Product Model"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {initialData ? "Update item specifications and categories." : "Add a new 3D printed model to the public catalog."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="col-span-2 space-y-4">
          <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
              Primary Specifications
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Spiral Ribbed Vase"
                  className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. ENV-VASE-001"
                  className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Slug URL *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. spiral-ribbed-vase"
                className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Short Catalog Description *
              </label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief 1-2 sentence description shown in lists"
                className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Production Description
              </label>
              <textarea
                rows={5}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Full details: design story, manufacturing parameters, optimal plant match etc."
                className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
              Physical attributes & tags
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Materials Used
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. PLA (Wood filled)"
                  className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Dimensions (WxLxH)
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 15cm x 15cm x 22cm"
                  className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. minimalist, planter, bio-degradable"
                className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Categories & Catalog settings */}
        <div className="space-y-4">
          {/* Price Card */}
          <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
              Pricing Details
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="INR"
                className="w-20 px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono text-center"
              />
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Categories select */}
          <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
              Categories *
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left text-xs transition-all cursor-pointer"
                >
                  <span>{cat.name}</span>
                  {selectedCategories.includes(cat.id) && (
                    <div className="w-5 h-5 rounded-md bg-primary text-black flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Options Card */}
          <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono border-b border-white/5 pb-2">
              Toggles
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold cursor-pointer">
                <span>Is customizable?</span>
                <input
                  type="checkbox"
                  checked={isCustomizable}
                  onChange={(e) => setIsCustomizable(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold cursor-pointer">
                <span>Featured item?</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold cursor-pointer">
                <span>Active status (Visible)</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-black font-display font-black py-4 rounded-2xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving model...
              </>
            ) : (
              "Save Product Model"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
