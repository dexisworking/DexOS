"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDexOS } from "@/context/DexOSContext";

const ArchiveApp = () => {
  const { setActiveApp } = useDexOS();
  const [selectedFolder, setSelectedFolder] = useState("Evidence");

  const folders = [
    { name: "Evidence", icon: "📁", count: 12 },
    { name: "Intercepts", icon: "📡", count: 8 },
    { name: "Artifacts", icon: "🏺", count: 4 },
    { name: "System_Dump", icon: "💾", count: 2 },
    { name: "Encrypted", icon: "🔒", count: 1 },
  ];

  const files = {
    Evidence: [
      { name: "case_042_payload.bin", size: "128KB", date: "2026-04-18" },
      { name: "rootkit_signature.db", size: "1.2MB", date: "2026-04-15" },
      { name: "metadata_extract.json", size: "45KB", date: "2026-04-19" },
    ],
    Intercepts: [
      { name: "packet_stream_01.pcap", size: "4.5MB", date: "2026-04-20" },
      { name: "ssh_handshake.log", size: "12KB", date: "2026-04-20" },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-[#060a06] text-white/90 font-mono text-[10px] sm:text-xs">
      {/* Folder Navigation - Mobile: Horizontal Scroll, Desktop: Sidebar */}
      <div className="md:w-56 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 flex flex-col shrink-0">
        <div className="hidden md:block p-4 opacity-40 uppercase tracking-widest text-[9px] border-b border-white/5">
          Directories
        </div>
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar py-2">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => setSelectedFolder(folder.name)}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-2 text-left transition-all whitespace-nowrap border-b-2 md:border-b-0 md:border-l-2 shrink-0 ${
                selectedFolder === folder.name 
                  ? "bg-white/5 text-white border-green-500" 
                  : "opacity-40 border-transparent hover:bg-white/5 hover:opacity-100"
              }`}
            >
              <span className="text-sm md:text-base">{folder.icon}</span>
              <span className="flex-1 truncate uppercase tracking-widest text-[9px] md:text-inherit">{folder.name}</span>
              <span className="opacity-40 text-[8px] hidden md:block">{folder.count}</span>
            </button>
          ))}
        </div>
        <div className="hidden md:block p-4 border-t border-white/5">
            <div className="text-[9px] opacity-30 uppercase tracking-[0.2em] mb-2">Integrity Status</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    className="h-full bg-green-500/50" 
                />
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-bottom border-white/5 bg-white/5 flex items-center justify-between">
            <span className="opacity-60">{selectedFolder.toUpperCase()} {"//"} INDEX_VIEW</span>
            <span className="text-[9px] opacity-30">CRC32: FFFFFFFF</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="opacity-30 uppercase text-[9px] tracking-widest">
                <th className="pb-4 font-normal">Filename</th>
                <th className="pb-4 font-normal">Size</th>
                <th className="pb-4 font-normal hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {(files[selectedFolder as keyof typeof files] || []).map((file, i) => (
                <tr key={i} className="group hover:bg-white/5 cursor-pointer">
                  <td className="py-2.5 flex items-center gap-2">
                    <span className="opacity-30">📄</span>
                    <span className="opacity-80 group-hover:opacity-100 truncate max-w-[120px] sm:max-w-none">{file.name}</span>
                  </td>
                  <td className="py-2.5 opacity-40">{file.size}</td>
                  <td className="py-2.5 opacity-40 hidden md:table-cell">{file.date}</td>
                </tr>
              ))}
              {(!files[selectedFolder as keyof typeof files] || files[selectedFolder as keyof typeof files].length === 0) && (
                <tr>
                  <td colSpan={3} className="py-12 text-center opacity-20 italic">
                    NO ACCESSIBLE ARTIFACTS IN THIS DIRECTORY
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Challenge Footer */}
        <div className="p-6 bg-red-500/5 border-t border-red-500/10 m-4 rounded-xl border-dashed">
            <h3 className="text-red-500 font-bold mb-1">[!] SECURITY CHALLENGE DETECTED</h3>
            <p className="opacity-60 text-[10px] leading-relaxed">
                Found encrypted packet bundle in root directory. Decryption requires Field Agent level 4 clearance.
            </p>
            <button 
              onClick={() => setActiveApp({ id: "dexforensics", name: "DexForensics", slug: "dexforensics", access_status: true } as any)}
              className="mt-4 px-4 py-1.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest rounded-lg"
            >
                Decrypt Artifact
            </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveApp;
