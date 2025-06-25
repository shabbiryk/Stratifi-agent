"use client";

import { useEffect, useState, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  useEasing?: boolean;
}

export function useCountUp({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  useEasing = true,
}: UseCountUpOptions) {
  const [current, setCurrent] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const formatNumber = (num: number) => {
    const fixedNum =
      decimals > 0 ? num.toFixed(decimals) : Math.floor(num).toString();
    const parts = fixedNum.split(".");

    // Add thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return prefix + parts.join(".") + suffix;
  };

  const easeOutQuart = (t: number) => {
    return 1 - Math.pow(1 - t, 4);
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / (duration * 1000), 1);

    const easedProgress = useEasing ? easeOutQuart(progress) : progress;
    const currentValue = start + (end - start) * easedProgress;

    setCurrent(currentValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
    }
  };

  const startAnimation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration]);

  return formatNumber(current);
}
