"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  enableFlip?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  enableFlip = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const animationRef = useRef<number | undefined>(undefined);
  const currentValueRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  // Single effect to handle all animations
  useEffect(() => {
    if (!isInView) return;

    // More robust check to prevent infinite loops
    const valuesDifferent = Math.abs(currentValueRef.current - value) > 0.001;
    if (isAnimatingRef.current || !valuesDifferent) return;

    // Start animation
    isAnimatingRef.current = true;
    const startValue = currentValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const newValue = startValue + (endValue - startValue) * easedProgress;
      currentValueRef.current = newValue;

      const formattedValue = newValue.toFixed(decimals);
      setDisplayValue(formattedValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation completed
        isAnimatingRef.current = false;
        currentValueRef.current = endValue;
        setDisplayValue(endValue.toFixed(decimals));
      }
    };

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, [value, isInView, duration, decimals]);

  if (!enableFlip) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {displayValue}
        {suffix}
      </span>
    );
  }

  // Split display value into individual digits for flip animation
  const digits = displayValue.split("");

  return (
    <div ref={ref} className={`inline-flex items-center ${className}`}>
      {prefix && <span>{prefix}</span>}
      <div className="flex">
        {digits.map((digit, index) => (
          <DigitFlip key={`${index}-${digit}`} digit={digit} />
        ))}
      </div>
      {suffix && <span>{suffix}</span>}
    </div>
  );
}

interface DigitFlipProps {
  digit: string;
}

function DigitFlip({ digit }: DigitFlipProps) {
  return (
    <div className="relative inline-block overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={digit}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="inline-block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Component for racing bar animation (APY comparison)
interface RacingBarsProps {
  data: { label: string; value: number; color: string }[];
  maxValue?: number;
  className?: string;
}

export function RacingBars({
  data,
  maxValue,
  className = "",
}: RacingBarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [animatedData, setAnimatedData] = useState(
    data.map((item) => ({ ...item, animatedValue: 0 }))
  );

  const max = maxValue || Math.max(...data.map((item) => item.value));

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      setAnimatedData(
        data.map((item) => ({
          ...item,
          animatedValue: item.value * easedProgress,
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [data, isInView]);

  return (
    <div ref={ref} className={`space-y-4 ${className}`}>
      {animatedData.map((item, index) => (
        <div key={item.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm font-bold">
              {item.animatedValue.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.animatedValue / max) * 100}%` }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: index * 0.1,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
