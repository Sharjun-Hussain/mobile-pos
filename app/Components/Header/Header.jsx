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
    <header className="px-4 py-3 bg-white w-full border-b shadow-md sticky top-0 z-10">
      <div className="text-center">
        <div className="flex  justify-between items-center">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="font-bold text-2xl"> {Name?.toUpperCase() || ""}</h1>
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <DateFormatter date={CurrentDate} />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
