"use client";

import React from "react";
import { motion } from "framer-motion";

const LaserSweep = ({ onComplete }: { onComplete?: () => void }) => {
  return (
    <div className="fixed inset-0 z-[110] pointer-events-none">
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        onAnimationComplete={onComplete}
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_30px_rgba(239,68,68,1)]"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-red-500/5 backdrop-blur-[1px]"
      />
    </div>
  );
};

export default LaserSweep;
