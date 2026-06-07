"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSession, removeSession } from "./auth";
import { 
  getAdminByEmail, 
  updateSettingsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  addProductMediaAdmin,
  deleteProductMediaAdmin,
  setPrimaryProductMediaAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  createLatestCreationAdmin,
  updateLatestCreationAdmin,
  deleteLatestCreationAdmin,
} from "./db";
import { supabaseAdmin } from "./supabase";

// ----------------------------------------------------
// AUTH ACTIONS
// ----------------------------------------------------

export async function loginAction(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const admin = await getAdminByEmail(email.toLowerCase().trim());
    if (!admin) {
      return { error: "Invalid email or password." };
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    // Set cookie
    await createSession(admin.id, admin.email);

    return { success: true };
  } catch (e: any) {
    console.error("Login action error:", e);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutAction() {
  await removeSession();
  return { success: true };
}

// ----------------------------------------------------
// SETTINGS ACTIONS
// ----------------------------------------------------

export async function updateSettingsAction(state: any, formData: FormData) {
  const business_name = formData.get("business_name") as string;
  const whatsapp_number = formData.get("whatsapp_number") as string;
  const whatsapp_group_url = formData.get("whatsapp_group_url") as string;
  const instagram_url = formData.get("instagram_url") as string;
  const about_text = formData.get("about_text") as string;
  const logo_url = formData.get("logo_url") as string;

  try {
    await updateSettingsAdmin({
      business_name,
      whatsapp_number,
      whatsapp_group_url,
      instagram_url,
      about_text,
      logo_url,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true, message: "Settings updated successfully." };
  } catch (e: any) {
    return { error: e.message || "Failed to update settings." };
  }
}

// ----------------------------------------------------
// MEDIA STORAGE ACTIONS
// ----------------------------------------------------

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "No file uploaded." };
  }

  const isMockMode = 
    !process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-supabase-project");

  if (isMockMode) {
    const demoPics = [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800"
    ];
    const url = demoPics[Math.floor(Math.random() * demoPics.length)];
    return { success: true, url };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload to 'media' bucket in Supabase (Ensure bucket 'media' exists in Supabase Dashboard with public access)
    const { data, error } = await supabaseAdmin.storage
      .from("media")
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrl } = supabaseAdmin.storage
      .from("media")
      .getPublicUrl(uniqueName);

    return { success: true, url: publicUrl.publicUrl };
  } catch (e: any) {
    console.error("Storage upload error:", e);
    return { success: false, error: e.message || "Failed to upload file." };
  }
}

// ----------------------------------------------------
// PRODUCT ACTIONS
// ----------------------------------------------------

export async function createProductAction(state: any, data: {
  sku: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  price: number;
  currency: string;
  material?: string;
  dimensions?: string;
  is_customizable: boolean;
  is_featured: boolean;
  is_active: boolean;
  categoryIds: string[];
  tagNames: string[];
}) {
  try {
    const { categoryIds, tagNames, ...productFields } = data;
    await createProductAdmin(productFields, categoryIds, tagNames);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, message: "Product created successfully." };
  } catch (e: any) {
    return { error: e.message || "Failed to create product." };
  }
}

export async function updateProductAction(state: any, data: {
  id: string;
  sku: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  price: number;
  currency: string;
  material?: string;
  dimensions?: string;
  is_customizable: boolean;
  is_featured: boolean;
  is_active: boolean;
  categoryIds: string[];
  tagNames: string[];
}) {
  try {
    const { id, categoryIds, tagNames, ...productFields } = data;
    await updateProductAdmin(id, productFields, categoryIds, tagNames);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${productFields.slug}`);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);

    return { success: true, message: "Product updated successfully." };
  } catch (e: any) {
    return { error: e.message || "Failed to update product." };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await deleteProductAdmin(id);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully." };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to delete product." };
  }
}

// Product Media Links
export async function addProductMediaAction(data: {
  product_id: string;
  media_type: "image" | "video";
  media_url: string;
  display_order: number;
  is_primary: boolean;
}) {
  try {
    const res = await addProductMediaAdmin(data);
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, data: res };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to link media." };
  }
}

export async function deleteProductMediaAction(mediaId: string, productId?: string) {
  try {
    await deleteProductMediaAdmin(mediaId);
    if (productId) {
      revalidatePath(`/admin/products/${productId}`);
      revalidatePath("/products");
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to delete media linkage." };
  }
}

export async function setPrimaryMediaAction(productId: string, mediaId: string) {
  try {
    await setPrimaryProductMediaAdmin(productId, mediaId);
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to set primary media." };
  }
}

// ----------------------------------------------------
// CATEGORY ACTIONS
// ----------------------------------------------------

export async function createCategoryAction(state: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const display_order = parseInt(formData.get("display_order") as string || "0");
  const is_active = formData.get("is_active") === "true";
  
  let parent_category_id = formData.get("parent_category_id") as string | null;
  if (parent_category_id === "" || parent_category_id === "none") {
    parent_category_id = null;
  }

  try {
    await createCategoryAdmin({
      name,
      slug,
      description,
      image_url,
      display_order,
      is_active,
      parent_category_id,
    });

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/admin/categories");

    return { success: true, message: "Category created successfully." };
  } catch (e: any) {
    return { error: e.message || "Failed to create category." };
  }
}

export async function updateCategoryAction(state: any, data: {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  parent_category_id?: string | null;
}) {
  try {
    const { id, ...fields } = data;
    if (fields.parent_category_id === "" || fields.parent_category_id === "none") {
      fields.parent_category_id = null;
    }
    await updateCategoryAdmin(id, fields);

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath(`/categories/${fields.slug}`);
    revalidatePath("/admin/categories");

    return { success: true, message: "Category updated successfully." };
  } catch (e: any) {
    return { error: e.message || "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategoryAdmin(id);

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/admin/categories");

    return { success: true, message: "Category deleted successfully." };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to delete category." };
  }
}

// ----------------------------------------------------
// CREATION ACTIONS
// ----------------------------------------------------

export async function createLatestCreationAction(state: any, data: {
  title: string;
  description?: string;
  product_id?: string;
  media_url: string;
  media_type: "image" | "video";
  is_featured: boolean;
  display_order: number;
}) {
  try {
    await createLatestCreationAdmin(data);

    revalidatePath("/");
    revalidatePath("/latest-creations");
    revalidatePath("/admin/latest-creations");

    return { success: true, message: "Creation added successfully." };
  } catch (e: any) {
    return { error: e.message || "Failed to add creation." };
  }
}

export async function updateLatestCreationAction(id: string, data: {
  title: string;
  description?: string;
  product_id?: string;
  media_url: string;
  media_type: "image" | "video";
  is_featured: boolean;
  display_order: number;
}) {
  try {
    await updateLatestCreationAdmin(id, data);

    revalidatePath("/");
    revalidatePath("/latest-creations");
    revalidatePath("/admin/latest-creations");

    return { success: true, message: "Creation updated successfully." };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to update creation." };
  }
}

export async function deleteLatestCreationAction(id: string) {
  try {
    await deleteLatestCreationAdmin(id);

    revalidatePath("/");
    revalidatePath("/latest-creations");
    revalidatePath("/admin/latest-creations");

    return { success: true, message: "Creation deleted successfully." };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to delete creation." };
  }
}
