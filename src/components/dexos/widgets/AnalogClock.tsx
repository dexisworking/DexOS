"use client";

import React, { useEffect, useRef } from "react";

const AnalogClock = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const SIZE = 480;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const R = SIZE / 2 - 10;

    const isDark = () =>
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    let smoothSec = 0,
      smoothMin = 0,
      smoothHour = 0;
    let prevSec: number | null = null;
    let lastTs: number | null = null;

    function drawHand(
      ctx: CanvasRenderingContext2D,
      angleDeg: number,
      length: number,
      widthBase: number,
      widthTip: number,
      color: string,
      hasTail: boolean,
      tailLength: number,
      shadowColor: string
    ) {
      const angle = (angleDeg - 90) * (Math.PI / 180);
      const perpAngle = angle + Math.PI / 2;

      const tipX = CX + Math.cos(angle) * length;
      const tipY = CY + Math.sin(angle) * length;
      const tailX = hasTail ? CX - Math.cos(angle) * tailLength : CX;
      const tailY = hasTail ? CY - Math.sin(angle) * tailLength : CY;

      const bx = Math.cos(perpAngle);
      const by = Math.sin(perpAngle);

      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.beginPath();
      ctx.moveTo(tailX + bx * (widthBase / 2), tailY + by * (widthBase / 2));
      ctx.lineTo(tailX - bx * (widthBase / 2), tailY - by * (widthBase / 2));
      ctx.lineTo(tipX - bx * (widthTip / 2), tipY - by * (widthTip / 2));
      ctx.lineTo(tipX + bx * (widthTip / 2), tipY + by * (widthTip / 2));
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function draw(ts: number) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.1);
      lastTs = ts;

      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      const targetSec = s * 6;
      const targetMin = m * 6;
      const targetHour = h * 30;

      if (prevSec === null) {
        smoothSec = targetSec;
        smoothMin = targetMin;
        smoothHour = targetHour;
      } else {
        smoothSec = lerp(smoothSec, targetSec, Math.min(1, dt * 12));
        smoothMin = lerp(smoothMin, targetMin, Math.min(1, dt * 8));
        smoothHour = lerp(smoothHour, targetHour, Math.min(1, dt * 8));
      }
      prevSec = s;

      ctx.clearRect(0, 0, SIZE, SIZE);

      const dark = isDark();
      const bezelOuter = dark ? "#3A3A3C" : "#D1CFC8";
      const bezelInner = dark ? "#2C2C2E" : "#E8E6DF";
      const numColor = dark ? "#EBEBF5" : "#1C1C1E";
      const tickMajor = dark ? "rgba(235,235,245,0.7)" : "rgba(28,28,30,0.7)";
      const tickMinor = dark ? "rgba(235,235,245,0.2)" : "rgba(28,28,30,0.2)";
      const handColor = dark ? "#EBEBF5" : "#1C1C1E";
      const shadowColor = dark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.15)";

      // Outer bezel shadow
      ctx.save();
      ctx.shadowColor = dark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = bezelOuter;
      ctx.fill();
      ctx.restore();

      // Bezel gradient ring
      const bezelGrad = ctx.createLinearGradient(
        CX - R, CY - R, CX + R, CY + R
      );
      bezelGrad.addColorStop(0, dark ? "#505054" : "#E0DED7");
      bezelGrad.addColorStop(0.5, dark ? "#3A3A3C" : "#C8C6BF");
      bezelGrad.addColorStop(1, dark ? "#2A2A2C" : "#B8B6AF");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = bezelGrad;
      ctx.fill();

      // Inner bezel
      const bezelW = 18;
      ctx.beginPath();
      ctx.arc(CX, CY, R - bezelW, 0, Math.PI * 2);
      ctx.fillStyle = bezelInner;
      ctx.fill();

      // Clock face
      const faceGrad = ctx.createRadialGradient(
        CX - 20, CY - 30, 10, CX, CY, R - bezelW
      );
      if (dark) {
        faceGrad.addColorStop(0, "#2C2C2E");
        faceGrad.addColorStop(1, "#1C1C1E");
      } else {
        faceGrad.addColorStop(0, "#FEFDFB");
        faceGrad.addColorStop(1, "#F0EDE4");
      }
      ctx.beginPath();
      ctx.arc(CX, CY, R - bezelW - 2, 0, Math.PI * 2);
      ctx.fillStyle = faceGrad;
      ctx.fill();

      // Inner shadow on face edge
      const edgeShadow = ctx.createRadialGradient(
        CX, CY, R - bezelW - 22, CX, CY, R - bezelW - 2
      );
      edgeShadow.addColorStop(0, "rgba(0,0,0,0)");
      edgeShadow.addColorStop(1, dark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)");
      ctx.beginPath();
      ctx.arc(CX, CY, R - bezelW - 2, 0, Math.PI * 2);
      ctx.fillStyle = edgeShadow;
      ctx.fill();

      // Tick marks
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const isMajor = i % 5 === 0;
        const isHour = i % 15 === 0;
        const outer = R - bezelW - 6;
        const inner = isMajor
          ? isHour
            ? outer - 22
            : outer - 14
          : outer - 8;

        ctx.save();
        ctx.strokeStyle = isMajor ? tickMajor : tickMinor;
        ctx.lineWidth = isHour ? 3.5 : isMajor ? 2.5 : 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(angle) * inner, CY + Math.sin(angle) * inner);
        ctx.lineTo(CX + Math.cos(angle) * outer, CY + Math.sin(angle) * outer);
        ctx.stroke();
        ctx.restore();
      }

      // Hour numerals — 12, 3, 6, 9
      const numDist = R - bezelW - 44;
      const numerals = ["12", "3", "6", "9"];
      const numAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
      ctx.fillStyle = numColor;
      ctx.font = `600 ${dark ? 32 : 30}px -apple-system, "Helvetica Neue", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      numerals.forEach((num, idx) => {
        const nx = CX + Math.cos(numAngles[idx]) * numDist;
        const ny = CY + Math.sin(numAngles[idx]) * numDist;
        ctx.fillText(num, nx, ny);
      });

      // Hour hand
      drawHand(ctx, smoothHour, R * 0.48, 10, 4, handColor, true, 20, shadowColor);
      // Minute hand
      drawHand(ctx, smoothMin, R * 0.68, 7, 3, handColor, true, 22, shadowColor);

      // Second hand
      const secAngle = (smoothSec - 90) * (Math.PI / 180);
      const secLen = R - bezelW - 10;
      const secTail = 38;

      ctx.save();
      ctx.shadowColor = "rgba(255,80,0,0.4)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.strokeStyle = "#FF3B30";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(
        CX - Math.cos(secAngle) * secTail,
        CY - Math.sin(secAngle) * secTail
      );
      ctx.lineTo(
        CX + Math.cos(secAngle) * secLen,
        CY + Math.sin(secAngle) * secLen
      );
      ctx.stroke();

      // Counterbalance circle
      const ballDist = 22;
      const ballX = CX - Math.cos(secAngle) * ballDist;
      const ballY = CY - Math.sin(secAngle) * ballDist;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#FF3B30";
      ctx.fill();
      ctx.restore();

      // Center cap
      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.arc(CX, CY, 9, 0, Math.PI * 2);
      ctx.fillStyle = handColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(CX, CY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#FF3B30";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(CX - 1.5, CY - 1.5, 2, 0, Math.PI * 2);
      ctx.fillStyle = dark
        ? "rgba(255,255,255,0.5)"
        : "rgba(255,255,255,0.7)";
      ctx.fill();
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="w-full aspect-square relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="w-full h-full max-w-[240px] max-h-[240px]"
        />
    </div>
  );
};

export default AnalogClock;
