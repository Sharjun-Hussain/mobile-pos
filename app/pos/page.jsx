"use client";

import { useState } from "react";
import { Search, Scan, Menu, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { Settings } from "lucide-react";
import DateFormatter from "@/lib/DateFormatter";
import Header from "../Components/Header/Header";

// Mock Data for "Quick Grid"
const QUICK_ITEMS = [
  { id: 1, name: "Panadol", price: 5, color: "bg-blue-100 text-blue-800" },
  {
    id: 2,
    name: "Milk 1L",
    price: 350,
    color: "bg-orange-100 text-orange-800",
  },
  { id: 3, name: "Bread", price: 180, color: "bg-amber-100 text-amber-800" },
  { id: 4, name: "Soda", price: 150, color: "bg-red-100 text-red-800" },
  {
    id: 5,
    name: "Eggs (x10)",
    price: 600,
    color: "bg-yellow-100 text-yellow-800",
  },
  { id: 6, name: "Tea Pkt", price: 120, color: "bg-green-100 text-green-800" },
];

export default function PosScreen() {
  const [cart, setCart] = useState([]);
  const [manualPrice, setManualPrice] = useState("");

  // --- Logic Helpers ---
  const addToCart = (name, price) => {
    setCart((prev) => [...prev, { name, price, qty: 1 }]);
    setManualPrice(""); // Reset calculator if used
  };

  const handleNumpad = (val) => {
    if (val === "C") return setManualPrice("");
    if (val === "BACK") return setManualPrice((prev) => prev.slice(0, -1));
    setManualPrice((prev) => prev + val);
  };

  const handleManualAdd = () => {
    if (!manualPrice) return;
    addToCart("Custom Item", parseInt(manualPrice, 10));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="flex flex-col h-screen w-screen relative">
      {/* App Header */}
      <Header Name="Point of Sale" />
      {/* Scrollable Body */}
      <ScrollArea className="flex-1 bg-gray-50"></ScrollArea>

      {/* 3. The "Drawer" Footer (Cart Summary) */}
      <div className="bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 pb-2 z-20">
        {/* Total & Action */}
      </div>
    </div>
  );
}

// Helper Component for Numpad Buttons
function NumpadBtn({ val, onClick }) {
  return (
    <Button
      variant="ghost"
      className="h-14 text-2xl font-medium text-gray-700 rounded-lg active:bg-gray-100"
      onClick={onClick}
    >
      {val}
    </Button>
  );
}
