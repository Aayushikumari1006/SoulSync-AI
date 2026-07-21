import React, { useEffect, useRef } from "react";
import { AtmosphereType, AccessibilitySettings } from "../types";

interface AtmosphereVisualizerProps {
  atmosphere: AtmosphereType;
  accessibility: AccessibilitySettings;
}

interface BreathPuff {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  growth: number;
  speedY: number;
  speedX: number;
}

export const AtmosphereVisualizer: React.FC<AtmosphereVisualizerProps> = ({
  atmosphere,
  accessibility,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const droneNodeRef = useRef<OscillatorNode[] | null>(null);
  const chirpIntervalRef = useRef<number | null>(null);

  // Keep volume responsive in real-time
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const vol = accessibility.muteSounds ? 0 : (accessibility.soundVolume ?? 50) / 100;
      gainNodeRef.current.gain.linearRampToValueAtTime(
        0.18 * vol,
        audioContextRef.current.currentTime + 0.1
      );
    }
  }, [accessibility.soundVolume, accessibility.muteSounds]);

  // --- AUDIO SYNTHESIS ENGINE (Nature Synth) ---
  const stopAudio = () => {
    if (chirpIntervalRef.current) {
      clearInterval(chirpIntervalRef.current);
      chirpIntervalRef.current = null;
    }

    if (gainNodeRef.current && audioContextRef.current) {
      try {
        const currTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, currTime + 1.2);
      } catch (e) {}
    }

    setTimeout(() => {
      if (droneNodeRef.current) {
        droneNodeRef.current.forEach((osc) => {
          try { osc.stop(); } catch (e) {}
        });
        droneNodeRef.current = null;
      }
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop?.(); } catch (e) {}
        noiseNodeRef.current = null;
      }
    }, 1300);
  };

  const startAudio = () => {
    if (accessibility.muteSounds) {
      stopAudio();
      return;
    }

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      stopAudio();

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      mainGain.connect(ctx.destination);
      gainNodeRef.current = mainGain;

      const userVolume = (accessibility.soundVolume ?? 50) / 100;
      mainGain.gain.linearRampToValueAtTime(0.18 * userVolume, ctx.currentTime + 1.5);

      if (atmosphere === "rain") {
        // Rain white noise synthesize + filter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1100, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(mainGain);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } else if (atmosphere === "forest" || atmosphere === "spring") {
        // Wind drone (low freq oscillation) and bird chirps
        const windOsc = ctx.createOscillator();
        windOsc.type = "sine";
        windOsc.frequency.setValueAtTime(75, ctx.currentTime);

        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.04, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 15;

        lfo.connect(lfoGain);
        lfoGain.connect(windOsc.frequency);
        windOsc.connect(windGain);
        windGain.connect(mainGain);

        lfo.start();
        windOsc.start();
        droneNodeRef.current = [windOsc, lfo];

        const triggerBirdChirp = () => {
          if (accessibility.muteSounds) return;
          try {
            const now = ctx.currentTime;
            const chirpOsc = ctx.createOscillator();
            const chirpGain = ctx.createGain();

            chirpOsc.type = "sine";
            chirpOsc.frequency.setValueAtTime(2500 + Math.random() * 400, now);
            chirpOsc.frequency.exponentialRampToValueAtTime(3300 + Math.random() * 200, now + 0.1);
            chirpOsc.frequency.exponentialRampToValueAtTime(2000, now + 0.25);

            chirpGain.gain.setValueAtTime(0, now);
            chirpGain.gain.linearRampToValueAtTime(0.02 * userVolume, now + 0.05);
            chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

            chirpOsc.connect(chirpGain);
            chirpGain.connect(mainGain);

            chirpOsc.start(now);
            chirpOsc.stop(now + 0.3);
          } catch (e) {}
        };

        chirpIntervalRef.current = window.setInterval(() => {
          if (Math.random() > 0.4) {
            triggerBirdChirp();
            if (Math.random() > 0.5) {
              setTimeout(triggerBirdChirp, 180);
            }
          }
        }, 4000);
      } else if (atmosphere === "night") {
        // Crickets synth + deep night base drone
        const nightDrone = ctx.createOscillator();
        nightDrone.type = "sine";
        nightDrone.frequency.setValueAtTime(55, ctx.currentTime);
        const droneGain = ctx.createGain();
        droneGain.gain.setValueAtTime(0.05, ctx.currentTime);

        nightDrone.connect(droneGain);
        droneGain.connect(mainGain);
        nightDrone.start();
        droneNodeRef.current = [nightDrone];

        const triggerCrickets = () => {
          if (accessibility.muteSounds) return;
          try {
            const now = ctx.currentTime;
            for (let i = 0; i < 4; i++) {
              const t = now + i * 0.08;
              const osc = ctx.createOscillator();
              const cg = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(4200, t);
              cg.gain.setValueAtTime(0, t);
              cg.gain.linearRampToValueAtTime(0.008 * userVolume, t + 0.01);
              cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

              osc.connect(cg);
              cg.connect(mainGain);
              osc.start(t);
              osc.stop(t + 0.07);
            }
          } catch (e) {}
        };

        chirpIntervalRef.current = window.setInterval(() => {
          if (Math.random() > 0.3) {
            triggerCrickets();
          }
        }, 2200);
      } else if (atmosphere === "lake" || atmosphere === "sunset") {
        // Shimmering wave swishes
        const waveOsc = ctx.createOscillator();
        waveOsc.type = "sine";
        waveOsc.frequency.setValueAtTime(120, ctx.currentTime);

        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.02, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.015;

        lfo.connect(lfoGain);
        lfoGain.connect(waveGain.gain);

        waveOsc.connect(waveGain);
        waveGain.connect(mainGain);

        lfo.start();
        waveOsc.start();
        droneNodeRef.current = [waveOsc, lfo];
      } else {
        // Morning / Snow - Ambient meditation sine bowl
        const healingOsc = ctx.createOscillator();
        healingOsc.type = "sine";
        healingOsc.frequency.setValueAtTime(220, ctx.currentTime);
        const hGain = ctx.createGain();
        hGain.gain.setValueAtTime(0.02, ctx.currentTime);

        healingOsc.connect(hGain);
        hGain.connect(mainGain);
        healingOsc.start();
        droneNodeRef.current = [healingOsc];
      }
    } catch (e) {
      console.warn("Autoplay block: audio synthesis is waiting for customer click.", e);
    }
  };

  useEffect(() => {
    startAudio();
    return () => {
      stopAudio();
    };
  }, [atmosphere, accessibility.muteSounds]);

  // --- CANVAS GRAPHICS RENDERING ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const parentElement = canvas.parentElement || document.body;
    let width = (canvas.width = parentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = parentElement.clientHeight || window.innerHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = canvas.width = entryWidth || parentElement.clientWidth || window.innerWidth;
        height = canvas.height = entryHeight || parentElement.clientHeight || window.innerHeight;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Dynamic state trackers
    const particles: any[] = [];
    const clouds: { x: number; y: number; scale: number; speed: number; opacity: number }[] = [];
    const birds: { x: number; y: number; sy: number; angle: number; speed: number; scale: number; wingPhase: number }[] = [];
    const butterflies: { x: number; y: number; targetX: number; targetY: number; speed: number; scale: number; angle: number; color: string }[] = [];
    const ripples: { x: number; y: number; radius: number; maxRadius: number; opacity: number; speed: number }[] = [];
    const breathPuffs: BreathPuff[] = [];

    // Ambient structures
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        scale: 0.8 + Math.random() * 1.5,
        speed: 0.15 + Math.random() * 0.25,
        opacity: 0.15 + Math.random() * 0.2,
      });
    }

    const stars: { x: number; y: number; radius: number; speed: number; phase: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.6),
        radius: 0.5 + Math.random() * 1.2,
        speed: 0.02 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const initParticles = (type: AtmosphereType) => {
      particles.length = 0;
      birds.length = 0;
      butterflies.length = 0;
      ripples.length = 0;
      breathPuffs.length = 0;

      // Performance adjustment based on accessibility setup
      const isLowPerf = accessibility.lowPerformanceMode;
      const baseCount = type === "rain" ? 180 : type === "snow" ? 100 : type === "spring" ? 50 : 35;
      const numParticles = accessibility.reducedMotion
        ? 10
        : isLowPerf
        ? Math.round(baseCount * 0.35)
        : baseCount;

      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle(type, true));
      }

      // Pre-add birds & butterflies
      if (type === "sunset" || type === "morning" || type === "forest") {
        for (let i = 0; i < (isLowPerf ? 1 : 3); i++) {
          birds.push({
            x: -50 - Math.random() * 200,
            y: height * 0.12 + Math.random() * (height * 0.2),
            sy: 0,
            angle: 0,
            speed: 0.8 + Math.random() * 0.8,
            scale: 0.45 + Math.random() * 0.35,
            wingPhase: Math.random() * Math.PI * 2,
          });
        }
      }

      if (type === "forest" && !accessibility.reducedMotion) {
        const butterflyColors = ["#fca5a5", "#fde047", "#38bdf8", "#c084fc"];
        for (let i = 0; i < (isLowPerf ? 2 : 5); i++) {
          butterflies.push({
            x: Math.random() * width,
            y: Math.random() * height,
            targetX: Math.random() * width,
            targetY: Math.random() * height,
            speed: 0.5 + Math.random() * 0.8,
            scale: 4 + Math.random() * 3,
            angle: Math.random() * Math.PI * 2,
            color: butterflyColors[i % butterflyColors.length],
          });
        }
      }
    };

    const createParticle = (type: AtmosphereType, randomY = false) => {
      const pY = randomY ? Math.random() * height : -15;
      const pX = Math.random() * width;

      switch (type) {
        case "rain":
          return {
            x: pX,
            y: pY,
            length: 12 + Math.random() * 18,
            speed: 12 + Math.random() * 7,
            opacity: 0.2 + Math.random() * 0.4,
            angle: 1.1 + Math.random() * 1.3,
            width: 1 + Math.random() * 0.7,
          };
        case "snow":
          return {
            x: pX,
            y: pY,
            radius: 1.5 + Math.random() * 3.5,
            speed: 0.5 + Math.random() * 1.1,
            opacity: 0.3 + Math.random() * 0.6,
            swing: Math.random() * 2.2,
            swingSpeed: 0.01 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2,
          };
        case "spring":
          return {
            x: pX,
            y: pY,
            radius: 4 + Math.random() * 4.5,
            speed: 0.6 + Math.random() * 1.0,
            opacity: 0.4 + Math.random() * 0.45,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: 0.01 + Math.random() * 0.02,
            swing: 1 + Math.random() * 2,
            swingSpeed: 0.01 + Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2,
          };
        case "night":
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 1.4 + Math.random() * 2.2,
            speedX: (Math.random() * 2 - 1) * 0.22,
            speedY: (Math.random() * 2 - 1) * 0.22,
            opacity: 0,
            targetOpacity: 0.4 + Math.random() * 0.5,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            phase: Math.random() * Math.PI * 2,
          };
        case "forest":
          return {
            x: pX,
            y: pY,
            radius: 4 + Math.random() * 5,
            speed: 0.4 + Math.random() * 0.8,
            opacity: 0.2 + Math.random() * 0.45,
            angle: Math.random() * Math.PI,
            rotationSpeed: 0.005 + Math.random() * 0.01,
            color: Math.random() > 0.5 ? "#4ade80" : "#22c55e",
            swing: 1.5 + Math.random() * 2,
            swingSpeed: 0.01 + Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2,
          };
        case "sunset":
          return {
            x: Math.random() * width,
            y: height + 10,
            radius: 1 + Math.random() * 2.5,
            speedY: -(0.5 + Math.random() * 1.1),
            speedX: (Math.random() * 2 - 1) * 0.3,
            opacity: 0.6 + Math.random() * 0.4,
            life: 1.0,
            decay: 0.003 + Math.random() * 0.005,
          };
        case "morning":
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 1 + Math.random() * 1.8,
            speedX: (Math.random() * 2 - 1) * 0.15,
            speedY: (Math.random() * 2 - 1) * 0.15,
            opacity: 0.1 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            speedPhase: 0.005 + Math.random() * 0.01,
          };
        default:
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 2 + Math.random() * 3.5,
            speedX: (Math.random() * 2 - 1) * 0.1,
            speedY: (Math.random() * 2 - 1) * 0.05,
            opacity: 0.1 + Math.random() * 0.2,
          };
      }
    };

    initParticles(atmosphere);

    const getColors = (type: AtmosphereType) => {
      switch (type) {
        case "rain":
          return { gradStart: "#111827", gradEnd: "#030712" };
        case "morning":
          return { gradStart: "#cbd5e1", gradEnd: "#fef08a" };
        case "sunset":
          return { gradStart: "#3b0764", gradEnd: "#ea580c" };
        case "night":
          return { gradStart: "#030712", gradEnd: "#111827" };
        case "forest":
          return { gradStart: "#022c22", gradEnd: "#064e3b" };
        case "lake":
          return { gradStart: "#0f172a", gradEnd: "#0c4a6e" };
        case "snow":
          return { gradStart: "#334155", gradEnd: "#1e293b" };
        case "spring":
          return { gradStart: "#ffe4e6", gradEnd: "#ffedd5" };
      }
    };

    let currentGradStart = getColors(atmosphere).gradStart;
    let currentGradEnd = getColors(atmosphere).gradEnd;
    let lightningFlash = 0;

    const draw = () => {
      if (accessibility.highContrast) {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      const targetColors = getColors(atmosphere);
      const blendRate = accessibility.reducedMotion ? 1.0 : 0.02;
      currentGradStart = lerpColor(currentGradStart, targetColors.gradStart, blendRate);
      currentGradEnd = lerpColor(currentGradEnd, targetColors.gradEnd, blendRate);

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, currentGradStart);
      gradient.addColorStop(1, currentGradEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const isStatic = accessibility.staticBackground;

      // --- 1. SPECIAL ATMOSPHERE GRAPHICS ---
      if (atmosphere === "night") {
        // Starfield twinkling
        stars.forEach((star) => {
          if (!isStatic) star.phase += star.speed;
          const starOpacity = 0.2 + Math.abs(Math.sin(star.phase)) * 0.8;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
          ctx.fill();
        });

        // Moonlight glow halo
        const moonHalo = ctx.createRadialGradient(width - 120, 100, 0, width - 120, 100, 240);
        moonHalo.addColorStop(0, "rgba(241, 245, 249, 0.2)");
        moonHalo.addColorStop(1, "rgba(15, 23, 42, 0)");
        ctx.fillStyle = moonHalo;
        ctx.beginPath();
        ctx.arc(width - 120, 100, 240, 0, Math.PI * 2);
        ctx.fill();

        // Moonlight disk
        ctx.fillStyle = "rgba(248, 250, 252, 0.9)";
        ctx.beginPath();
        ctx.arc(width - 120, 100, 26, 0, Math.PI * 2);
        ctx.fill();

        // Cloud shadows (large transparent slow paths)
        ctx.fillStyle = "rgba(3, 7, 18, 0.15)";
        for (let i = 0; i < 2; i++) {
          const sx = ((Date.now() * 0.0018 * (i + 1)) % (width + 600)) - 300;
          ctx.beginPath();
          ctx.ellipse(sx, height * 0.55, 280, 70, 0.08, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (atmosphere === "sunset") {
        // Glowing sun disk
        const sunGrad = ctx.createRadialGradient(width * 0.75, height * 0.5, 0, width * 0.75, height * 0.5, 140);
        sunGrad.addColorStop(0, "rgba(251, 146, 60, 0.7)");
        sunGrad.addColorStop(0.3, "rgba(234, 88, 12, 0.2)");
        sunGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width * 0.75, height * 0.5, 140, 0, Math.PI * 2);
        ctx.fill();

        // Shimmering lake sunset rays reflection
        ctx.strokeStyle = "rgba(253, 186, 116, 0.18)";
        ctx.lineWidth = 1.5;
        for (let y = height * 0.5; y < height; y += 12) {
          const shift = Math.sin(Date.now() * 0.002 + y) * 20;
          ctx.beginPath();
          ctx.moveTo(width * 0.55 + shift, y);
          ctx.lineTo(width * 0.9 + shift, y);
          ctx.stroke();
        }
      }

      if (atmosphere === "morning") {
        const sunGrad = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, 280);
        sunGrad.addColorStop(0, "rgba(254, 240, 138, 0.6)");
        sunGrad.addColorStop(0.5, "rgba(253, 224, 71, 0.12)");
        sunGrad.addColorStop(1, "rgba(203, 213, 225, 0)");
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width * 0.2, height * 0.2, 280, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw clouds for sunset/morning/lake
      if (atmosphere === "sunset" || atmosphere === "morning" || atmosphere === "lake") {
        clouds.forEach((cloud) => {
          if (!isStatic) {
            cloud.x += cloud.speed;
            if (cloud.x > width + 220 * cloud.scale) {
              cloud.x = -220 * cloud.scale;
              cloud.y = Math.random() * (height * 0.35);
            }
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
          ctx.beginPath();
          const cx = cloud.x;
          const cy = cloud.y;
          const r = 26 * cloud.scale;

          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.arc(cx + r * 0.65, cy - r * 0.22, r * 0.85, 0, Math.PI * 2);
          ctx.arc(cx - r * 0.65, cy - r * 0.1, r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw birds
      if (atmosphere === "morning" || atmosphere === "sunset" || atmosphere === "forest") {
        birds.forEach((bird) => {
          if (!isStatic) {
            bird.x += bird.speed;
            bird.wingPhase += 0.14;
            bird.y += Math.sin(bird.wingPhase) * 0.4;
            if (bird.x > width + 120) {
              bird.x = -120;
              bird.y = height * 0.12 + Math.random() * (height * 0.2);
            }
          }
          ctx.strokeStyle = atmosphere === "sunset" ? "rgba(49, 10, 47, 0.55)" : "rgba(30, 41, 59, 0.4)";
          ctx.lineWidth = 1.6 * bird.scale;
          ctx.beginPath();
          const flap = Math.sin(bird.wingPhase) * 7 * bird.scale;
          ctx.moveTo(bird.x, bird.y);
          ctx.quadraticCurveTo(bird.x - 9 * bird.scale, bird.y - 11 * bird.scale + flap, bird.x - 18 * bird.scale, bird.y - 3 * bird.scale + flap);
          ctx.moveTo(bird.x, bird.y);
          ctx.quadraticCurveTo(bird.x + 9 * bird.scale, bird.y - 11 * bird.scale + flap, bird.x + 18 * bird.scale, bird.y - 3 * bird.scale + flap);
          ctx.stroke();
        });
      }

      // Draw butterflies flying
      if (atmosphere === "forest" && butterflies.length > 0) {
        butterflies.forEach((b) => {
          if (!isStatic) {
            const dx = b.targetX - b.x;
            const dy = b.targetY - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 25) {
              b.targetX = Math.random() * width;
              b.targetY = Math.random() * height;
            } else {
              b.x += (dx / dist) * b.speed;
              b.y += (dy / dist) * b.speed;
              b.angle = Math.atan2(dy, dx);
            }
          }
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.angle + Math.PI / 2);
          const flap = Math.sin(Date.now() * 0.015) * 0.85;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.ellipse(-b.scale / 2, 0, (b.scale * (1 + flap)) / 2, b.scale, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(b.scale / 2, 0, (b.scale * (1 + flap)) / 2, b.scale, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // Forest grass swaying animation
      if (atmosphere === "forest") {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.22)";
        ctx.lineWidth = 1.8;
        const grassSway = Math.sin(Date.now() * 0.002) * 9;
        for (let x = 0; x < width; x += 45) {
          ctx.beginPath();
          ctx.moveTo(x, height);
          ctx.quadraticCurveTo(x + grassSway * 0.5, height - 16, x + grassSway, height - 32);
          ctx.stroke();
        }
      }

      // Lake ducks, fish, and floating leaves
      if (atmosphere === "lake") {
        // Fish swimming
        for (let i = 0; i < 3; i++) {
          const fx = (width * 0.15 + i * 220 + Date.now() * 0.018) % (width + 60);
          const fy = height * 0.78 + Math.sin(Date.now() * 0.003 + i) * 10;
          ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
          ctx.beginPath();
          ctx.ellipse(fx, fy, 9, 3.5, 0.05, 0, Math.PI * 2);
          ctx.moveTo(fx - 9, fy);
          ctx.lineTo(fx - 13, fy - 3.2);
          ctx.lineTo(fx - 13, fy + 3.2);
          ctx.fill();
        }

        // Ducks swimming silhouette
        const duckX = ((Date.now() * 0.012) % (width + 160)) - 80;
        const duckY = height * 0.7 + Math.sin(Date.now() * 0.004) * 4;
        ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
        ctx.beginPath();
        ctx.ellipse(duckX, duckY, 13, 8.5, 0, 0, Math.PI * 2);
        ctx.arc(duckX + 11, duckY - 6, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(249, 115, 22, 0.8)";
        ctx.beginPath();
        ctx.moveTo(duckX + 13, duckY - 8);
        ctx.lineTo(duckX + 19, duckY - 6.2);
        ctx.lineTo(duckX + 13, duckY - 4.2);
        ctx.fill();

        // Shimmering ripples
        if (Math.random() < 0.014 && ripples.length < 5 && !isStatic) {
          ripples.push({
            x: Math.random() * width,
            y: height * 0.55 + Math.random() * (height * 0.4),
            radius: 4,
            maxRadius: 45 + Math.random() * 60,
            opacity: 0.5,
            speed: 0.35 + Math.random() * 0.3,
          });
        }

        ripples.forEach((rip, idx) => {
          if (!isStatic) {
            rip.radius += rip.speed;
            rip.opacity -= rip.speed / rip.maxRadius;
          }
          if (rip.opacity <= 0) {
            ripples.splice(idx, 1);
            return;
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${rip.opacity * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.radius * 2.2, rip.radius * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Floating leaves
        ctx.fillStyle = "rgba(234, 88, 12, 0.32)";
        for (let i = 0; i < 4; i++) {
          const lx = (width * 0.1 + i * 200 + Date.now() * 0.008) % width;
          const ly = height * 0.8 + Math.sin(Date.now() * 0.0018 + i) * 7;
          ctx.beginPath();
          ctx.ellipse(lx, ly, 7, 3, 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rain lighting flash
      if (atmosphere === "rain") {
        if (!isStatic && Math.random() < 0.0012) {
          lightningFlash = 1.0;
          // Thunder synth
          if (audioContextRef.current && !accessibility.muteSounds) {
            try {
              const ctxAudio = audioContextRef.current;
              const nowAudio = ctxAudio.currentTime;
              const oscThun = ctxAudio.createOscillator();
              const gainThun = ctxAudio.createGain();
              oscThun.type = "sawtooth";
              oscThun.frequency.setValueAtTime(45 + Math.random() * 15, nowAudio);
              oscThun.frequency.exponentialRampToValueAtTime(22, nowAudio + 1.6);
              gainThun.gain.setValueAtTime(0, nowAudio);
              const volRatio = (accessibility.soundVolume ?? 50) / 100;
              gainThun.gain.linearRampToValueAtTime(0.08 * volRatio, nowAudio + 0.12);
              gainThun.gain.exponentialRampToValueAtTime(0.0001, nowAudio + 1.6);

              const filterLp = ctxAudio.createBiquadFilter();
              filterLp.type = "lowpass";
              filterLp.frequency.setValueAtTime(80, nowAudio);

              oscThun.connect(filterLp);
              filterLp.connect(gainThun);
              gainThun.connect(ctxAudio.destination);
              oscThun.start(nowAudio);
              oscThun.stop(nowAudio + 1.7);
            } catch (err) {}
          }
        }

        if (lightningFlash > 0) {
          lightningFlash -= 0.045;
          ctx.fillStyle = `rgba(224, 242, 254, ${lightningFlash * 0.45})`;
          ctx.fillRect(0, 0, width, height);
        }

        // Mist overlay at the bottom
        ctx.fillStyle = "rgba(148, 163, 184, 0.07)";
        for (let i = 0; i < 3; i++) {
          const shiftMist = (Date.now() * 0.012 * (i + 1)) % width;
          ctx.beginPath();
          ctx.arc(shiftMist, height - 25, 110, 0, Math.PI * 2);
          ctx.arc((shiftMist + width * 0.4) % width, height - 15, 95, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Snow accumulation, cabin glow and breath fog puffs
      if (atmosphere === "snow") {
        // Snow mounds bottom
        ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.quadraticCurveTo(width * 0.28, height - 11, width * 0.55, height - 8);
        ctx.quadraticCurveTo(width * 0.82, height - 14, width, height - 9);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Fireplace hearth glow in bottom-right corner
        const fireplaceFlicker = 0.85 + Math.sin(Date.now() * 0.016) * 0.15;
        const fireplaceGrad = ctx.createRadialGradient(
          width - 15, height - 15, 0,
          width - 15, height - 15, 170
        );
        fireplaceGrad.addColorStop(0, `rgba(234, 88, 12, ${0.45 * fireplaceFlicker})`);
        fireplaceGrad.addColorStop(0.5, `rgba(220, 38, 38, ${0.16 * fireplaceFlicker})`);
        fireplaceGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
        ctx.fillStyle = fireplaceGrad;
        ctx.beginPath();
        ctx.arc(width - 15, height - 15, 170, 0, Math.PI * 2);
        ctx.fill();

        // Breath fog puff generation
        if (!isStatic && Math.random() < 0.004 && breathPuffs.length < 5) {
          breathPuffs.push({
            x: width * 0.15 + Math.random() * 40,
            y: height - 85,
            radius: 8,
            opacity: 0.35,
            growth: 0.3,
            speedY: -0.7,
            speedX: 0.35
          });
        }

        breathPuffs.forEach((puff, pidx) => {
          if (!isStatic) {
            puff.y += puff.speedY;
            puff.x += puff.speedX + Math.sin(Date.now() * 0.003 + pidx) * 0.15;
            puff.radius += puff.growth;
            puff.opacity -= 0.0065;
          }
          if (puff.opacity <= 0) {
            breathPuffs.splice(pidx, 1);
            return;
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${puff.opacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // --- 2. MAIN WEATHER PARTICLES ---
      particles.forEach((p) => {
        if (!isStatic) {
          if (atmosphere === "rain") {
            p.y += p.speed;
            p.x += Math.sin(p.angle) * 0.6;
            if (p.y > height + 25) {
              p.y = -25;
              p.x = Math.random() * width;
            }
          } else if (atmosphere === "snow") {
            p.phase += p.swingSpeed;
            p.y += p.speed;
            p.x += Math.sin(p.phase) * p.swing * 0.45;
            if (p.y > height + 12) {
              p.y = -12;
              p.x = Math.random() * width;
            }
          } else if (atmosphere === "spring") {
            p.phase += p.swingSpeed;
            p.y += p.speed;
            p.x += Math.sin(p.phase) * p.swing * 0.35 + 0.25;
            p.angle += p.rotationSpeed;
            if (p.y > height + 16) {
              p.y = -16;
              p.x = Math.random() * width;
            }
          } else if (atmosphere === "night") {
            p.phase += p.pulseSpeed;
            p.x += p.speedX;
            p.y += p.speedY;
            p.opacity = Math.abs(Math.sin(p.phase)) * p.targetOpacity;
            if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
              p.x = Math.random() * width;
              p.y = Math.random() * height;
            }
          } else if (atmosphere === "forest") {
            p.phase += p.swingSpeed;
            p.y += p.speed;
            p.x += Math.sin(p.phase) * p.swing * 0.3;
            p.angle += p.rotationSpeed;
            if (p.y > height + 20) {
              p.y = -20;
              p.x = Math.random() * width;
            }
          } else if (atmosphere === "sunset") {
            p.y += p.speedY;
            p.x += p.speedX;
            p.life -= p.decay;
            p.opacity = p.life;
            if (p.life <= 0) {
              p.x = Math.random() * width;
              p.y = height + 10;
              p.life = 1.0;
              p.opacity = 1.0;
            }
          } else if (atmosphere === "morning") {
            p.phase += p.speedPhase;
            p.x += p.speedX + Math.sin(p.phase) * 0.05;
            p.y += p.speedY + Math.cos(p.phase) * 0.05;
            if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
              p.x = Math.random() * width;
              p.y = Math.random() * height;
            }
          } else {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
              p.x = Math.random() * width;
              p.y = Math.random() * height;
            }
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;

        if (atmosphere === "rain") {
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.lineWidth = p.width;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.sin(p.angle) * 2, p.y + p.length);
          ctx.stroke();
        } else if (atmosphere === "snow") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (atmosphere === "spring") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(254, 205, 211, ${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius, p.radius * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (atmosphere === "night") {
          const fireflyGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
          fireflyGrad.addColorStop(0, `rgba(253, 224, 71, ${p.opacity})`);
          fireflyGrad.addColorStop(0.3, `rgba(234, 179, 8, ${p.opacity * 0.4})`);
          fireflyGrad.addColorStop(1, "rgba(234, 179, 8, 0)");
          ctx.fillStyle = fireflyGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (atmosphere === "forest") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius, p.radius * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 1.0;
        } else if (atmosphere === "sunset") {
          const emberGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
          emberGrad.addColorStop(0, `rgba(249, 115, 22, ${p.opacity})`);
          emberGrad.addColorStop(0.5, `rgba(239, 68, 68, ${p.opacity * 0.5})`);
          emberGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = emberGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (atmosphere === "morning") {
          const pollenGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
          pollenGrad.addColorStop(0, `rgba(253, 224, 71, ${p.opacity})`);
          pollenGrad.addColorStop(0.5, `rgba(253, 224, 71, ${p.opacity * 0.3})`);
          pollenGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
          ctx.fillStyle = pollenGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Ambient droplets splashes
      if (atmosphere === "rain" && !isStatic) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        for (let i = 0; i < 2; i++) {
          const sx = Math.random() * width;
          const sy = height - 12 - Math.random() * 45;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 3 + Math.random() * 5, 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [atmosphere, accessibility]);

  const lerpColor = (color1: string, color2: string, amount: number) => {
    const parse = (c: string) => {
      if (c.startsWith("#")) {
        let hex = c.slice(1);
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
      return [0, 0, 0];
    };

    const c1 = parse(color1);
    const c2 = parse(color2);

    const r = Math.round(c1[0] + (c2[0] - c1[0]) * amount);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * amount);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * amount);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Condensation for rain */}
      {atmosphere === "rain" && !accessibility.staticBackground && (
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-slate-900/10 to-slate-900/15 backdrop-saturate-150">
          <div className="absolute w-2 h-4 bg-white/20 rounded-full blur-[0.5px] top-[15%] left-[10%] animate-[bounce_8s_infinite_ease-in-out]" />
          <div className="absolute w-1.5 h-3 bg-white/25 rounded-full blur-[0.5px] top-[45%] left-[25%] animate-[bounce_11s_infinite_ease-in-out]" />
          <div className="absolute w-2.5 h-5 bg-white/15 rounded-full blur-[0.5px] top-[25%] left-[70%] animate-[bounce_13s_infinite_ease-in-out]" />
        </div>
      )}

      {/* Ambient glass tint sheen layers */}
      <div
        className="absolute inset-0 transition-opacity duration-[3000ms] pointer-events-none"
        style={{
          background:
            atmosphere === "morning"
              ? "radial-gradient(circle at 15% 15%, rgba(254, 240, 138, 0.15), transparent 60%)"
              : atmosphere === "sunset"
              ? "radial-gradient(circle at 75% 50%, rgba(249, 115, 22, 0.16), rgba(49, 16, 47, 0.05) 80%)"
              : atmosphere === "spring"
              ? "linear-gradient(rgba(253, 164, 175, 0.04), rgba(254, 215, 170, 0.08))"
              : atmosphere === "forest"
              ? "linear-gradient(rgba(16, 185, 129, 0.05), transparent 70%)"
              : "transparent",
        }}
      />
    </div>
  );
};
