"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import { useCountdown } from "@/hooks/useCountdown";
import type { DexOSApp } from "@/lib/cms/types";

import TerminalApp from "./apps/TerminalApp";
import ArchiveApp from "./apps/ArchiveApp";
import SettingsApp from "./apps/SettingsApp";

interface Message {
  text: string;
  type: "info" | "success" | "error" | "warn" | "system";
  delay: number;
}

const AppTerminalOverlay = ({ app, onClose }: { app: DexOSApp; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);
  const [bootFinished, setBootFinished] = useState(false);
  const countdown = useCountdown(app?.access_restore_date || null);

  const bootSequence: Message[] = React.useMemo(() => [
    { text: "INITIALIZING CORE SERVICE...", type: "system", delay: 500 },
    { text: `TARGET: ${app?.name?.toUpperCase() || "UNKNOWN"}`, type: "info", delay: 300 },
    { text: `ENCRYPTION: AES-256-GCM`, type: "info", delay: 200 },
    { text: `HANDSHAKE... [OK]`, type: "success", delay: 400 },
    { text: "----------------------------------------", type: "system", delay: 100 },
    { text: app?.description || "NO DATA DESCRIPTION AVAILABLE", type: "info", delay: 800 },
    { text: "----------------------------------------", type: "system", delay: 100 },
    { text: "> loading system modules...", type: "info", delay: 400 },
    { text: "> entering app environment...", type: "info", delay: 600 },
  ], [app?.name, app?.description]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIdx = 0;

    const showNextMessage = () => {
      if (currentIdx < bootSequence.length) {
        setMessages((prev) => [...prev, bootSequence[currentIdx]]);
        timeoutId = setTimeout(showNextMessage, bootSequence[currentIdx].delay);
        currentIdx++;
      } else {
        setBootFinished(true);
        setShowResult(true);
        if (app.access_status) {
          setTimeout(() => setCanRedirect(true), 500);
        }
      }
    };

    showNextMessage();
    return () => clearTimeout(timeoutId);
  }, [app, bootSequence]);

  const handleRedirect = useCallback(() => {
    if (canRedirect && app.redirect_url) {
      window.location.href = app.redirect_url;
    }
  }, [canRedirect, app.redirect_url]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleRedirect();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRedirect, onClose]);

  const renderInternalApp = () => {
    switch (app.internal_type) {
      case "terminal": return <TerminalApp />;
      case "archive": return <ArchiveApp />;
      case "settings": return <SettingsApp />;
      default: return null;
    }
  };

  const isInternal = !!app.internal_type && ["terminal", "archive", "settings"].includes(app.internal_type);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
    >
      <div className="w-full h-[calc(100%-1.75rem)] mt-7 md:mt-0 md:w-[90%] md:h-[85%] md:max-w-6xl bg-[#060a06] md:border border-white/10 md:rounded-2xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
        {/* Terminal Header */}
        <div className="px-4 py-2 md:py-2.5 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-md">
          {/* Mobile BACK button (Left) */}
          <button onClick={onClose} className="md:hidden opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 -ml-2">
            <span className="text-[10px] font-mono text-white font-bold tracking-widest flex items-center">
              <span className="text-lg mr-0.5">‹</span>
              <span>BACK</span>
            </span>
          </button>

          {/* Desktop Traffic Lights */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>

          <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase opacity-40 flex-1 md:flex-none text-center md:text-left">
            SECURE_SHELL {"//"} {app.slug}
          </span>

          {/* Desktop Close button (Right) */}
          <button onClick={onClose} className="hidden md:flex opacity-40 hover:opacity-100 transition-opacity items-center gap-1.5 px-2 py-1 -mr-2">
            <span className="text-[9px] font-mono text-white font-bold tracking-widest">CLOSE</span>
            <span className="text-sm font-mono text-white">✕</span>
          </button>
        </div>

        {/* Terminal Body / App Content */}
        <div className="flex-1 font-mono overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!bootFinished || (!isInternal && showResult) ? (
              <motion.div 
                key="terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-xs overflow-y-auto custom-scrollbar h-full"
              >
                <div className="space-y-1.5">
                    {messages.map((msg, i) => {
                      if (!msg) return null;
                      return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={
                            msg.type === "success" ? "text-green-400" :
                            msg.type === "error" ? "text-red-400" :
                            msg.type === "warn" ? "text-yellow-400" :
                            msg.type === "system" ? "opacity-30" : "opacity-70 text-white"
                            }
                        >
                            {msg.type === "system" ? msg.text : `[${msg.type.toUpperCase()}] ${msg.text}`}
                        </motion.div>
                      );
                    })}

                    {showResult && !isInternal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 p-6 rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/5"
                    >
                        {app.access_status ? (
                        <>
                            <h2 className="text-xl font-bold tracking-widest text-green-400 mb-2">[ACCESS GRANTED]</h2>
                            <p className="opacity-40 mb-6 text-[10px] uppercase">Identity Verified via Biometric Scan</p>
                            
                            {canRedirect && (
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-white font-bold tracking-[0.3em] uppercase text-sm cursor-pointer"
                                onClick={handleRedirect}
                            >
                                <span className="hidden md:inline">------ PRESS ENTER TO VISIT ------</span>
                                <span className="md:hidden">------ TAP HERE TO VISIT ------</span>
                            </motion.div>
                            )}
                        </>
                        ) : (
                        <>
                            <h2 className="text-xl font-bold tracking-widest text-red-500 mb-2">[ACCESS DENIED]</h2>
                            <p className="opacity-60 mb-6 text-[11px] uppercase tracking-wide text-red-400/80 font-bold">
                            ---- PROJECT UNDER DEVELOPMENT ----
                            </p>
                            
                            <div className="space-y-1">
                            <p className="text-[9px] opacity-40 uppercase tracking-widest mb-2 font-mono">Restoration ETA</p>
                            <div className="text-2xl font-black text-white tracking-widest font-mono">
                                {countdown}
                            </div>
                            </div>
                        </>
                        )}
                    </motion.div>
                    )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="app"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full pt-7 md:pt-0"
              >
                {renderInternalApp()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-x-0 inset-y-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-10 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default AppTerminalOverlay;
