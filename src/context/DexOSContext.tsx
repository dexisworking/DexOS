"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import type { DexOSApp } from "@/lib/cms/types";

type SystemStatus = {
  threatLevel: "STABLE" | "ELEVATED" | "CRITICAL";
  packetsIntercepted: number;
  evidenceLocked: number;
  uptime: string;
};

export interface DexOSMetrics {
  shippedProjects: number;
  userReviews: number;
  visitsToday: number;
}

type DexOSContextType = {
  isLocked: boolean;
  setIsLocked: Dispatch<SetStateAction<boolean>>;
  activeApp: DexOSApp | null;
  setActiveApp: Dispatch<SetStateAction<DexOSApp | null>>;
  systemStatus: SystemStatus;
  accentColor: string;
  metrics: DexOSMetrics;
  wallpaper: string;
  setWallpaper: Dispatch<SetStateAction<string>>;
  isAppsWindowOpen: boolean;
  setIsAppsWindowOpen: Dispatch<SetStateAction<boolean>>;
  batteryLevel: number;
  apps: DexOSApp[];
  loading: boolean;
};

const DexOSContext = createContext<DexOSContextType | undefined>(undefined);

export const DexOSProvider = ({ children }: { children: ReactNode }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [activeApp, setActiveApp] = useState<DexOSApp | null>(null);
  const [wallpaper, setWallpaper] = useState("/dexos/wallpapers/dexPC_wall1.jpg");
  const [isAppsWindowOpen, setIsAppsWindowOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [apps, setApps] = useState<DexOSApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DexOSMetrics>({
    shippedProjects: 0,
    userReviews: 0,
    visitsToday: 0,
  });

  const [systemStatus] = useState<SystemStatus>({
    threatLevel: "ELEVATED",
    packetsIntercepted: 14029,
    evidenceLocked: 42,
    uptime: "04:12:08",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          fetch("/api/dexos/stats"),
          fetch("/api/dexos/apps")
        ]);

        if (statsRes.ok) {
          const stats = await statsRes.json();
          if (stats && typeof stats === 'object') {
            setMetrics({
              shippedProjects: stats.shippedProjects ?? 0,
              userReviews: stats.userReviews ?? 0,
              visitsToday: stats.visitsToday ?? 0,
            });
          }
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          if (Array.isArray(appsData)) {
            // Ensure we only have valid app objects
            setApps(appsData.filter(app => app && typeof app === 'object' && (app.id || app.slug)));
          }
        }
      } catch (error) {
        console.error("DexOS Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Battery API integration
    if (typeof window !== "undefined" && "getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  // Dynamic accent color based on active app or system state
  const getAccentColor = (app: DexOSApp | null) => {
    if (!app) return "#ef4444"; // Root red
    
    switch (app.slug) {
      case "dexsec": return "#00ff88";
      case "dexforensics": return "#00ffff";
      case "dexfortify": return "#a855f7";
      case "dexsentinel": return "#ef4444";
      default: return "#ef4444";
    }
  };

  return (
    <DexOSContext.Provider
      value={{
        isLocked,
        setIsLocked,
        activeApp,
        setActiveApp,
        systemStatus,
        metrics,
        wallpaper,
        setWallpaper,
        isAppsWindowOpen,
        setIsAppsWindowOpen,
        batteryLevel,
        apps,
        loading,
        accentColor: getAccentColor(activeApp),
      }}
    >
      {children}
    </DexOSContext.Provider>
  );
};

export const useDexOS = () => {
  const context = useContext(DexOSContext);
  if (!context) throw new Error("useDexOS must be used within DexOSProvider");
  return context;
};
