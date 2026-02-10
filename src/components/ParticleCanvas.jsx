import { useEffect, useRef } from 'react';

const SHAPE_PARTICLE_COUNT = 1300;
const AMBIENT_PARTICLE_COUNT = 220;
const TEXT_HOLD_MS = 2400;
const FLOATING_MS = 900;

const PALETTES = [
  ['#ff4d4d', '#ff6a3d', '#ff9f43', '#ffd166'],
  ['#ff2e63', '#ff7b54', '#ffd166', '#f9f871'],
  ['#ff6f91', '#ff9671', '#ffc75f', '#f9f871'],
  ['#f94144', '#f3722c', '#f9844a', '#f9c74f'],
  ['#ff3c78', '#ff8a5b', '#ffd166', '#fff275'],
];
const PARTICLE_COUNT = 1200;
const TEXT_HOLD_MS = 2200;
const FLOATING_MS = 900;
const WARM_COLORS = ['#ff4d4d', '#ff6a3d', '#ff7f50', '#ff9a3c', '#ffb347'];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function colorFromPalette(palette) {
  return palette[Math.floor(random(0, palette.length))];
}

function createTextTargets(text, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const fontSize = clamp(Math.floor(width * 0.13), 42, 128);
  const fontSize = clamp(Math.floor(width * 0.12), 38, 120);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${fontSize}px system-ui, sans-serif`;
  ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
  ctx.fillText(text, width / 2, height / 2);

  const image = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  const step = Math.max(3, Math.floor(width / 220));
  const step = Math.max(4, Math.floor(width / 180));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = image[(y * width + x) * 4 + 3];
      if (alpha > 100) {
      if (alpha > 120) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

function insideHeart(nx, ny) {
  const a = nx * nx + ny * ny - 1;
  return a * a * a - nx * nx * ny * ny * ny <= 0;
}

function randomInsideHeart(scale) {
  for (let i = 0; i < 40; i += 1) {
    const x = random(-1.25, 1.25);
    const y = random(-1.25, 1.25);
    if (insideHeart(x, y)) {
      return { x: x * scale, y: y * scale };
    }
  }
  return { x: 0, y: 0 };
}

function createFilledHeartTargets(width, height, amount) {
  const points = [];
  const baseScale = Math.min(width, height) * 0.22;
  const layers = [1, 0.72, 0.46];

  while (points.length < amount) {
    for (const layer of layers) {
      const target = randomInsideHeart(baseScale * layer);
      points.push({
        x: width / 2 + target.x,
        y: height / 2 - target.y,
      });
      if (points.length >= amount) break;
    }
  }

  return points;
}

function ParticleCanvas({ started, texts }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const particlesRef = useRef([]);
  const ambientRef = useRef([]);
function createHeartTargets(width, height, amount) {
  const targets = [];
  const scale = Math.min(width, height) / 42;

  for (let i = 0; i < amount; i += 1) {
    const t = (i / amount) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    targets.push({
      x: width / 2 + x * scale,
      y: height / 2 - y * scale * 0.9,
    });
  }

  return targets;
}

function ParticleCanvas({ started, texts, onTextChange, onHeartMode }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const particlesRef = useRef([]);
  const modeRef = useRef('idle');
  const timerRef = useRef(0);
  const textIndexRef = useRef(-1);
  const targetsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const paletteRef = useRef(PALETTES[0]);

  useEffect(() => {
    if (!started) return undefined;

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const recolorAll = (palette) => {
      particlesRef.current.forEach((particle) => {
        particle.color = colorFromPalette(palette);
      });

      ambientRef.current.forEach((particle) => {
        particle.color = colorFromPalette(palette);
      });
    };

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: SHAPE_PARTICLE_COUNT }, () => ({
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
          x: random(0, canvas.width),
          y: random(0, canvas.height),
          vx: random(-0.25, 0.25),
          vy: random(-0.25, 0.25),
          color: colorFromPalette(paletteRef.current),
          color: WARM_COLORS[Math.floor(random(0, WARM_COLORS.length))],
          size: random(1.2, 2.8),
        }));
      }

      if (ambientRef.current.length === 0) {
        ambientRef.current = Array.from({ length: AMBIENT_PARTICLE_COUNT }, () => ({
          x: random(0, canvas.width),
          y: random(0, canvas.height),
          vx: random(-0.38, 0.38),
          vy: random(-0.38, 0.38),
          color: colorFromPalette(paletteRef.current),
          size: random(0.8, 2.2),
          twinkle: random(0, Math.PI * 2),
        }));
      }

      if (modeRef.current === 'text' && textIndexRef.current >= 0) {
        targetsRef.current = createTextTargets(texts[textIndexRef.current], canvas.width, canvas.height);
      }

      if (modeRef.current === 'heart') {
        targetsRef.current = createFilledHeartTargets(canvas.width, canvas.height, SHAPE_PARTICLE_COUNT);
      }
    };

    const setNextStep = () => {
      textIndexRef.current += 1;

      if (textIndexRef.current < texts.length) {
        modeRef.current = 'text';
        timerRef.current = performance.now();
        paletteRef.current = PALETTES[textIndexRef.current % PALETTES.length];
        recolorAll(paletteRef.current);
        targetsRef.current = createTextTargets(texts[textIndexRef.current], canvas.width, canvas.height);
      } else {
        modeRef.current = 'heart';
        timerRef.current = performance.now();
        paletteRef.current = ['#ff2d55', '#ff6f61', '#ff8fab', '#ffd6a5'];
        recolorAll(paletteRef.current);
        targetsRef.current = createFilledHeartTargets(canvas.width, canvas.height, SHAPE_PARTICLE_COUNT);
      if (modeRef.current === 'text' && textIndexRef.current >= 0) {
        targetsRef.current = createTextTargets(
          texts[textIndexRef.current],
          canvas.width,
          canvas.height
        );
      }

      if (modeRef.current === 'heart') {
        targetsRef.current = createHeartTargets(
          canvas.width,
          canvas.height,
          PARTICLE_COUNT
        );
      }
    };

    const setNextText = () => {
      textIndexRef.current += 1;
      if (textIndexRef.current < texts.length) {
        modeRef.current = 'text';
        timerRef.current = performance.now();
        const newText = texts[textIndexRef.current];
        onTextChange(newText);
        onHeartMode(false);
        targetsRef.current = createTextTargets(newText, canvas.width, canvas.height);
      } else {
        modeRef.current = 'heart';
        timerRef.current = performance.now();
        onTextChange('');
        onHeartMode(true);
        targetsRef.current = createHeartTargets(canvas.width, canvas.height, PARTICLE_COUNT);
      }
    };

    const update = (timestamp) => {
      const particles = particlesRef.current;
      const ambient = ambientRef.current;
      const mouse = mouseRef.current;
      const targets = targetsRef.current;
      const width = canvas.width;
      const height = canvas.height;

      if (modeRef.current === 'floating' && timestamp - timerRef.current > FLOATING_MS) {
        setNextStep();
      }

      if (modeRef.current === 'text' && timestamp - timerRef.current > TEXT_HOLD_MS) {
        setNextStep();
      }

      const pulse = modeRef.current === 'heart' ? 1 + Math.sin(timestamp * 0.0042) * 0.08 : 1;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < ambient.length; i += 1) {
        const p = ambient[i];
        p.twinkle += 0.03;
        p.vx += random(-0.01, 0.01);
        p.vy += random(-0.01, 0.01);
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.globalAlpha = 0.22 + (Math.sin(p.twinkle) + 1) * 0.18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
        setNextText();
      }

      if (modeRef.current === 'text' && timestamp - timerRef.current > TEXT_HOLD_MS) {
        setNextText();
      }

      let pulse = 1;
      if (modeRef.current === 'heart') {
        pulse = 1 + Math.sin(timestamp * 0.004) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        if (modeRef.current === 'floating' || modeRef.current === 'idle') {
          p.vx += random(-0.02, 0.02);
          p.vy += random(-0.02, 0.02);
        }

        if ((modeRef.current === 'text' || modeRef.current === 'heart') && targets.length > 0) {
          const t = targets[i % targets.length];
          const tx = modeRef.current === 'heart' ? width / 2 + (t.x - width / 2) * pulse : t.x;
          const ty = modeRef.current === 'heart' ? height / 2 + (t.y - height / 2) * pulse : t.y;

          p.vx += (tx - p.x) * 0.013;
          p.vy += (ty - p.y) * 0.013;
          p.vx += (tx - p.x) * 0.012;
          p.vy += (ty - p.y) * 0.012;
        }

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const radius = 130;
          const radius = 120;

          if (dist < radius && dist > 0.0001) {
            const force = (radius - dist) * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.91;
        p.vy *= 0.91;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(update);
    };

    const onMouseMove = (event) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    setSize();
    modeRef.current = 'floating';
    timerRef.current = performance.now();

    window.addEventListener('resize', setSize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    frameRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [started, texts]);
  }, [onHeartMode, onTextChange, started, texts]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-label="Animación de partículas" />;
}

export default ParticleCanvas;
