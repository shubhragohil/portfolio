import { useState, useEffect, useRef, useCallback } from "react";

// ─── Typing Animation Hook ───────────────────────────────────────────────────
function useTyping(words, speed = 80, pause = 1800) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) { setDeleting(false); setWordIdx(i => i + 1); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx, words, speed, pause]);

  return text;
}

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,179,237,${p.alpha})`;
        ctx.fill();
      });
      // draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,179,237,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["hero", "about", "skills", "projects", "contact"];

const SKILLS = {
  Languages: [
    { name: "Python", level: 88 }, { name: "C++", level: 82 },
    { name: "JavaScript", level: 85 }, { name: "Java", level: 75 },
    { name: "TypeScript", level: 72 }, { name: "SQL", level: 70 },
  ],
  Frameworks: [
    { name: "React", level: 83 }, { name: "Node.js", level: 78 },
    { name: "Express", level: 75 }, { name: "Next.js", level: 70 },
    { name: "Tailwind CSS", level: 88 }, { name: "FastAPI", level: 68 },
  ],
  "Cloud & DevOps": [
    { name: "Azure", level: 65 }, { name: "Docker", level: 72 },
    { name: "Git / GitHub", level: 90 }, { name: "Linux", level: 78 },
    { name: "CI/CD", level: 62 }, { name: "Firebase", level: 70 },
  ],
  Tools: [
    { name: "VS Code", level: 95 }, { name: "Postman", level: 80 },
    { name: "MongoDB", level: 74 }, { name: "PostgreSQL", level: 68 },
    { name: "Figma", level: 60 }, 
  ],
};

const PROJECTS = [
  {
    title: "Gesture Controlled Maze Game",
    desc: "Built an interactive maze game controlled using real-time hand gestures via webcam. Integrated OpenCV and MediaPipe with A* and Dijkstra algorithms for intelligent pathfinding.",
    tags: ["Python", "OpenCV", "MediaPipe", "Pygame", "Algorithms"],
    github: "https://github.com/yourusername/gesture-maze",
    demo: "",
    featured: true,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Smart Vadodara Civic Issue Monitoring App",
    desc: "Developed a civic issue reporting platform enabling users to report and track local problems like potholes and waste. Designed to improve communication between citizens and authorities.",
    tags: ["React", "Node.js", "MongoDB", "Web App"],
    github: "https://github.com/yourusername/smart-vadodara",
    demo: "",
    featured: true,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "GitHub README Generator",
    desc: "Built a dynamic web app that generates professional GitHub README files with customizable sections, improving developer productivity.",
    tags: ["React", "JavaScript", "UI/UX"],
    github: "https://github.com/yourusername/readme-generator",
    demo: "",
    featured: false,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "LegalEase (Legal Document Simplifier)",
    desc: "Created a system that simplifies complex legal documents into easy-to-understand language using NLP techniques for better accessibility.",
    tags: ["Python", "NLP", "Machine Learning"],
    github: "https://github.com/yourusername/legalease",
    demo: "",
    featured: false,
    gradient: "from-orange-500 to-rose-600",
  },
  {
    title: "MeetMate AI",
    desc: "Developed an AI-powered meeting assistant that summarizes conversations, extracts key points, and improves productivity using NLP models.",
    tags: ["Python", "AI", "NLP"],
    github: "https://github.com/yourusername/meetmate-ai",
    demo: "",
    featured: false,
    gradient: "from-pink-500 to-fuchsia-600",
  }
];

const EXPERIENCES = [
  {
    type: "certification",
    title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    org: "Microsoft",
    period: "2025",
    desc: "Validated knowledge of cloud concepts, Azure services, pricing, security, and governance.",
    icon: "☁️",
  },
  {
    type: "certification",
    title: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
    org: "Microsoft",
    period: "2025",
    desc: "Learned core AI concepts including machine learning, NLP, and computer vision services in Azure.",
    icon: "🤖",
  },
  {
    type: "certification",
    title: "Microsoft Certified: Security, Compliance & Identity Fundamentals (SC-900)",
    org: "Microsoft",
    period: "2025",
    desc: "Understood cybersecurity principles, identity management, and compliance solutions.",
    icon: "🔐",
  },
  {
    type: "certification",
    title: "Microsoft Certified: Power Platform Fundamentals (PL-900)",
    org: "Microsoft",
    period: "2025",
    desc: "Explored Power Apps, Power Automate, and building low-code business solutions.",
    icon: "⚡",
  },
  {
    type: "certification",
    title: "Microsoft Certified: Azure Data Fundamentals (DP-900)",
    org: "Microsoft",
    period: "2025",
    desc: "Gained knowledge of data concepts, relational & non-relational databases, and analytics workloads.",
    icon: "📊",
  }
];

// ─── Skill Bar ────────────────────────────────────────────────────────────────
function SkillBar({ name, level, inView, delay }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>{name}</span>
        <span style={{ fontSize: 12, color: "#63b3ed", fontWeight: 700 }}>{level}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 100,
          background: "linear-gradient(90deg, #63b3ed, #9f7aea)",
          width: inView ? `${level}%` : "0%",
          transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        }} />
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, inView, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(99,179,237,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "28px 26px",
        backdropFilter: "blur(16px)",
        transform: inView ? (hovered ? "translateY(-8px) scale(1.01)" : "translateY(0)") : "translateY(40px)",
        opacity: inView ? 1 : 0,
        transition: `all 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient accent top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, var(--from), var(--to))`,
        '--from': project.gradient.includes('cyan') ? '#06b6d4' : project.gradient.includes('violet') ? '#8b5cf6' : project.gradient.includes('emerald') ? '#10b981' : project.gradient.includes('orange') ? '#f97316' : project.gradient.includes('pink') ? '#ec4899' : '#0ea5e9',
        '--to': project.gradient.includes('blue') ? '#3b82f6' : project.gradient.includes('purple') ? '#7c3aed' : project.gradient.includes('teal') ? '#14b8a6' : project.gradient.includes('rose') ? '#f43f5e' : project.gradient.includes('fuchsia') ? '#d946ef' : '#6366f1',
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.3s",
        borderRadius: "20px 20px 0 0",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f7fafc", fontFamily: "'Clash Display', 'DM Sans', sans-serif", margin: 0 }}>
          {project.title}
        </h3>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={project.github} target="_blank" rel="noreferrer"
            style={{ color: "#a0aec0", textDecoration: "none", fontSize: 18, transition: "color 0.2s" }}
            onMouseOver={e => e.target.style.color = "#63b3ed"}
            onMouseOut={e => e.target.style.color = "#a0aec0"}
            title="GitHub"
          >⌥</a>
          <a href={project.demo} target="_blank" rel="noreferrer"
            style={{ color: "#a0aec0", textDecoration: "none", fontSize: 16, transition: "color 0.2s" }}
            onMouseOver={e => e.target.style.color = "#63b3ed"}
            onMouseOut={e => e.target.style.color = "#a0aec0"}
            title="Live Demo"
          >↗</a>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: "#a0aec0", lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
        {project.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: "auto" }}>
        {project.tags.map(t => (
          <span key={t} style={{
            fontSize: 11, fontWeight: 600, color: "#63b3ed",
            background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.2)",
            borderRadius: 100, padding: "3px 11px", fontFamily: "'DM Sans', sans-serif",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────
function ExpCard({ item, inView, delay, isLeft }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: isLeft ? "flex-end" : "flex-start",
      padding: "0 40px",
      marginBottom: 32,
      transform: inView ? "translateX(0)" : `translateX(${isLeft ? -40 : 40}px)`,
      opacity: inView ? 1 : 0,
      transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>
      <div style={{
        maxWidth: 380,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "20px 22px",
        backdropFilter: "blur(12px)",
        position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f7fafc", fontFamily: "'DM Sans', sans-serif" }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#63b3ed", fontWeight: 600 }}>{item.org}</div>
          </div>
          <span style={{
            marginLeft: "auto", fontSize: 11, color: "#718096",
            background: "rgba(255,255,255,0.05)", borderRadius: 100,
            padding: "2px 10px", whiteSpace: "nowrap",
            fontFamily: "'DM Sans', sans-serif",
          }}>{item.period}</span>
        </div>
        <p style={{ fontSize: 13, color: "#a0aec0", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
      </div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, style }) {
  return (
    <section id={id} style={{
      position: "relative", zIndex: 1,
      padding: "100px 0", ...style
    }}>
      {children}
    </section>
  );
}

function Container({ children }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      {children}
    </div>
  );
}

function SectionTitle({ label, title, sub }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 64 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
        color: "#63b3ed", textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</span>
      <h2 style={{
        fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800,
        color: "#f7fafc", margin: "10px 0 14px",
        fontFamily: "'Clash Display', 'DM Sans', sans-serif",
        letterSpacing: "-0.02em",
      }}>{title}</h2>
      {sub && <p style={{ color: "#718096", fontSize: 15, maxWidth: 500, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

// ─── GitHub Stats ─────────────────────────────────────────────────────────────
function GitHubStats() {
  const [ref, inView] = useInView();
  const USERNAME = "yourusername"; // ← replace

  const stats = [
    { label: "Public Repos", value: "32+" },
    { label: "Total Stars", value: "210+" },
    { label: "Contributions (yr)", value: "1.2k+" },
    { label: "Pull Requests", value: "85+" },
  ];

  return (
    <div ref={ref} style={{ marginTop: 48 }}>
      <h3 style={{
        textAlign: "center", fontSize: 18, fontWeight: 700,
        color: "#a0aec0", marginBottom: 28, fontFamily: "'DM Sans', sans-serif",
      }}>
        GitHub at a Glance
      </h3>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "18px 28px", textAlign: "center", minWidth: 130,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            opacity: inView ? 1 : 0,
            transition: `all 0.5s ease ${i * 80}ms`,
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#63b3ed", fontFamily: "'DM Sans', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#718096", fontWeight: 600, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <img
          src={`https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0d1117&title_color=63b3ed&icon_color=9f7aea&text_color=a0aec0&count_private=true`}
          alt="GitHub Stats"
          style={{ borderRadius: 14, maxWidth: "100%", height: "auto" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <img
          src={`https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=tokyonight&hide_border=true&background=0d1117&ring=63b3ed&fire=9f7aea&currStreakLabel=63b3ed`}
          alt="GitHub Streak"
          style={{ borderRadius: 14, maxWidth: "100%", height: "auto" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      </div>
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    if (form.name && form.email && form.message) { setSent(true); setTimeout(() => setSent(false), 3500); setForm({ name: "", email: "", message: "" }); }
  };
  const inp = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    color: "#f7fafc", padding: "14px 16px", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.25s",
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <input placeholder="Shubhra Gohil" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={inp} onFocus={e => e.target.style.borderColor = "#63b3ed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
        <input type="email" placeholder="gohilshubhra@gmail.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          style={inp} onFocus={e => e.target.style.borderColor = "#63b3ed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      </div>
      <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        style={{ ...inp, resize: "vertical", marginBottom: 18 }}
        onFocus={e => e.target.style.borderColor = "#63b3ed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      <button onClick={handleSubmit} style={{
        background: sent ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #63b3ed, #9f7aea)",
        border: sent ? "1px solid #10b981" : "none",
        color: sent ? "#10b981" : "#fff",
        padding: "14px 36px", borderRadius: 100, fontSize: 14, fontWeight: 700,
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.3s", letterSpacing: "0.03em",
      }}>
        {sent ? "✓ Message Sent!" : "Send Message →"}
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const typedRole = useTyping(["Full-Stack Developer", "Cloud Explorer", "DSA Enthusiast", "Open Source Contributor", "Problem Solver"], 75, 2000);

  const [aboutRef, aboutInView] = useInView();
  const [skillsRef, skillsInView] = useInView();
  const [projectsRef, projectsInView] = useInView();
  const [expRef, expInView] = useInView();
  const [contactRef, contactInView] = useInView();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_LINKS;
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const NAV_LABELS = { hero: "Home", about: "About", skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact" };

  return (
    <>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #080c14; color: #f7fafc; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #080c14; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 10px; }
        ::selection { background: rgba(99,179,237,0.25); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(99,179,237,0.2)} 50%{box-shadow:0 0 40px rgba(99,179,237,0.45)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation: blink 0.9s infinite; }
        .float { animation: float 4s ease-in-out infinite; }
        .glow-btn { animation: pulse-glow 2.5s ease-in-out infinite; }
      `}</style>

      <ParticleCanvas />

      {/* Background mesh gradients */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "60%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(159,122,234,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px",
        background: scrolled ? "rgba(8,12,20,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.35s ease",
        height: 70, display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => scrollTo("hero")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, fontWeight: 800, color: "#63b3ed",
            fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em",
          }}>
            &lt;SG /&gt;
          </button>
          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
            {NAV_LINKS.map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: activeSection === id ? "rgba(99,179,237,0.1)" : "none",
                border: "none", cursor: "pointer",
                color: activeSection === id ? "#63b3ed" : "#718096",
                padding: "8px 16px", borderRadius: 100,
                fontSize: 13.5, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
                letterSpacing: "0.01em",
              }}
                onMouseOver={e => { if (activeSection !== id) e.currentTarget.style.color = "#a0aec0"; }}
                onMouseOut={e => { if (activeSection !== id) e.currentTarget.style.color = "#718096"; }}
              >
                {NAV_LABELS[id]}
              </button>
            ))}
            <a href="/resume.pdf" download style={{
              marginLeft: 8, background: "rgba(99,179,237,0.15)",
              border: "1px solid rgba(99,179,237,0.3)", color: "#63b3ed",
              padding: "8px 18px", borderRadius: 100,
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(99,179,237,0.25)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(99,179,237,0.15)"; }}
            >
              Resume ↓
            </a>
          </div>
          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(m => !m)} style={{
            display: "none", background: "none", border: "none",
            color: "#a0aec0", fontSize: 22, cursor: "pointer",
          }} id="hamburger">☰</button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "rgba(8,12,20,0.97)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: activeSection === id ? "#63b3ed" : "#a0aec0",
                padding: "12px 0", fontSize: 15, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>{NAV_LABELS[id]}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <Section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 0 80px" }}>
        <Container>
          <div style={{ maxWidth: 700 }}>
            <div style={{ animation: "fadeUp 0.7s ease forwards", animationDelay: "0.1s", opacity: 0 }}>
              <span style={{
                display: "inline-block", fontSize: 13, fontWeight: 700,
                color: "#63b3ed", background: "rgba(99,179,237,0.1)",
                border: "1px solid rgba(99,179,237,0.2)",
                borderRadius: 100, padding: "5px 16px",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em",
                marginBottom: 24,
              }}>
                👋 Available for Internships & Opportunities
              </span>
            </div>
            <h1 style={{
              fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 800,
              lineHeight: 1.08, letterSpacing: "-0.03em",
              fontFamily: "'DM Sans', sans-serif",
              animation: "fadeUp 0.7s ease forwards", animationDelay: "0.2s", opacity: 0,
              marginBottom: 16,
            }}>
              <span style={{ color: "#f7fafc" }}>Hi, I'm </span>
              <span style={{ background: "linear-gradient(135deg, #63b3ed 0%, #9f7aea 50%, #f687b3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
               Shubhra Gohil
              </span>
            </h1>
            <div style={{
              fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 600, color: "#a0aec0",
              fontFamily: "'DM Sans', sans-serif", marginBottom: 24, height: 36,
              animation: "fadeUp 0.7s ease forwards", animationDelay: "0.3s", opacity: 0,
            }}>
              <span style={{ color: "#63b3ed" }}>{typedRole}</span>
              <span className="blink" style={{ color: "#9f7aea", marginLeft: 2 }}>|</span>
            </div>
            <p style={{
              fontSize: 16, color: "#718096", lineHeight: 1.8,
              maxWidth: 520, fontFamily: "'DM Sans', sans-serif", marginBottom: 40,
              animation: "fadeUp 0.7s ease forwards", animationDelay: "0.4s", opacity: 0,
            }}>
              CSE student passionate about building scalable web apps, exploring cloud infrastructure, and crushing DSA problems. Currently building cool things and open to collaborations.
            </p>
            <div style={{
              display: "flex", gap: 14, flexWrap: "wrap",
              animation: "fadeUp 0.7s ease forwards", animationDelay: "0.5s", opacity: 0,
            }}>
              <button onClick={() => scrollTo("projects")} className="glow-btn" style={{
                background: "linear-gradient(135deg, #63b3ed, #9f7aea)",
                border: "none", color: "#fff", padding: "14px 32px",
                borderRadius: 100, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.03em",
              }}>
                View Projects →
              </button>
              <button onClick={() => scrollTo("contact")} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                color: "#a0aec0", padding: "14px 32px",
                borderRadius: 100, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.25s",
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(99,179,237,0.4)"; e.currentTarget.style.color = "#63b3ed"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#a0aec0"; }}
              >
                Contact Me
              </button>
            </div>
            {/* Socials */}
            <div style={{
              display: "flex", gap: 18, marginTop: 40,
              animation: "fadeUp 0.7s ease forwards", animationDelay: "0.65s", opacity: 0,
            }}>
              {[
                { label: "GitHub", href: "https://github.com/shubhragohil", icon: "⌥" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/shubhra15/", icon: "in" },
               
                { label: "Email", href: "gohilshubhra@gmail.com", icon: "@" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: "#4a5568", textDecoration: "none",
                  fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  transition: "color 0.2s",
                }}
                  onMouseOver={e => e.currentTarget.style.color = "#63b3ed"}
                  onMouseOut={e => e.currentTarget.style.color = "#4a5568"}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
                </a>
              ))}
            </div>
          </div>
          {/* Floating badge */}
          <div className="float" style={{
            position: "absolute", right: "8%", top: "32%",
            background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
            padding: "18px 22px", textAlign: "center", pointerEvents: "none",
            display: "none",
          }}>
            <div style={{ fontSize: 32 }}>⚡</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#63b3ed", fontFamily: "'DM Sans', sans-serif" }}>600+</div>
            <div style={{ fontSize: 11, color: "#718096", fontFamily: "'DM Sans', sans-serif" }}>LeetCode<br />Problems</div>
          </div>
        </Container>
        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          animation: "fadeUp 0.7s ease forwards", animationDelay: "1s", opacity: 0,
        }}>
          <span style={{ fontSize: 11, color: "#4a5568", letterSpacing: "0.12em", fontFamily: "'DM Sans', sans-serif" }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #63b3ed, transparent)" }} />
        </div>
      </Section>

      {/* ── ABOUT ── */}
      <Section id="about">
        <Container>
          <SectionTitle label="01. About" title="Who Am I?" />
          <div ref={aboutRef} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64,
            alignItems: "center",
          }}>
            <div style={{
              transform: aboutInView ? "translateX(0)" : "translateX(-40px)",
              opacity: aboutInView ? 1 : 0,
              transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
            }}>
              <div style={{
                width: 260, height: 260, borderRadius: 28, margin: "0 auto",
                background: "linear-gradient(135deg, rgba(99,179,237,0.15), rgba(159,122,234,0.15))",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 96,
              }}>
                🧑‍💻
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
                {["DSA Problem Solver", "Azure Certified", "Tech Enthusiast"].map(b => (
                  <span key={b} style={{
                    fontSize: 12, fontWeight: 600, color: "#63b3ed",
                    background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: 100, padding: "5px 14px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{
              transform: aboutInView ? "translateX(0)" : "translateX(40px)",
              opacity: aboutInView ? 1 : 0,
              transition: "all 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s",
            }}>
              <h3 style={{
                fontSize: 26, fontWeight: 800, color: "#f7fafc",
                fontFamily: "'DM Sans', sans-serif", marginBottom: 20,
                letterSpacing: "-0.02em",
              }}>
                Building. Learning. Shipping.
              </h3>
              <p style={{ color: "#a0aec0", lineHeight: 1.85, fontSize: 15, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
                I'm a Computer Science Engineering student with a deep passion for crafting meaningful digital experiences. From writing my first "Hello World" to deploying full-stack apps on cloud infrastructure — every line of code has been a stepping stone.
              </p>
              <p style={{ color: "#a0aec0", lineHeight: 1.85, fontSize: 15, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
                I thrive in the intersection of <span style={{ color: "#63b3ed", fontWeight: 600 }}>software development</span>, <span style={{ color: "#9f7aea", fontWeight: 600 }}>cloud architecture</span>, and <span style={{ color: "#f687b3", fontWeight: 600 }}>competitive programming</span>. When I'm not coding, you'll find me contributing to open source or experimenting with emerging tech.
              </p>
              <p style={{ color: "#a0aec0", lineHeight: 1.85, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
                Currently exploring distributed systems, microservices, and DevOps practices while actively looking for opportunities to contribute to impactful projects.
              </p>
              <a href="/resume.pdf" download style={{
                display: "inline-block", marginTop: 28,
                background: "linear-gradient(135deg, #63b3ed, #9f7aea)",
                color: "#fff", padding: "13px 30px", borderRadius: 100,
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
              }}>
                Download Resume ↓
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SKILLS ── */}
      <Section id="skills" style={{ background: "rgba(255,255,255,0.015)" }}>
        <Container>
          <SectionTitle label="02. Skills" title="Technical Arsenal" sub="The languages, frameworks, and tools I use to bring ideas to life." />
          <div ref={skillsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
            {Object.entries(SKILLS).map(([category, items], ci) => (
              <div key={category} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "28px 24px", backdropFilter: "blur(12px)",
                transform: skillsInView ? "translateY(0)" : "translateY(40px)",
                opacity: skillsInView ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${ci * 100}ms`,
              }}>
                <h3 style={{
                  fontSize: 13, fontWeight: 700, color: "#63b3ed", letterSpacing: "0.12em",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 22,
                }}>
                  {category}
                </h3>
                {items.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} inView={skillsInView} delay={ci * 80 + i * 60} />
                ))}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── PROJECTS ── */}
      <Section id="projects">
        <Container>
          <SectionTitle label="03. Projects" title="Things I've Built" sub="A selection of projects I've designed, built, and shipped." />
          <div ref={projectsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.title} project={p} inView={projectsInView} delay={i * 80} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.12)", color: "#a0aec0",
              padding: "13px 30px", borderRadius: 100, fontSize: 14, fontWeight: 700,
              textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.25s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(99,179,237,0.4)"; e.currentTarget.style.color = "#63b3ed"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#a0aec0"; }}
            >
              See All Projects on GitHub →
            </a>
          </div>
        </Container>
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section id="experience" style={{ background: "rgba(255,255,255,0.015)" }}>
        <Container>
         <SectionTitle 
  label="04. Certifications" 
  title="Microsoft Certifications" 
  sub="Professional certifications validating my cloud and AI expertise." 
/>
          <div ref={expRef} style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
            {/* Center line */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 1, background: "rgba(99,179,237,0.15)",
              transform: "translateX(-50%)",
            }} />
            {EXPERIENCES.map((item, i) => (
              <ExpCard key={item.title} item={item} inView={expInView} delay={i * 100} isLeft={i % 2 === 0} />
            ))}
          </div>
          
        </Container>
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact">
        <Container>
          <SectionTitle label="05. Contact" title="Let's Work Together" sub="Have an idea, opportunity, or just want to say hi? My inbox is always open." />
          <div ref={contactRef} style={{
            display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56,
            transform: contactInView ? "translateY(0)" : "translateY(40px)",
            opacity: contactInView ? 1 : 0,
            transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f7fafc", fontFamily: "'DM Sans', sans-serif", marginBottom: 18 }}>
                Get In Touch
              </h3>
              <p style={{ color: "#718096", fontSize: 14, lineHeight: 1.8, marginBottom: 32, fontFamily: "'DM Sans', sans-serif" }}>
                Whether it's a job opportunity, collaboration on an interesting project, or just a tech chat — feel free to reach out!
              </p>
              {[
                { icon: "@", label: "Email", val: "gohilshubhra@gmail.com", href: "gohilshubhra@gmail.com" },
                { icon: "in", label: "LinkedIn", val: "https://www.linkedin.com/in/shubhra15/", href: "https://www.linkedin.com/in/shubhra15/" },
                { icon: "⌥", label: "GitHub", val: "https://github.com/shubhragohil", href: "https://github.com/shubhragohil" },
                
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  textDecoration: "none", transition: "all 0.2s",
                }}
                  onMouseOver={e => e.currentTarget.querySelector("span").style.color = "#63b3ed"}
                  onMouseOut={e => e.currentTarget.querySelector("span").style.color = "#a0aec0"}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, color: "#63b3ed", flexShrink: 0,
                  }}>{l.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: "#4a5568", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{l.label}</div>
                    <span style={{ fontSize: 14, color: "#a0aec0", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>{l.val}</span>
                  </div>
                </a>
              ))}
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "32px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
        background: "rgba(8,12,20,0.8)",
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#4a5568", fontSize: 13 }}>
          © 2025 <span style={{ color: "#63b3ed" }}>Shubhra Gohil</span>. Crafted with ☕ & React.
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["GitHub", "LinkedIn"].map(s => (
            <a key={s} href="#" style={{ color: "#4a5568", textDecoration: "none", fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = "#63b3ed"}
              onMouseOut={e => e.target.style.color = "#4a5568"}
            >{s}</a>
          ))}
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #hamburger { display: block !important; }
          #about > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          #contact > div > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          #experience > div > div[style*="maxWidth"] { max-width: 100% !important; padding: 0 !important; }
          #experience > div > div > div[style*="justify"] { justify-content: center !important; padding: 0 0 0 0 !important; }
          #experience > div > div > div[style*="absolute"] { display: none !important; }
        }
      `}</style>
    </>
  );
}
