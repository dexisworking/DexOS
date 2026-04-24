"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNetworkStore } from "@/store/useNetworkStore";
import { useDexOS } from "@/context/DexOSContext";

const TerminalApp = () => {
  const { logs, addLog, isRunning, setGameState, clearLogs } = useNetworkStore();
  const { accentColor, apps } = useDexOS();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track visual viewport to handle mobile keyboard
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const vh = window.innerHeight;
      const vv = window.visualViewport?.height || vh;
      setKeyboardHeight(Math.max(0, vh - vv));
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Start network simulation on mount if not running
  useEffect(() => {
    if (!isRunning) {
        setGameState(true);
        addLog("DEXSEC CORE_SHELL v4.2.0 INITIALIZED", "info");
        addLog("ESTABLISHING ENCRYPTED TUNNEL...", "info");
        addLog("CONNECTION SECURE: AES-256-GCM [ACTIVE]", "success" as any);
        addLog('ENTER COMMAND "HELP" FOR MANUAL', "warn");
    }
  }, [isRunning, setGameState, addLog]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    addLog(`> ${command}`, "info");

    const cmd = command.toLowerCase().trim();
    const args = cmd.split(" ");
    const primary = args[0];

    switch (primary) {
      case "help":
        addLog("--- DexOS TERMINAL MANUAL ---", "info");
        addLog("HELP      : Display this manual", "info");
        addLog("STATUS    : View system performance and network load", "info");
        addLog("PROJECTS  : List all provisioned projects and apps", "info");
        addLog("DEXFETCH  : Show detailed system and kernel information", "info");
        addLog("SCAN      : Initiate a security scan of the virtual network", "info");
        addLog("LS        : List available virtual file directories", "info");
        addLog("WHOAMI    : Show current session identity details", "info");
        addLog("MATRIX    : Initialize neural overlay sequence", "info");
        addLog("CLEAR     : Wipe the terminal buffer history", "info");
        addLog("REBOOT    : Perform a soft system restart", "info");
        addLog("EXIT      : Terminate current shell session", "info");
        addLog("SUDO      : Request superuser privileges", "info");
        break;
      case "status":
        addLog("SYSTEM: OPTIMAL", "success");
        addLog("NETWORK LOAD: 14%", "info");
        break;
      case "whoami":
        addLog("USER: DEX_ADMIN", "info");
        addLog("CLEARANCE: LEVEL_4 [FIELD_AGENT]", "warn");
        addLog("LOCATION: REDACTED", "info");
        break;
      case "dexfetch":
        addLog("                                     ilr,I", "system");
        addLog("                                    iTrrF.", "system");
        addLog("     ,lI:                           Trrrrt", "system");
        addLog("      ;FrrFt:                     ;TrrFrrrt,:IFFFt.      ;FFFFl", "system");
        addLog("       ;IlFjl:n                  :Frrr.trrrjr!rrrrF.    ;rrrr!", "system");
        addLog("      i!rrjfjrrrrt;l,           Irrrf .lFrrF ,jjjrrr;,  :frrl i", "system");
        addLog("   :lFrr!,rrrf lfrrrrrf!I,    ijrrrrrf!:Iri . ;f:trrrt,IrrrI i", "system");
        addLog("  :;.   .:TrrrI. .,iTrrrrrrfIFrrfI,lrr! ::.     c trrrfrrri", "system");
        addLog("          ,jrrr,l    .,:Trj!;. ,.IjrrI I           Ijrrrr:", "system");
        addLog("         IlrrrrT.        Irrrr!!Trrr:             jIrrrrjf.", "system");
        addLog("         irrrrrj I     IIFrrrr!rrrr,.   :. ,i:;i ;frrrrrrrj:", "system");
        addLog("        ;jrrrrr.   ,lTrrrrrrfTrrrj,.i::i,;Trrrrl;jrrrF.Trrrrl:", "system");
        addLog("    ;,t;Trrrrj .ITrrrrrrrjlijrrjjrrrrrrrrrrjrrFTrrrrF ,.!rrrrF:", "system");
        addLog("    irrfrrrrrFjrrrrrrrF:  !rrrrrrrjfTTFrrrrrrtjrrrrf :   lrrrrrI", "system");
        addLog("    ;fFrrrrrrrrrrrrl  .; Itrrrrr.:       l:fTrrrrrFr:,   frrrrrrf,", "system");
        addLog("     lrrrrrrrrrF:  :     ItrjT. :         ijrrrrrrrI     ifrrrrrrj;", "system");
        addLog("     irrrrrj!.  :        Il, ,           Iffffffffl       ifTTTffff;;", "system");
        addLog("----------------------------------------", "system");
        addLog("OS: DexOS v1.1.0 (Mobile Native Updated)", "success");
        addLog("KERNEL: v4.2.0-dex-generic", "info");
        addLog("UPTIME: 3h 42m", "info");
        addLog("SHELL: dexsh 2.0", "info");
        addLog("RESOLUTION: 1920x1080 [VIRTUAL]", "info");
        addLog("THEME: Obsidian/Emerald", "info");
        addLog("----------------------------------------", "system");
        break;
      case "projects":
        addLog("--- SYSTEM APPLICATIONS & PROJECTS ---", "info");
        apps.forEach(app => {
            addLog(`${app.name.padEnd(20)} [${app.slug}]`, "info");
        });
        break;
      case "ls":
        addLog("Directories:", "info");
        addLog("  Evidence/ Intercepts/ Artifacts/ System_Dump/ Encrypted/", "info");
        break;
      case "sudo":
        addLog("Permission denied: USER 'dex' is not in the sudoers file. This incident will be reported.", "error");
        break;
      case "matrix":
        addLog("INITIALIZING NEURAL OVERLAY...", "warn");
        addLog("WAKE UP, NEO...", "success");
        addLog("THE MATRIX HAS YOU.", "success");
        addLog("FOLLOW THE WHITE RABBIT.", "success");
        break;
      case "clear":
        clearLogs();
        break;
      case "reboot":
        addLog("SYSTEM REBOOT INITIATED...", "warn");
        setTimeout(() => window.location.reload(), 1500);
        break;
      case "scan":
        addLog("INITIATING NETWORK SCAN...", "info");
        addLog("SCANNING NODES 0-255...", "info");
        setTimeout(() => addLog("SCAN COMPLETE: 12 NODES FOUND", "success"), 1000);
        break;
      case "exit":
        addLog("SESSION TERMINATED", "warn");
        break;
      default:
        addLog(`COMMAND NOT RECOGNIZED: ${primary}`, "error");
    }

    setCommand("");
  };

  return (
    <div 
        className="flex flex-col h-full bg-[#060a06] text-white/90 font-mono text-[10px] sm:text-xs"
        style={{ paddingBottom: `${keyboardHeight}px` }}
    >
      {/* Metrics Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 md:py-2 border-b border-white/5 bg-white/5">
        <div className="flex gap-4">
          <span className="opacity-40 flex items-center gap-1.5">
            <span className="hidden sm:inline">CPU:</span>
            <span className="text-white">12%</span>
          </span>
          <span className="opacity-40 flex items-center gap-1.5">
            <span className="hidden sm:inline">MEM:</span>
            <span className="text-white">420MB</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="opacity-60 text-[9px] tracking-tighter">LINK_ACTIVE</span>
        </div>
      </div>

      {/* Logs Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar"
      >
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={
                log.type === "error" ? "text-red-400" : 
                log.type === "warn" ? "text-yellow-400" : 
                log.type === "success" ? "text-green-400" : "opacity-70"
            }
          >
            <span className="opacity-30 mr-2">[{log?.timestamp || "--:--:--"}]</span>
            {log?.msg}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleCommand}
        className="p-3 border-t border-white/5 bg-black/40 flex items-center gap-2"
      >
        <span className="text-red-500 font-bold">dex@os:~$</span>
        <input 
          type="text" 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 text-[10px] sm:text-xs"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
};

export default TerminalApp;
