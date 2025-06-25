"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      // Add particles on mouse move
      for (let i = 0; i < 3; i++) {
        addParticle(mousePosition.current.x, mousePosition.current.y);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Add a particle
    const addParticle = (x: number, y: number) => {
      const size = Math.random() * 5 + 1;
      const speedX = (Math.random() - 0.5) * 2;
      const speedY = (Math.random() - 0.5) * 2;
      const life = 0;
      const maxLife = Math.random() * 30 + 10;
      particles.current.push({ x, y, size, speedX, speedY, life, maxLife });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.life++;
        if (p.life >= p.maxLife) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        p.x += p.speedX;
        p.y += p.speedY;
        p.size -= 0.05;

        if (p.size <= 0) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        // Calculate opacity based on life
        const opacity = 1 - p.life / p.maxLife;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
