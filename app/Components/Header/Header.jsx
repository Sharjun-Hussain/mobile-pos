import DateFormatter from "@/lib/DateFormatter";
import { Settings } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import React from "react";

const Header = ({ Name }) => {
  return (
    <header className="px-4 py-3 bg-white w-full border-b shadow-md sticky top-0 z-10">
      <div className="text-center">
        <div className="flex  justify-between items-center">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="font-bold text-2xl"> {Name?.toUpperCase() || ""}</h1>
          <Settings className="w-6 h-6" />
        </div>
        <div>{DateFormatter({ date: new Date() })}</div>
      </div>
    </header>
  );
};

export default Header;
