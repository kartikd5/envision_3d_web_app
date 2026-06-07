"use client";

import { usePathname } from "next/navigation";

interface FloatingWhatsAppButtonProps {
  number: string;
  businessName: string;
}

export default function FloatingWhatsAppButton({ number, businessName }: FloatingWhatsAppButtonProps) {
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname.startsWith("/admin") || !number) {
    return null;
  }

  const cleanNumber = number.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    `Hello ${businessName},\n\nI was browsing your 3D printed catalog and wanted to inquire about custom orders. Please let me know what options you have available!`
  );
  
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${text}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group pointer-events-auto border border-white/10"
      aria-label="Contact on WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 scale-100 animate-ping group-hover:hidden"></span>
      
      <svg
        className="w-6 h-6 fill-current relative z-10"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.717-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.453 5.429 0 9.85-4.388 9.854-9.785.002-2.614-1.012-5.074-2.859-6.924-1.848-1.85-4.305-2.868-6.922-2.869-5.431 0-9.851 4.39-9.855 9.787a9.69 9.69 0 001.558 5.22L2.14 21.86l4.507-1.183zM18.06 14.86c-.328-.164-1.94-.956-2.24-1.066-.3-.11-.518-.164-.737.164-.219.328-.847 1.066-1.037 1.284-.19.219-.38.246-.708.082-.328-.164-1.386-.51-2.64-1.627-.976-.87-1.635-1.946-1.826-2.274-.19-.328-.02-.505.144-.668.148-.146.328-.383.493-.574.164-.19.219-.328.328-.546.11-.219.055-.41-.027-.574-.082-.164-.738-1.776-1.01-2.433-.267-.641-.56-.553-.77-.564-.198-.01-.426-.01-.655-.01-.228 0-.6-.086-.913.256-.314.341-1.2 1.175-1.2 2.863s1.229 3.32 1.4 3.548c.17.228 2.42 3.693 5.86 5.176.82.353 1.46.562 1.96.721.824.262 1.576.225 2.167.137.66-.098 1.94-.793 2.21-1.56.27-.766.27-1.422.19-1.557-.08-.135-.298-.219-.626-.383z" />
      </svg>
    </a>
  );
}
