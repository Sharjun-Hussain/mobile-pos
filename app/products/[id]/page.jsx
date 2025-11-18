"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Heart, Share2, Minus, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import gsap from "gsap";

export default function ProductDetails({ product, onClose, onAddToCart }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [note, setNote] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // --- Mock Variants ---
  const SIZES = ["S", "M", "L", "XL"];
  const EXTRAS = [
    { id: 1, name: "Extra Cheese", price: 2.0 },
    { id: 2, name: "Spicy Sauce", price: 0.5 },
    { id: 3, name: "No Onion", price: 0.0 },
  ];
  const [selectedExtras, setSelectedExtras] = useState([]);

  // --- Animation: Slide Up ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Fade in background overlay
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      // 2. Slide up content (iOS style spring)
      gsap.fromTo(
        contentRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.5, ease: "expo.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // --- Handle Close Animation ---
  const handleClose = () => {
    setIsClosing(true);
    gsap.to(contentRef.current, {
      y: "100%",
      duration: 0.4,
      ease: "power3.in",
    });
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: onClose, // Trigger parent state change after animation
    });
  };

  const toggleExtra = (id) => {
    if (selectedExtras.includes(id)) {
      setSelectedExtras(selectedExtras.filter((x) => x !== id));
    } else {
      setSelectedExtras([...selectedExtras, id]);
    }
  };

  const calculateTotal = () => {
    const base = parseFloat(product.price);
    const extrasTotal = selectedExtras.reduce((acc, id) => {
      const extra = EXTRAS.find((e) => e.id === id);
      return acc + (extra ? extra.price : 0);
    }, 0);
    return ((base + extrasTotal) * qty).toFixed(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        ref={containerRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full h-[92vh] sm:h-[85vh] sm:max-w-md bg-gray-50 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* --- HEADER IMAGE AREA --- */}
        <div className="relative h-72 shrink-0 bg-white">
          {/* Image Background */}
          <div
            style={{ backgroundColor: product.color }}
            className="absolute inset-0 opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Placeholder for real image */}
            <span className="text-9xl font-black text-black/10 select-none">
              {product.name.charAt(0)}
            </span>
          </div>

          {/* Header Actions */}
          <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-start">
            <button
              onClick={handleClose}
              className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-transform"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex gap-3">
              <button className="h-10 w-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white active:scale-90 transition-transform">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE DETAILS --- */}
        <div className="flex-1 overflow-y-auto -mt-6 bg-gray-50 rounded-t-[32px] relative z-10 pt-8 px-6 pb-24">
          {/* Title & Price */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">SKU: #8823-X</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-primary">
                ${product.price}
              </h2>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50 mt-1"
              >
                In Stock
              </Badge>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 my-6" />

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Select Size</h3>
            <div className="flex gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 w-12 rounded-xl font-bold text-sm transition-all active:scale-95 border-2
                    ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20"
                        : "bg-white text-gray-600 border-transparent hover:border-gray-200"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Extras / Add-ons */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Customizations</h3>
            <div className="flex flex-wrap gap-2">
              {EXTRAS.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border active:scale-95 flex items-center gap-2
                        ${
                          isSelected
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-white text-gray-600 border-transparent hover:bg-white hover:shadow-sm"
                        }`}
                  >
                    {extra.name}
                    <span className="opacity-60 text-xs">+${extra.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Kitchen Note
            </h3>
            <Textarea
              placeholder="E.g. No spicy, extra napkins..."
              className="bg-white border-0 resize-none shadow-sm h-24 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
          <div className="flex gap-4 h-14">
            {/* Qty Stepper */}
            <div className="flex items-center bg-gray-100 rounded-xl px-2 shrink-0">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 active:text-black active:scale-90 transition"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-8 text-center font-bold text-lg">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-600 active:text-black active:scale-90 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add Button */}
            <Button
              onClick={() => {
                if (isClosing) return;
                handleClose(); // Close modal
                setTimeout(() => {
                  onAddToCart(product, qty, calculateTotal()); // Trigger add to cart logic in parent
                }, 300); // Wait for animation
              }}
              className="flex-1 h-full rounded-xl text-lg font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform"
            >
              Add to Order
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-sm">
                ${calculateTotal()}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
