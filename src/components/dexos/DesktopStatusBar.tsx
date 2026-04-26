"use client";

import React, { useState, useEffect } from "react";

const DesktopStatusBar = () => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHeaderDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).replace(/,/g, ""); // "Sun Apr 26"
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="hidden md:flex fixed top-0 inset-x-0 h-7 z-[150] items-center justify-between px-4 bg-black/40 backdrop-blur-md border-b border-white/5 text-white/90 shadow-sm pointer-events-none">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img 
          src="/favicon.ico" 
          alt="DexOS Logo" 
          className="w-4 h-4 object-contain opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
        />
        <span className="text-xs font-semibold tracking-wide">DexOS</span>
      </div>

      {/* Right: Date & Time */}
      <div className="flex items-center gap-3 text-xs font-medium tracking-wide">
        <span>{date ? formatHeaderDate(date) : "..."}</span>
        <span>{date ? formatTime(date) : "--:--"}</span>
      </div>
    </div>
  );
};

export default DesktopStatusBar;
