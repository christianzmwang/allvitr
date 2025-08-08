"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

export type ConnectingDotsProps = {
  height?: number; // px
  density?: number; // lower = fewer points
  neighbors?: number; // N nearest neighbors
  color?: string; // base RGB string e.g. "255,255,255"
  backgroundColor?: string; // solid fill, optional
  className?: string; // allow extra classes
};

/**
 * Point in the field with original and animated position.
 */
export type Point = {
  originX: number;
  originY: number;
  x: number;
  y: number;
  radius: number;
  neighbors: number[]; // indices of nearest neighbors
  tween?: gsap.core.Tween;
};

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0)
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const DEFAULTS = {
  height: 500,
  density: 45,
  neighbors: 3,
  color: "255,255,255",
} as const;

export default function ConnectingDots(props: ConnectingDotsProps) {
  const {
    height = DEFAULTS.height,
    density = DEFAULTS.density,
    neighbors = DEFAULTS.neighbors,
    color = DEFAULTS.color,
    backgroundColor,
    className,
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const reducedMotion = useMemo(prefersReducedMotion, []);
  const isTouch = useMemo(isTouchDevice, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    let width = wrapper.clientWidth;
    let heightPx = wrapper.clientHeight || height || DEFAULTS.height;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const setCanvasSize = () => {
      width = wrapper.clientWidth;
      heightPx = wrapper.clientHeight || height || DEFAULTS.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(heightPx * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      // re-render background immediately after resize
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, heightPx);
      } else {
        ctx.clearRect(0, 0, width, heightPx);
      }
    };

    setCanvasSize();

    // Build points on a jittered grid
    const buildPoints = () => {
      const spacing = clamp(density, 6, 120);
      const jitter = spacing * 0.5;
      const cols = Math.max(2, Math.floor(width / spacing));
      const rows = Math.max(2, Math.floor(heightPx / spacing));
      const points: Point[] = [];

      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = x * spacing + (Math.random() * jitter - jitter / 2);
          const py = y * spacing + (Math.random() * jitter - jitter / 2);
          const radius = Math.random() * 2 + 0.5; // small dots
          points.push({
            originX: px,
            originY: py,
            x: px,
            y: py,
            radius,
            neighbors: [],
          });
        }
      }

      // find neighbors by naive O(n^2) distance; fine for modest N
      const numNeighbors = Math.max(1, neighbors | 0);
      for (let i = 0; i < points.length; i++) {
        const distances: { idx: number; d2: number }[] = [];
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue;
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          distances.push({ idx: j, d2: dx * dx + dy * dy });
        }
        distances.sort((a, b) => a.d2 - b.d2);
        points[i].neighbors = distances.slice(0, numNeighbors).map((d) => d.idx);
      }

      pointsRef.current = points;
    };

    buildPoints();

    // Animation for each point: gentle around origin
    const startTweens = () => {
      const points = pointsRef.current;
      const maxShift = Math.max(6, density * 0.75); // shift radius
      const minDuration = 1.5;
      const maxDuration = 3.5;

      points.forEach((p) => {
        const tweenTo = () => {
          const nx = p.originX + (Math.random() - 0.5) * maxShift;
          const ny = p.originY + (Math.random() - 0.5) * maxShift;
          const duration = minDuration + Math.random() * (maxDuration - minDuration);
          p.tween = gsap.to(p, {
            x: nx,
            y: ny,
            duration,
            ease: "sine.inOut",
            onComplete: tweenTo,
          });
        };
        if (!reducedMotion) tweenTo();
      });
    };

    const stopTweens = () => {
      pointsRef.current.forEach((p) => p.tween?.kill());
    };

    startTweens();

    // Draw
    const draw = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, heightPx);
      } else {
        ctx.clearRect(0, 0, width, heightPx);
      }

      const points = pointsRef.current;
      const { x: mx, y: my, active } = mouseRef.current;

      // opacity fields
      const maxDist2 = (Math.min(width, heightPx) * 0.25) ** 2; // influence radius
      const midDist2 = maxDist2 * 1.5;

      // Combined draw loop
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dx = mx - p.x;
        const dy = my - p.y;
        const d2 = dx * dx + dy * dy;

        // Draw lines
        let lineAlpha = active ? (d2 < midDist2 ? (d2 < maxDist2 ? 0.8 : 0.4) : 0.1) : 0.15;
        lineAlpha = clamp(lineAlpha, 0, 0.8);

        if (lineAlpha > 0.01) {
          ctx.strokeStyle = `rgba(${color},${lineAlpha})`;
          p.neighbors.forEach((ni) => {
            const np = points[ni];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(np.x, np.y);
            ctx.stroke();
          });
        }

        // Draw circles
        let circleAlpha = active ? (d2 < maxDist2 ? 1.0 : d2 < midDist2 ? 0.7 : 0.3) : 0.4;
        circleAlpha = clamp(circleAlpha, 0, 1);
        const radius = p.radius * (active && d2 < midDist2 ? (d2 < maxDist2 ? 2.5 : 1.5) : 1);
        ctx.fillStyle = `rgba(${color},${circleAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Mouse listeners (skip touch)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (!isTouch) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    // ResizeObserver for responsiveness
    const ro = new ResizeObserver(() => {
      setCanvasSize();
      // rebuild points on size change for even coverage
      stopTweens();
      buildPoints();
      startTweens();
    });
    ro.observe(wrapper);
    resizeObserverRef.current = ro;

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopTweens();
      if (!isTouch) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      resizeObserverRef.current?.disconnect();
      ctxRef.current = null;
    };
  }, [height, density, neighbors, color, backgroundColor, reducedMotion, isTouch]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full ${className ?? ""}`.trim()}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden
      />
    </div>
  );
}