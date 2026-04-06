'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PongGame.module.css';

const CANVAS_W = 600;
const CANVAS_H = 300;
const PADDLE_W = 8;
const PADDLE_H = 60;
const BALL_SIZE = 8;
const PADDLE_SPEED = 5;
const BALL_SPEED_INIT = 3;
const AI_SPEED = 3.2;
const WIN_SCORE = 5;

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const gameRef = useRef({
    playerY: CANVAS_H / 2 - PADDLE_H / 2,
    aiY: CANVAS_H / 2 - PADDLE_H / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H / 2,
    ballDX: BALL_SPEED_INIT,
    ballDY: BALL_SPEED_INIT * 0.6,
    keysDown: new Set<string>(),
    playerScore: 0,
    aiScore: 0,
  });

  const resetBall = useCallback(() => {
    const g = gameRef.current;
    g.ballX = CANVAS_W / 2;
    g.ballY = CANVAS_H / 2;
    g.ballDX = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED_INIT;
    g.ballDY = (Math.random() - 0.5) * BALL_SPEED_INIT;
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.playerScore = 0;
    g.aiScore = 0;
    g.playerY = CANVAS_H / 2 - PADDLE_H / 2;
    g.aiY = CANVAS_H / 2 - PADDLE_H / 2;
    setScore({ player: 0, ai: 0 });
    setWinner(null);
    resetBall();
    setPlaying(true);
  }, [resetBall]);

  useEffect(() => {
    if (!playing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = gameRef.current;
    let animId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      g.keysDown.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      g.keysDown.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      // Player movement
      if (g.keysDown.has('ArrowUp') || g.keysDown.has('w')) {
        g.playerY = Math.max(0, g.playerY - PADDLE_SPEED);
      }
      if (g.keysDown.has('ArrowDown') || g.keysDown.has('s')) {
        g.playerY = Math.min(CANVAS_H - PADDLE_H, g.playerY + PADDLE_SPEED);
      }

      // AI movement — tracks ball with slight lag
      const aiCenter = g.aiY + PADDLE_H / 2;
      if (aiCenter < g.ballY - 10) {
        g.aiY = Math.min(CANVAS_H - PADDLE_H, g.aiY + AI_SPEED);
      } else if (aiCenter > g.ballY + 10) {
        g.aiY = Math.max(0, g.aiY - AI_SPEED);
      }

      // Ball movement
      g.ballX += g.ballDX;
      g.ballY += g.ballDY;

      // Top/bottom bounce
      if (g.ballY <= 0 || g.ballY >= CANVAS_H - BALL_SIZE) {
        g.ballDY *= -1;
        g.ballY = Math.max(0, Math.min(CANVAS_H - BALL_SIZE, g.ballY));
      }

      // Player paddle collision (left)
      if (
        g.ballX <= PADDLE_W + 16 &&
        g.ballY + BALL_SIZE >= g.playerY &&
        g.ballY <= g.playerY + PADDLE_H &&
        g.ballDX < 0
      ) {
        g.ballDX = Math.abs(g.ballDX) * 1.05;
        const hitPos = (g.ballY - g.playerY) / PADDLE_H;
        g.ballDY = (hitPos - 0.5) * BALL_SPEED_INIT * 2;
      }

      // AI paddle collision (right)
      if (
        g.ballX + BALL_SIZE >= CANVAS_W - PADDLE_W - 16 &&
        g.ballY + BALL_SIZE >= g.aiY &&
        g.ballY <= g.aiY + PADDLE_H &&
        g.ballDX > 0
      ) {
        g.ballDX = -Math.abs(g.ballDX) * 1.05;
        const hitPos = (g.ballY - g.aiY) / PADDLE_H;
        g.ballDY = (hitPos - 0.5) * BALL_SPEED_INIT * 2;
      }

      // Scoring
      if (g.ballX < 0) {
        g.aiScore++;
        setScore({ player: g.playerScore, ai: g.aiScore });
        if (g.aiScore >= WIN_SCORE) {
          setWinner('CPU');
          setPlaying(false);
          return;
        }
        resetBall();
      }
      if (g.ballX > CANVAS_W) {
        g.playerScore++;
        setScore({ player: g.playerScore, ai: g.aiScore });
        if (g.playerScore >= WIN_SCORE) {
          setWinner('YOU');
          setPlaying(false);
          return;
        }
        resetBall();
      }

      // Draw
      ctx.fillStyle = '#f5f0e8';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Dashed center line
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#111';
      ctx.fillRect(12, g.playerY, PADDLE_W, PADDLE_H);
      ctx.fillRect(CANVAS_W - 12 - PADDLE_W, g.aiY, PADDLE_W, PADDLE_H);

      // Ball
      ctx.fillRect(g.ballX, g.ballY, BALL_SIZE, BALL_SIZE);

      // Score
      ctx.font = '20px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(17, 17, 17, 0.25)';
      ctx.textAlign = 'center';
      ctx.fillText(String(g.playerScore), CANVAS_W / 2 - 40, 32);
      ctx.fillText(String(g.aiScore), CANVAS_W / 2 + 40, 32);

      // Border
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, CANVAS_W - 1, CANVAS_H - 1);

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playing, resetBall]);

  // Draw idle state
  useEffect(() => {
    if (playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f5f0e8';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Border
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, CANVAS_W - 1, CANVAS_H - 1);

    // Dashed center line
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = 'rgba(17, 17, 17, 0.15)';
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2, 0);
    ctx.lineTo(CANVAS_W / 2, CANVAS_H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Idle paddles
    ctx.fillStyle = '#111';
    ctx.fillRect(12, CANVAS_H / 2 - PADDLE_H / 2, PADDLE_W, PADDLE_H);
    ctx.fillRect(CANVAS_W - 12 - PADDLE_W, CANVAS_H / 2 - PADDLE_H / 2, PADDLE_W, PADDLE_H);

    // Ball in center
    ctx.fillRect(CANVAS_W / 2 - BALL_SIZE / 2, CANVAS_H / 2 - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);
  }, [playing, winner]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.game}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
        />

        {/* Overlay for play/winner */}
        <AnimatePresence>
          {!playing && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {winner ? (
                <div className={styles.winnerBlock}>
                  <div className={styles.winnerText}>{winner} WIN{winner === 'YOU' ? '' : 'S'}</div>
                  <button className={styles.playBtn} onClick={startGame}>
                    play again
                  </button>
                </div>
              ) : (
                <button className={styles.playBtn} onClick={startGame}>
                  ▶ PLAY ME
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {playing && (
        <motion.div
          className={styles.controls}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ↑↓ or W/S to move · first to {WIN_SCORE} wins
        </motion.div>
      )}
    </div>
  );
}
