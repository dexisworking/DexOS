"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import { LuScanFace, LuCircleCheck } from "react-icons/lu";

const Lockscreen = () => {
  const { metrics, setIsLocked } = useDexOS();
  const [time, setTime] = useState<Date | null>(null);
  
  const [isFaceIDActive, setIsFaceIDActive] = useState(false);
  const [faceIDStatus, setFaceIDStatus] = useState<"scanning" | "success" | "idle">("idle");
  
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, -200], [1, 0]);
  const scale = useTransform(dragY, [0, -200], [1, 0.95]);
  const blur = useTransform(dragY, [0, -200], [20, 0]);

  // Trigger FaceID on drag start
  useEffect(() => {
    const unsubscribe = dragY.on("change", (latest) => {
        if (latest < -20 && faceIDStatus === "idle") {
            setFaceIDStatus("scanning");
            setTimeout(() => setFaceIDStatus("success"), 800);
        }
    });
    return () => unsubscribe();
  }, [dragY, faceIDStatus]);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      style={{ y: dragY, opacity, scale }}
      drag="y"
      dragConstraints={{ top: -1000, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.y < -150 || info.velocity.y < -500) {
          setIsLocked(false);
        }
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-24 cursor-grab active:cursor-grabbing"
    >
      {/* Liquid Glass Background Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-[40px] saturate-150 shadow-[inset_0_0_100px_rgba(255,255,255,0.05)]" />

      {/* Top: FaceID Auth Animation (Mobile) */}
      <div className="md:hidden fixed top-10 inset-x-0 flex justify-center z-[110] pointer-events-none">
        <AnimatePresence>
            {faceIDStatus !== "idle" && (
                <motion.div 
                    initial={{ scale: 0.8, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-3xl border transition-colors duration-500 ${
                        faceIDStatus === "success" ? "bg-green-500/10 border-green-500/30" : "bg-white/5 border-white/10"
                    }`}
                >
                    <motion.div
                        animate={faceIDStatus === "scanning" ? { rotate: 360 } : { rotate: 0 }}
                        transition={faceIDStatus === "scanning" ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    >
                        {faceIDStatus === "scanning" ? (
                            <LuScanFace className="w-5 h-5 text-white/40" />
                        ) : (
                            <LuCircleCheck className="w-5 h-5 text-green-400" />
                        )}
                    </motion.div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-white/80 uppercase">
                        {faceIDStatus === "scanning" ? "Authenticating..." : "Identity_Verified"}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Top: Clock & Date */}
      <div className="text-center select-none pointer-events-none px-4">
        <motion.h1 
          className="text-6xl sm:text-7xl md:text-[8.5rem] font-black tracking-tighter leading-none text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {time ? formatTime(time) : "--:--"}
        </motion.h1>
        <p className="text-[10px] sm:text-sm font-mono tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white/50 mt-4">
          {time ? formatDate(time) : "INITIALIZING_SYSTEM"}
        </p>
      </div>

      {/* Middle: Analytical Widgets */}
      <div className="w-full max-w-4xl px-6 select-none pointer-events-none">
        {/* Mobile: Notification List View */}
        <div className="md:hidden flex flex-col gap-3">
            <MobileNotification label="Deployment_Status" value={`${metrics.shippedProjects} PROJ_SHIPPED`} color="#ef4444" time="NEW" />
            <MobileNotification label="Network_Feedback" value={`${metrics.userReviews} USER_REVIEWS`} color="#00ff88" time="NOW" />
            <MobileNotification label="Trace_Intelligence" value={`${metrics.visitsToday} VISITS_TODAY`} color="#00ffff" time="ACTIVE" />
        </div>

        {/* Desktop: Grid View */}
        <div className="hidden md:grid grid-cols-3 gap-6">
            <Widget label="PROJECTS_SHIPPED" value={metrics.shippedProjects} color="#ef4444" />
            <Widget label="USER_REVIEWS" value={metrics.userReviews} color="#00ff88" />
            <Widget label="VISITS_TODAY" value={metrics.visitsToday} color="#00ffff" />
        </div>
      </div>

      {/* Bottom: Swipe Hint & Apple Handle */}
      <div className="text-center select-none pointer-events-none flex flex-col items-center">
        <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/30 mb-8 animate-pulse">
          Swipe up to unlock
        </p>
        {/* Apple Home Indicator */}
        <div className="w-32 h-[5px] bg-white/40 rounded-full blur-[0.5px] shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
      </div>
    </motion.div>
  );
};

const Widget = ({ label, value, color }: { label: string; value: any; color: string }) => (
  <div className="relative group overflow-hidden bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-[28px] p-7 flex flex-col justify-between aspect-video shadow-[0_8px_32px_rgba(0,0,0,0.3)] saturate-150">
    {/* Liquid highlight */}
    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent blur-3xl pointer-events-none" />
    
    <span className="text-[9px] font-mono tracking-widest uppercase text-white/40">{label}</span>
    <span className="text-3xl font-bold font-mono" style={{ color, textShadow: `0 0 20px ${color}44` }}>{value}</span>
  </div>
);

const MobileNotification = ({ label, value, color, time }: { label: string; value: string; color: string; time: string }) => (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-lg">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">{label}</span>
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{time}</span>
        </div>
        <div className="text-[11px] font-bold tracking-wide text-white/80 pl-3.5 uppercase">{value}</div>
    </div>
);

export default Lockscreen;
