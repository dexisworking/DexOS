"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import Image from "next/image";
import { FiLoader, FiGrid } from "react-icons/fi";

const Dock = () => {
  const { activeApp, setActiveApp, apps, setIsAppsWindowOpen } = useDexOS();

  const sysUtils = [
    { id: "term", name: "Terminal", char: ">_", color: "#ef4444", slug: "terminal", internal_type: "terminal" },
    { id: "apps", name: "Apps", char: <FiGrid />, color: "#ffffff", slug: "apps", internal_type: "apps_window" },
    { id: "arch", name: "Archive", char: "📁", color: "#ef4444", slug: "archive", internal_type: "archive" },
    { id: "sett", name: "Settings", char: "⚙", color: "#ef4444", slug: "settings", internal_type: "settings" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full flex justify-center">
      {/* macOS Style Dock (Desktop) */}
      <motion.div 
        className="hidden md:flex items-end gap-3 bg-white/5 backdrop-blur-3xl border border-white/10 px-4 py-3 rounded-[24px] shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Primary Apps */}
        <div className="flex items-center gap-3">
          {apps.map((app) => (
            <DockIcon 
              key={app.id} 
              app={app as any} 
              isActive={activeApp?.id === app.id} 
              onClick={() => setActiveApp(app)} 
            />
          ))}
        </div>

        {/* Separator */}
        {apps.length > 0 && <div className="w-[1px] h-8 bg-white/10 mx-1 self-center" />}

        {/* System Utils */}
        <div className="flex items-center gap-3">
          {sysUtils.map((util) => (
            <DockIcon 
              key={util.id} 
              app={util as any} 
              isUtil 
              isActive={activeApp?.slug === util.slug}
              onClick={() => {
                if (util.internal_type === "apps_window") {
                  setIsAppsWindowOpen(true);
                } else {
                  setActiveApp(util as any);
                }
              }} 
            />
          ))}
        </div>
      </motion.div>

      {/* iOS Style Dock (Mobile) */}
      <motion.div 
        className="flex md:hidden items-center justify-around gap-4 bg-white/10 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl w-full max-w-[340px] shadow-xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {sysUtils.map((util) => (
          <button 
            key={util.id}
            onClick={() => {
                if (util.internal_type === "apps_window") {
                  setIsAppsWindowOpen(true);
                } else {
                  setActiveApp(util as any);
                }
            }}
            className="relative flex flex-col items-center gap-1"
          >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center overflow-hidden ${
                activeApp?.slug === util.slug ? "bg-white/20 border-white/30" : "bg-white/5 border-white/10"
            }`}>
              {typeof util.char === 'string' ? (
                <span className="text-xl font-mono" style={{ color: util.color }}>{util.char}</span>
              ) : (
                <div className="text-white text-xl">{util.char}</div>
              )}
            </div>
            {activeApp?.slug === util.slug && (
              <motion.div layoutId="mobile-indicator" className="w-1 h-1 bg-white rounded-full mt-1" />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

const DockIcon = ({ app, isActive, isUtil, onClick }: any) => (
  <motion.button
    whileHover={{ y: -10, scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="relative group"
  >
    {/* Tooltip */}
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none uppercase whitespace-nowrap">
      {app.name}
    </div>

    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${isUtil ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'} border ${!app.access_status && !isUtil ? 'grayscale opacity-50' : ''}`}>
      {app.icon_url ? (
        <Image src={app.icon_url} alt={app.name} width={32} height={32} />
      ) : (
        <span className="text-lg font-mono" style={{ color: app.color }}>{app.char}</span>
      )}
    </div>

    {/* Indicator dot */}
    {isActive && (
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
    )}
  </motion.button>
);

export default Dock;
