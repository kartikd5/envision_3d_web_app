"use client";

import { useState } from "react";
import QuoteModal from "./QuoteModal";
import { MessageSquare } from "lucide-react";

interface ProductDetailActionsProps {
  product: {
    sku: string;
    name: string;
    price: number;
    currency: string;
    is_customizable: boolean;
  };
  whatsappNumber: string;
}

export default function ProductDetailActions({ product, whatsappNumber }: ProductDetailActionsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <>
      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4 pb-2 pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto bg-[#101524]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Estimated Price</span>
            <span className="font-display font-black text-xl text-primary">{formattedPrice}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-primary hover:bg-primary/95 text-black font-display font-black text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <MessageSquare size={14} className="fill-current" />
            Get Custom Quote
          </button>
        </div>
      </div>

      {/* Quote Modal bottom sheet */}
      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          sku: product.sku,
          name: product.name,
        }}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
