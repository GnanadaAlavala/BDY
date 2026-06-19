"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Constants ────────────────────────────────────────────────────────────────

const LIGHT_COLORS = [
  "#FFD700", "#FF6B6B", "#98FB98", "#87CEEB",
  "#DDA0DD", "#FFA500", "#FF69B4", "#00BFFF",
];

const BALLOON_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF6BB5", "#C77DFF", "#FF9F1C", "#2EC4B6",
  "#E63946", "#F4A261",
];

// ─── FairyLights ──────────────────────────────────────────────────────────────

function FairyLights() {
  const count = 11;

  const bezier = (
    t: number,
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number
  ) => ({
    x: (1 - t) ** 2 * p0x + 2 * (1 - t) * t * p1x + t ** 2 * p2x,
    y: (1 - t) ** 2 * p0y + 2 * (1 - t) * t * p1y + t ** 2 * p2y,
  });

  const leftLights = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const pt = bezier(t, 2, 1, 26, 28, 50, 6);
    return { ...pt, color: LIGHT_COLORS[i % LIGHT_COLORS.length] };
  });

  const rightLights = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const pt = bezier(t, 98, 1, 74, 28, 50, 6);
    return { ...pt, color: LIGHT_COLORS[(i + 4) % LIGHT_COLORS.length] };
  });

  const allLights = [
    ...leftLights.map((l, i) => ({ ...l, id: `l-${i}`, delay: i * 0.11 })),
    ...rightLights.map((l, i) => ({ ...l, id: `r-${i}`, delay: i * 0.11 + 0.06 })),
  ];

  return (
    <div className="absolute top-0 inset-x-0 pointer-events-none" style={{ height: "40vh", zIndex: 5 }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M 2,1 Q 26,28 50,6" stroke="rgba(255,240,180,0.18)" strokeWidth="0.28" fill="none" />
        <path d="M 98,1 Q 74,28 50,6" stroke="rgba(255,240,180,0.18)" strokeWidth="0.28" fill="none" />
      </svg>

      {allLights.map((light) => (
        <motion.div
          key={light.id}
          style={{ position: "absolute", left: `${light.x}%`, top: `${light.y}%`, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: light.delay, duration: 0.5, ease: "backOut" }}
        >
          <motion.div
            style={{ width: 11, height: 13, backgroundColor: light.color, borderRadius: "50% 50% 42% 42%" }}
            animate={{
              boxShadow: [
                `0 0 6px 3px ${light.color}55`,
                `0 0 18px 9px ${light.color}99`,
                `0 0 6px 3px ${light.color}55`,
              ],
              opacity: [0.65, 1, 0.65],
            }}
            transition={{
              duration: 1.6 + (parseInt(light.id.split("-")[1]) % 4) * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: light.delay * 0.8,
            }}
          />
          <div style={{ width: 5, height: 4, backgroundColor: "rgba(255,255,200,0.3)", borderRadius: "2px 2px 0 0", margin: "-1px auto 0" }} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Balloons ─────────────────────────────────────────────────────────────────

function Balloons() {
  const balloons = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    x: 3 + ((i * 6.5 + (i % 3) * 4) % 91),
    size: 44 + (i % 3) * 18,
    duration: 8 + (i % 5) * 2.5,
    delay: (i % 6) * 1.1,
    sway: i % 2 === 0 ? 12 : -12,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          style={{ position: "absolute", left: `${b.x}%`, bottom: "-18%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: "-125vh",
            opacity: [0, 1, 1, 1, 0.6, 0],
            x: [0, b.sway, -b.sway * 0.6, b.sway * 0.4, 0],
          }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: b.size, height: b.size * 1.18,
                backgroundColor: b.color,
                borderRadius: "50% 50% 46% 46%",
                position: "relative",
                boxShadow: `inset -${b.size * 0.13}px -${b.size * 0.09}px ${b.size * 0.18}px rgba(0,0,0,0.22), 0 0 ${b.size * 0.3}px ${b.color}44`,
              }}
            >
              <div style={{ position: "absolute", top: "16%", left: "20%", width: "24%", height: "19%", backgroundColor: "rgba(255,255,255,0.42)", borderRadius: "50%", transform: "rotate(-35deg)" }} />
              <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, backgroundColor: b.color, borderRadius: "50%" }} />
            </div>
            <div style={{ width: 1.5, height: b.size * 0.75, background: "linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.08))" }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── LoadingDots ───────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 28 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "white" }}
          animate={{
            opacity: [0.18, 1, 0.18],
            scale: [0.75, 1.35, 0.75],
            boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 14px 5px rgba(255,255,255,0.65)", "0 0 0px rgba(255,255,255,0)"],
          }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.38, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(() => onCompleteRef.current(), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1100);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 15,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 50%, rgba(13,27,100,0.6) 0%, transparent 70%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={`count-${count}`}
            initial={{ scale: 1.8, opacity: 0, filter: "blur(12px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.3, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
          >
            <span
              style={{
                fontSize: "clamp(7rem, 22vw, 16rem)",
                fontWeight: 800,
                fontFamily: '"Playfair Display", serif',
                color: "white",
                lineHeight: 1,
                textShadow:
                  "0 0 60px rgba(255,255,255,0.9), 0 0 120px rgba(180,160,255,0.6), 0 0 200px rgba(180,160,255,0.3)",
                letterSpacing: "-0.04em",
              }}
            >
              {count}
            </span>
            {/* Pulse ring */}
            <motion.div
              style={{
                width: 140, height: 140,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.35)",
                position: "absolute",
              }}
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontSize: "clamp(3rem, 10vw, 8rem)",
                fontWeight: 800,
                fontFamily: '"Playfair Display", serif',
                color: "white",
                lineHeight: 1,
                textShadow:
                  "0 0 50px rgba(255,200,100,1), 0 0 100px rgba(255,200,100,0.6), 0 0 180px rgba(255,200,100,0.3)",
                letterSpacing: "-0.02em",
              }}
            >
              ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#FFD700", "#FF6B6B", "#98FB98", "#87CEEB", "#DDA0DD", "#FF69B4", "#FFA500", "#00CED1"];

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      color: string; w: number; h: number;
      rotation: number; rotSpeed: number; opacity: number;
    }

    const particles: Particle[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 600,
      vx: (Math.random() - 0.5) * 3.5,
      vy: 1.8 + Math.random() * 3.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      w: 8 + Math.random() * 10, h: 3 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.14,
      opacity: 0.7 + Math.random() * 0.3,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed; p.vy += 0.025;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; p.vy = 1.8 + Math.random() * 3.5; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30 }} />;
}

// ─── MusicPlayer ──────────────────────────────────────────────────────────────

function MusicPlayer({ playing }: { playing: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [playing]);
  return (
    <audio ref={audioRef} loop preload="auto">
      <source src="https://assets.mixkit.co/music/preview/mixkit-birthday-party-happy-1.mp3" type="audio/mpeg" />
    </audio>
  );
}

// ─── MusicVisualizer ──────────────────────────────────────────────────────────

function MusicVisualizer() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 52, justifyContent: "center" }}>
      {Array.from({ length: 14 }, (_, i) => (
        <motion.div
          key={i}
          style={{ width: 6, backgroundColor: "#FF69B4", borderRadius: 3 }}
          animate={{
            height: [5, 14 + Math.abs(Math.sin(i * 0.9)) * 28, 5],
            boxShadow: ["0 0 4px rgba(255,105,180,0.4)", "0 0 14px 4px rgba(255,105,180,0.9)", "0 0 4px rgba(255,105,180,0.4)"],
          }}
          transition={{ duration: 0.65 + (i % 5) * 0.13, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }}
        />
      ))}
    </div>
  );
}

// ─── NextButton ───────────────────────────────────────────────────────────────

function NextButton({ onClick, label = "Continue →" }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        padding: "15px 48px", borderRadius: 999,
        backgroundColor: "white", color: "#050508",
        fontSize: "1.05rem", fontWeight: 700,
        letterSpacing: "0.06em", fontFamily: '"Lato", sans-serif',
        border: "none", cursor: "pointer", position: "relative", zIndex: 10,
        boxShadow: "0 0 22px 7px rgba(255,255,255,0.22), 0 4px 22px rgba(0,0,0,0.5)",
        textTransform: "uppercase",
      }}
      whileHover={{ scale: 1.07, boxShadow: "0 0 42px 16px rgba(255,255,255,0.45), 0 4px 28px rgba(0,0,0,0.5)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 340, damping: 20 }}
    >
      {label}
    </motion.button>
  );
}

// ─── StageScreen ──────────────────────────────────────────────────────────────

function StageScreen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      initial={{ opacity: 0, y: 44, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -32, scale: 1.03 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Heading ──────────────────────────────────────────────────────────────────

function Heading({ text, glow = false, pink = false }: { text: string; glow?: boolean; pink?: boolean }) {
  const shadow = pink
    ? "0 0 40px rgba(255,105,180,0.9), 0 0 80px rgba(255,105,180,0.5), 0 0 140px rgba(255,105,180,0.2)"
    : glow
    ? "0 0 40px rgba(255,255,255,0.9), 0 0 90px rgba(255,255,255,0.45), 0 0 140px rgba(255,255,255,0.2)"
    : "0 0 28px rgba(255,255,255,0.2)";
  return (
    <h1
      style={{
        fontSize: "clamp(2.1rem, 5.5vw, 5.2rem)", fontWeight: 700,
        color: "white", textAlign: "center", padding: "0 1.5rem",
        fontFamily: '"Playfair Display", serif',
        textShadow: shadow,
        letterSpacing: "-0.02em", lineHeight: 1.22, maxWidth: 880,
      }}
    >
      {text}
    </h1>
  );
}

// ─── CurtainPanel ─────────────────────────────────────────────────────────────

function CurtainPanel({ side, open }: { side: "left" | "right"; open: boolean }) {
  const isLeft = side === "left";

  return (
    <motion.div
      style={{
        position: "absolute",
        [isLeft ? "left" : "right"]: 0,
        top: 0, bottom: 0,
        width: "51%",
        zIndex: 20,
        overflow: "hidden",
        // Rich velvet texture via layered gradients
        background: isLeft
          ? "linear-gradient(to right, #0e0120 0%, #1a0340 30%, #2a0a65 60%, #1e0550 80%, #0e0120 100%)"
          : "linear-gradient(to left,  #0e0120 0%, #1a0340 30%, #2a0a65 60%, #1e0550 80%, #0e0120 100%)",
      }}
      // Curtains start closed, sweep open
      animate={{ x: open ? (isLeft ? "-102%" : "102%") : "0%" }}
      transition={{
        duration: 3.8,
        ease: [0.76, 0, 0.24, 1], // heavy theatrical ease: slow start, accelerate, drift to stop
        delay: 0,
      }}
    >
      {/* Velvet fold highlights */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: 0, bottom: 0,
            [isLeft ? "left" : "right"]: `${8 + i * 11}%`,
            width: 3,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.28), rgba(255,255,255,0.04))",
          }}
        />
      ))}

      {/* Sheen on inner face */}
      <div
        style={{
          position: "absolute", top: 0, bottom: 0,
          [isLeft ? "right" : "left"]: 0,
          width: "30%",
          background: isLeft
            ? "linear-gradient(to right, rgba(255,255,255,0.0), rgba(255,255,255,0.06))"
            : "linear-gradient(to left,  rgba(255,255,255,0.0), rgba(255,255,255,0.06))",
        }}
      />

      {/* Gold braid on inner edge */}
      <div
        style={{
          position: "absolute", top: 0, bottom: 0,
          [isLeft ? "right" : "left"]: 0,
          width: 7,
          background: "linear-gradient(to bottom, #6B4C00, #FFD700, #DAA520, #FFD700, #8B6200)",
          boxShadow: isLeft ? "3px 0 18px rgba(255,215,0,0.55)" : "-3px 0 18px rgba(255,215,0,0.55)",
        }}
      />

      {/* Valance at top */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 28,
          background: "linear-gradient(to bottom, rgba(255,215,0,0.18), transparent)",
          borderBottom: "1px solid rgba(255,215,0,0.25)",
        }}
      />

      {/* Bottom gold trim */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 10,
          background: "linear-gradient(to right, #6B4C00, #FFD700, #DAA520, #FFD700, #6B4C00)",
        }}
      />
    </motion.div>
  );
}

// ─── CurtainAnimation ─────────────────────────────────────────────────────────

function CurtainAnimation() {
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Brief pause before curtains start to move — builds anticipation
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) {
      // Confetti fires after curtains are most of the way open (~3s into animation)
      const t = setTimeout(() => setShowConfetti(true), 3200);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Final wish rendered behind curtain */}
      <FinalWish />

      {showConfetti && <Confetti />}

      {/* Curtain panels */}
      <CurtainPanel side="left" open={open} />
      <CurtainPanel side="right" open={open} />

      {/* Center seam glow — fades once curtains begin moving */}
      <motion.div
        style={{
          position: "absolute", left: "50%", top: 0, bottom: 0,
          width: 3, transform: "translateX(-50%)",
          background: "rgba(255,215,0,0.75)",
          boxShadow: "0 0 28px 12px rgba(255,215,0,0.5)",
          zIndex: 21,
        }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.8, delay: open ? 0.4 : 0 }}
      />
    </div>
  );
}

// ─── FinalWish ────────────────────────────────────────────────────────────────

function FinalWish() {
  return (
    <div
      style={{
        position: "relative", zIndex: 5,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "100vh", textAlign: "center", padding: "2rem 1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <h1
          style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)", fontWeight: 800,
            color: "white", fontFamily: '"Playfair Display", serif',
            textShadow:
              "0 0 40px rgba(255,105,180,1), 0 0 90px rgba(255,105,180,0.6), 0 0 160px rgba(255,105,180,0.25)",
            letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: "2rem",
          }}
        >
          Happy Birthday ❤️
        </h1>

        <motion.p
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.35rem)", color: "rgba(255,255,255,0.78)",
            maxWidth: 620, lineHeight: 1.85,
            fontFamily: '"Lato", sans-serif', fontWeight: 300, margin: "0 auto",
          }}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        >
          On this magical day, I want you to know just how special you are to me.
          May every moment be filled with the joy, warmth, and love you so beautifully deserve.
          You light up every room you walk into — and you light up my world.{" "}
          <em style={{ color: "#FFB6C1" }}>With all my heart. 🌸</em>
        </motion.p>

        <motion.div
          style={{
            marginTop: "3rem", display: "flex", gap: "1.6rem",
            justifyContent: "center", fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          {["✨", "🎂", "✨", "🎁", "✨"].map((icon, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 2.2 + i * 0.28, repeat: Infinity, ease: "easeInOut", delay: i * 0.32 }}
            >
              {icon}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

type AppStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | "countdown" | 8;

export default function App() {
  const [stage, setStage] = useState<AppStage>(1);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const nextStage = useCallback(() => {
    setStage((s) => {
      if (s === 7) return "countdown"; // intercept: show countdown first
      const next = (s as number) + 1;
      if (next === 5) setMusicPlaying(true);
      return next as AppStage;
    });
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setStage(8);
  }, []);

  const background =
    stage === 4 || stage === 5 || stage === 6 || stage === 7 || stage === "countdown" || stage === 8
      ? "radial-gradient(ellipse at 50% 0%, #0e1d6b 0%, #060c2a 45%, #030410 100%)"
      : "radial-gradient(ellipse at 50% 25%, #0e0820 0%, #050508 100%)";

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", background, overflow: "hidden", transition: "background 1.8s ease" }}>
      <MusicPlayer playing={musicPlaying} />

      {/* Stage 5 pink ambient */}
      {stage === 5 && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(255,50,150,0.1) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />
      )}

      {/* Fairy lights — stages 4 through 7 / countdown */}
      <AnimatePresence>
        {(stage === 4 || stage === 5 || stage === 6 || stage === 7 || stage === "countdown") && (
          <motion.div
            key="fairy-lights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6 }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <FairyLights />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Balloons — ONLY stage 6, exit instantly so they don't bleed into stage 7 */}
      <AnimatePresence>
        {stage === 6 && (
          <motion.div
            key="balloons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} // near-instant exit
          >
            <Balloons />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown overlay — sits above stage 7 content */}
      <AnimatePresence>
        {stage === "countdown" && (
          <Countdown key="countdown" onComplete={handleCountdownComplete} />
        )}
      </AnimatePresence>

      {/* Main stage content */}
      <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
        <AnimatePresence mode="wait">

          {stage === 1 && (
            <StageScreen key="s1">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
                <Heading text="It's Your Special Day ✨" />
                <NextButton onClick={nextStage} />
              </div>
            </StageScreen>
          )}

          {stage === 2 && (
            <StageScreen key="s2">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
                <Heading text="Have A Look At It 👀" />
                <NextButton onClick={nextStage} />
              </div>
            </StageScreen>
          )}

          {stage === 3 && (
            <StageScreen key="s3">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
                <motion.div
                  animate={{ filter: ["drop-shadow(0 0 18px rgba(255,210,80,0.3))", "drop-shadow(0 0 55px rgba(255,210,80,0.85))", "drop-shadow(0 0 18px rgba(255,210,80,0.3))"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heading text="Ready For The Surprise? 🎁" glow />
                </motion.div>
                <NextButton onClick={nextStage} />
              </div>
            </StageScreen>
          )}

          {stage === 4 && (
            <StageScreen key="s4">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48, marginTop: "8vh" }}>
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heading text="The Stage Is Set !!" glow />
                </motion.div>
                <NextButton onClick={nextStage} />
              </div>
            </StageScreen>
          )}

          {stage === 5 && (
            <StageScreen key="s5">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
                <Heading text="Music Makes It Better 🎵" />
                <MusicVisualizer />
                <NextButton onClick={nextStage} />
              </div>
            </StageScreen>
          )}

          {stage === 6 && (
            <StageScreen key="s6">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48, position: "relative", zIndex: 10 }}>
                <Heading text="Let Colors Fly 🎈" />
                <NextButton onClick={nextStage} />
              </div>
            </StageScreen>
          )}

          {stage === 7 && (
            <StageScreen key="s7">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <Heading text="Almost There ⏳" />
                <LoadingDots />
                <div style={{ marginTop: 28 }}>
                  <NextButton onClick={nextStage} label="Reveal The Surprise →" />
                </div>
              </div>
            </StageScreen>
          )}

          {/* Stage 7 stays visible under countdown — countdown is an overlay, not a replacement */}
          {stage === "countdown" && (
            <StageScreen key="s7-under">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <Heading text="Almost There ⏳" />
                <LoadingDots />
              </div>
            </StageScreen>
          )}

          {stage === 8 && (
            <motion.div
              key="s8"
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CurtainAnimation />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Mute / unmute */}
      <AnimatePresence>
        {stage !== 1 && stage !== 2 && stage !== 3 && musicPlaying !== undefined && (stage as number) >= 5 && (
          <motion.button
            key="mute-btn"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
            onClick={() => setMusicPlaying((m) => !m)}
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 50,
              width: 50, height: 50, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white", fontSize: "1.25rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(255,255,255,0.12)",
            }}
          >
            {musicPlaying ? "🔊" : "🔇"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
