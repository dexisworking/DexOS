"use client";

import React, { useState, useEffect } from "react";
import { useDexOS } from "@/context/DexOSContext";
import { RiWifiFill, RiBattery2Fill } from "react-icons/ri";

const MobileStatusBar = () => {
  const { batteryLevel } = useDexOS();
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="md:hidden fixed top-0 inset-x-0 h-7 z-[150] flex items-center justify-between px-6 bg-black/30 backdrop-blur-md pointer-events-none">
      {/* Left: Time */}
      <span className="text-[10px] font-bold tracking-tight text-white/90">
        {time ? formatTime(time) : "--:--"}
      </span>

      {/* Right: Info Cluster */}
      <div className="flex items-center gap-2 text-white/90">
        <RiWifiFill className="w-3 h-3" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold">{batteryLevel}%</span>
          <RiBattery2Fill className="w-3.5 h-3.5 rotate-0" />
        </div>
      </div>
    </div>
  );
};

export default MobileStatusBar;
