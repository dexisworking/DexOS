"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import Image from "next/image";
import AnalogClock from "./widgets/AnalogClock";
import WeatherWidget from "./widgets/WeatherWidget";
import CalendarWidget from "./widgets/CalendarWidget";
import EarbudsWidget from "./widgets/EarbudsWidget";
import AppSearchBar from "./widgets/AppSearchBar";

const Homescreen = () => {
  const { setActiveApp } = useDexOS();

  const apps = [
    { id: "dexsec", name: "DexSec", icon: "/dexsec-favicon.png", desc: "Network Scanner", color: "#00ff88" },
    { id: "dexforensics", name: "DexForensics", icon: "/dexforensics-favicon.png", desc: "Evidence Processor", color: "#00ffff" },
    { id: "dexfortify", name: "DexFortify", icon: "/dexfortify-favicon.png", desc: "Laboratory", color: "#a855f7" },
    { id: "dexsentinel", name: "DexSentinel", icon: "/dexsentinel-favicon.png", desc: "Threat Detection", color: "#ef4444" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen pt-12 pb-32 px-6 md:hidden flex flex-col justify-between overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full">
        <div className="col-span-1">
          <AnalogClock />
        </div>
        <div className="col-span-1 space-y-4">
          <WeatherWidget />
          <div className="bg-white/5 backdrop-blur-3xl rounded-[28px] border border-white/10 p-4 flex items-center justify-around h-20">
             <div className="flex flex-col items-center">
                <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                <span className="text-[8px] font-mono mt-1 opacity-40">PWR</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-1.5 h-4 bg-white/20 rounded-full" />
                <span className="text-[8px] font-mono mt-1 opacity-40">SIG</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-1.5 h-5 bg-white/20 rounded-full" />
                <span className="text-[8px] font-mono mt-1 opacity-40">BWT</span>
             </div>
          </div>
        </div>
        <div className="col-span-1">
          <EarbudsWidget />
        </div>
        <div className="col-span-1">
          <CalendarWidget />
        </div>
      </div>

      <AppSearchBar />
    </div>
  );
};

export default Homescreen;
