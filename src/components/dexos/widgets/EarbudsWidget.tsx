"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const STEPS = ["Scanning...", "Handshake...", "Encrypting...", "Connected"];

const EarbudsWidget = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connStep, setConnStep] = useState(-1);
  const [battery, setBattery] = useState(82);
  const [leftBatt] = useState(79);
  const [rightBatt] = useState(84);
  const [barHeights, setBarHeights] = useState<number[]>(Array(8).fill(4));
  const [isPressed, setIsPressed] = useState(false);
  const barInterval = useRef<NodeJS.Timeout | null>(null);
  const connTimer = useRef<NodeJS.Timeout | null>(null);

  // Haptic feedback simulation
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      const duration = type === 'light' ? 10 : type === 'medium' ? 25 : 50;
      navigator.vibrate(duration);
    }
  };

  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBattery(Math.round(batt.level * 100));
        batt.addEventListener("levelchange", () => {
          setBattery(Math.round(batt.level * 100));
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      barInterval.current = setInterval(() => {
        setBarHeights(Array(8).fill(0).map(() => 4 + Math.random() * 16));
      }, 120);
    } else {
      if (barInterval.current) clearInterval(barInterval.current);
      setBarHeights(Array(8).fill(0).map(() => 2 + Math.random() * 4));
    }
    return () => { if (barInterval.current) clearInterval(barInterval.current); };
  }, [isConnected]);

  const handleConnect = () => {
    if (isConnecting) return;

    triggerHaptic('medium');

    if (isConnected) {
      setIsConnected(false);
      setConnStep(-1);
      triggerHaptic('light');
      return;
    }

    setIsConnecting(true);
    setConnStep(0);
    let step = 0;

    connTimer.current = setInterval(() => {
      step++;
      if (step >= STEPS.length) {
        clearInterval(connTimer.current!);
        setIsConnecting(false);
        setIsConnected(true);
        setConnStep(-1);
        triggerHaptic('heavy'); // Success feedback
      } else {
        setConnStep(step);
        triggerHaptic('light'); // Step feedback
      }
    }, 600);
  };

  useEffect(() => {
    return () => { if (connTimer.current) clearInterval(connTimer.current); };
  }, []);

  return (
    <div className="w-full aspect-square bg-[#0a0a0b] rounded-[20px] sm:rounded-[28px] border border-white/[0.06] p-[12px] sm:p-[18px] flex flex-col items-center justify-between shadow-[0_32px_64px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)] relative overflow-hidden font-mono touch-manipulation">

      {/* Scanline texture */}
      <div className="absolute inset-0 rounded-[20px] sm:rounded-[28px] pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)" }} />

      {/* Top glow */}
      <div className={`absolute top-0 inset-x-0 h-28 pointer-events-none transition-all duration-700 ${isConnected ? "opacity-100" : "opacity-40"}`}
        style={{ background: isConnected ? "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 70%)" : "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

      {/* Header */}
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[5px] sm:text-[6px] font-bold tracking-[0.1em] text-white/20 uppercase">Acoustic_Link</span>
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/5 border border-white/[0.06] rounded-full px-1.5 sm:px-2 py-0.5">
          <div className={`w-[3px] sm:w-[4px] h-[3px] sm:h-[4px] rounded-full transition-all duration-500 ${isConnected ? "bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.15),0_0_10px_rgba(34,197,94,0.5)]" : "bg-white/18"}`} />
          <span className="text-[7px] sm:text-[8px] font-bold text-white/70">{battery}%</span>
        </div>
      </div>

      {/* Center: rings + image + bars */}
      <div className="relative flex flex-col items-center z-10 gap-0">
        {/* Pulse rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] sm:w-[100px] h-[70px] sm:h-[100px] pointer-events-none">
          {isConnected && [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full border border-green-500/50"
              style={{ translateX: "-50%", translateY: "-50%" }}
              initial={{ width: 35, height: 35, opacity: 0.8 }}
              animate={{ width: 70, height: 70, opacity: 0 }}
              transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Earbud image */}
        <motion.div
          className="w-14 h-14 sm:w-20 sm:h-20 relative flex items-center justify-center"
          animate={isConnected ? { y: [0, -3, 0], scale: [1, 1.02, 1] } : { y: 0, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/dexos_earbud_asset_1776721872089.png"
            alt="Earbuds"
            width={56}
            height={56}
            className="w-10 h-10 sm:w-16 sm:h-16 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]"
          />
          {/* LED overlays — position these over your actual image */}
          <div className={`absolute top-[38%] left-[22%] w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${isConnected ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-white/20"}`} />
          <div className={`absolute top-[38%] right-[22%] w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${isConnected ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-white/20"}`} />
        </motion.div>

        {/* Waveform bars */}
        <div className="flex items-end gap-[1.5px] sm:gap-[2px] h-4 sm:h-5 mt-2">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className={`w-[2px] sm:w-[3px] rounded-sm transition-all duration-150 ${isConnected ? "bg-green-500" : "bg-white/15"}`}
              style={{ height: `${h * 0.8}px` }}
            />
          ))}
        </div>
      </div>

      {/* Per-earbud battery cards */}
      <div className="flex gap-1 sm:gap-1.5 w-full z-10 mt-1">
        {[
          { label: "L", batt: leftBatt },
          { label: "R", batt: rightBatt },
        ].map(({ label, batt }) => (
          <div
            key={label}
            className={`flex-1 rounded-[8px] sm:rounded-[10px] p-1 sm:p-1.5 border transition-all duration-500 flex flex-col gap-0.5 ${
              isConnected
                ? "bg-white/[0.04] border-green-500/20"
                : "bg-white/[0.03] border-white/[0.07]"
            }`}
          >
            <span className="text-[5px] sm:text-[6px] tracking-[0.1em] text-white/30 uppercase">{label}</span>
            <span className={`text-[9px] sm:text-[10px] font-bold transition-colors duration-500 ${isConnected ? "text-green-400" : "text-white/40"}`}>
              {isConnected ? `${batt}%` : "0%"}
            </span>
            <div className="h-[1.5px] sm:h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isConnected ? "bg-green-500" : "bg-white/20"}`}
                animate={{ width: isConnected ? `${batt}%` : "0%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Connection progress + button */}
      <div className="flex flex-col gap-1.5 w-full z-10">
        {/* Step progress bar */}
        <div className="flex gap-0.5 sm:gap-1 h-2.5 sm:h-3 items-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-[2.5px] sm:h-[3px] rounded-full transition-all duration-300 ${
                isConnected || i < connStep
                  ? "bg-green-500"
                  : i === connStep
                  ? "bg-green-500/40 animate-pulse"
                  : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>

        {/* Step label */}
        <AnimatePresence mode="wait">
          {isConnecting && connStep >= 0 && (
            <motion.span
              key={connStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[6px] sm:text-[7px] tracking-[0.15em] text-green-500/60 uppercase"
            >
              ● &nbsp;{STEPS[connStep]}
            </motion.span>
          )}
          {!isConnecting && !isConnected && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[7px] text-white/0 select-none"
            >
              &nbsp;
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={handleConnect}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          disabled={isConnecting}
          className={`w-full py-1.5 sm:py-2 rounded-[10px] sm:rounded-[12px] text-[7px] sm:text-[8px] font-bold tracking-[0.15em] uppercase transition-all duration-300 outline-none touch-manipulation select-none ${
            isPressed ? 'scale-[0.96]' : ''
          } ${
            isConnected
              ? "bg-green-500 text-black border-transparent shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:bg-green-400 active:scale-[0.94]"
              : isConnecting
              ? "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
              : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.94]"
          }`}
        >
          {isConnected ? "Activated" : isConnecting ? "Connecting..." : "Connect_Device"}
        </button>
      </div>

      {/* Bottom edge line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default EarbudsWidget;
