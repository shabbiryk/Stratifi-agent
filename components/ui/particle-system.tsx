"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  mouseInteraction?: boolean;
  colors?: string[];
  className?: string;
}

export function ParticleSystem({
  particleCount = 50,
  mouseInteraction = true,
  colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
  className = "",
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    const initParticles = () => {
      particlesRef.current = Array.from(
        { length: particleCount },
        createParticle
      );
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction
        if (mouseInteraction) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.3;
            particle.vy += (dy / distance) * force * 0.3;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Life cycle
        particle.life++;
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle();
        }

        // Opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = (1 - lifeRatio) * 0.8 + 0.2;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = particle.color;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Draw connections with reduced opacity
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = ((120 - distance) / 120) * 0.15;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    // Initialize
    resize();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener("resize", resize);
    if (mouseInteraction) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [particleCount, mouseInteraction, colors, isClient]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
}
