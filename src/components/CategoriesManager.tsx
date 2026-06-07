"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from "@/lib/actions";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import UploadMedia from "./UploadMedia";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_category_id?: string | null;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
}

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setParentCategoryId("");
    setDescription("");
    setImageUrl("");
    setDisplayOrder("0");
    setIsActive(true);
    setError("");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setParentCategoryId(cat.parent_category_id || "");
    setDescription(cat.description || "");
    setImageUrl(cat.image_url || "");
    setDisplayOrder(cat.display_order.toString());
    setIsActive(cat.is_active);
    setError("");
  };

  const handleDelete = async (id: string, name: string) => {
    const isParent = categories.some((c) => c.parent_category_id === id);
    let msg = `Are you sure you want to delete category "${name}"? Products inside this category will remain, but will be unassociated.`;
    if (isParent) {
      msg = `Warning: Category "${name}" has sub-categories. Deleting it will orphan those sub-categories, promoting them to top-level main categories. Proceed?`;
    }

    if (confirm(msg)) {
      setLoading(true);
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id).map((c) => {
          if (c.parent_category_id === id) {
            return { ...c, parent_category_id: null };
          }
          return c;
        }));
        router.refresh();
      } else {
        alert(res.error || "Failed to delete category.");
      }
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      parent_category_id: parentCategoryId || null,
      description: description.trim(),
      image_url: imageUrl.trim(),
      display_order: parseInt(displayOrder) || 0,
      is_active: isActive,
    };

    try {
      let res;
      if (editingId) {
        res = await updateCategoryAction(null, { id: editingId, ...payload });
      } else {
        // Mock FormData for create action
        const mockForm = new FormData();
        mockForm.append("name", payload.name);
        mockForm.append("slug", payload.slug);
        mockForm.append("parent_category_id", payload.parent_category_id || "");
        mockForm.append("description", payload.description);
        mockForm.append("image_url", payload.image_url);
        mockForm.append("display_order", payload.display_order.toString());
        mockForm.append("is_active", payload.is_active.toString());
        
        res = await createCategoryAction(null, mockForm);
      }

      if (res.success) {
        resetForm();
        router.refresh();
        // Since database revalidation runs on layout, let's refresh page
        window.location.reload();
      } else {
        setError(res.error || "Failed to save category.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (url: string) => {
    setImageUrl(url);
  };

  // Group Categories hierarchically
  const mainCategories = useMemo(() => {
    return categories
      .filter((c) => !c.parent_category_id)
      .sort((a, b) => a.display_order - b.display_order);
  }, [categories]);

  const getSubCategories = (parentId: string) => {
    return categories
      .filter((c) => c.parent_category_id === parentId)
      .sort((a, b) => a.display_order - b.display_order);
  };

  // Helper check if category has sub-categories
  const hasChildren = (catId: string) => {
    return categories.some((c) => c.parent_category_id === catId);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left side: Categories List */}
      <div className="col-span-2 space-y-4">
        <div className="rounded-2xl glass border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground font-mono">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {mainCategories.map((cat) => {
                const subCats = getSubCategories(cat.id);
                return (
                  <React.Fragment key={cat.id}>
                    {/* Main Category Row */}
                    <tr 
                      className={`hover:bg-white/[0.01] transition-all ${
                        editingId === cat.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {cat.display_order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {cat.image_url ? (
                            <img
                              src={cat.image_url}
                              alt={cat.name}
                              className="w-8 h-8 object-cover rounded-lg bg-[#101424] border border-white/5"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground text-xs font-bold border border-white/5">
                              📁
                            </div>
                          )}
                          <span className="font-semibold text-foreground">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            cat.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-white/5 text-muted-foreground border border-white/5"
                          }`}
                        >
                          {cat.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-category Rows */}
                    {subCats.map((sub) => (
                      <tr 
                        key={sub.id} 
                        className={`hover:bg-white/[0.01] transition-all bg-white/[0.002] border-l-2 border-primary/20 ${
                          editingId === sub.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground/50 pl-10">
                          {sub.display_order}
                        </td>
                        <td className="px-6 py-4 pl-10">
                          <div className="flex items-center gap-3">
                            {sub.image_url ? (
                              <img
                                src={sub.image_url}
                                alt={sub.name}
                                className="w-6 h-6 object-cover rounded-md bg-[#101424] border border-white/5"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-muted-foreground text-[10px] font-bold border border-white/5">
                                💡
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground/40 text-xs">└─</span>
                              <span className="font-semibold text-foreground/80">{sub.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground/50 pl-10">
                          {sub.slug}
                        </td>
                        <td className="px-6 py-4 pl-10">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                              sub.is_active
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-white/5 text-muted-foreground border border-white/5"
                            }`}
                          >
                            {sub.is_active ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(sub)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                              title="Edit Sub-category"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id, sub.name)}
                              className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all cursor-pointer"
                              title="Delete Sub-category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground italic text-xs">
                    No categories created yet. Use the form to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side: Editor Form */}
      <div className="space-y-4">
        <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-widest font-mono">
              {editingId ? "Edit Category" : "New Category"}
            </h3>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                <X size={12} />
                Cancel
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Lighting"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all animate-none"
              />
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
                placeholder="e.g. lighting"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>

            {/* Parent Category Selector */}
            {editingId && hasChildren(editingId) ? (
              <div className="text-[10px] text-muted-foreground/60 p-3 bg-white/5 rounded-xl border border-white/5 leading-relaxed font-mono">
                ℹ️ This category has sub-categories, so it cannot be assigned a parent.
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Parent Category
                </label>
                <select
                  value={parentCategoryId}
                  onChange={(e) => setParentCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#0b0f19] text-muted-foreground">
                    None (Top-Level Main Category)
                  </option>
                  {categories
                    .filter((cat) => !cat.parent_category_id && cat.id !== editingId)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0b0f19] text-foreground">
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of catalog items inside"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Category Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all text-xs"
              />
              <div className="pt-1">
                <UploadMedia onUploadSuccess={handlePhotoUploaded} allowedTypes={["image/*"]} />
              </div>
            </div>

            <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold cursor-pointer">
              <span>Is Active (Visible)?</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-black font-display font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving category...
                </>
              ) : (
                editingId ? "Update Category" : "Create Category"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
