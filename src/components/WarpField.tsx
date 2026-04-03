'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NUM_STREAKS = 120;
const BASE_SPEED = 200.0;
const TUNNEL_RADIUS_MIN = 35; 
const TUNNEL_RADIUS_MAX = 200;
const TUNNEL_LENGTH = 1500;

export default function WarpField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04081c); // Deep navy background
    scene.fog = new THREE.FogExp2(0x04081c, 0.0015); // Fog makes things fade gracefully

    const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // CREATE FADE GRADIENT TEXTURE FOR STREAKS
    const gCanvas = document.createElement('canvas');
    gCanvas.width = 128;
    gCanvas.height = 512;
    const gCtx = gCanvas.getContext('2d');
    if (gCtx) {
      const imgData = gCtx.createImageData(128, 512);
      const data = imgData.data;
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 128; x++) {
          const cx = Math.abs(x - 64) / 64.0; 
          const cy = y / 512.0; 
          
          // Width tapers beautifully from head to tail
          const taperX = Math.pow(1.0 - cy, 2.0); 
          const effectiveWidth = 0.05 + 0.95 * taperX; 
          
          let intensityX = 0;
          if (cx < effectiveWidth) {
            intensityX = Math.pow(1.0 - (cx / effectiveWidth), 2.5); // Very soft glow falloff
          }
          
          // Fade from bright head to 0 tail, with a tiny rounding at the very front
          let intensityY = 1.0;
          if (cy < 0.02) {
            intensityY = cy / 0.02; // Tip rounding
          } else {
            intensityY = Math.pow(1.0 - ((cy - 0.02) / 0.98), 1.8);
          }
          
          const alpha = intensityX * intensityY * 255;
          const idx = (y * 128 + x) * 4;
          data[idx] = 255;     // R
          data[idx+1] = 255;   // G
          data[idx+2] = 255;   // B
          data[idx+3] = alpha; // A
        }
      }
      gCtx.putImageData(imgData, 0, 0);
    }
    const gradientTex = new THREE.CanvasTexture(gCanvas);
    gradientTex.needsUpdate = true;
    gradientTex.minFilter = THREE.LinearFilter;
    gradientTex.magFilter = THREE.LinearFilter;

    // MATERIALS
    // To avoid the "polygon" tube look, we use a flat 2D plane that always faces the center.
    // PlaneGeometry default: faces +Z, spans X and Y.
    const geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(Math.PI / 2); // Now it lies on X-Z plane, facing +Y. Normal is +Y.
    // Width is along X, Length is along Z.

    const material = new THREE.MeshBasicMaterial({
      map: gradientTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false, 
      side: THREE.DoubleSide
    });

    // Single InstancedMesh handles both cores and glows purely through scaling and opacity
    const mesh = new THREE.InstancedMesh(geometry, material, NUM_STREAKS * 2);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    interface StreakData {
      angle: number;
      radius: number;
      z: number;
      length: number;
      speed: number;
      baseColor: THREE.Color;
      glowColor: THREE.Color;
      width: number;
    }

    const streaks: StreakData[] = [];

    for (let i = 0; i < NUM_STREAKS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rRandom = Math.pow(Math.random(), 1.5); 
      const radius = TUNNEL_RADIUS_MIN + rRandom * (TUNNEL_RADIUS_MAX - TUNNEL_RADIUS_MIN);
      
      // Start randomly distributed inside tunnel
      const z = -Math.random() * TUNNEL_LENGTH;
      const length = 150 + Math.random() * 350; // Much longer beams
      const speedMult = 0.8 + Math.random() * 1.5;

      const roll = Math.random();
      let cCore, cGlow;
      if (roll < 0.5) {
        cCore = new THREE.Color(0xffffff);
        cGlow = new THREE.Color(0x70b0ff); 
      } else if (roll < 0.9) {
        cCore = new THREE.Color(0xa0d0ff);
        cGlow = new THREE.Color(0x1050ff); 
      } else {
        cCore = new THREE.Color(0xfff0c0);
        cGlow = new THREE.Color(0xff9010); 
      }

      // Made thicker as requested
      const width = 1.5 + Math.random() * 3.5;

      streaks.push({
        angle, radius, z, length, speed: speedMult, baseColor: cCore, glowColor: cGlow, width
      });
    }

    scene.add(mesh);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const dt = clock.getDelta();
      
      const scrollFrac = Math.min(scrollRef.current / (window.innerHeight * 1.5), 1);
      const currentSpeed = BASE_SPEED * (1 + scrollFrac * 6);

      const targetCamX = (mouseRef.current.x - window.innerWidth / 2) * 0.05;
      const targetCamY = -(mouseRef.current.y - window.innerHeight / 2) * 0.05;
      camera.position.x += (targetCamX - camera.position.x) * 5 * dt;
      camera.position.y += (targetCamY - camera.position.y) * 5 * dt;

      for (let i = 0; i < NUM_STREAKS; i++) {
        const s = streaks[i];
        
        // Move towards camera
        s.z += currentSpeed * s.speed * dt;

        if (s.z - s.length > camera.position.z + 50) {
          s.z = -TUNNEL_LENGTH;
          s.angle += (Math.random() - 0.5) * 0.5;
        }

        const x = Math.cos(s.angle) * s.radius;
        const y = Math.sin(s.angle) * s.radius;

        // Plane normal is +Y. By rotating around Z by (angle - PI/2),
        // we guarantee the flat face of the plane points directly inward at the camera.
        const rotationAngle = s.angle - Math.PI / 2;

        // --- CORE BEAM ---
        dummy.position.set(x, y, s.z);
        dummy.rotation.set(0, 0, rotationAngle);
        dummy.scale.set(s.width, 1, s.length);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        // Base bright color
        mesh.setColorAt(i, s.baseColor);

        // --- OUTER GLOW ---
        // Same exact position, perfectly flat face, just wider and semi transparent
        dummy.scale.set(s.width * 6, 1, s.length * 0.8);
        dummy.position.set(x, y, s.z + s.length * 0.1); // slightly offset back
        dummy.updateMatrix();
        mesh.setMatrixAt(i + NUM_STREAKS, dummy.matrix);
        // Reduce intensity heavily for additive blending glow
        const dimGlow = new THREE.Color(s.glowColor).multiplyScalar(0.4);
        mesh.setColorAt(i + NUM_STREAKS, dimGlow);
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // EVENT LISTENERS
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      
      geometry.dispose();
      material.dispose();
      gradientTex.dispose();
      renderer.dispose();
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
}
