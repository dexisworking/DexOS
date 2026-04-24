"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type WeatherData = {
  temp: number;
  code: number;
  feels: number;
  humidity: number;
  wind: number;
  uv: number;
  city: string;
  forecast: { code: number; hi: number; lo: number; day: string }[];
};

function getCondition(code: number) {
  if (code === 0) return "Clear_Sky";
  if (code < 4) return "Partly_Cloudy";
  if (code < 10) return "Overcast";
  if (code < 30) return "Foggy";
  if (code < 50) return "Drizzle";
  if (code < 70) return "Rainy";
  if (code < 80) return "Snowfall";
  if (code < 90) return "Showers";
  return "Thunderstorm";
}

type SkyTheme = {
  bg: string;
  horizon: string;
  accentColor: string;
  dotClass: string;
};

function getSkyTheme(code: number): SkyTheme {
  if (code === 0)
    return {
      bg: "#0a1628",
      horizon:
        "radial-gradient(ellipse at 50% 100%, rgba(251,146,60,0.15) 0%, rgba(59,130,246,0.08) 60%, transparent 100%)",
      accentColor: "#fbbf24",
      dotClass: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]",
    };
  if (code < 4)
    return {
      bg: "#090c14",
      horizon:
        "radial-gradient(ellipse at 50% 100%, rgba(148,163,184,0.07) 0%, transparent 70%)",
      accentColor: "#94a3b8",
      dotClass: "bg-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.5)]",
    };
  if (code < 70)
    return {
      bg: "#08101a",
      horizon:
        "radial-gradient(ellipse at 50% 100%, rgba(96,165,250,0.1) 0%, transparent 70%)",
      accentColor: "#60a5fa",
      dotClass: "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.7)]",
    };
  if (code < 99)
    return {
      bg: "#0c0814",
      horizon:
        "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.12) 0%, transparent 70%)",
      accentColor: "#a78bfa",
      dotClass: "bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]",
    };
  return {
    bg: "#090c14",
    horizon:
      "radial-gradient(ellipse at 50% 100%, rgba(148,163,184,0.06) 0%, transparent 70%)",
    accentColor: "#94a3b8",
    dotClass: "bg-slate-400",
  };
}

// --- Animated SVG icons ---
const SunIcon = ({ size = 44 }: { size?: number }) => {
  const c = size / 2, r = size * 0.28, rr = size * 0.38;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return {
      x1: c + Math.cos(a) * rr,
      y1: c + Math.sin(a) * rr,
      x2: c + Math.cos(a) * (rr + size * 0.1),
      y2: c + Math.sin(a) * (rr + size * 0.1),
    };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <motion.circle
        cx={c} cy={c} r={r} fill="#fbbf24"
        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {rays.map((ray, i) => (
        <motion.line
          key={i} stroke="#fbbf24" strokeWidth={size * 0.045} strokeLinecap="round"
          x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
};

const CloudIcon = ({ size = 44, color = "rgba(203,213,225,0.75)" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    <motion.g animate={{ x: [0, 3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <ellipse cx={size * 0.5} cy={size * 0.64} rx={size * 0.36} ry={size * 0.2} fill="rgba(148,163,184,0.6)" />
      <ellipse cx={size * 0.36} cy={size * 0.55} rx={size * 0.23} ry={size * 0.18} fill="rgba(203,213,225,0.7)" />
      <ellipse cx={size * 0.61} cy={size * 0.5} rx={size * 0.25} ry={size * 0.2} fill={color} />
    </motion.g>
  </svg>
);

const RainIcon = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    <motion.g animate={{ x: [0, 3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <ellipse cx={size * 0.5} cy={size * 0.5} rx={size * 0.32} ry={size * 0.18} fill="rgba(148,163,184,0.6)" />
      <ellipse cx={size * 0.36} cy={size * 0.41} rx={size * 0.2} ry={size * 0.16} fill="rgba(203,213,225,0.65)" />
      <ellipse cx={size * 0.61} cy={size * 0.39} rx={size * 0.23} ry={size * 0.18} fill="rgba(226,232,240,0.7)" />
    </motion.g>
    {[0, 0.3, 0.6].map((delay, i) => (
      <motion.line
        key={i}
        x1={(size * 0.36) + i * size * 0.14} y1={size * 0.7}
        x2={(size * 0.32) + i * size * 0.14} y2={size * 0.84}
        stroke="#60a5fa" strokeWidth={size * 0.034} strokeLinecap="round"
        animate={{ y: [0, size * 0.12, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeIn" }}
      />
    ))}
  </svg>
);

const StormIcon = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    <motion.g animate={{ x: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <ellipse cx={size * 0.5} cy={size * 0.45} rx={size * 0.32} ry={size * 0.18} fill="rgba(100,116,139,0.6)" />
      <ellipse cx={size * 0.36} cy={size * 0.36} rx={size * 0.2} ry={size * 0.16} fill="rgba(148,163,184,0.5)" />
      <ellipse cx={size * 0.61} cy={size * 0.34} rx={size * 0.23} ry={size * 0.18} fill="rgba(148,163,184,0.55)" />
    </motion.g>
    <motion.polyline
      points={`${size * 0.55},${size * 0.63} ${size * 0.45},${size * 0.79} ${size * 0.52},${size * 0.79} ${size * 0.41},${size * 0.97}`}
      fill="none" stroke="#a78bfa" strokeWidth={size * 0.045} strokeLinecap="round" strokeLinejoin="round"
      animate={{ opacity: [0, 1, 0.3, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.15, 0.2, 0.3], ease: "easeInOut" }}
    />
  </svg>
);

const WindIcon = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
    {[
      { d: `M${size*0.18} ${size*0.41} Q${size*0.73} ${size*0.41} ${size*0.82} ${size*0.32}`, delay: 0 },
      { d: `M${size*0.18} ${size*0.5} L${size*0.68} ${size*0.5}`, delay: 0.2 },
      { d: `M${size*0.18} ${size*0.59} Q${size*0.77} ${size*0.59} ${size*0.86} ${size*0.68}`, delay: 0.1 },
    ].map((item, i) => (
      <motion.path
        key={i} d={item.d} fill="none"
        stroke="rgba(148,163,184,0.65)" strokeWidth={size * 0.041} strokeLinecap="round"
        animate={{ x: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
      />
    ))}
  </svg>
);

function WeatherIcon({ code, size = 44 }: { code: number; size?: number }) {
  if (code === 0) return <SunIcon size={size} />;
  if (code < 4) return <CloudIcon size={size} />;
  if (code < 70) return <RainIcon size={size} />;
  if (code < 99) return <StormIcon size={size} />;
  return <WindIcon size={size} />;
}

// --- Main widget ---
const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,uv_index,windspeed_10m` +
          `&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
        );
        const d = await res.json();
        const cw = d.current_weather;
        const hourIdx = Math.max(
          d.hourly.time.findIndex((t: string) =>
            t.startsWith(new Date().toISOString().slice(0, 13))
          ),
          0
        );
        const forecast = d.daily.weathercode.slice(0, 4).map((code: number, i: number) => ({
          code,
          hi: Math.round(d.daily.temperature_2m_max[i]),
          lo: Math.round(d.daily.temperature_2m_min[i]),
          day: i === 0 ? "Now" : DAYS[new Date(d.daily.time[i]).getDay()],
        }));
        setWeather({
          temp: Math.round(cw.temperature),
          code: cw.weathercode,
          feels: Math.round(d.hourly.apparent_temperature[hourIdx] ?? cw.temperature),
          humidity: Math.round(d.hourly.relativehumidity_2m[hourIdx] ?? 60),
          wind: Math.round(cw.windspeed),
          uv: Math.round(d.hourly.uv_index?.[hourIdx] ?? 3),
          city: "Local_Node",
          forecast,
        });
      } catch (err) {
        console.error("Weather fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(20.2961, 85.8245)
      );
    } else {
      fetchWeather(20.2961, 85.8245);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full aspect-square bg-[#090c14] rounded-[28px] border border-white/[0.07] flex items-center justify-center">
        <motion.div
          className="w-8 h-8 rounded-full border border-white/10"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    );
  }

  const sky = getSkyTheme(weather?.code ?? 0);
  const uvPct = Math.min((weather?.uv ?? 0) * 9, 100);

  return (
    <div
      className="w-full aspect-square rounded-[28px] border border-white/[0.07] p-5 flex flex-col justify-between relative overflow-hidden font-mono shadow-[0_32px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-700"
      style={{ background: sky.bg }}
    >
      {/* Sky horizon glow */}
      <div className="absolute inset-0 rounded-[28px] pointer-events-none transition-all duration-700"
        style={{ background: sky.horizon }} />
      {/* Scanline */}
      <div className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.007) 3px,rgba(255,255,255,0.007) 4px)" }} />

      {/* Top row */}
      <div className="flex justify-between items-start z-10 relative">
        <span className="text-[6px] font-bold tracking-[0.1em] text-white/20 uppercase">Atmos_Link</span>
        <span className="text-[6px] font-bold tracking-[0.1em] text-white/20 uppercase">{time}</span>
      </div>

      <div className="flex items-end justify-between z-10 relative mt-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-[64px] leading-none text-white tracking-[-4px]"
          style={{ textShadow: "0 0 30px rgba(255,255,255,0.1)" }}
        >
          {weather?.temp}
          <sup className="text-[24px] font-light opacity-70 tracking-normal align-super ml-0.5">°</sup>
        </motion.div>
        <div className="flex flex-col items-end gap-1">
          {weather && <WeatherIcon code={weather.code} size={38} />}
          <span className="text-[6px] font-bold tracking-[0.1em] text-white/40 uppercase text-right">
            {getCondition(weather?.code ?? 0)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px my-3 z-10 relative"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)" }} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 z-10 relative">
        {[
          { label: "Feels", value: weather?.feels, unit: "°C" },
          { label: "Humid", value: weather?.humidity, unit: "%" },
          { label: "Wind", value: weather?.wind, unit: "km/h" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[6px] font-bold tracking-[0.18em] text-white/20 uppercase">{label}</span>
            <span className="text-[13px] font-bold text-white/75">{value}</span>
            <span className="text-[6px] text-white/30">{unit}</span>
          </div>
        ))}
      </div>

      {/* 4-day forecast */}
      <div className="flex gap-1 z-10 relative mt-2">
        {weather?.forecast.map((f, i) => (
          <div
            key={i}
            className={`flex-1 rounded-[10px] border flex flex-col items-center gap-0.5 py-1 px-0.5 transition-all duration-500 ${
              i === 0
                ? "bg-white/[0.09] border-white/[0.12] flex-[1.2]"
                : "bg-white/[0.04] border-white/[0.06]"
            }`}
          >
            <span className="text-[5px] font-bold tracking-[0.05em] text-white/30 uppercase">{f.day}</span>
            <WeatherIcon code={f.code} size={16} />
            <span className="text-[10px] font-bold text-white/75">{f.hi}°</span>
            <span className="text-[8px] text-white/30">{f.lo}°</span>
          </div>
        ))}
      </div>

      {/* UV index bar */}
      <div className="h-[2px] rounded-full bg-white/[0.08] overflow-hidden z-10 relative mt-2.5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, rgba(56,189,248,0.5), ${sky.accentColor})` }}
          initial={{ width: "0%" }}
          animate={{ width: `${uvPct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Bottom row */}
      <div className="flex justify-between items-center z-10 relative mt-2">
        <span className="text-[7px] font-bold tracking-[0.1em] text-white/35 uppercase">{weather?.city}</span>
        <div className="flex items-center gap-1">
          <div className={`w-1 h-1 rounded-full transition-all duration-500 ${sky.dotClass}`} />
          <span className="text-[5px] font-bold tracking-[0.1em] text-white/25 uppercase">Live_Feed</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
