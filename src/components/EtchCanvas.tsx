'use client';

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

interface Pen {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  stepsTaken: number;
  stepsBeforeTurn: number;
}

const NUM_PENS = 4;
const LINE_OPACITY = 0.06;
const FADE_RATE = 0.0004;
const MIN_STEPS = 40;
const MAX_STEPS = 200;

function randomDirection(): [number, number] {
  const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function createPen(w: number, h: number): Pen {
  const [dx, dy] = randomDirection();
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    dx,
    dy,
    speed: 0.8 + Math.random() * 1.2,
    stepsTaken: 0,
    stepsBeforeTurn: MIN_STEPS + Math.floor(Math.random() * (MAX_STEPS - MIN_STEPS)),
  };
}

export interface EtchCanvasHandle {
  shake: () => void;
}

const EtchCanvas = forwardRef<EtchCanvasHandle>(function EtchCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pensRef = useRef<Pen[]>([]);
  const dimsRef = useRef({ w: 0, h: 0 });

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = dimsRef.current;

    // Clear to paper color
    ctx.fillStyle = '#f5f0e8';
    ctx.fillRect(0, 0, w, h);

    // Reset pens to new random positions
    pensRef.current = [];
    for (let i = 0; i < NUM_PENS; i++) {
      pensRef.current.push(createPen(w, h));
    }
  }, []);

  useImperativeHandle(ref, () => ({
    shake: () => {
      clearCanvas();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dimsRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    pensRef.current = [];
    for (let i = 0; i < NUM_PENS; i++) {
      pensRef.current.push(createPen(w, h));
    }

    let animId: number;

    const draw = () => {
      // Slow fade by overlaying semi-transparent paper color
      ctx.fillStyle = `rgba(245, 240, 232, ${FADE_RATE})`;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = `rgba(17, 17, 17, ${LINE_OPACITY})`;
      ctx.lineWidth = 1;
      ctx.lineCap = 'square';

      for (const pen of pensRef.current) {
        const prevX = pen.x;
        const prevY = pen.y;

        pen.x += pen.dx * pen.speed;
        pen.y += pen.dy * pen.speed;
        pen.stepsTaken++;

        // Draw line segment
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(pen.x, pen.y);
        ctx.stroke();

        // Turn at random intervals
        if (pen.stepsTaken >= pen.stepsBeforeTurn) {
          if (pen.dx !== 0) {
            pen.dy = Math.random() > 0.5 ? 1 : -1;
            pen.dx = 0;
          } else {
            pen.dx = Math.random() > 0.5 ? 1 : -1;
            pen.dy = 0;
          }
          pen.stepsTaken = 0;
          pen.stepsBeforeTurn = MIN_STEPS + Math.floor(Math.random() * (MAX_STEPS - MIN_STEPS));
        }

        // Wrap around edges
        if (pen.x < -20) pen.x = w + 20;
        if (pen.x > w + 20) pen.x = -20;
        if (pen.y < -20) pen.y = h + 20;
        if (pen.y > h + 20) pen.y = -20;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
});

export default EtchCanvas;
