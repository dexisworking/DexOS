"use client";

import React, { useState, useMemo } from "react";
import { LuSearch, LuCommand, LuMic, LuCamera } from "react-icons/lu";
import { useDexOS } from "@/context/DexOSContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const AppSearchBar = () => {
  const { apps, setActiveApp } = useDexOS();
  const [query, setQuery] = useState("");

  const filteredApps = useMemo(() => {
    if (!query.trim()) return [];
    return apps.filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase()) || 
        app.slug.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [apps, query]);

  return (
    <div className="relative w-full max-w-lg mx-auto mt-8 z-[60]">
      <div className="relative group">
        <div className="absolute inset-x-2 -inset-y-2 bg-gradient-to-r from-red-500/20 to-green-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-5 py-3 shadow-2xl">
          <LuSearch className="text-white/40 mr-3 w-5 h-5" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search_Applications..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-white/20 focus:ring-0"
          />
          <div className="flex items-center gap-3 ml-2 text-white/40">
            <LuMic className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
            <LuCamera className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filteredApps.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -85, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] p-2"
          >
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                    setActiveApp(app);
                    setQuery("");
                }}
                className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    <Image src={app.icon_url || "/icon.png"} alt={app.name} width={24} height={24} className="object-contain" />
                </div>
                <div className="flex-1">
                    <div className="text-[11px] font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-widest">{app.name}</div>
                    <div className="text-[9px] text-white/40 font-mono tracking-tighter uppercase">{app.slug}_session</div>
                </div>
                <LuCommand className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppSearchBar;
