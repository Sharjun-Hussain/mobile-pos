"use client";
// AppLayout.jsx (Your main application file)

import React, { useState } from "react";
import ProductManager from "../products/page";
import { BottomNav } from "../Components/BottomNav";
import { ShoppingBag } from "lucide-react";
import { Package } from "lucide-react";
import { Settings } from "lucide-react";

// --- PLACEHOLDER COMPONENTS ---
// Replace these with your actual imported components
const PosScreenStub = () => (
  <div className="h-full w-full flex items-center justify-center bg-green-50">
    <h2 className="text-2xl font-bold text-green-700">POS SCREEN (Full App)</h2>
  </div>
);

const SettingsScreenStub = () => (
  <div className="h-full w-full flex items-center justify-center bg-blue-50">
    <h2 className="text-2xl font-bold text-blue-700">SETTINGS SCREEN</h2>
  </div>
);

// (BottomNav component code goes here)
const navItems = [
  { id: "POS", label: "POS", icon: ShoppingBag },
  { id: "INVENTORY", label: "Inventory", icon: Package },
  { id: "SETTINGS", label: "Settings", icon: Settings },
];
// ... [Insert the BottomNav component code from above here] ...

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState("INVENTORY"); // Default view

  const renderContent = () => {
    switch (activeTab) {
      case "POS":
        return <PosScreenStub />;
      case "INVENTORY":
        return <ProductManager />; // Renders your complex inventory component
      case "SETTINGS":
        return <SettingsScreenStub />;
      default:
        return <ProductManager />;
    }
  };

  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-gray-100">
      {/* --- Main Screen Content --- */}
      {/* We need padding at the bottom equal to the navbar height (h-16) */}
      <div className="h-full w-full overflow-y-auto pb-16">
        {renderContent()}
      </div>

      {/* --- Bottom Navigation Bar --- */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
