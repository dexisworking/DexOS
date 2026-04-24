"use client";

import React, { useState } from "react";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["M","T","W","T","F","S","S"];
const DAYS_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const FAKE_EVENTS = new Set([3, 7, 14, 22]);

const CalendarWidget = () => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();
  const isCurrentMonth = viewMonth === todayMonth && viewYear === todayYear;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const todayStr =
    String(now.getDate()).padStart(2, "0") +
    " " +
    MONTHS[now.getMonth()] +
    " " +
    now.getFullYear();
  const dowStr = DAYS_FULL[now.getDay()].substring(0, 3).toUpperCase();

  const prevMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(prev => prev === dayNum ? null : dayNum);
  };

  return (
    <div className="flex justify-center w-full aspect-square">
      <div
        className="w-full h-full rounded-[32px] border border-white/[0.07] p-5 font-mono relative overflow-hidden flex flex-col justify-between shadow-2xl"
        style={{ background: "#0c0c0c" }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        {/* Header */}
        <div className="flex justify-between items-start mb-2 px-0.5">
          <div>
            <span className="block text-[10px] font-black text-red-500 tracking-[0.2em] uppercase leading-none">
              {MONTHS[viewMonth]}
            </span>
            <span className="block text-[7px] text-white/[0.18] font-bold tracking-[0.05em] mt-1 uppercase">
               {viewYear}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex gap-1.5">
              {[{ label: "‹", action: prevMonth }, { label: "›", action: nextMonth }].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-[20px] h-[20px] rounded-lg flex items-center justify-center text-[10px] text-white/40 border border-white/[0.08] transition-all duration-150 hover:bg-white/10 hover:text-white/80"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-y-1 flex-1 items-center">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="text-[7px] text-white/[0.18] font-black text-center pb-0.5">
              {d}
            </div>
          ))}

          {Array.from({ length: totalCells }, (_, i) => {
            const colIdx = i % 7;
            const isWeekend = colIdx === 5 || colIdx === 6;

            if (i < startOffset) {
              const prevDay = daysInPrevMonth - startOffset + i + 1;
              return (
                <div key={i} className="aspect-square flex items-center justify-center text-[7px] text-white/[0.12]">
                  {prevDay}
                </div>
              );
            }

            const dayNum = i - startOffset + 1;

            if (dayNum > daysInMonth) {
              const nextDay = dayNum - daysInMonth;
              return (
                <div key={i} className="aspect-square flex items-center justify-center text-[7px] text-white/[0.12]">
                  {nextDay}
                </div>
              );
            }

            const isToday = isCurrentMonth && dayNum === today;
            const isSelected = selectedDay === dayNum && !isToday;
            const hasEvent = FAKE_EVENTS.has(dayNum);

            return (
              <div
                key={i}
                onClick={() => handleDayClick(dayNum)}
                className={[
                  "aspect-square flex items-center justify-center text-[7px] font-semibold rounded-[6px] cursor-pointer relative transition-all duration-150 mx-0.5",
                  isToday
                    ? "bg-white text-black font-black rounded-[6px]"
                    : isSelected
                    ? "bg-red-500/[0.18] text-red-500 rounded-[6px]"
                    : isWeekend
                    ? "text-red-400/30 hover:bg-white/[0.07] hover:text-white/90"
                    : "text-white/45 hover:bg-white/[0.07] hover:text-white/90",
                ].join(" ")}
                style={
                  isToday
                    ? { boxShadow: "0 2px 8px rgba(255,255,255,0.2)" }
                    : undefined
                }
              >
                {dayNum}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-[1.5px] left-1/2 -translate-x-1/2 w-[2px] h-[2px] rounded-full bg-red-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mt-1 pt-1.5 flex justify-between items-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div>
            <div className="text-[8px] text-white/40 font-bold tracking-tighter">{todayStr}</div>
          </div>
          <div
            className="text-[8px] font-black tracking-[0.2em] text-red-500 uppercase px-1.5 py-0.5 rounded-[6px]"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            {dowStr}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
