"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import Lockscreen from "./Lockscreen";
import Homescreen from "./Homescreen";
import Dock from "./Dock";
import LaserSweep from "./LaserSweep";
import AppTerminalOverlay from "./AppTerminalOverlay";
import AppsWindow from "./AppsWindow";
import MobileStatusBar from "./MobileStatusBar";
import DesktopStatusBar from "./DesktopStatusBar";

const DexOSClient = () => {
  const { isLocked, setIsLocked, activeApp, setActiveApp, wallpaper, setIsAppsWindowOpen } = useDexOS();
  const [showSweep, setShowSweep] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle unlocking when system is locked
      if (isLocked) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsLocked(false);
        }
        return;
      }

      // Ignore if typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        // Allow escape to blur even if focused
        if (e.key === "Escape") {
          (document.activeElement as HTMLElement).blur();
        } else {
          return;
        }
      }

      // Alt Shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "t":
            e.preventDefault();
            setActiveApp({ id: "term", name: "Terminal", slug: "terminal", internal_type: "terminal" } as any);
            setIsAppsWindowOpen(false);
            break;
          case "a":
            e.preventDefault();
            setActiveApp({ id: "arch", name: "Archive", slug: "archive", internal_type: "archive" } as any);
            setIsAppsWindowOpen(false);
            break;
          case "s":
            e.preventDefault();
            setActiveApp({ id: "sett", name: "Settings", slug: "settings", internal_type: "settings" } as any);
            setIsAppsWindowOpen(false);
            break;
          case "l":
            e.preventDefault();
            setIsLocked(true);
            setActiveApp(null);
            setIsAppsWindowOpen(false);
            break;
        }
      }

      // Ctrl + K (Apps Window)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAppsWindowOpen((prev: boolean) => !prev);
      }

      // Escape (Universal Close)
      if (e.key === "Escape") {
        setActiveApp(null);
        setIsAppsWindowOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, setActiveApp, setIsAppsWindowOpen, setIsLocked]);

  // Handle the transition logic
  useEffect(() => {
    if (!isLocked && !isUnlocked) {
      setShowSweep(true);
      // Let the sweep animation play before showing the homescreen
      const timer = setTimeout(() => {
        setIsUnlocked(true);
        setShowSweep(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLocked, isUnlocked]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-[#f4f2ed]">
      <MobileStatusBar />
      <DesktopStatusBar />
      {/* Dynamic Background with Liquid Blur Transition */}
      <motion.div 
        animate={{ 
          filter: isUnlocked ? "blur(0px) brightness(0.6)" : "blur(40px) brightness(0.3)",
          scale: isUnlocked ? 1.05 : 1,
          opacity: 1
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${wallpaper}'), radial-gradient(circle at 50% 50%, #0a1f0a 0%, #000 70%), linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)` 
        }}
      />
      
      {/* Liquid Overlay Glow */}
      <motion.div 
        animate={{ opacity: isUnlocked ? 0.3 : 0.6 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" 
      />

      {/* OS Interface */}
      <AnimatePresence mode="wait">
        {isLocked ? (
          <Lockscreen key="lockscreen" />
        ) : (
          <motion.main 
            key="homescreen"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-full h-full"
          >
            <Homescreen />
            <Dock />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Transition Animation Overlay */}
      {showSweep && <LaserSweep />}

      {/* App Window Overlay - Terminal Edition */}
      <AnimatePresence>
        {activeApp && (
          <AppTerminalOverlay 
            key="terminal-overlay"
            app={activeApp} 
            onClose={() => setActiveApp(null)} 
          />
        )}
      </AnimatePresence>
      {/* Apps Window (Launchpad) Overlay */}
      <AppsWindow />
    </div>
  );
};

export default DexOSClient;
