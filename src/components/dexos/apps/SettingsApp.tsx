"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";
import Image from "next/image";

const SettingsApp = () => {
  const { wallpaper, setWallpaper } = useDexOS();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wallpapers = [
    { name: "Elite Operator", url: "/dexos/wallpapers/dexPC_wall1.jpg" },
    { name: "Security Grid", url: "/dexos/wallpapers/dexPC_wall2.jpg" },
    { name: "Neural Mesh", url: "/dexos/wallpapers/dexPC_wall3.jpg" },
    { name: "Classic Dex", url: "/dexos/wallpapers/DexPC_wallOG.jpg" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#060a06] text-white/90 font-mono text-[10px] sm:text-xs overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left: Wallpaper Selector */}
        <div className="flex-1 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-white/5 bg-black/10 md:bg-transparent">
          <h3 className="text-[10px] opacity-40 uppercase tracking-[0.2em] mb-6">Environment_Visuals</h3>
          <div className="grid grid-cols-2 gap-4">
            {wallpapers.map((wp) => (
              <button
                key={wp.url}
                onClick={() => setWallpaper(wp.url)}
                className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                  wallpaper === wp.url ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="w-full h-full relative">
                  <Image 
                    src={wp.url} 
                    alt={wp.name} 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-md">
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest">{wp.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Contact Support */}
        <div className="w-full md:w-96 p-5 sm:p-8 bg-white/[0.01] md:bg-white/[0.02] flex flex-col border-t md:border-t-0 border-white/5">
          <h3 className="text-[10px] opacity-40 uppercase tracking-[0.2em] mb-6">Secure_Comms</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[9px] opacity-30 uppercase tracking-widest mb-1.5 block">Identifier</label>
              <input 
                type="text" 
                placeholder="Agent Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-2 outline-none focus:border-green-500/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[9px] opacity-30 uppercase tracking-widest mb-1.5 block">Relay_Email</label>
              <input 
                type="email" 
                placeholder="agent@relay.link"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-2 outline-none focus:border-green-500/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[9px] opacity-30 uppercase tracking-widest mb-1.5 block">Encrypted_Payload</label>
              <textarea 
                rows={4}
                placeholder="Transmission details..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500/50 transition-colors resize-none"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 sm:py-3 bg-green-500/20 text-green-500 border border-green-500/30 rounded-xl font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
            >
              {isSubmitting ? "TRANSMITTING..." : "SEND TRANSCRIPT"}
            </button>

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] text-green-400 text-center uppercase tracking-widest bg-green-500/10 py-3 rounded-xl"
              >
                Transmission Success // Payload Delivered
              </motion.div>
            )}
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 opacity-20 text-[8px] uppercase tracking-tighter leading-normal flex justify-between items-end">
            <span>Identity verification active. All communications are logged via centralized portfolio archive.</span>
            <span className="font-bold border border-white/20 px-1.5 py-0.5 rounded ml-4 shrink-0">v1.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
