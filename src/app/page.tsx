"use client";

import React from "react";
import { DexOSProvider } from "@/context/DexOSContext";
import DexOSClient from "@/components/dexos/DexOSClient";

export default function DexOSPage() {
  return (
    <DexOSProvider>
      <DexOSClient />
    </DexOSProvider>
  );
}
