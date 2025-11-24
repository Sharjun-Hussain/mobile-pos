"use client";
// BottomNav.jsx (Internal component, remains largely the same but relies on router)

import { ShoppingBag, Package, Settings } from "lucide-react";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router

const navItems = [
  { id: "POS", label: "POS", icon: ShoppingBag, path: "/pos" },
  { id: "INVENTORY", label: "Inventory", icon: Package, path: "/products" },
  { id: "SETTINGS", label: "Settings", icon: Settings, path: "/settings" },
];

export const BottomNav = ({ activeTab }) => {
  const router = useRouter();

  const handleNavigation = (item) => {
    // Navigate to the specific path defined for the tab
    router.push(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-4px_10px_rgba(0,0,0,0.1)] h-16">
      <nav className="flex h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex-1 flex flex-col items-center justify-center p-2 text-sm transition-colors ${
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-0.5 transition-all ${
                  isActive ? "fill-primary/10" : "fill-transparent"
                }`}
              />
              <span
                className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
