"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  Upload,
  MoreVertical,
  Save,
  Trash2,
  Image as ImageIcon,
  Scan,
  LayoutGrid,
  List as ListIcon,
  CheckCircle,
  X,
  Check,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import gsap from "gsap";

// --- Mock Data ---
const CATEGORIES = [
  "Medicine",
  "Snacks",
  "Beverages",
  "Personal Care",
  "Household",
];
const SUB_CATEGORIES = {
  Medicine: ["Painkillers", "Antibiotics", "Supplements"],
  Snacks: ["Chips", "Biscuits", "Chocolates"],
  Beverages: ["Juice", "Soda", "Water"],
  "Personal Care": ["Soaps", "Shampoos", "Lotions"],
  Household: ["Cleaners", "Tools"],
};
const BRANDS = [
  "Panadol",
  "Coca Cola",
  "Munchee",
  "Unilever",
  "Nestle",
  "Generic",
];

const INITIAL_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: i % 2 === 0 ? `Product ${i + 1} (Box)` : `Item ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  brand: BRANDS[i % BRANDS.length],
  price: (Math.random() * 50 + 10).toFixed(2),
  stock: Math.floor(Math.random() * 100),
  sku: `SKU-88${i}`,
  color: `hsl(${Math.random() * 360}, 70%, 95%)`,
  image: null, // URL would go here
}));

export default function ProductManager() {
  // --- State ---
  const [view, setView] = useState("LIST"); // LIST, DETAIL, CREATE
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("LIST"); // 'GRID' or 'LIST'

  // Bulk Action State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Form State (Create/Edit)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    sku: "",
    category: "",
    subCategory: "",
    brand: "",
    description: "",
    image: null,
  });

  // Refs
  const listRef = useRef(null);
  const detailRef = useRef(null);
  const createRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- 1. FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  // --- 2. NAVIGATION ANIMATIONS ---
  const openDetail = (product) => {
    if (isSelectionMode) {
      toggleSelection(product.id);
      return;
    }
    setSelectedProduct(product);
    setFormData({
      ...product,
      subCategory: "",
      cost: (product.price * 0.8).toFixed(2),
    }); // Pre-fill logic
    setView("DETAIL");
  };

  const openCreate = () => {
    setFormData({
      name: "",
      price: "",
      cost: "",
      stock: "",
      sku: "",
      category: "",
      subCategory: "",
      brand: "",
      description: "",
      image: null,
    });
    setView("CREATE");
  };

  const goBack = () => {
    const currentRef = view === "DETAIL" ? detailRef : createRef;
    if (view === "DETAIL")
      gsap.to(currentRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
    else
      gsap.to(currentRef.current, {
        y: "100%",
        duration: 0.4,
        ease: "power3.in",
      });

    gsap.to(listRef.current, {
      x: "0%",
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => setView("LIST"),
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (view === "DETAIL" && detailRef.current) {
        gsap.to(listRef.current, {
          x: "-20%",
          scale: 0.95,
          opacity: 0.8,
          filter: "brightness(0.8)",
          duration: 0.5,
          ease: "power3.out",
        });
        gsap.fromTo(
          detailRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.5, ease: "expo.out" }
        );
      } else if (view === "CREATE" && createRef.current) {
        gsap.to(listRef.current, {
          scale: 0.92,
          opacity: 0.5,
          filter: "blur(2px)",
          duration: 0.5,
          ease: "power3.out",
        });
        gsap.fromTo(
          createRef.current,
          { y: "100%" },
          { y: "0%", duration: 0.5, ease: "expo.out" }
        );
      }
    });
    return () => ctx.revert();
  }, [view]);

  // --- 3. ACTIONS (Bulk, Create, Image) ---
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const toggleSelection = (id) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((x) => x !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} items?`)) {
      setProducts(products.filter((p) => !selectedIds.includes(p.id)));
      setIsSelectionMode(false);
      setSelectedIds([]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  const handleSave = () => {
    // Add basic validation here
    if (view === "CREATE") {
      const newProduct = {
        ...formData,
        id: Date.now(),
        color: "hsl(200, 70%, 95%)",
      };
      setProducts([newProduct, ...products]);
    } else {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        )
      );
    }
    goBack();
  };

  // --- RENDER HELPERS ---
  const ProductCard = ({ item, isGrid }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <div
        onClick={() => openDetail(item)}
        className={`relative group bg-white border shadow-sm transition-all cursor-pointer select-none overflow-hidden
          ${
            isSelectionMode && isSelected
              ? "ring-2 ring-primary border-primary bg-primary/5"
              : "active:scale-95"
          }
          ${
            isGrid
              ? "flex flex-col p-3 rounded-2xl"
              : "flex items-center gap-4 p-3 rounded-xl"
          }
        `}
      >
        {/* Selection Checkbox Overlay */}
        {isSelectionMode && (
          <div
            className={`absolute top-2 right-2 z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? "bg-primary border-primary"
                : "bg-white border-gray-300"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        )}

        {/* Image Area */}
        <div
          style={{ backgroundColor: item.color }}
          className={`${
            isGrid ? "h-32 w-full mb-3" : "h-16 w-16 shrink-0"
          } rounded-xl flex items-center justify-center text-xl font-bold text-black/10 relative overflow-hidden`}
        >
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{item.name.charAt(0)}</span>
          )}
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <div
            className={`${isGrid ? "" : "flex justify-between items-start"}`}
          >
            <h3 className="font-bold text-gray-900 truncate text-sm">
              {item.name}
            </h3>
            <span
              className={`${
                isGrid ? "hidden" : "block"
              } text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600`}
            >
              {item.sku}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {item.brand} • {item.category}
          </p>

          <div className="flex justify-between items-end mt-2">
            <p className="font-bold text-primary">${item.price}</p>
            <p
              className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                item.stock < 10
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {item.stock} left
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-dvh w-screen bg-black overflow-hidden font-sans">
      {/* =========================== */}
      {/* 1. MAIN LIST VIEW           */}
      {/* =========================== */}
      <div
        ref={listRef}
        className="absolute inset-0 bg-gray-50 flex flex-col h-full w-full origin-center will-change-transform"
      >
        {/* Header */}
        <header
          className={`px-4 py-3 border-b flex justify-between items-center sticky top-0 z-20 transition-colors ${
            isSelectionMode ? "bg-primary text-white" : "bg-white text-gray-900"
          }`}
        >
          {isSelectionMode ? (
            <div className="flex items-center gap-3 w-full">
              <button onClick={toggleSelectionMode}>
                <X className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg">
                {selectedIds.length} Selected
              </span>
              <div className="flex-1" />
              <button
                onClick={() => setSelectedIds(products.map((p) => p.id))}
                className="text-sm font-medium opacity-90"
              >
                Select All
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">Inventory</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-10 w-10"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() =>
                      setViewMode(viewMode === "LIST" ? "GRID" : "LIST")
                    }
                  >
                    {viewMode === "LIST" ? (
                      <LayoutGrid className="mr-2 h-4 w-4" />
                    ) : (
                      <ListIcon className="mr-2 h-4 w-4" />
                    )}
                    Switch to {viewMode === "LIST" ? "Grid" : "List"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleSelectionMode}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Select Items
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </header>

        {/* Search & Filters */}
        {!isSelectionMode && (
          <div className="px-4 py-3 space-y-3 bg-white shadow-sm z-10">
            <div className="flex items-center rounded-xl border bg-gray-50 px-3 h-11">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product name, SKU..."
                className="border-0 bg-transparent focus-visible:ring-0 h-full text-base shadow-none"
              />
              {searchQuery && (
                <X
                  onClick={() => setSearchQuery("")}
                  className="h-4 w-4 text-gray-400 cursor-pointer"
                />
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["All", ...CATEGORIES].map((cat, i) => (
                <Badge
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className={`h-8 px-4 shrink-0 cursor-pointer transition-all ${
                    activeCategory !== cat
                      ? "bg-white text-gray-600 border-gray-200"
                      : ""
                  }`}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-28">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Filter className="w-12 h-12 mb-2 opacity-20" />
              <p>No products found</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "GRID" ? "grid grid-cols-2 gap-3" : "space-y-3"
              }
            >
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  isGrid={viewMode === "GRID"}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action / Bulk Bar */}
        {isSelectionMode ? (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 z-30 flex gap-3 shadow-lg slide-up">
            <Button
              variant="outline"
              className="flex-1"
              onClick={toggleSelectionMode}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </Button>
          </div>
        ) : (
          <div className="absolute bottom-8 right-6 z-20">
            <button
              onClick={openCreate}
              className="h-14 w-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>

      {/* =========================== */}
      {/* 2. CREATE / EDIT FORM       */}
      {/* =========================== */}
      {/* We reuse the same form layout for both Create and Edit but animate differently based on 'view' */}
      {(view === "CREATE" || view === "DETAIL") && (
        <div
          ref={view === "DETAIL" ? detailRef : createRef}
          className={`absolute inset-0 z-30 flex flex-col bg-gray-50 shadow-2xl overflow-hidden
            ${view === "CREATE" ? "top-4 rounded-t-[32px]" : "h-full w-full"}
          `}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b bg-white flex items-center justify-between shrink-0 ${
              view === "CREATE" ? "rounded-t-[32px]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="-ml-2 rounded-full bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <h2 className="text-xl font-bold">
                {view === "CREATE" ? "New Product" : "Edit Product"}
              </h2>
            </div>
            {view === "DETAIL" && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 bg-red-50 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
            {/* Image Uploader */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative h-52 rounded-2xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 overflow-hidden transition-all"
            >
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Tap to upload image
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Basic Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Panadol Extra"
                  className="h-12 bg-white border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Brand</Label>
                <select
                  className="flex h-12 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                >
                  <option value="">Select Brand</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subCategory: "",
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-Category</Label>
                  <select
                    disabled={!formData.category}
                    className="flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm disabled:opacity-50"
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subCategory: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {formData.category &&
                      SUB_CATEGORIES[formData.category]?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">
                Inventory & Pricing
              </h3>

              <div className="space-y-2">
                <Label>SKU / Barcode</Label>
                <div className="relative">
                  <Input
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Scan or type..."
                    className="h-12 bg-gray-50 pr-10"
                  />
                  <Scan className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="h-12 bg-gray-50 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost</Label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    className="h-12 bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="h-12 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white resize-none h-32"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 bg-white border-t pb-8 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg"
              onClick={handleSave}
            >
              <Save className="w-5 h-5 mr-2" /> Save Product
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
