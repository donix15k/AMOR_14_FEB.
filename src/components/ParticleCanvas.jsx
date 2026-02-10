import { useEffect, useRef } from 'react';

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

function createTextTargets(text, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const fontSize = clamp(Math.floor(width * 0.12), 38, 120);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
  ctx.fillText(text, width / 2, height / 2);

  const image = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  const step = Math.max(4, Math.floor(width / 180));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = image[(y * width + x) * 4 + 3];
      if (alpha > 120) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

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

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
          x: random(0, canvas.width),
          y: random(0, canvas.height),
          vx: random(-0.25, 0.25),
          vy: random(-0.25, 0.25),
          color: WARM_COLORS[Math.floor(random(0, WARM_COLORS.length))],
          size: random(1.2, 2.8),
        }));
      }

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
      const mouse = mouseRef.current;
      const targets = targetsRef.current;
      const width = canvas.width;
      const height = canvas.height;

      if (modeRef.current === 'floating' && timestamp - timerRef.current > FLOATING_MS) {
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

          p.vx += (tx - p.x) * 0.012;
          p.vy += (ty - p.y) * 0.012;
        }

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
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
  }, [onHeartMode, onTextChange, started, texts]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-label="Animación de partículas" />;
}

export default ParticleCanvas;
