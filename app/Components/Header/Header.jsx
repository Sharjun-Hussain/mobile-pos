import DateFormatter from "@/lib/DateFormatter";
import { Settings } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import React, { memo, useEffect, useState } from "react";

const Header = ({ Name }) => {
  const [CurrentDate, setCurrentDate] = useState(null);
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    // REMOVED: sticky top-0 z-10 (Not needed with the new layout)
    <header className="px-4 py-3 bg-white w-full border-b shadow-md shrink-0">
      <div className="text-center">
        <div className="flex justify-between items-center">
          <ShoppingBag className="h-6 w-6 text-gray-600" />
          <h1 className="font-bold text-2xl text-gray-800">
            {" "}
            {Name?.toUpperCase() || ""}
          </h1>
          <Settings className="w-6 h-6 text-gray-600" />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {/* Safe check to prevent hydration errors if DateFormatter expects a date */}
          {CurrentDate && <DateFormatter date={CurrentDate} />}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
