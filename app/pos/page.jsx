"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Scan,
  ShoppingCart,
  Minus,
  Plus,
  ChevronDown,
  Receipt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "../Components/Header/Header";
import gsap from "gsap";

// --- Mock Data ---
const PRODUCTS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
  price: (Math.random() * 20 + 5).toFixed(2),
  color: `hsl(${Math.random() * 360}, 70%, 95%)`,
}));

export default function PosScreen() {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Refs
  const cartBtnRef = useRef(null);
  const mainContainerRef = useRef(null);
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  // --- 1. ITEM FLY ANIMATION ---
  const handleAddToCart = (e, product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }

    if (cartBtnRef.current && !isDrawerOpen) {
      const clickedEl = e.currentTarget;
      const rect = clickedEl.getBoundingClientRect();
      const destRect = cartBtnRef.current.getBoundingClientRect();
      const clone = clickedEl.cloneNode(true);

      clone.style.position = "fixed";
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = 100;
      clone.style.pointerEvents = "none";
      clone.style.transition = "none";
      clone.style.borderRadius = "16px";
      document.body.appendChild(clone);

      gsap.to(clone, {
        x: destRect.left - rect.left + (destRect.width / 2 - rect.width / 2),
        y: destRect.top - rect.top + (destRect.height / 2 - rect.height / 2),
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in", // Smooth acceleration in
        onComplete: () => {
          clone.remove();
          // Subtle bounce on the button
          gsap.fromTo(
            cartBtnRef.current,
            { scale: 1.2 },
            { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
          );
        },
      });
    }
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id)
            return { ...item, qty: Math.max(0, item.qty + delta) };
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  // --- 2. SMOOTH DRAWER ANIMATION (UPDATED) ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isDrawerOpen) {
        // === OPEN: "Soft Landing" ===

        // Screen moves back
        gsap.to(mainContainerRef.current, {
          scale: 0.92,
          y: "15px",
          borderRadius: "24px",
          filter: "brightness(0.6)",
          duration: 0.6, // Slightly longer for smoothness
          ease: "expo.out", // The "Apple" ease: Fast start, very soft end
        });

        // Drawer slides up
        gsap.to(drawerRef.current, {
          y: "0%",
          duration: 0.6,
          ease: "expo.out",
        });

        gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.4 });
      } else {
        // === CLOSE: "Perfectly Synced" ===

        // Drawer drops
        gsap.to(drawerRef.current, {
          y: "100%",
          duration: 0.55,
          ease: "power3.inOut", // Smooth start AND smooth end
        });

        // Screen comes forward (Synced exactly with drawer)
        gsap.to(mainContainerRef.current, {
          scale: 1,
          y: "0px",
          borderRadius: "0px",
          filter: "brightness(1)",
          duration: 0.55,
          ease: "power3.inOut",
        });

        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.4 });
      }
    });
    return () => ctx.revert();
  }, [isDrawerOpen]);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="bg-black h-dvh w-screen overflow-hidden relative">
      {/* === MAIN SCREEN === */}
      <div
        ref={mainContainerRef}
        className="flex flex-col h-full bg-gray-100 w-full origin-top will-change-transform"
      >
        <Header Name="Point of Sale" />

        <div className="flex-1 h-full w-full bg-gray-50 overflow-y-auto">
          <div className="p-4 pb-32">
            {/* Search & Filters */}
            <div className="sticky top-0 z-10 bg-gray-50 pb-4 pt-2">
              <div className="flex items-center rounded-full border bg-white px-3 shadow-sm mb-3 transition-all">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <Input
                  placeholder="Search..."
                  className="border-0 bg-transparent focus-visible:ring-0 h-12"
                />
                <Scan className="h-5 w-5 text-gray-400 shrink-0" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  "All Items",
                  "Medicine",
                  "Snacks",
                  "Drinks",
                  "Home",
                  "Kids",
                ].map((t, i) => (
                  <Badge
                    key={i}
                    variant={i === 0 ? "default" : "secondary"}
                    className="h-9 px-4 shrink-0 transition-all active:scale-95"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  onClick={(e) => handleAddToCart(e, product)}
                  className="bg-white p-3 rounded-2xl shadow-sm border active:scale-95 transition-transform duration-200 cursor-pointer select-none"
                >
                  <div
                    style={{ backgroundColor: product.color }}
                    className="h-28 w-full rounded-xl mb-3 flex items-center justify-center text-3xl font-bold text-gray-400/40"
                  >
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold mt-1">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === OVERLAY === */}
      <div
        ref={overlayRef}
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-30 opacity-0 invisible"
      />

      {/* === FLOATING BUTTON === */}
      <div
        className={`absolute bottom-6 right-4 z-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDrawerOpen || cart.length === 0
            ? "translate-y-32 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <button
          ref={cartBtnRef}
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-3 bg-gray-900 text-white pl-5 pr-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative bg-gray-800 p-2 rounded-full">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-gray-900">
              {totalItems}
            </span>
          </div>
          <div className="text-left flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
              Total Amount
            </span>
            <span className="font-bold text-lg leading-none">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </button>
      </div>

      {/* === DRAWER === */}
      <div
        ref={drawerRef}
        className="absolute inset-x-0 bottom-0 h-[90vh] bg-white z-40 flex flex-col translate-y-full rounded-t-4xl shadow-[0_-20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative bg-white border-b px-6 py-5 flex items-center justify-between shrink-0 z-50">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full" />

          <div className="flex items-center gap-3 pt-2">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-none">
                Current Order
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                ID: #8834 • {cart.length} Items
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 pt-2"
            onClick={() => setIsDrawerOpen(false)}
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>

        {/* CART LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="font-medium">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Add Items
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-3 bg-white border rounded-xl shadow-sm"
              >
                <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400 mr-4 shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-bold text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-primary font-bold">
                    ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-2 py-1 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="h-6 w-6 flex items-center justify-center hover:bg-white rounded active:scale-90 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="h-6 w-6 flex items-center justify-center hover:bg-white rounded active:scale-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-white border-t pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-black text-gray-900">
                ${(totalAmount * 1.05).toFixed(2)}
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Subtotal: ${totalAmount.toFixed(2)}</p>
              <p>Tax (5%): ${(totalAmount * 0.05).toFixed(2)}</p>
            </div>
          </div>
          <Button className="w-full h-14 text-lg font-bold rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 transition-transform shadow-xl shadow-gray-900/20">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
