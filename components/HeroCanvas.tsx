'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Glyph {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  char: string;
  baseOpacity: number;
  currentOpacity: number;
  fontSize: number;
  phase: number;
  speed: number;        // drift cycle seconds
  driftAmpX: number;
  driftAmpY: number;
  rotation: number;
  targetRotation: number;
  scattered: boolean;
}

interface ProjectDot {
  id: string;
  label: string;
  sub: string;
  route: string;
  xPct: number;
  yPct: number;
  labelOpacity: number;
  ripples: { r: number; opacity: number }[];
  swarmType: 'web' | 'stream' | 'pulse' | 'spiral';
}

interface BloomPos {
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const GLYPH_COUNT = 800;

const HEAVY_CHARS = ['·', '×', '+', '°', '∙', '•', '‧'];
const MEDIUM_CHARS = ['∘', '⊕', '⊗', '✕', '✦', '※'];
const RARE_CHARS = ['a', 'e', 'i', 'n', 's', 't', 'r'];

const PROJECT_DOTS: Omit<ProjectDot, 'labelOpacity' | 'ripples'>[] = [
  { id: 'influence-graph',    label: 'Influence Graph',    sub: 'Salesloft · 2024', route: '/work/influence-graph',    xPct: 0.30, yPct: 0.35, swarmType: 'web'    },
  { id: 'ai-email-assistant', label: 'AI Email Assistant', sub: 'Salesloft · 2023', route: '/work/ai-email-assistant', xPct: 0.62, yPct: 0.28, swarmType: 'stream'  },
  { id: 'github',             label: 'GitHub',             sub: 'GitHub · 2022',    route: '/work/github',             xPct: 0.22, yPct: 0.65, swarmType: 'pulse'   },
  { id: 'sony',               label: 'Sony',               sub: 'Sony · 2021',      route: '/work/sony',               xPct: 0.68, yPct: 0.62, swarmType: 'spiral'  },
];

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) — deterministic layout
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Glyph factory
// ---------------------------------------------------------------------------
function makeGlyphs(w: number, h: number, dotPositions: { x: number; y: number }[]): Glyph[] {
  const rand = mulberry32(42);
  const glyphs: Glyph[] = [];

  for (let i = 0; i < GLYPH_COUNT; i++) {
    // Organic clustering: choose a seed point (biased toward dot positions
    // or a random cluster center), then spread around it
    let cx: number;
    let cy: number;

    const clusterBias = rand();
    if (clusterBias < 0.35 && dotPositions.length > 0) {
      // cluster near a project dot
      const dp = dotPositions[Math.floor(rand() * dotPositions.length)];
      cx = dp.x + (rand() - 0.5) * w * 0.25;
      cy = dp.y + (rand() - 0.5) * h * 0.25;
    } else {
      // random cluster center
      cx = rand() * w;
      cy = rand() * h;
    }
    const spread = 40 + rand() * 120;
    const homeX = cx + (rand() - 0.5) * spread;
    const homeY = cy + (rand() - 0.5) * spread;

    // character selection
    const charRoll = rand();
    let char: string;
    if (charRoll < 0.55)      char = HEAVY_CHARS[Math.floor(rand() * HEAVY_CHARS.length)];
    else if (charRoll < 0.87) char = MEDIUM_CHARS[Math.floor(rand() * MEDIUM_CHARS.length)];
    else                      char = RARE_CHARS[Math.floor(rand() * RARE_CHARS.length)];

    const fontSizes = [7, 9, 11];
    const fontSize = fontSizes[Math.floor(rand() * fontSizes.length)];

    glyphs.push({
      x: homeX,
      y: homeY,
      homeX,
      homeY,
      vx: 0,
      vy: 0,
      char,
      baseOpacity: 0.15 + rand() * 0.40,
      currentOpacity: 0.15 + rand() * 0.40,
      fontSize,
      phase: rand() * Math.PI * 2,
      speed: 2 + rand() * 3,
      driftAmpX: 1 + rand() * 1.5,
      driftAmpY: 1 + rand() * 1.5,
      rotation: 0,
      targetRotation: 0,
      scattered: false,
    });
  }
  return glyphs;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface HeroCanvasProps {
  onDotClick?: (dotId: string, x: number, y: number) => void;
}

export default function HeroCanvas({ onDotClick }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const glyphsRef = useRef<Glyph[]>([]);
  const dotsRef = useRef<ProjectDot[]>(
    PROJECT_DOTS.map(d => ({ ...d, labelOpacity: 0, ripples: [] }))
  );
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const bloomRef = useRef<BloomPos>({ x: -9999, y: -9999 });
  const bloomTargetRef = useRef<BloomPos>({ x: -9999, y: -9999 });
  const expandRef = useRef<{ active: boolean; x: number; y: number; r: number; maxR: number; startTime: number; dotId: string; route: string } | null>(null);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  // ----- init ---------------------------------------------------------------
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dotPositions = PROJECT_DOTS.map(d => ({
      x: d.xPct * canvas.width,
      y: d.yPct * canvas.height,
    }));

    glyphsRef.current = makeGlyphs(canvas.width, canvas.height, dotPositions);

    // reset bloom to center-ish
    bloomRef.current = { x: canvas.width * 0.45, y: canvas.height * 0.5 };
    bloomTargetRef.current = { x: canvas.width * 0.45, y: canvas.height * 0.5 };
  }, []);

  // ----- draw ---------------------------------------------------------------
  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const isDark = themeRef.current === 'dark';
    const inkColor = isDark ? '#ede9e3' : '#1c1b19';
    const faintColor = isDark ? '#605d58' : '#b0ada7';

    ctx.clearRect(0, 0, W, H);

    // --- bloom layer --------------------------------------------------------
    const bx = bloomRef.current.x;
    const by = bloomRef.current.y;
    // lerp bloom toward target
    const btx = bloomTargetRef.current.x;
    const bty = bloomTargetRef.current.y;
    bloomRef.current.x += (btx - bx) * 0.08;
    bloomRef.current.y += (bty - by) * 0.08;

    const compositeMode = isDark ? 'screen' : 'multiply';

    // cursor bloom
    if (bloomRef.current.x > 0) {
      ctx.save();
      ctx.globalCompositeOperation = compositeMode as GlobalCompositeOperation;
      const grad = ctx.createRadialGradient(
        bloomRef.current.x, bloomRef.current.y, 0,
        bloomRef.current.x, bloomRef.current.y, 120
      );
      grad.addColorStop(0, isDark ? 'rgba(232,213,196,0.25)' : 'rgba(232,213,196,0.35)');
      grad.addColorStop(1, 'rgba(232,213,196,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // project dot blooms (when hovered)
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    for (const dot of dotsRef.current) {
      const dx = dot.xPct * W;
      const dy = dot.yPct * H;
      const distToDot = Math.hypot(mx - dx, my - dy);
      if (distToDot < 140) {
        const t2 = 1 - distToDot / 140;
        ctx.save();
        ctx.globalCompositeOperation = compositeMode as GlobalCompositeOperation;
        const grad2 = ctx.createRadialGradient(dx, dy, 0, dx, dy, 160);
        grad2.addColorStop(0, `rgba(212,207,201,${0.25 * t2})`);
        grad2.addColorStop(1, 'rgba(212,207,201,0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    // reset composite for glyph layer
    ctx.globalCompositeOperation = 'source-over';

    // --- glyphs -------------------------------------------------------------
    const sec = t / 1000;

    for (let i = 0; i < glyphsRef.current.length; i++) {
      const g = glyphsRef.current[i];

      if (g.scattered) {
        // flying off — apply velocity
        g.x += g.vx;
        g.y += g.vy;
        g.vx *= 0.98;
        g.vy *= 0.98;
        g.currentOpacity *= 0.97;
        continue;
      }

      // sine drift
      const driftX = Math.sin(sec / g.speed + g.phase) * g.driftAmpX;
      const driftY = Math.cos(sec / g.speed * 0.7 + g.phase) * g.driftAmpY;

      // cursor interaction
      const distToMouse = Math.hypot(g.x - mx, g.y - my);
      let extraOpacity = 0;
      let pullX = 0;
      let pullY = 0;
      let drawSize = g.fontSize;
      let applyRotation = false;
      let rotForce = 0;

      if (distToMouse < 90) {
        extraOpacity = (1 - distToMouse / 90) * (0.9 - g.baseOpacity);
        pullX = (mx - g.x) * 0.015;
        pullY = (my - g.y) * 0.015;
        if (distToMouse < 30) drawSize = 11;
      } else {
        // drift home (smooth return)
        pullX = (g.homeX - g.x) * 0.04;
        pullY = (g.homeY - g.y) * 0.04;
      }

      g.currentOpacity += (g.baseOpacity + extraOpacity - g.currentOpacity) * 0.1;

      // project dot interactions
      for (const dot of dotsRef.current) {
        const dpx = dot.xPct * W;
        const dpy = dot.yPct * H;
        const distToDot = Math.hypot(mx - dpx, my - dpy);
        const distGlyphToDot = Math.hypot(g.x - dpx, g.y - dpy);

        if (distToDot < 140 && distGlyphToDot < 100) {
          const strength = (1 - distGlyphToDot / 100) * (1 - distToDot / 140);

          switch (dot.swarmType) {
            case 'web': {
              // tangential orbit
              const angle = Math.atan2(g.y - dpy, g.x - dpx);
              pullX += Math.cos(angle + Math.PI / 2) * strength * 1.5;
              pullY += Math.sin(angle + Math.PI / 2) * strength * 1.5;
              pullX += (dpx - g.x) * 0.01 * strength;
              pullY += (dpy - g.y) * 0.01 * strength;
              break;
            }
            case 'stream': {
              pullX += strength * 2.5; // flow right
              pullY += (dpy - g.y) * 0.02 * strength;
              break;
            }
            case 'pulse': {
              // breathing scale effect — push out and snap back
              const pulseFactor = Math.sin(sec * 3) * 0.5 + 0.5;
              const outX = (g.x - dpx) * pulseFactor * 0.05;
              const outY = (g.y - dpy) * pulseFactor * 0.05;
              pullX += outX * strength;
              pullY += outY * strength;
              break;
            }
            case 'spiral': {
              // clockwise rotation force
              const angle2 = Math.atan2(g.y - dpy, g.x - dpx);
              rotForce = strength * 0.04;
              applyRotation = true;
              pullX += Math.cos(angle2 + Math.PI / 2) * strength * 1.2;
              pullY += Math.sin(angle2 + Math.PI / 2) * strength * 1.2;
              pullX += (dpx - g.x) * 0.008 * strength;
              pullY += (dpy - g.y) * 0.008 * strength;
              break;
            }
          }
        }
      }

      g.x += pullX + driftX * 0.05;
      g.y += pullY + driftY * 0.05;

      if (applyRotation) {
        g.rotation += rotForce;
      } else {
        g.rotation *= 0.95; // ease back to 0
      }

      // draw
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, g.currentOpacity));
      ctx.font = `${drawSize}px var(--font-ibm-plex-mono, monospace)`;
      ctx.fillStyle = inkColor;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (Math.abs(g.rotation) > 0.005) {
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.fillText(g.char, 0, 0);
      } else {
        ctx.fillText(g.char, g.x, g.y);
      }
      ctx.restore();
    }

    // --- project dots — faint rings + labels --------------------------------
    for (const dot of dotsRef.current) {
      const dpx = dot.xPct * W;
      const dpy = dot.yPct * H;
      const distToDot = Math.hypot(mx - dpx, my - dpy);
      const hovered = distToDot < 140;

      // fade label in/out
      dot.labelOpacity += (hovered ? 1 : 0 - dot.labelOpacity) * 0.1;

      // faint ring
      ctx.save();
      ctx.globalAlpha = 0.2 + (hovered ? 0.15 : 0);
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(dpx, dpy, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ripple rings
      for (let ri = dot.ripples.length - 1; ri >= 0; ri--) {
        const rip = dot.ripples[ri];
        rip.r += 4;
        rip.opacity -= 0.025;
        if (rip.opacity <= 0) {
          dot.ripples.splice(ri, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = rip.opacity;
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(dpx, dpy, rip.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // labels
      if (dot.labelOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = dot.labelOpacity;
        ctx.font = '11px var(--font-ibm-plex-mono, monospace)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = inkColor;
        ctx.letterSpacing = '0.12em';
        ctx.fillText(dot.label.toUpperCase(), dpx, dpy + 26);
        ctx.fillStyle = faintColor;
        ctx.font = '10px var(--font-ibm-plex-mono, monospace)';
        ctx.fillText(dot.sub, dpx, dpy + 42);
        ctx.restore();
      }
    }

    // --- expand circle animation --------------------------------------------
    if (expandRef.current?.active) {
      const exp = expandRef.current;
      const elapsed = (t - exp.startTime) / 500; // 0→1 over 500ms
      const eased = 1 - Math.pow(1 - Math.min(elapsed, 1), 3); // ease-out cubic
      exp.r = eased * exp.maxR;

      const bgColor = isDark ? '#1a1918' : '#f2f0eb';
      ctx.save();
      ctx.beginPath();
      ctx.arc(exp.x, exp.y, exp.r, 0, Math.PI * 2);
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.restore();

      if (elapsed >= 1) {
        expandRef.current = null;
        router.push(exp.route || '/');
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [router]);

  // ----- effects ------------------------------------------------------------
  useEffect(() => {
    init();
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [init, draw]);

  useEffect(() => {
    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [init]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };
    bloomTargetRef.current = { x, y };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
    // bloom drifts to center
    const canvas = canvasRef.current;
    if (canvas) {
      bloomTargetRef.current = { x: canvas.width * 0.45, y: canvas.height * 0.5 };
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const W = canvas.width;
    const H = canvas.height;

    for (const dot of dotsRef.current) {
      const dpx = dot.xPct * W;
      const dpy = dot.yPct * H;
      if (Math.hypot(cx - dpx, cy - dpy) < 30) {
        // save clicked dot for back animation
        sessionStorage.setItem('clickedDot', dot.id);
        sessionStorage.setItem('clickedDotX', String(dpx));
        sessionStorage.setItem('clickedDotY', String(dpy));

        // ripples
        dot.ripples.push({ r: 18, opacity: 0.6 });
        dot.ripples.push({ r: 18, opacity: 0.4 });
        dot.ripples.push({ r: 18, opacity: 0.25 });

        // scatter glyphs
        for (const g of glyphsRef.current) {
          const dx = g.x - dpx;
          const dy = g.y - dpy;
          const dist = Math.max(1, Math.hypot(dx, dy));
          g.vx = (dx / dist) * (300 / dist + 2);
          g.vy = (dy / dist) * (300 / dist + 2);
          g.scattered = true;
        }

        // start expand
        const maxR = Math.hypot(W, H) * 1.1;
        expandRef.current = {
          active: true, x: dpx, y: dpy, r: 0, maxR,
          startTime: performance.now(),
          dotId: dot.id,
          route: dot.route,
        };

        onDotClick?.(dot.id, dpx, dpy);
        return;
      }
    }
  }, [onDotClick]);

  const handleCursorStyle = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const W = canvas.width;
    const H = canvas.height;
    let onDot = false;
    for (const dot of dotsRef.current) {
      if (Math.hypot(cx - dot.xPct * W, cy - dot.yPct * H) < 30) {
        onDot = true;
        break;
      }
    }
    canvas.style.cursor = onDot ? 'pointer' : 'default';
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
      onMouseMove={(e) => { handleMouseMove(e); handleCursorStyle(e); }}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  );
}
