"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  shape: "circle" | "square" | "triangle";
  color: string;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

export function ParticleBackground({
  particleCount = 50,
  className = "",
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Particle colors - subtle blues and whites
  const colors = useMemo(
    () => [
      "rgba(59, 130, 246, 0.3)", // blue-500
      "rgba(96, 165, 250, 0.2)", // blue-400
      "rgba(147, 197, 253, 0.15)", // blue-300
      "rgba(255, 255, 255, 0.1)", // white
      "rgba(255, 255, 255, 0.05)", // very subtle white
    ],
    []
  );

  // Initialize particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 4 + 1, // 1-5px
      opacity: Math.random() * 0.5 + 0.1, // 0.1-0.6
      speedX: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25
      speedY: (Math.random() - 0.5) * 0.5,
      shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as
        | "circle"
        | "square"
        | "triangle",
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Mouse move handler for subtle interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [colors, particleCount]);

  // Animation loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const rect = container.getBoundingClientRect();

      particlesRef.current.forEach((particle) => {
        // Basic movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction - subtle attraction
        const mouseDistance = Math.sqrt(
          (particle.x - mouseRef.current.x) ** 2 + (particle.y - mouseRef.current.y) ** 2
        );

        if (mouseDistance < 100) {
          const force = ((100 - mouseDistance) / 100) * 0.02;
          const angle = Math.atan2(
            mouseRef.current.y - particle.y,
            mouseRef.current.x - particle.x
          );
          particle.x += Math.cos(angle) * force;
          particle.y += Math.sin(angle) * force;
        }

        // Boundary wrapping
        if (particle.x < -10) particle.x = rect.width + 10;
        if (particle.x > rect.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = rect.height + 10;
        if (particle.y > rect.height + 10) particle.y = -10;

        // Subtle opacity pulsing
        particle.opacity += (Math.random() - 0.5) * 0.01;
        particle.opacity = Math.max(0.05, Math.min(0.6, particle.opacity));
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      position: "absolute" as const,
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      opacity: particle.opacity,
      pointerEvents: "none" as const,
      filter: "blur(0.5px)",
    };

    switch (particle.shape) {
      case "circle":
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: "50%",
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        );
      case "square":
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: "1px",
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            }}
          />
        );
      case "triangle":
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`,
              filter: `blur(0.5px) drop-shadow(0 0 ${particle.size}px ${particle.color})`,
            }}
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      {particlesRef.current.map(renderParticle)}
    </div>
  );
}

// Animated particle variants for initial entrance - no delay
export function AnimatedParticles({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay }} // Uses the delay prop (now 0)
      className="absolute inset-0"
    >
      <ParticleBackground particleCount={60} />
    </motion.div>
  );
}
