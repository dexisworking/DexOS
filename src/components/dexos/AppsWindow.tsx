"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import Image from "next/image";
import { FaGithub, FaInstagram, FaLinkedin, FaPinterest, FaXTwitter } from "react-icons/fa6";
import { SiBuymeacoffee } from "react-icons/si";
import { FiX } from "react-icons/fi";

const AppsWindow = () => {
  const { apps, isAppsWindowOpen, setIsAppsWindowOpen, setActiveApp } = useDexOS();

  const socialApps = [
    { name: "GitHub", icon: FaGithub, url: "https://github.com/dexisworking", color: "#ffffff" },
    { name: "Instagram", icon: FaInstagram, url: "https://instagram.com/dexisreal", color: "#E4405F" },
    { name: "X", icon: FaXTwitter, url: "https://x.com/SekharDibyanshu", color: "#ffffff" },
    { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/in/dibyanshusekhar/", color: "#0A66C2" },
    { name: "Supporters", icon: SiBuymeacoffee, url: "https://buymeacoffee.com/dexisworking", color: "#FFDD00" },
    { name: "Pinterest", icon: FaPinterest, url: "https://www.pinterest.com/thisisdex/_created", color: "#BD081C" },
  ];

  if (!isAppsWindowOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1.1, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, scale: 1, backdropFilter: "blur(20px)" }}
        exit={{ opacity: 0, scale: 1.1, backdropFilter: "blur(0px)" }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-20 pb-32 overflow-y-auto no-scrollbar md:custom-scrollbar bg-black/40 px-6 sm:px-12"
        onClick={() => setIsAppsWindowOpen(false)}
      >
        <div 
          className="w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white">Applications_Vault</h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mt-1">Select source to initialize session</p>
            </div>
            <button 
              onClick={() => setIsAppsWindowOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <FiX className="text-white/60" />
            </button>
          </div>

          {/* System Section */}
          <div className="mb-20">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 mb-8 px-2 border-l-2 border-red-500">Core_Environment</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-10">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    setActiveApp(app);
                    setIsAppsWindowOpen(false);
                  }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <Image 
                      src={app.icon_url || "/icon.png"} 
                      alt={app.name} 
                      width={40} 
                      height={40}
                      className={`object-contain transition-transform duration-500 group-hover:rotate-6 ${app.access_status ? "" : "grayscale"}`}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white/60 group-hover:text-white transition-colors text-center truncate w-full px-1 capitalize">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* External Section */}
          <div className="mb-20">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-8 px-2 border-l-2 border-white/20">External_Nodes</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-10">
              {socialApps.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <social.icon 
                      className="text-2xl sm:text-3xl transition-all duration-500 group-hover:scale-110" 
                      style={{ color: social.color }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white/60 group-hover:text-white transition-colors text-center capitalize">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppsWindow;
