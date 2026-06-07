"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Filter, X, Package } from "lucide-react";
import DeleteProductButton from "@/components/DeleteProductButton";
import { Category, Product } from "@/lib/db";

interface AdminProductsTableProps {
  products: (Product & { 
    primary_media_url?: string; 
    product_categories?: { category_id: string }[];
  })[];
  categories: Category[];
}

type SortableKeys = "sku" | "name" | "price" | "is_active";

export default function AdminProductsTable({ products, categories }: AdminProductsTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Sort States
  const [sortBy, setSortBy] = useState<SortableKeys | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Build maps and lists of categories
  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    categories.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  const mainCategories = useMemo(() => {
    return categories.filter((c) => !c.parent_category_id);
  }, [categories]);

  // Sub-categories list changes based on selected main category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory) {
      return categories.filter((c) => c.parent_category_id === selectedCategory);
    }
    return categories.filter((c) => c.parent_category_id);
  }, [categories, selectedCategory]);

  // Handle Category Filter Change: Reset Sub-category selection and pagination
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory(""); // Always reset sub-category
    setCurrentPage(1);
  };

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle Sub-category Change
  const handleSubCategoryChange = (subId: string) => {
    setSelectedSubCategory(subId);
    setCurrentPage(1);
  };

  // Handle Page Size Change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Helper to resolve categories/sub-categories names for rendering inside the table
  const getProductCategoryNames = (productCatLinks: { category_id: string }[] = []) => {
    const mainNames = new Set<string>();
    const subNames = new Set<string>();

    productCatLinks.forEach((link) => {
      const cat = categoryMap[link.category_id];
      if (cat) {
        if (!cat.parent_category_id) {
          mainNames.add(cat.name);
        } else {
          subNames.add(cat.name);
          const parent = categoryMap[cat.parent_category_id];
          if (parent) {
            mainNames.add(parent.name);
          }
        }
      }
    });

    return {
      mains: Array.from(mainNames).join(", ") || "-",
      subs: Array.from(subNames).join(", ") || "-",
    };
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const prodCatIds = p.product_categories?.map((pc) => pc.category_id) || [];

      // Search matching SKU, Name, Description, and Material
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || "").toLowerCase().includes(q);
        const matchesShortDesc = (p.short_description || "").toLowerCase().includes(q);
        const matchesMaterial = (p.material || "").toLowerCase().includes(q);

        if (!matchesSku && !matchesName && !matchesDesc && !matchesShortDesc && !matchesMaterial) {
          return false;
        }
      }

      // Main Category Filter (matches direct parent category or sub-category belonging to that parent)
      if (selectedCategory) {
        const subCatIds = categories
          .filter((c) => c.parent_category_id === selectedCategory)
          .map((c) => c.id);

        const hasDirectLink = prodCatIds.includes(selectedCategory);
        const hasSubLink = prodCatIds.some((id) => subCatIds.includes(id));

        if (!hasDirectLink && !hasSubLink) {
          return false;
        }
      }

      // Sub-category Filter (matches direct sub-category)
      if (selectedSubCategory) {
        const hasSubLink = prodCatIds.includes(selectedSubCategory);
        if (!hasSubLink) {
          return false;
        }
      }

      return true;
    });
  }, [products, categories, searchQuery, selectedCategory, selectedSubCategory]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    if (!sortBy) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      let fieldA: any = a[sortBy];
      let fieldB: any = b[sortBy];

      if (sortBy === "price") {
        fieldA = Number(fieldA);
        fieldB = Number(fieldB);
      } else if (typeof fieldA === "string") {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortBy, sortOrder]);

  // Compute Pagination values
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  }, [sortedProducts, activePage, pageSize]);

  // Toggle Sorting column
  const handleSort = (key: SortableKeys) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset page to 1 on sort change
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "" || selectedSubCategory !== "";

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSortBy(null);
    setCurrentPage(1);
  };

  // Helper render sort arrows
  const renderSortArrow = (key: SortableKeys) => {
    if (sortBy !== key) {
      return <ArrowUpDown size={12} className="text-muted-foreground/40 ml-1 inline-block" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={12} className="text-primary ml-1 inline-block font-bold" />
    ) : (
      <ArrowDown size={12} className="text-primary ml-1 inline-block font-bold" />
    );
  };

  // Helper to generate dynamic page number ranges with ellipses
  const getPageNumbers = (current: number, total: number) => {
    const pages: (number | string)[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, "...", total);
      } else if (current >= total - 2) {
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Filtering & Search Controls Panel */}
      <div className="p-4 rounded-2xl glass border border-white/5 bg-white/[0.01] flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="relative md:col-span-6">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by SKU, name, material..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 text-foreground focus:ring-1 focus:ring-primary/20 transition-all text-xs pl-10 pr-4 py-3 rounded-xl outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Main Category Dropdown */}
          <div className="relative md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 text-foreground focus:ring-1 focus:ring-primary/20 transition-all text-xs px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0b0f19] text-muted-foreground">
                All Categories
              </option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0b0f19] text-foreground">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <Filter size={12} />
            </div>
          </div>

          {/* Sub-category Dropdown */}
          <div className="relative md:col-span-3">
            <select
              value={selectedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 text-foreground focus:ring-1 focus:ring-primary/20 transition-all text-xs px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0b0f19] text-muted-foreground">
                All Sub-categories
              </option>
              {availableSubCategories.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-[#0b0f19] text-foreground">
                  {sub.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <Filter size={12} />
            </div>
          </div>
        </div>

        {/* Info panel + Reset button */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs">
          <div className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{totalItems}</span> of{" "}
            <span className="font-semibold text-foreground">{products.length}</span> products
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-primary hover:text-primary/80 transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] font-mono cursor-pointer"
            >
              <X size={12} strokeWidth={2.5} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl glass border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground font-mono">
                <th
                  onClick={() => handleSort("sku")}
                  className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-all select-none"
                >
                  <div className="flex items-center">
                    SKU {renderSortArrow("sku")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-all select-none"
                >
                  <div className="flex items-center">
                    Product Name {renderSortArrow("name")}
                  </div>
                </th>
                <th className="px-6 py-4 select-none">Category</th>
                <th className="px-6 py-4 select-none">Sub-category</th>
                <th
                  onClick={() => handleSort("price")}
                  className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-all select-none"
                >
                  <div className="flex items-center">
                    Price {renderSortArrow("price")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("is_active")}
                  className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-all select-none"
                >
                  <div className="flex items-center">
                    Status {renderSortArrow("is_active")}
                  </div>
                </th>
                <th className="px-6 py-4 text-right select-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {paginatedProducts.map((p) => {
                const { mains, subs } = getProductCategoryNames(p.product_categories);
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-all">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {p.sku}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.primary_media_url ? (
                          <img
                            src={p.primary_media_url}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg bg-[#101424] border border-white/5"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground text-xs font-bold border border-white/5">
                            3D
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-foreground block">{p.name}</span>
                          {p.is_customizable && (
                            <span className="text-[9px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                              Customizable
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-foreground/80">
                      {mains}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {subs}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: p.currency || "INR",
                        maximumFractionDigits: 0,
                      }).format(Number(p.price))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-white/5 text-muted-foreground border border-white/5"
                        }`}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          title="Edit Details & Upload Media"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <DeleteProductButton productId={p.id} productName={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {totalItems === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground text-xs space-y-2">
                    <Package size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                    <p className="font-mono text-muted-foreground/60">No products match your filter criteria.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-primary hover:underline font-bold text-xs uppercase tracking-wider mt-1 cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls footer */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-white/5 bg-white/[0.01]">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="bg-[#0b0f19] border border-white/10 text-foreground text-xs px-2.5 py-1.5 rounded-xl outline-none cursor-pointer focus:border-primary/50"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>products per page</span>
            </div>

            {/* Showing details */}
            <div className="text-xs text-muted-foreground font-mono">
              Showing {(activePage - 1) * pageSize + 1} - {Math.min(activePage * pageSize, totalItems)} of {totalItems} entries
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={activePage === 1}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground font-semibold cursor-pointer disabled:cursor-not-allowed"
                title="First Page"
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={activePage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground font-semibold cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {/* Dynamic Page Numbers */}
              {getPageNumbers(activePage, totalPages).map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                  disabled={pageNum === "..."}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    pageNum === activePage
                      ? "bg-primary text-black font-bold border border-primary/25"
                      : pageNum === "..."
                      ? "text-muted-foreground/30 border-none cursor-default"
                      : "border border-white/5 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={activePage === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground font-semibold cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={activePage === totalPages}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground font-semibold cursor-pointer disabled:cursor-not-allowed"
                title="Last Page"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
