"use client";

import { deleteProductAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action is permanent and will delete all associated media.`)) {
      setLoading(true);
      try {
        const res = await deleteProductAction(productId);
        if (res.success) {
          router.refresh();
        } else {
          alert(res.error || "Failed to delete product.");
        }
      } catch (err: any) {
        alert(err.message || "Failed to delete product.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive disabled:opacity-50 transition-all cursor-pointer"
      title="Delete Product"
    >
      <Trash2 size={14} />
    </button>
  );
}
