"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search products, categories, tags..."}
        className="w-full pl-11 pr-10 py-3.5 bg-[#161D30]/60 border border-white/10 rounded-2xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-3 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors"
          type="button"
          aria-label="Clear search query"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
