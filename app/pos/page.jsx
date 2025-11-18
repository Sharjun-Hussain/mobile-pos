"use client";

import { useState } from "react";
import { Search, Scan, Menu, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { Settings } from "lucide-react";

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
    <div className="flex flex-col h-screen w-scree relative">
      {/* 1. App Header */}
      <header className="px-4 py-3 bg-white border-b sticky top-0 z-10">
        <div className="flex  justify-between items-center">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="font-bold text-2xl"> Point of Sale </h1>
          <Settings className="w-6 h-6" />
        </div>
      </header>

      {/* 2. Scrollable Body */}
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="p-4 space-y-4 pb-32">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search product..."
              className="pl-9 h-12 text-lg bg-white shadow-sm border-gray-200 rounded-xl"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1 text-gray-500"
            >
              <Scan className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Grid */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Quick Items
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {QUICK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item.name, item.price)}
                  className={`
                    ${item.color} 
                    h-20 rounded-2xl flex flex-col items-center justify-center p-1 shadow-sm 
                    active:scale-95 transition-transform duration-100 border border-black/5
                  `}
                >
                  <span className="font-bold text-sm">{item.name}</span>
                  <span className="text-xs opacity-70 font-medium">
                    {item.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Numpad / Manual Entry */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Manual Price
            </h2>
            <Card className="p-1 bg-white shadow-sm border-gray-200 rounded-2xl overflow-hidden">
              {/* Display Screen */}
              <div className="bg-gray-100 p-4 mb-1 rounded-xl flex justify-between items-center">
                <span className="text-gray-500 text-sm">Amount:</span>
                <span className="text-2xl font-mono font-bold text-gray-900">
                  {manualPrice || "0"}
                </span>
              </div>

              {/* Keys */}
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3].map((n) => (
                  <NumpadBtn
                    key={n}
                    val={n.toString()}
                    onClick={() => handleNumpad(n.toString())}
                  />
                ))}
                <Button
                  className="h-14 text-lg font-bold bg-red-50 text-red-600 hover:bg-red-100"
                  variant="ghost"
                  onClick={() => handleNumpad("C")}
                >
                  C
                </Button>

                {[4, 5, 6].map((n) => (
                  <NumpadBtn
                    key={n}
                    val={n.toString()}
                    onClick={() => handleNumpad(n.toString())}
                  />
                ))}
                <Button
                  className="h-14 text-lg font-bold bg-gray-50 text-gray-600"
                  variant="ghost"
                  onClick={() => handleNumpad("BACK")}
                >
                  ⌫
                </Button>

                {[7, 8, 9, 0].map((n) => (
                  <NumpadBtn
                    key={n}
                    val={n.toString()}
                    onClick={() => handleNumpad(n.toString())}
                  />
                ))}
              </div>

              <Button
                className="w-full mt-2 h-12 text-lg bg-slate-900 hover:bg-slate-800 rounded-xl"
                onClick={handleManualAdd}
              >
                Add Custom Item
              </Button>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* 3. The "Drawer" Footer (Cart Summary) */}
      <div className="bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 pb-2 z-20">
        {/* Mini List */}
        {cart.length > 0 && (
          <div className="mb-3 space-y-2 max-h-24 overflow-y-auto">
            {cart
              .slice()
              .reverse()
              .slice(0, 2)
              .map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.name} x{item.qty}
                  </span>
                  <span className="font-mono">{item.price * item.qty}</span>
                </div>
              ))}
            {cart.length > 2 && (
              <p className="text-xs text-center text-gray-400">
                ...and {cart.length - 2} more
              </p>
            )}
          </div>
        )}

        {/* Total & Action */}
        <div className="flex gap-3 h-14">
          <div className="flex-1 flex flex-col justify-center px-2">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Total Due
            </span>
            <span className="text-3xl font-bold text-gray-900 leading-none">
              {total.toLocaleString()}
            </span>
          </div>

          <Button
            className="flex-1 h-full text-xl font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 shadow-lg"
            size="lg"
          >
            CHARGE
          </Button>
        </div>
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
