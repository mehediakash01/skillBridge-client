"use client"

// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform, easeOut } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Home, Search, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Floating particle ───────────────────────────────────────────────────────
function Particle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-indigo-400/20 pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0.5],
        y: [0, -60, -120],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  )
}

// ─── Glitch text effect ───────────────────────────────────────────────────────
function GlitchText() {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const trigger = () => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 400)
    }
    const id = setInterval(trigger, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative select-none">
      <style>{`
        @keyframes glitch-1 {
          0%,100% { clip-path: inset(0 0 90% 0); transform: translate(-4px, 0); }
          25% { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
          50% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
          75% { clip-path: inset(80% 0 5% 0); transform: translate(3px, 0); }
        }
        @keyframes glitch-2 {
          0%,100% { clip-path: inset(80% 0 5% 0); transform: translate(4px, 0); }
          25% { clip-path: inset(10% 0 70% 0); transform: translate(-4px, 0); }
          50% { clip-path: inset(50% 0 30% 0); transform: translate(2px, 0); }
          75% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 0); }
        }
        .glitch-1 { animation: glitch-1 0.35s steps(1) forwards; }
        .glitch-2 { animation: glitch-2 0.35s steps(1) forwards; }
      `}</style>

      {/* Main text */}
      <span
        className="block font-display text-[clamp(7rem,22vw,16rem)] font-bold leading-none tracking-tighter"
        style={{
          fontFamily: "'Clash Display', sans-serif",
          background: "linear-gradient(135deg, #4f46e5 0%, #818cf8 50%, #f97316 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </span>

      {/* Glitch layers */}
      {glitching && (
        <>
          <span
            className="glitch-1 absolute inset-0 block font-display text-[clamp(7rem,22vw,16rem)] font-bold leading-none tracking-tighter text-cyan-400/80 pointer-events-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
            aria-hidden
          >
            404
          </span>
          <span
            className="glitch-2 absolute inset-0 block font-display text-[clamp(7rem,22vw,16rem)] font-bold leading-none tracking-tighter text-rose-400/80 pointer-events-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
            aria-hidden
          >
            404
          </span>
        </>
      )}
    </div>
  )
}

// ─── Tilt card wrapper ─────────────────────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }}
      className="cursor-default"
    >
      {children}
    </motion.div>
  )
}

// ─── Orbiting ring ─────────────────────────────────────────────────────────────
function OrbitRing({ radius, duration, color, size = 8 }: { radius: number; duration: number; color: string; size?: number }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute rounded-full border border-dashed opacity-20"
        style={{ width: radius * 2, height: radius * 2, borderColor: color }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          top: `calc(50% - ${radius}px - ${size / 2}px)`,
          opacity: 0.7,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
    </motion.div>
  )
}

// ─── Main 404 page ─────────────────────────────────────────────────────────────
export default function NotFound() {
  const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${20 + Math.random() * 60}%`,
    size: 4 + Math.random() * 10,
    delay: i * 0.4,
  }))

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
    >
      {/* ── Background layers ── */}
      {/* Base */}
      <div className="absolute inset-0 bg-[#09090f]" />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(79,70,229,0.15)_0%,transparent_70%)]" />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

      {/* Particles */}
      {PARTICLES.map((p) => (
        <Particle key={p.id} x={p.x} y={p.y} size={p.size} delay={p.delay} />
      ))}

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Orbit rings behind number */}
        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <OrbitRing radius={110} duration={14} color="#4f46e5" size={10} />
            <OrbitRing radius={155} duration={22} color="#f97316" size={7} />
            <OrbitRing radius={195} duration={30} color="#818cf8" size={5} />
          </div>

          {/* 3D tilt + glitch number */}
          <motion.div variants={fadeUp}>
            <TiltCard>
              <GlitchText />
            </TiltCard>
          </motion.div>
        </div>

        {/* Label pill */}
        <motion.div variants={fadeUp}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Page Not Found
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight max-w-lg"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          Looks like you've drifted{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #818cf8, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            off course
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          className="text-slate-400 text-base leading-relaxed max-w-md mb-10"
        >
          The resource you're looking for doesn't exist or has been moved.
          Let's get you back to somewhere useful.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <Link href="/">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-sm font-semibold gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/tutors">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-sm font-semibold gap-2 border-slate-700 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-slate-500 hover:text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              Browse Tutors
            </Button>
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex items-center gap-4 text-slate-600 text-xs"
        >
          <span className="h-px w-16 bg-slate-800" />
          or try searching
          <span className="h-px w-16 bg-slate-800" />
        </motion.div>

        {/* Search hint */}
        <motion.div variants={fadeUp} className="mt-4">
          <Link href="/tutors">
            <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-slate-800 bg-white/3 hover:bg-white/6 hover:border-slate-600 transition-all duration-300 cursor-pointer group">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span className="text-slate-500 text-sm group-hover:text-slate-300 transition-colors">Search for tutors or subjects…</span>
              <kbd className="ml-2 px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 text-[10px] font-mono border border-slate-700">↵</kbd>
            </div>
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div variants={fadeUp} className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back to previous page
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#09090f] to-transparent pointer-events-none" />
    </div>
  )
}