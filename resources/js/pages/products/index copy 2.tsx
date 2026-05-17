import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  Github, Linkedin, Facebook, Mail, ExternalLink, ArrowRight,
  Code2, Layers, Shield, Brain, Cpu, Globe, Star, Zap,
  BookOpen, Terminal, Figma, Database, ChevronDown, Menu, X,
  Sparkles, Rocket, Target, GraduationCap, MapPin, Download,
  Coffee, Heart, Send, CheckCircle, Circle, ArrowUpRight
} from "lucide-react";

/* ─────────────────────────────────────────────
   DESIGN LANGUAGE
   ─────────────────────────────────────────────
   Font: Syne (display) + DM Sans (body)
   Palette: Near-black #020617, Blue #3B82F6,
            Cyan #06B6D4, Violet #7C3AED accent
   Motion: physics-spring easing, stagger reveals
   Aesthetic: Precision-dark / editorial-futuristic
   Signature: large kinetic number labels,
              diagonal accent lines, bleed grids
───────────────────────────────────────────── */

// ── Google Fonts injection ──────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #020617;
      --surface: #0a1628;
      --surface2: #0f1e35;
      --blue: #3B82F6;
      --cyan: #06B6D4;
      --violet: #7C3AED;
      --text: #F1F5F9;
      --muted: #64748B;
      --faint: #1e293b;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', system-ui, sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 99px; }

    ::selection { background: rgba(59,130,246,0.3); color: #fff; }

    .syne { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    /* Noise overlay for premium texture */
    .noise::after {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9999; opacity: 0.4;
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-12px) rotate(0.5deg); }
      66% { transform: translateY(-6px) rotate(-0.5deg); }
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.2); }
      50% { box-shadow: 0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(6,182,212,0.2); }
    }

    @keyframes blink-cursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .cursor { animation: blink-cursor 1s step-end infinite; }

    .gradient-text {
      background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #7C3AED 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient-shift 4s ease infinite;
    }

    .glow-blue { box-shadow: 0 0 30px rgba(59,130,246,0.25); }
    .glow-cyan { box-shadow: 0 0 30px rgba(6,182,212,0.25); }

    .glass {
      background: rgba(15,30,53,0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(59,130,246,0.1);
    }

    .glass-strong {
      background: rgba(10,22,40,0.8);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(59,130,246,0.15);
    }

    .card-3d {
      transform-style: preserve-3d;
      perspective: 1000px;
      transition: transform 0.4s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3B82F6, #06B6D4);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #06B6D4, #3B82F6);
      opacity: 0; transition: opacity 0.3s;
    }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(59,130,246,0.4); }

    .skill-card:hover { border-color: var(--blue); }

    input, textarea {
      background: rgba(15,30,53,0.8) !important;
      border: 1px solid rgba(59,130,246,0.15) !important;
      color: #f1f5f9 !important;
      transition: border-color 0.25s, box-shadow 0.25s !important;
      border-radius: 12px !important;
    }
    input:focus, textarea:focus {
      outline: none !important;
      border-color: rgba(59,130,246,0.5) !important;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.08) !important;
    }
    input::placeholder, textarea::placeholder { color: #475569 !important; }
  `}</style>
);

// ── Reusable motion variants ─────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ── Intersection reveal hook ─────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px", amount: threshold });
  return [ref, inView];
}

// ── Particle Background ──────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? "59,130,246" : "6,182,212",
    }));
    let frame;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(render);
    };
    render();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.7 }} />;
}

// ── Typewriter ───────────────────────────────
function Typewriter({ words, speed = 75, pause = 2000 }) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const cur = words[wordIdx];
    let t;
    if (!deleting && charIdx < cur.length) {
      t = setTimeout(() => setCharIdx(i => i + 1), speed);
    } else if (!deleting && charIdx === cur.length) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      t = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(cur.slice(0, charIdx));
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return (
    <span>
      <span className="gradient-text">{display}</span>
      <span className="cursor text-blue-400">|</span>
    </span>
  );
}

// ── Section wrapper ──────────────────────────
function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`relative ${className}`}>
      {children}
    </section>
  );
}

// ── Label pill ───────────────────────────────
function Label({ children }) {
  return (
    <motion.div
      variants={fadeUp}
      className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      <span className="mono text-xs text-blue-400 tracking-[0.2em] uppercase">{children}</span>
    </motion.div>
  );
}

// ── Section heading ──────────────────────────
function Heading({ number, title, sub }) {
  return (
    <div className="mb-16">
      <span className="mono text-[80px] font-bold leading-none text-transparent syne"
        style={{ WebkitTextStroke: "1px rgba(59,130,246,0.12)", userSelect: "none" }}>
        {number}
      </span>
      <h2 className="syne text-4xl md:text-5xl font-bold text-white -mt-8 mb-4">{title}</h2>
      {sub && <p className="text-slate-400 text-lg max-w-xl leading-relaxed">{sub}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  const links = ["About", "Skills", "Projects", "Education", "Goals", "Contact"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ["hero", ...links.map(l => l.toLowerCase())];
      const cur = sections.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 100 && r.bottom >= 100;
      });
      if (cur) setActive(cur);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-3 shadow-2xl shadow-black/50" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => go("hero")} className="syne font-bold text-lg group">
            <span className="text-blue-400 group-hover:text-cyan-400 transition-colors">&lt;</span>
            <span className="gradient-text">Momin</span>
            <span className="text-blue-400 group-hover:text-cyan-400 transition-colors"> /&gt;</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button
                key={l}
                onClick={() => go(l.toLowerCase())}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  active === l.toLowerCase() ? "text-blue-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {active === l.toLowerCase() && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-blue-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative">{l}</span>
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => go("contact")}
              className="btn-primary ml-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white relative z-10"
            >
              Hire Me →
            </motion.button>
          </div>

          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}
            className="fixed top-16 left-4 right-4 z-40 glass-strong rounded-2xl p-4 flex flex-col gap-1"
          >
            {links.map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())}
                className="text-left px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                {l}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const socials = [
    { icon: <Github size={18} />, href: "https://github.com", label: "GitHub" },
    { icon: <Linkedin size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Facebook size={18} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Mail size={18} />, href: "mailto:mominul.cse21@gmail.com", label: "Email" },
  ];

  return (
    <Section id="hero" className="min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", animation: "float-slow 10s ease-in-out infinite reverse" }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)" }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div variants={stagger(0.12)} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="mono text-xs text-green-400 tracking-widest">AVAILABLE FOR OPPORTUNITIES</span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h1 className="syne text-6xl md:text-7xl xl:text-8xl font-extrabold leading-[0.9] mb-6 tracking-tight">
                <span className="block text-white">Hi, I'm</span>
                <span className="block gradient-text mt-1">Momin</span>
                <span className="block text-white">Islam</span>
              </h1>
            </motion.div>

            <motion.div variants={fadeUp} className="text-2xl md:text-3xl font-medium text-slate-300 mb-4 h-10">
              <Typewriter words={["Front-End Developer", "CSE Student", "Future Researcher", "Problem Solver", "UI Craftsman"]} />
            </motion.div>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              Building digital experiences with <span className="text-blue-400">code</span>,{" "}
              <span className="text-cyan-400">curiosity</span>, and{" "}
              <span className="text-violet-400">creativity</span>. Final-year CSE student exploring the frontiers of AI and cybersecurity.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary px-8 py-4 rounded-2xl font-semibold text-white text-sm flex items-center gap-2 relative z-10 shadow-lg shadow-blue-500/20"
              >
                <Sparkles size={16} />
                View Projects
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="glass px-8 py-4 rounded-2xl font-semibold text-slate-300 text-sm flex items-center gap-2 hover:text-white hover:border-blue-500/30 transition-all"
              >
                <Download size={16} />
                Download Resume
              </motion.button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 mono tracking-widest mr-1">FIND ME ON</span>
              {socials.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — avatar + floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center items-center relative"
          >
            {/* Main avatar ring */}
            <div className="relative" style={{ animation: "float-slow 6s ease-in-out infinite" }}>
              <div className="w-72 h-72 rounded-full glass-strong flex items-center justify-center relative"
                style={{ animation: "pulse-glow 4s ease-in-out infinite" }}>
                {/* Rotating ring */}
                <div className="absolute inset-0 rounded-full border border-blue-500/20"
                  style={{ animation: "spin-slow 20s linear infinite" }}>
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <div key={deg} className="absolute w-1.5 h-1.5 rounded-full bg-blue-500/50"
                      style={{
                        top: "50%", left: "50%",
                        transform: `rotate(${deg}deg) translateX(135px) translateY(-50%)`,
                      }} />
                  ))}
                </div>
                {/* Avatar */}
                <div className="w-52 h-52 rounded-full overflow-hidden relative">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-7xl font-black syne"
                    style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)" }}>
                    <span className="gradient-text">MI</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              {[
                { label: "React Dev", icon: <Code2 size={14} />, pos: "-top-6 -left-8", color: "blue" },
                { label: "AI Explorer", icon: <Brain size={14} />, pos: "-top-6 -right-8", color: "violet" },
                { label: "CSE '26", icon: <GraduationCap size={14} />, pos: "-bottom-6 -left-8", color: "cyan" },
                { label: "Open to Work", icon: <Rocket size={14} />, pos: "-bottom-6 -right-8", color: "green" },
              ].map(b => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", bounce: 0.5 }}
                  className={`absolute ${b.pos} glass rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xl`}
                >
                  <span className={`text-${b.color}-400`}>{b.icon}</span>
                  <span className="text-xs font-semibold text-white whitespace-nowrap">{b.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="mono text-xs text-slate-600 tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-slate-600"
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════
function About() {
  const [ref, inView] = useReveal();

  const timeline = [
    {
      year: "2019", icon: <Terminal size={18} />, color: "blue",
      title: "First Lines of Code",
      desc: "Discovered HTML & CSS. Built my first webpage and felt the magic of making things appear on screen.",
    },
    {
      year: "2021", icon: <Layers size={18} />, color: "cyan",
      title: "Going Deeper",
      desc: "Diploma in Computer Technology. Learned JavaScript, databases, and fell in love with the web stack.",
    },
    {
      year: "2022", icon: <Code2 size={18} />, color: "violet",
      title: "React & Modern Dev",
      desc: "Started B.Sc. in CSE. Mastered React, Tailwind CSS, and modern UI engineering principles.",
    },
    {
      year: "2024", icon: <Zap size={18} />, color: "blue",
      title: "Shipping Real Products",
      desc: "Built BookSwap and the E-Voting system. Started working with teams and shipping production code.",
    },
    {
      year: "2026→", icon: <Brain size={18} />, color: "cyan",
      title: "AI + Cybersecurity Frontier",
      desc: "Final year. Eyes on research, higher studies abroad, and the intersection of AI and security.",
    },
  ];

  const colorMap = { blue: "#3B82F6", cyan: "#06B6D4", violet: "#7C3AED", green: "#22C55E" };

  return (
    <Section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div variants={stagger(0.1)} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}><Label>My Story</Label></motion.div>
          <motion.div variants={fadeUp}><Heading number="01" title="About Me" sub="A journey from curiosity to craftsmanship." /></motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left — story */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="glass rounded-2xl p-8 space-y-5">
                <p className="text-slate-300 leading-relaxed text-lg">
                  I'm <span className="text-white font-semibold">Momin Islam</span>, a final-year CSE student at First Capital University of Bangladesh — a developer who believes great software is equal parts <span className="text-blue-400">craft</span> and <span className="text-cyan-400">empathy</span>.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  My path started with raw curiosity. I taught myself HTML, then CSS, then JavaScript — each layer revealing a new world. Today I specialize in React and modern front-end development, but my hunger pushes me toward the frontiers of AI and cybersecurity.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Beyond code, I've trained 100+ youth participants in green entrepreneurship and digital literacy, run a sustainable agro-farm, and contributed to British Council programs. I believe technology is most powerful when it <span className="text-violet-400">empowers communities</span>.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "3+", label: "Years Building" },
                  { num: "5+", label: "Projects Shipped" },
                  { num: "100+", label: "Youth Trained" },
                ].map(s => (
                  <motion.div key={s.label} whileHover={{ y: -4 }}
                    className="glass rounded-2xl p-5 text-center group">
                    <p className="syne text-3xl font-bold gradient-text mb-1">{s.num}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Entrepreneurship", "Youth Leadership", "UI Design", "Research", "Agro-Tech"].map(tag => (
                  <span key={tag} className="glass px-4 py-2 rounded-full text-xs text-slate-400 border border-slate-700/50">{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* Right — timeline */}
            <motion.div variants={stagger(0.15)} initial="hidden" animate={inView ? "show" : "hidden"} className="relative">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-transparent" />
              {timeline.map((t, i) => (
                <motion.div key={t.year} variants={fadeUp} className="relative pl-16 pb-10 last:pb-0 group">
                  <div className="absolute left-3.5 w-5 h-5 rounded-full flex items-center justify-center -translate-x-1/2"
                    style={{ background: colorMap[t.color] + "20", border: `1px solid ${colorMap[t.color]}40` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: colorMap[t.color] }} />
                  </div>
                  <motion.div whileHover={{ x: 4 }} className="glass rounded-2xl p-5 transition-all group-hover:border-blue-500/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span style={{ color: colorMap[t.color] }}>{t.icon}</span>
                        <span className="font-semibold text-white text-sm">{t.title}</span>
                      </div>
                      <span className="mono text-xs font-bold" style={{ color: colorMap[t.color] }}>{t.year}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════
function Skills() {
  const [ref, inView] = useReveal();
  const [active, setActive] = useState("Frontend");

  const categories = {
    Frontend: [
      { name: "React", level: 85, icon: <Code2 size={20} />, color: "#61DAFB" },
      { name: "JavaScript", level: 82, icon: <Zap size={20} />, color: "#F7DF1E" },
      { name: "Tailwind CSS", level: 90, icon: <Layers size={20} />, color: "#06B6D4" },
      { name: "HTML & CSS", level: 95, icon: <Globe size={20} />, color: "#E44D26" },
      { name: "Figma / UI", level: 75, icon: <Figma size={20} />, color: "#A259FF" },
    ],
    Tools: [
      { name: "Git & GitHub", level: 80, icon: <Github size={20} />, color: "#F05032" },
      { name: "VS Code", level: 88, icon: <Terminal size={20} />, color: "#007ACC" },
      { name: "MongoDB", level: 65, icon: <Database size={20} />, color: "#22C55E" },
      { name: "MySQL", level: 70, icon: <Database size={20} />, color: "#4479A1" },
    ],
    Exploring: [
      { name: "Laravel", level: 35, icon: <Code2 size={20} />, color: "#FF2D20" },
      { name: "Artificial Intelligence", level: 28, icon: <Brain size={20} />, color: "#7C3AED" },
      { name: "Cybersecurity", level: 22, icon: <Shield size={20} />, color: "#06B6D4" },
      { name: "Machine Learning", level: 18, icon: <Cpu size={20} />, color: "#3B82F6" },
    ],
  };

  const accentColor = active === "Frontend" ? "#3B82F6" : active === "Tools" ? "#06B6D4" : "#7C3AED";

  return (
    <Section id="skills" className="py-32 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div variants={stagger(0.1)} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}><Label>What I Know</Label></motion.div>
          <motion.div variants={fadeUp}><Heading number="02" title="Skills & Expertise" sub="Technologies I wield and frontiers I'm conquering." /></motion.div>

          {/* Tab switcher */}
          <motion.div variants={fadeUp} className="flex gap-2 mb-12 flex-wrap">
            {Object.keys(categories).map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active === cat ? "text-white" : "glass text-slate-400 hover:text-white"
                }`}
                style={active === cat ? { background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`, border: `1px solid ${accentColor}40` } : {}}
              >
                {active === cat && (
                  <motion.div layoutId="skill-tab" className="absolute inset-0 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}05)`, border: `1px solid ${accentColor}30` }}
                    transition={{ type: "spring", bounce: 0.2 }} />
                )}
                <span className="relative">{cat}</span>
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
              className="grid md:grid-cols-2 gap-5"
            >
              {categories[active].map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="glass rounded-2xl p-6 skill-card transition-all cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: skill.color + "15", color: skill.color }}>
                        {skill.icon}
                      </div>
                      <span className="font-semibold text-white">{skill.name}</span>
                    </div>
                    <span className="mono text-sm font-bold" style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════
function Projects() {
  const [ref, inView] = useReveal();
  const [hovered, setHovered] = useState(null);

  const projects = [
    {
      id: 0,
      num: "01",
      title: "BookSwap",
      tagline: "Connect readers. Exchange books.",
      desc: "A community platform where book lovers can exchange titles, discover new reads, and connect with fellow readers through a clean, intuitive interface.",
      tech: ["Next.js", "Tailwind CSS", "MongoDB", "Node.js"],
      features: ["Book listings", "User messaging", "Community feed"],
      gradient: "from-blue-500/20 to-cyan-500/10",
      accent: "#3B82F6",
      icon: <BookOpen size={28} />,
      github: "#",
      live: "#",
      status: "Completed",
    },
    {
      id: 1,
      num: "02",
      title: "Laravel E-Voting",
      tagline: "Secure. Transparent. Democratic.",
      desc: "A full-stack online voting platform with OTP-based voter verification, real-time results, admin dashboard, and candidate management built for institutional use.",
      tech: ["Laravel", "MySQL", "Tailwind CSS", "PHP"],
      features: ["OTP verification", "Admin dashboard", "Live results"],
      gradient: "from-cyan-500/20 to-violet-500/10",
      accent: "#06B6D4",
      icon: <Shield size={28} />,
      github: "#",
      live: "#",
      status: "Completed",
    },
    {
      id: 2,
      num: "03",
      title: "AI + Cyber Research",
      tagline: "The frontier begins here.",
      desc: "An ongoing research direction exploring the intersection of artificial intelligence and cybersecurity — threat detection, adversarial ML, and AI-powered defense systems.",
      tech: ["Python", "Research", "AI/ML", "Security"],
      features: ["Threat modeling", "Adversarial ML", "Defense AI"],
      gradient: "from-violet-500/20 to-blue-500/10",
      accent: "#7C3AED",
      icon: <Brain size={28} />,
      github: "#",
      live: null,
      status: "In Progress",
    },
  ];

  return (
    <Section id="projects" className="py-32 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div variants={stagger(0.1)} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}><Label>What I've Built</Label></motion.div>
          <motion.div variants={fadeUp}><Heading number="03" title="Featured Projects" sub="A curated selection of work I'm proud of." /></motion.div>

          <div className="space-y-8">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                variants={scaleIn}
                onHoverStart={() => setHovered(p.id)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -6 }}
                className="relative glass rounded-3xl overflow-hidden transition-all duration-500 cursor-default"
                style={{
                  borderColor: hovered === p.id ? p.accent + "40" : "rgba(59,130,246,0.1)",
                  boxShadow: hovered === p.id ? `0 20px 60px ${p.accent}15` : "none",
                }}
              >
                {/* gradient wash */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-${hovered === p.id ? 100 : 0} transition-opacity duration-500`} />

                <div className="relative z-10 p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    {/* Icon + number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300"
                        style={{ background: p.accent + "15", color: p.accent, boxShadow: hovered === p.id ? `0 0 30px ${p.accent}30` : "none" }}>
                        {p.icon}
                      </div>
                      <span className="mono text-xs font-bold text-slate-600">{p.num}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="syne text-2xl md:text-3xl font-bold text-white mb-1">{p.title}</h3>
                          <p className="text-sm font-medium" style={{ color: p.accent }}>{p.tagline}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold mono ${
                          p.status === "Completed" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>{p.status}</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed mb-5 max-w-xl">{p.desc}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {p.features.map(f => (
                          <div key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <CheckCircle size={12} style={{ color: p.accent }} />
                            {f}
                          </div>
                        ))}
                      </div>

                      {/* Tech + CTAs */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {p.tech.map(t => (
                            <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                              style={{ background: p.accent + "10", color: p.accent, border: `1px solid ${p.accent}20` }}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3 ml-auto">
                          <motion.a href={p.github} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="glass px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-all">
                            <Github size={15} /> GitHub
                          </motion.a>
                          {p.live && (
                            <motion.a href={p.live} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all"
                              style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent}88)` }}>
                              <ExternalLink size={15} /> Live Demo
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// EDUCATION
// ═══════════════════════════════════════════
function Education() {
  const [ref, inView] = useReveal();

  const items = [
    {
      period: "2022 – 2026",
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "First Capital University of Bangladesh",
      location: "Chuadanga, Bangladesh",
      status: "Final Year",
      statusColor: "green",
      icon: <GraduationCap size={20} />,
      accent: "#3B82F6",
      highlights: ["React & modern web dev", "AI fundamentals", "Software engineering", "Database systems"],
    },
    {
      period: "2017 – 2021",
      degree: "Diploma in Engineering — Computer Technology",
      institution: "Dhaka Polytechnic Institute",
      location: "Dhaka, Bangladesh",
      status: "CGPA 3.18 / 4.0",
      statusColor: "blue",
      icon: <BookOpen size={20} />,
      accent: "#06B6D4",
      highlights: ["Programming: C, Java", "Networking fundamentals", "Database & SQL", "Software development lifecycle"],
    },
    {
      period: "2025 – Present",
      degree: "Youth Leader — LEAD Bangladesh",
      institution: "British Council Program",
      location: "Bangladesh",
      status: "Active",
      statusColor: "violet",
      icon: <Star size={20} />,
      accent: "#7C3AED",
      highlights: ["Green entrepreneurship", "Youth capacity building", "Social innovation", "Facilitation training"],
    },
  ];

  return (
    <Section id="education" className="py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div variants={stagger(0.1)} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}><Label>Academic Journey</Label></motion.div>
          <motion.div variants={fadeUp}><Heading number="04" title="Education" /></motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, #3B82F6, #06B6D4, transparent)" }} />

            {items.map((item, i) => (
              <motion.div
                key={item.degree}
                variants={fadeUp}
                className="relative pl-20 pb-12 last:pb-0 group"
              >
                {/* Connector dot */}
                <motion.div
                  initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: i * 0.2 + 0.4, type: "spring", bounce: 0.5 }}
                  className="absolute left-5 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 shadow-lg"
                  style={{ background: item.accent + "20", border: `2px solid ${item.accent}60`, boxShadow: `0 0 20px ${item.accent}30` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: item.accent }} />
                </motion.div>

                <motion.div
                  whileHover={{ x: 6 }}
                  className="glass rounded-2xl p-6 transition-all group-hover:border-blue-500/20"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span style={{ color: item.accent }}>{item.icon}</span>
                      <div>
                        <h3 className="syne font-bold text-white text-base">{item.degree}</h3>
                        <p className="text-sm text-slate-500">{item.institution}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="mono text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: item.accent + "15", color: item.accent, border: `1px solid ${item.accent}30` }}>
                        {item.status}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin size={11} />
                        <span>{item.location}</span>
                      </div>
                      <span className="mono text-xs text-slate-600">{item.period}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map(h => (
                      <div key={h} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Circle size={4} style={{ fill: item.accent, color: item.accent }} />
                        {h}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// GOALS — Roadmap
// ═══════════════════════════════════════════
function Goals() {
  const [ref, inView] = useReveal();

  const roadmap = [
    {
      phase: "Now",
      icon: <Code2 size={22} />,
      title: "Mastering the Craft",
      items: ["Ship production-grade React apps", "Deep dive into Next.js & full-stack", "Contribute to open source", "Build a strong GitHub presence"],
      accent: "#3B82F6",
      ring: "border-blue-500/40",
    },
    {
      phase: "2026",
      icon: <Rocket size={22} />,
      title: "Graduate & Launch",
      items: ["Complete B.Sc. with distinction", "Land a software engineering role", "Start building personal SaaS", "Apply to international universities"],
      accent: "#06B6D4",
      ring: "border-cyan-500/40",
    },
    {
      phase: "2027+",
      icon: <Brain size={22} />,
      title: "Research & Beyond",
      items: ["Higher studies abroad (MS/PhD)", "Publish AI/Cybersecurity research", "Build a research lab team", "Make impact at global scale"],
      accent: "#7C3AED",
      ring: "border-violet-500/40",
    },
  ];

  return (
    <Section id="goals" className="py-32 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div variants={stagger(0.1)} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}><Label>The Roadmap</Label></motion.div>
          <motion.div variants={fadeUp}><Heading number="05" title="Goals & Vision" sub="Where I'm headed and why it matters." /></motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {roadmap.map((r, i) => (
              <motion.div
                key={r.phase}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`glass rounded-3xl p-8 relative overflow-hidden border ${r.ring} transition-all duration-300 group`}
              >
                {/* Background glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${r.accent}08 0%, transparent 60%)` }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                      style={{ background: r.accent + "15", color: r.accent }}>
                      {r.icon}
                    </div>
                    <span className="syne text-4xl font-black"
                      style={{ WebkitTextStroke: `1px ${r.accent}30`, color: "transparent" }}>
                      {r.phase}
                    </span>
                  </div>

                  <h3 className="syne text-xl font-bold text-white mb-5">{r.title}</h3>

                  <ul className="space-y-3">
                    {r.items.map((item, j) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.15 + j * 0.08 + 0.5 }}
                        className="flex items-start gap-2.5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors"
                      >
                        <Target size={14} className="flex-shrink-0 mt-0.5" style={{ color: r.accent }} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Vision banner */}
          <motion.div
            variants={fadeUp}
            className="glass rounded-3xl p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(6,182,212,0.03) 50%, rgba(124,58,237,0.05) 100%)" }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3B82F620, #06B6D420)" }}>
                <Sparkles size={24} className="text-blue-400" />
              </div>
              <p className="syne text-2xl md:text-3xl font-bold text-white mb-4">
                "The intersection of <span className="gradient-text">AI and Cybersecurity</span><br />
                is where I want to spend my life's work."
              </p>
              <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                I believe the next decade belongs to those who can build intelligent systems that are both powerful and secure. That's the research frontier I'm aiming for.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════
function Contact() {
  const [ref, inView] = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | sent

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1400));
    setStatus("sent");
  };

  return (
    <Section id="contact" className="py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={stagger(0.1)} initial="hidden" animate={inView ? "show" : "hidden"}>
          <motion.div variants={fadeUp}><Label>Get In Touch</Label></motion.div>
          <motion.div variants={fadeUp}><Heading number="06" title="Let's Build Together" /></motion.div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Left */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-8">
              <p className="text-lg text-slate-300 leading-relaxed">
                Have an opportunity, a project idea, or just want to talk tech?{" "}
                <span className="text-white font-medium">I'd love to hear from you.</span>
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Mail size={18} />, label: "Email", value: "mominul.cse21@gmail.com", href: "mailto:mominul.cse21@gmail.com", color: "#3B82F6" },
                  { icon: <MapPin size={18} />, label: "Location", value: "Chuadanga, Bangladesh", href: null, color: "#06B6D4" },
                  { icon: <Coffee size={18} />, label: "Status", value: "Open to opportunities", href: null, color: "#7C3AED" },
                ].map(c => (
                  <motion.div key={c.label} whileHover={{ x: 4 }}
                    className="flex items-center gap-4 glass rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: c.color + "15", color: c.color }}>
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mono">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm text-slate-300 hover:text-white transition-colors">{c.value}</a>
                      ) : (
                        <p className="text-sm text-slate-300">{c.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass rounded-2xl p-6">
                <p className="text-xs text-slate-600 mono mb-4 tracking-widest">SOCIAL LINKS</p>
                <div className="flex gap-3">
                  {[
                    { icon: <Github size={18} />, href: "https://github.com", label: "GitHub" },
                    { icon: <Linkedin size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
                    { icon: <Facebook size={18} />, href: "https://facebook.com", label: "Facebook" },
                  ].map(s => (
                    <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                      whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
                      className="w-11 h-11 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all">
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={scaleIn} className="lg:col-span-3">
              {status === "sent" ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="glass rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center gap-5">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "#22C55E20", border: "1px solid #22C55E40" }}>
                    <CheckCircle size={32} className="text-green-400" />
                  </motion.div>
                  <h3 className="syne text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-slate-400">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }}
                    className="glass px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all">
                    Send Another
                  </motion.button>
                </motion.div>
              ) : (
                <div className="glass rounded-3xl p-8 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-slate-500 mono mb-2 tracking-widest">YOUR NAME</label>
                      <input
                        type="text" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Momin Islam"
                        className="w-full px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mono mb-2 tracking-widest">EMAIL</label>
                      <input
                        type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="hello@example.com"
                        className="w-full px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mono mb-2 tracking-widest">MESSAGE</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={6}
                      placeholder="I'd love to discuss an opportunity / project idea / just want to say hi..."
                      className="w-full px-4 py-3 text-sm resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="btn-primary w-full py-4 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 relative z-10 disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function Footer() {
  const links = ["About", "Skills", "Projects", "Education", "Goals", "Contact"];
  return (
    <footer className="relative border-t border-slate-800/60 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="syne font-bold text-lg">
              <span className="text-blue-400">&lt;</span>
              <span className="gradient-text">Momin</span>
              <span className="text-blue-400"> /&gt;</span>
            </span>
            <span className="text-slate-600 text-sm">— CSE Student & Dev</span>
          </div>

          <div className="flex gap-1 flex-wrap justify-center">
            {links.map(l => (
              <button key={l}
                onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/5 transition-all">
                {l}
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-600 flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-400" fill="currentColor" /> by{" "}
            <span className="text-slate-400 font-medium">Momin Islam</span>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/40 text-center">
          <p className="mono text-xs text-slate-700">© 2026 Momin Islam · Built with React + Framer Motion · Designed with precision</p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════
export default function Portfolio() {
  return (
    <div className="noise" style={{ background: "#020617", minHeight: "100vh" }}>
      <FontLoader />
      <ParticleField />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Goals />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
