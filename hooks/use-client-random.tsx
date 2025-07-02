"use client";

import { useState, useEffect } from "react";

export function useClientRandom() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateRandom = (min: number = 0, max: number = 1): number => {
    if (!mounted) {
      // Return a consistent value during SSR
      return min + (max - min) * 0.5;
    }
    return Math.random() * (max - min) + min;
  };

  const generateRandomInt = (min: number, max: number): number => {
    return Math.floor(generateRandom(min, max + 1));
  };

  const generateRandomAPY = (isLending: boolean = true): string => {
    const baseRate = isLending ? 5 : 3;
    const variation = isLending ? 8 : 5;
    return generateRandom(baseRate, baseRate + variation).toFixed(2);
  };

  const generateRandomBalance = (
    min: number = 100,
    max: number = 1000
  ): string => {
    return generateRandom(min, max).toFixed(2);
  };

  const generateRandomUtilization = (): string => {
    return generateRandom(50, 90).toFixed(1);
  };

  return {
    mounted,
    generateRandom,
    generateRandomInt,
    generateRandomAPY,
    generateRandomBalance,
    generateRandomUtilization,
  };
}
