"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-stratifi-400 border-none"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-90"
        style={{
          backgroundImage: "url('/backgroundimage.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          WebkitBackfaceVisibility: "hidden",
          MozBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 w-full">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-8 lg:space-y-10">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-2 relative"
            >
              {/* Static gradient background */}
              <div
                className="absolute -inset-10 opacity-30 z-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 70%, #7256FE 0%, transparent 70%)",
                  pointerEvents: "none",
                  transform: "translateY(20%)",
                }}
              />

              <h1 className="relative z-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-light text-white leading-[1.1] tracking-tight">
                <span className="block">Intelligent</span>
                <span className="block">Autonomous</span>
                <span className="block bg-gradient-to-r from-stratifi-50 via-stratifi-100 to-stratifi-200 bg-clip-text text-transparent">
                  DeFAI
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl font-body font-normal text-stratifi-50/90 leading-relaxed max-w-2xl"
            >
              Stop leaving money on the table. Our AI analyzes thousands of DeFi
              protocols in real-time to find the highest yields for your assets.
            </motion.p>

            {/* CTA Buttons */}
                <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Button
                    size="lg"
                className="bg-stratifi-200 hover:bg-stratifi-100 text-white px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
              >
                <span>Launch App</span>
                <ArrowRight className="ml-2 h-5 w-5 text-white" />
                  </Button>

                <Button
                  variant="outline"
                  size="lg"
                className="border-2 border-stratifi-300 text-white hover:bg-stratifi-300/20 px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm"
                >
                  <a
                    href="https://app.youform.com/forms/bbbn2d9r"
                    target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white"
                  >
                  <span>Early Access</span>
                  <ExternalLink className="ml-2 h-5 w-5 text-white" />
                  </a>
                </Button>
            </motion.div>
          </div>

          {/* Right Column - Reserved for background image */}
          <div className="hidden lg:block">
            {/* This space is intentionally left for the background image */}
          </div>
        </div>
      </div>
    </section>
  );
}
