"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface CuteRobotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CuteRobot({ size = "md", className = "" }: CuteRobotProps) {
  const bodyControls = useAnimationControls();

  const sizeClasses = {
    sm: "w-28 h-36",
    md: "w-40 h-56",
    lg: "w-64 h-96",
  };

  // Floating animation
  useEffect(() => {
    bodyControls.start({
      y: [0, -10, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    });
  }, [bodyControls]);

  // Adjusted SVG: all elements are centered, antennas start at y=20, no negative y values
  return (
    <motion.div
      animate={bodyControls}
      className={`relative mx-auto ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 320 440"
        width="100%"
        height="100%"
        style={{ display: "block" }}
        fill="none"
      >
        {/* Left Antenna */}
        <g>
          <line
            x1="120"
            y1="20"
            x2="90"
            y2="-20"
            stroke="#6ec1ff"
            strokeWidth="6"
          />
          <circle
            cx="90"
            cy="-20"
            r="12"
            fill="#e3f0ff"
            stroke="#6ec1ff"
            strokeWidth="4"
            filter="url(#glow)"
          />
        </g>
        {/* Right Antenna */}
        <g>
          <line
            x1="200"
            y1="20"
            x2="230"
            y2="-20"
            stroke="#6ec1ff"
            strokeWidth="6"
          />
          <circle
            cx="230"
            cy="-20"
            r="12"
            fill="#e3f0ff"
            stroke="#6ec1ff"
            strokeWidth="4"
            filter="url(#glow)"
          />
        </g>
        {/* Headphones/Ears */}
        <ellipse
          cx="40"
          cy="120"
          rx="32"
          ry="48"
          fill="#e3e7f7"
          stroke="#bfc7e6"
          strokeWidth="8"
        />
        <ellipse
          cx="280"
          cy="120"
          rx="32"
          ry="48"
          fill="#e3e7f7"
          stroke="#bfc7e6"
          strokeWidth="8"
        />
        <ellipse
          cx="40"
          cy="120"
          rx="20"
          ry="32"
          fill="#ff6b81"
          opacity="0.5"
        />
        <ellipse
          cx="280"
          cy="120"
          rx="20"
          ry="32"
          fill="#ff6b81"
          opacity="0.5"
        />
        {/* Head */}
        <ellipse
          cx="160"
          cy="120"
          rx="110"
          ry="100"
          fill="#f8fafc"
          stroke="#bfc7e6"
          strokeWidth="8"
        />
        {/* Glowing blue border */}
        <ellipse
          cx="160"
          cy="120"
          rx="100"
          ry="90"
          fill="#e3f0ff"
          stroke="#6ec1ff"
          strokeWidth="8"
          filter="url(#glow)"
        />
        {/* Face area */}
        <ellipse cx="160" cy="120" rx="80" ry="70" fill="#e3f0ff" />
        {/* Blue neon border */}
        <ellipse
          cx="160"
          cy="120"
          rx="78"
          ry="68"
          fill="none"
          stroke="#6ec1ff"
          strokeWidth="6"
          filter="url(#glow)"
        />
        {/* Eyes */}
        <ellipse cx="120" cy="120" rx="22" ry="24" fill="#222" />
        <ellipse cx="200" cy="120" rx="22" ry="24" fill="#222" />
        {/* Eye glow */}
        <ellipse
          cx="120"
          cy="120"
          rx="22"
          ry="24"
          fill="#6ec1ff"
          opacity="0.25"
        />
        <ellipse
          cx="200"
          cy="120"
          rx="22"
          ry="24"
          fill="#6ec1ff"
          opacity="0.25"
        />
        {/* Eye highlights */}
        <ellipse cx="112" cy="112" rx="6" ry="8" fill="#fff" opacity="0.8" />
        <ellipse cx="192" cy="112" rx="6" ry="8" fill="#fff" opacity="0.8" />
        {/* Eyebrows */}
        <path
          d="M105 98 Q120 90 135 98"
          stroke="#222"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M185 98 Q200 90 215 98"
          stroke="#222"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Cheeks */}
        <ellipse cx="110" cy="145" rx="12" ry="8" fill="#ffb6c1" />
        <ellipse cx="210" cy="145" rx="12" ry="8" fill="#ffb6c1" />
        {/* Mouth */}
        <ellipse cx="160" cy="155" rx="18" ry="12" fill="#ff6b81" />
        <ellipse cx="160" cy="158" rx="10" ry="5" fill="#fff" opacity="0.7" />
        {/* Body */}
        <ellipse
          cx="160"
          cy="290"
          rx="80"
          ry="70"
          fill="#f8fafc"
          stroke="#bfc7e6"
          strokeWidth="8"
        />
        {/* Glowing belly ring */}
        <ellipse
          cx="160"
          cy="290"
          rx="48"
          ry="32"
          fill="#e3f0ff"
          stroke="#6ec1ff"
          strokeWidth="6"
          filter="url(#glow)"
        />
        <ellipse
          cx="160"
          cy="290"
          rx="28"
          ry="16"
          fill="#fff"
          stroke="#ffb86b"
          strokeWidth="4"
          filter="url(#glow)"
        />
        {/* Arms */}
        <ellipse
          cx="70"
          cy="310"
          rx="22"
          ry="38"
          fill="#f8fafc"
          stroke="#bfc7e6"
          strokeWidth="8"
        />
        <ellipse
          cx="250"
          cy="310"
          rx="22"
          ry="38"
          fill="#f8fafc"
          stroke="#bfc7e6"
          strokeWidth="8"
        />
        <ellipse
          cx="70"
          cy="340"
          rx="12"
          ry="10"
          fill="#6ec1ff"
          opacity="0.5"
        />
        <ellipse
          cx="250"
          cy="340"
          rx="12"
          ry="10"
          fill="#6ec1ff"
          opacity="0.5"
        />
        {/* Feet */}
        <ellipse cx="120" cy="400" rx="24" ry="12" fill="#bfc7e6" />
        <ellipse cx="200" cy="400" rx="24" ry="12" fill="#bfc7e6" />
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}
