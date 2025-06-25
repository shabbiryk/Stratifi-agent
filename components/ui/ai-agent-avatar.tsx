"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface AIAgentAvatarProps {
  isActive?: boolean;
  isTalking?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  mouseFollow?: boolean;
}

export function AIAgentAvatar({
  isActive = false,
  isTalking = false,
  size = "md",
  className = "",
  mouseFollow = true,
}: AIAgentAvatarProps) {
  const eyeControls = useAnimationControls();
  const mouthControls = useAnimationControls();
  const glowControls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Eye following mouse movement
  useEffect(() => {
    if (!mouseFollow) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const distance = Math.min(
        Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        ) / 200,
        1
      );

      const eyeX = Math.cos(angle) * distance * 3;
      const eyeY = Math.sin(angle) * distance * 3;

      setMousePosition({ x: eyeX, y: eyeY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseFollow]);

  // Talking animation
  useEffect(() => {
    if (isTalking) {
      mouthControls.start({
        scaleY: [1, 1.2, 0.8, 1.1, 0.9, 1],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      mouthControls.start({ scaleY: 1 });
    }
  }, [isTalking, mouthControls]);

  // Active state glow
  useEffect(() => {
    if (isActive) {
      glowControls.start({
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      glowControls.start({ scale: 1, opacity: 0 });
    }
  }, [isActive, glowControls]);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      eyeControls.start({
        scaleY: [1, 0.1, 1],
        transition: { duration: 0.15 },
      });
    };

    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [eyeControls]);

  return (
    <div
      ref={containerRef}
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        animate={glowControls}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
        style={{ filter: "blur(10px)" }}
      />

      {/* Main avatar container */}
      <motion.div
        className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30" />
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M10 0v20M0 10h20"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Face elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Eyes */}
            <div className="flex space-x-3 mb-2">
              <motion.div
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                  scaleY: 1,
                }}
                className="w-2 h-2 bg-blue-400 rounded-full relative"
              >
                <motion.div
                  animate={eyeControls}
                  className="absolute inset-0 bg-blue-400 rounded-full"
                />
              </motion.div>
              <motion.div
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                  scaleY: 1,
                }}
                className="w-2 h-2 bg-blue-400 rounded-full relative"
              >
                <motion.div
                  animate={eyeControls}
                  className="absolute inset-0 bg-blue-400 rounded-full"
                />
              </motion.div>
            </div>

            {/* Mouth */}
            <motion.div
              animate={mouthControls}
              className="w-4 h-1 bg-blue-400 rounded-full mx-auto"
              style={{ originY: 0.5 }}
            />

            {/* Processing indicator */}
            {isActive && (
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-blue-400 rounded-full"
                      animate={{
                        y: [0, -4, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {isActive && (
            <g>
              <motion.path
                d="M20,20 Q50,40 80,20"
                stroke="url(#neuralGrad)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
              <motion.path
                d="M20,80 Q50,60 80,80"
                stroke="url(#neuralGrad)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
          isActive ? "bg-green-400" : "bg-slate-500"
        }`}
        animate={
          isActive
            ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          repeatType: "loop",
        }}
      />
    </div>
  );
}

// Preset configurations for different AI states
export function AgentThinking() {
  return <AIAgentAvatar isActive={true} isTalking={false} />;
}

export function AgentSpeaking() {
  return <AIAgentAvatar isActive={true} isTalking={true} />;
}

export function AgentIdle() {
  return <AIAgentAvatar isActive={false} isTalking={false} />;
}
