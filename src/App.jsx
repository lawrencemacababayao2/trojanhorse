import { useState, useEffect, useRef } from "react";

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1024, w };
};

// ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────
const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const trailRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (isMobile) return;

    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const animate = () => {
      trailRef.current = {
        x: trailRef.current.x + (pos.x - trailRef.current.x) * 0.12,
        y: trailRef.current.y + (pos.y - trailRef.current.y) * 0.12,
      };
      setTrail({ ...trailRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const checkHover = (e) => {
      const el = e.target;
      const isInteractive = el.closest('button, a, [role="button"], input, select, textarea');
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, pos.x, pos.y]);

  if (isMobile) return null;

  const outerSize = hovering ? 44 : 36;
  const innerSize = clicking ? 3 : 5;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Trailing ring */}
      <div style={{
        position: "fixed",
        left: trail.x,
        top: trail.y,
        width: outerSize,
        height: outerSize,
        transform: "translate(-50%, -50%)",
        border: `1px solid ${hovering ? "rgba(232,0,29,0.9)" : "rgba(232,0,29,0.5)"}`,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 99999,
        transition: "width 0.15s ease, height 0.15s ease, border-color 0.15s ease",
        boxShadow: hovering ? "0 0 12px rgba(232,0,29,0.4), inset 0 0 8px rgba(232,0,29,0.1)" : "none",
      }}>
        {/* Crosshair lines */}
        <div style={{
          position: "absolute", left: "50%", top: -6,
          width: 1, height: 5, background: "rgba(232,0,29,0.6)",
          transform: "translateX(-50%)",
        }}/>
        <div style={{
          position: "absolute", left: "50%", bottom: -6,
          width: 1, height: 5, background: "rgba(232,0,29,0.6)",
          transform: "translateX(-50%)",
        }}/>
        <div style={{
          position: "absolute", top: "50%", left: -6,
          width: 5, height: 1, background: "rgba(232,0,29,0.6)",
          transform: "translateY(-50%)",
        }}/>
        <div style={{
          position: "absolute", top: "50%", right: -6,
          width: 5, height: 1, background: "rgba(232,0,29,0.6)",
          transform: "translateY(-50%)",
        }}/>

        {/* Corner brackets */}
        {hovering && (
          <>
            <div style={{ position:"absolute", top:-2, left:-2, width:7, height:7,
              borderTop:"1.5px solid var(--red)", borderLeft:"1.5px solid var(--red)" }}/>
            <div style={{ position:"absolute", top:-2, right:-2, width:7, height:7,
              borderTop:"1.5px solid var(--red)", borderRight:"1.5px solid var(--red)" }}/>
            <div style={{ position:"absolute", bottom:-2, left:-2, width:7, height:7,
              borderBottom:"1.5px solid var(--red)", borderLeft:"1.5px solid var(--red)" }}/>
            <div style={{ position:"absolute", bottom:-2, right:-2, width:7, height:7,
              borderBottom:"1.5px solid var(--red)", borderRight:"1.5px solid var(--red)" }}/>
          </>
        )}
      </div>

      {/* Sharp center dot */}
      <div style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: innerSize,
        height: innerSize,
        transform: "translate(-50%, -50%)",
        background: "var(--red)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 100000,
        boxShadow: "0 0 6px var(--red)",
        transition: "width 0.1s ease, height 0.1s ease",
      }}/>
    </>
  );
};

// ─── SVG ICONS (red stroke, no fill) ─────────────────────────────────────────
const Icon = ({ name, size = 24, color = "var(--red)", style = {} }) => {
  const s = { width: size, height: size, flexShrink: 0, ...style };
  const props = { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", style: s };

  switch (name) {
    case "horse":
      return <svg {...props}><path d="M4 18c0-4 2-7 5-9l1-4h4l1 2 3-1v4l-2 1c1 2 1 4 1 7"/><path d="M9 18v2M13 18v2"/><path d="M7 9c-1-1-2-2-2-4 0 0 2 0 3 1"/><circle cx="15" cy="6" r="1"/></svg>;
    case "lock":
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 2l7 4v6c0 5-3.5 9-7 10C8.5 21 5 17 5 12V6l7-4z"/><polyline points="9 12 11 14 15 10"/></svg>;
    case "skull":
      return <svg {...props}><circle cx="12" cy="10" r="7"/><path d="M9 17v2h6v-2"/><path d="M9 13h.01M15 13h.01"/><line x1="12" y1="7" x2="12" y2="13"/></svg>;
    case "virus":
      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case "alert":
      return <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "wifi-off":
      return <svg {...props}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
    case "zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "eye":
      return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "database":
      return <svg {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
    case "server":
      return <svg {...props}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
    case "download":
      return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "key":
      return <svg {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "globe":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "credit-card":
      return <svg {...props}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case "mail":
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "usb":
      return <svg {...props}><path d="M12 2v8l3-3M12 10l-3-3"/><rect x="8" y="14" width="8" height="6" rx="1"/><path d="M12 10v4"/></svg>;
    case "smartphone":
      return <svg {...props}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
    case "cursor":
      return <svg {...props}><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>;
    case "bank":
      return <svg {...props}><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>;
    case "arrow-down":
      return <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
    case "wrench":
      return <svg {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
    case "lock-open":
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
    case "bomb":
      return <svg {...props}><circle cx="11" cy="13" r="7"/><path d="M14 6l1-4 4 2"/><line x1="16" y1="5" x2="18" y2="7"/></svg>;
    case "radio":
      return <svg {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
    case "flame":
      return <svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
    case "user":
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "graduation":
      return <svg {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
    case "building":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 22V12h6v10M9 7h1M14 7h1M9 11h1M14 11h1"/></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "star":
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "check":
      return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "x":
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "menu":
      return <svg {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case "theater":
      return <svg {...props}><path d="M2 10s3-3 3-8c0 0 3.5 4 9 4s9-4 9-4c0 5 3 8 3 8"/><path d="M2 14s3 3 3 8c0 0 3.5-4 9-4s9 4 9 4c0-5 3-8 3-8"/></svg>;
    case "door":
      return <svg {...props}><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><rect x="2" y="4" width="11" height="16" rx="1"/></svg>;
    case "signal":
      return <svg {...props}><line x1="2" y1="20" x2="22" y2="20"/><line x1="2" y1="20" x2="22" y2="4"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
    case "warning":
      return <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "terminal":
      return <svg {...props}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --red: #e8001d; --red-dim: #9b0013; --red-glow: #ff0033;
      --black: #050507; --black2: #0d0d0f; --black3: #141418;
      --white: #f0f0f0; --grey: #888;
      --mono: 'Share Tech Mono', monospace;
      --display: 'Bebas Neue', cursive;
      --body: 'Rajdhani', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--black); color: var(--white);
      font-family: var(--body); font-size: 16px;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--red); }

    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .blink { animation: blink 1s infinite; }

    @keyframes pulse-red {
      0%,100% { box-shadow: 0 0 0 0 rgba(232,0,29,0.4); }
      50%     { box-shadow: 0 0 0 12px rgba(232,0,29,0); }
    }
    @keyframes shake {
      0%,100%{transform:translate(0)} 10%{transform:translate(-4px,2px)}
      20%{transform:translate(4px,-2px)} 30%{transform:translate(-4px,0)}
      40%{transform:translate(4px,2px)} 50%{transform:translate(-2px,-4px)}
      60%{transform:translate(2px,4px)} 70%{transform:translate(-4px,-2px)}
      80%{transform:translate(4px,0)} 90%{transform:translate(-2px,2px)}
    }
    @keyframes popIn {
      from{opacity:0;transform:scale(0.5) rotate(-5deg)}
      to{opacity:1;transform:scale(1) rotate(0)}
    }
    @keyframes progressBar { from{width:0} to{width:100%} }
    @keyframes glitch {
      0%,100% { text-shadow: none; transform: translate(0); }
      20% { text-shadow: -2px 0 var(--red); transform: translate(-1px,0); }
      40% { text-shadow: 2px 0 cyan; transform: translate(1px,0); }
    }
    .glitch { animation: glitch 3s infinite; }

    @media (max-width: 639px) {
      .nav-links { display: none; }
      .nav-links.open { display: flex !important; }
    }
  `}</style>
);

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState([]);
  const { isMobile } = useBreakpoint();

  const bootLines = [
    "INITIALIZING SECURE ENVIRONMENT...",
    "LOADING THREAT DATABASE v4.2.1...",
    "SCANNING NETWORK PERIMETER...",
    "DECRYPTING PAYLOAD SIGNATURES...",
    "WARNING: ANOMALOUS ACTIVITY DETECTED",
    "BYPASSING FIREWALL PROTOCOLS...",
    "ESTABLISHING COVERT CHANNEL...",
    "ACCESS GRANTED — TROJAN.HORSE MODULE LOADED",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]]);
        i++;
        setProgress(Math.round((i / bootLines.length) * 100));
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase(1), 400);
        setTimeout(() => onDone(), 1600);
      }
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position:"fixed",inset:0,background:"#000",zIndex:9999,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      fontFamily:"var(--mono)",overflow:"hidden",
      opacity: phase === 1 ? 0 : 1, transition:"opacity 0.8s ease",
      padding:"16px",
    }}>
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)",
        pointerEvents:"none",zIndex:1,
      }}/>
      <div style={{
        width:"100%",maxWidth:680,padding: isMobile ? "20px 16px" : "32px",
        border:"1px solid var(--red)",background:"rgba(10,0,0,0.9)",
        boxShadow:"0 0 40px rgba(232,0,29,0.3)",position:"relative",zIndex:2,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:"#ff5f56"}}/>
          <div style={{width:10,height:10,borderRadius:"50%",background:"#ffbd2e"}}/>
          <div style={{width:10,height:10,borderRadius:"50%",background:"#27c93f"}}/>
          <span style={{color:"var(--grey)",fontSize: isMobile ? 9 : 11,marginLeft:6}}>
            {isMobile ? "TERMINAL — ROOT@TROJAN" : "SYSTEM TERMINAL — ROOT@TROJAN:~#"}
          </span>
        </div>
        <div style={{color:"var(--red)",marginBottom:12,fontSize: isMobile ? 8 : 11,letterSpacing:2,overflowX:"hidden"}}>
          ████████████████████████████████████████
        </div>
        <div style={{minHeight: isMobile ? 160 : 200}}>
          {lines.map((line, idx) => (
            <div key={idx} style={{
              fontSize: isMobile ? 10 : 13,lineHeight:2,
              color: line.includes("WARNING")||line.includes("BYPASS")||line.includes("ANOMALOUS") ? "var(--red)" :
                     line.includes("GRANTED") ? "#00ff88" : "#aaa",
              opacity: idx === lines.length-1 ? 1 : 0.7,
              wordBreak:"break-word",
            }}>
              <span style={{color:"var(--red)"}}>{">"} </span>{line}
              {idx === lines.length-1 && <span className="blink" style={{color:"var(--red)"}}>█</span>}
            </div>
          ))}
        </div>
        <div style={{marginTop:16,height:4,background:"#1a0005",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",background:"var(--red)",width:`${progress}%`,transition:"width 0.2s ease",boxShadow:"0 0 8px var(--red)"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize: isMobile?9:11,color:"var(--grey)"}}>
          <span>{isMobile ? "LOADING..." : "LOADING TROJAN HORSE SIMULATION..."}</span>
          <span style={{color:"var(--red)"}}>{progress}%</span>
        </div>
      </div>
      <div style={{
        marginTop:24,fontSize:"clamp(22px,6vw,48px)",
        fontFamily:"var(--display)",letterSpacing:6,
        color:"var(--red)",textShadow:"0 0 30px var(--red)",textAlign:"center",
        display:"flex",alignItems:"center",gap:16,
      }}>
        <Icon name="horse" size={isMobile?32:48} />
        TROJAN HORSE
      </div>
      <div style={{color:"var(--grey)",fontSize: isMobile?9:12,letterSpacing:4,marginTop:4,textAlign:"center"}}>
        CYBERSECURITY SIMULATION
      </div>
    </div>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ active, setActive }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleNav = (l) => { setActive(l); setMenuOpen(false); };
  const links = ["Home","Discussion","Articles","Reflection","About"];

  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background: scrolled||menuOpen ? "rgba(5,5,7,0.97)" : "rgba(5,5,7,0.75)",
        backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(232,0,29,0.2)",
        padding: isMobile ? "0 16px" : "0 32px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        height:64,transition:"background 0.3s",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{
            width:36,height:36,border:"2px solid var(--red)",borderRadius:4,
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <img src="./horselogo.png" alt="" />
          </div>
          <div>
            <div style={{fontFamily:"var(--display)",fontSize: isMobile?15:20,letterSpacing:3}}>
              TROJAN <span style={{color:"var(--red)"}}>HORSE</span>
            </div>
            
          </div>
        </div>

        {!isMobile && (
          <div style={{display:"flex",gap:2}}>
            {links.map(l => (
              <button key={l} onClick={() => handleNav(l)} style={{
                background:"none",border:"none",cursor:"pointer",
                padding:"8px 14px",fontFamily:"var(--body)",fontWeight:600,
                fontSize:13,letterSpacing:2,textTransform:"uppercase",
                color: active===l ? "var(--red)" : "var(--grey)",
                borderBottom: active===l ? "2px solid var(--red)" : "2px solid transparent",
                transition:"all 0.2s",
              }}>{l}</button>
            ))}
          </div>
        )}

        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{
            width:36,height:36,border:"2px solid var(--red)",borderRadius:"50%",
            display:"flex",alignItems:"center",justifyContent:"center",
            animation:"pulse-red 2s infinite",flexShrink:0,
          }}>
            <Icon name="lock" size={16} />
          </div>

          {isMobile && (
            <button onClick={() => setMenuOpen(o=>!o)} style={{
              background:"none",border:"1px solid rgba(232,0,29,0.4)",
              borderRadius:4,padding:"6px 10px",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <Icon name={menuOpen ? "x" : "menu"} size={18} />
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div style={{
          position:"fixed",top:64,left:0,right:0,zIndex:99,
          background:"rgba(5,5,7,0.98)",borderBottom:"1px solid rgba(232,0,29,0.3)",
          display:"flex",flexDirection:"column",
        }}>
          {links.map(l => (
            <button key={l} onClick={() => handleNav(l)} style={{
              background:"none",border:"none",
              borderBottom:"1px solid rgba(232,0,29,0.1)",
              padding:"16px 24px",textAlign:"left",
              fontFamily:"var(--body)",fontWeight:600,fontSize:16,
              letterSpacing:3,textTransform:"uppercase",cursor:"pointer",
              color: active===l ? "var(--red)" : "var(--grey)",
              display:"flex",alignItems:"center",gap:12,
            }}>
              {active===l && <span style={{width:4,height:16,background:"var(--red)",display:"inline-block",borderRadius:2}}/>}
              {l}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

// ─── TROJAN SIMULATION POPUPS ─────────────────────────────────────────────────
const TrojanSimulation = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [popups, setPopups] = useState([]);
  const [compromised, setCompromised] = useState(false);
  const [finalMsg, setFinalMsg] = useState(false);
  const { isMobile } = useBreakpoint();

  const popupData = [
    { icon: "alert",    label: "VIRUS DETECTED!" },
    { icon: "warning",  label: "SYSTEM AT RISK!" },
    { icon: "skull",    label: "Trojan.Horse found!" },
    { icon: "zap",      label: "SECURITY BREACH!" },
    { icon: "lock-open",label: "UNAUTHORIZED ACCESS!" },
    { icon: "shield",   label: "FIREWALL DISABLED!" },
    { icon: "bomb",     label: "MALWARE INSTALLING..." },
    { icon: "radio",    label: "DATA TRANSMITTED..." },
    { icon: "flame",    label: "COMPROMISED!" },
    { icon: "skull",    label: "FILES ENCRYPTED!" },
  ];

  const spawnPopups = () => {
    const newPops = popupData.map((p, i) => ({
      id: i, ...p,
      x: isMobile ? 2 + Math.random()*50 : 5 + Math.random()*60,
      y: 8 + Math.random()*65,
      delay: i * 120,
    }));
    setPopups(newPops);
    setCompromised(true);
    setTimeout(() => setFinalMsg(true), 1800);
  };

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:200,
      background:"rgba(0,0,0,0.88)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:16,
      animation: compromised ? "shake 0.5s ease" : "none",
    }}>
      {popups.map(p => (
        <div key={p.id} style={{
          position:"fixed",
          left:`${p.x}vw`,top:`${p.y}vh`,
          background:"#0d0d0f",border:"2px solid var(--red)",
          padding: isMobile ? "8px 12px" : "10px 16px",
          borderRadius:4,fontFamily:"var(--mono)",
          fontSize: isMobile ? 10 : 12,
          color:"var(--white)",
          boxShadow:"0 0 20px rgba(232,0,29,0.5)",
          animation:`popIn 0.3s ease ${p.delay}ms both`,
          zIndex:210,
          display:"flex",alignItems:"center",gap:8,
          whiteSpace:"nowrap",
        }}>
          <Icon name={p.icon} size={14} />
          {p.label}
        </div>
      ))}

      {!compromised && (
        <div style={{
          background:"var(--black3)",border:"1px solid var(--red)",
          padding: isMobile ? 24 : 40,
          maxWidth:480,width:"100%",borderRadius:4,
          boxShadow:"0 0 60px rgba(232,0,29,0.4)",
          animation:"popIn 0.4s ease",position:"relative",zIndex:220,
        }}>
          {step === 0 && (
            <>
              <div style={{fontFamily:"var(--display)",fontSize: isMobile?24:32,color:"var(--red)",letterSpacing:4,marginBottom:8}}>
                FREE SECURITY TOOL
              </div>
              <div style={{fontSize: isMobile?11:13,fontFamily:"var(--mono)",color:"var(--grey)",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                SecurityGuard_Pro_v2.exe — 2.4 MB —
                <span style={{display:"flex",gap:2}}>
                  {[0,1,2,3,4].map(i=><Icon key={i} name="star" size={11} color="#e8001d"/>)}
                </span>
              </div>
              <div style={{background:"#0d0d0f",padding: isMobile?"12px":"16px",borderRadius:4,marginBottom:20,fontSize: isMobile?13:14,lineHeight:1.8}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <Icon name="check" size={16} color="#e8001d"/>
                  <strong style={{color:"var(--white)"}}>Remove all viruses instantly</strong>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <Icon name="check" size={16} color="#e8001d"/>
                  <strong style={{color:"var(--white)"}}>Protect your files & data</strong>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <Icon name="check" size={16} color="#e8001d"/>
                  <strong style={{color:"var(--white)"}}>100% FREE — No credit card needed</strong>
                </div>
                <span style={{color:"var(--grey)",fontSize:12}}>Trusted by 10M+ users worldwide</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={() => setStep(1)} style={{
                  flex:1,padding:"13px",background:"var(--red)",border:"none",
                  color:"var(--white)",fontFamily:"var(--display)",fontSize: isMobile?17:20,
                  letterSpacing:3,cursor:"pointer",borderRadius:4,
                  boxShadow:"0 0 20px rgba(232,0,29,0.5)",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                }}>
                  <Icon name="download" size={20} color="#fff"/>
                  INSTALL NOW
                </button>
                <button onClick={onClose} style={{
                  padding:"13px 16px",background:"none",
                  border:"1px solid #333",color:"var(--grey)",
                  fontFamily:"var(--mono)",fontSize:11,cursor:"pointer",borderRadius:4,
                }}>Skip</button>
              </div>
              <div style={{fontSize:10,color:"#555",marginTop:10,textAlign:"center"}}>
                By installing, you agree to our Terms of Service
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div style={{fontFamily:"var(--display)",fontSize: isMobile?22:28,color:"var(--white)",letterSpacing:3,marginBottom:14}}>
                INSTALLING...
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--grey)",marginBottom:8}}>
                SecurityGuard_Pro_v2.exe
              </div>
              <div style={{height:8,background:"#111",borderRadius:4,overflow:"hidden",marginBottom:20}}>
                <div style={{height:"100%",background:"var(--red)",animation:"progressBar 2s ease forwards",boxShadow:"0 0 10px var(--red)"}}/>
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize: isMobile?10:11,color:"var(--grey)",marginBottom:20,lineHeight:2.2}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="check" size={12}/> Extracting files...
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="database" size={12}/> Reading system registry...
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,color:"var(--red)"}}>
                  <Icon name="shield" size={12}/> Disabling antivirus protection...
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,color:"var(--red)"}}>
                  <Icon name="door" size={12}/> Opening backdoor connection...<span className="blink">█</span>
                </div>
              </div>
              <button onClick={spawnPopups} style={{
                width:"100%",padding:13,background:"var(--red)",border:"none",
                color:"var(--white)",fontFamily:"var(--display)",fontSize: isMobile?17:20,
                letterSpacing:3,cursor:"pointer",borderRadius:4,
              }}>CONTINUE INSTALLATION →</button>
            </>
          )}
        </div>
      )}

      {finalMsg && (
        <div style={{
          position:"fixed",inset:0,zIndex:300,
          display:"flex",alignItems:"center",justifyContent:"center",
          background:"rgba(0,0,0,0.92)",padding:16,
        }}>
          <div style={{
            maxWidth:560,width:"100%",
            background:"#000",border:"3px solid var(--red)",
            padding: isMobile ? 24 : 40,textAlign:"center",borderRadius:4,
            boxShadow:"0 0 80px rgba(232,0,29,0.6)",
            animation:"popIn 0.5s ease",
            maxHeight:"90vh",overflowY:"auto",
          }}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <Icon name="skull" size={isMobile?56:72} />
            </div>
            <div style={{
              fontFamily:"var(--display)",fontSize:"clamp(20px,5vw,42px)",
              color:"var(--red)",letterSpacing:4,lineHeight:1.2,marginBottom:16,
              textShadow:"0 0 30px var(--red)",
            }}>TROJAN HORSE ATTACK<br/>SIMULATED</div>
            <div style={{
              background:"rgba(232,0,29,0.1)",border:"1px solid rgba(232,0,29,0.3)",
              padding: isMobile?"12px 16px":"20px",borderRadius:4,marginBottom:20,
              fontFamily:"var(--mono)",fontSize: isMobile?11:13,lineHeight:2.2,color:"var(--grey)",
              textAlign:"left",
            }}>
              {[
                {l:"THREAT",v:"Trojan.Horse.Backdoor.v4", icon:"virus"},
                {l:"FILES AFFECTED",v:"1,247 files encrypted", icon:"lock"},
                {l:"DATA EXFILTRATED",v:"Passwords, banking info", icon:"credit-card"},
                {l:"STATUS",v:"System fully compromised", icon:"warning"},
              ].map((row,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <Icon name={row.icon} size={13}/>
                  <span style={{color:"var(--red)"}}>{row.l}:</span>
                  <span>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize: isMobile?13:15,color:"var(--white)",marginBottom:8,lineHeight:1.8}}>
              <strong style={{color:"var(--red)"}}>THIS WAS A SIMULATION.</strong><br/>
              You just experienced how a Trojan Horse works. You were tricked into installing malicious software disguised as a helpful tool.
            </div>
            <div style={{fontSize: isMobile?12:13,color:"var(--grey)",marginBottom:20,lineHeight:1.8}}>
              Real Trojans use the same tactics: fake software, urgent alerts, trust signals.<br/>
              <strong style={{color:"var(--white)"}}>Always verify before you install.</strong>
            </div>
            <button onClick={onClose} style={{
              padding: isMobile?"12px 24px":"14px 40px",background:"var(--red)",border:"none",
              color:"var(--white)",fontFamily:"var(--display)",fontSize: isMobile?18:22,
              letterSpacing:4,cursor:"pointer",borderRadius:4,
              boxShadow:"0 0 20px rgba(232,0,29,0.5)",
            }}>I UNDERSTAND →</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [showSim, setShowSim] = useState(false);
  const [typed, setTyped] = useState("");
  const { isMobile, isTablet } = useBreakpoint();
  const fullText = "A Trojan Horse is malware that disguises itself as legitimate software to gain unauthorized access to your system.";

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= fullText.length) { setTyped(fullText.slice(0, i)); i++; }
      else clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, []);

  const stats = [
    {icon:"virus",  val:"1986", label:"First Trojan Discovered"},
    {icon:"shield", val:"70M+", label:"Attacks Every Year"},
    {icon:"server", val:"90%",  label:"Enter Systems Undetected"},
    {icon:"globe",  val:"#1",   label:"Worldwide Cyber Threat"},
  ];

  return (
    <>
      {showSim && <TrojanSimulation onClose={() => setShowSim(false)} />}

      {/* Hero */}
      <section style={{
        minHeight:"100vh",paddingTop:64,
        background:"radial-gradient(ellipse at 70% 50%, rgba(120,0,15,0.25) 0%, var(--black) 60%)",
        display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
        position:"relative",overflow:"hidden",
        padding: isMobile ? "90px 20px 48px" : isTablet ? "100px 32px 60px" : "100px 48px 60px",
      }}>
        <div style={{
          position:"absolute",inset:0,opacity:0.03,
          backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 40px,var(--red) 40px,var(--red) 41px),
                           repeating-linear-gradient(90deg,transparent,transparent 40px,var(--red) 40px,var(--red) 41px)`,
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)",
        }}/>

        <div style={{maxWidth:700,position:"relative",zIndex:2,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:"rgba(232,0,29,0.12)",border:"1px solid rgba(232,0,29,0.4)",
            padding:"5px 14px",borderRadius:2,marginBottom:20,
            fontFamily:"var(--mono)",fontSize: isMobile?10:12,color:"var(--red)",
          }}>
            <span className="blink" style={{width:7,height:7,borderRadius:"50%",background:"var(--red)",display:"inline-block"}}/>
            THREAT LEVEL: CRITICAL
          </div>

          <h1 style={{
            fontFamily:"var(--display)",
            fontSize:"clamp(48px,10vw,96px)",
            lineHeight:0.9,letterSpacing:4,marginBottom:20,
          }}>
            TROJAN 
            <span style={{color:"var(--red)",textShadow:"0 0 30px var(--red)"}}> HORSE</span>
          </h1>

          <div style={{
            fontFamily:"var(--mono)",fontSize:"clamp(11px,1.5vw,15px)",
            color:"var(--grey)",lineHeight:1.8,marginBottom:28,
            borderLeft:"3px solid var(--red)",paddingLeft:16,
            minHeight:60,maxWidth:700,width:"100%",
          }}>
            {typed}<span className="blink" style={{color:"var(--red)"}}>|</span>
          </div>

          {/* CTA Trap */}
          <div style={{
            background:"rgba(232,0,29,0.06)",border:"1px solid rgba(232,0,29,0.3)",
            padding: isMobile ? 20 : 28,borderRadius:4,
            marginBottom:20,maxWidth:480,width:"100%",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{
                background:"var(--red)",width:36,height:36,
                display:"flex",alignItems:"center",justifyContent:"center",
                borderRadius:4,flexShrink:0,
              }}>
                <Icon name="shield" size={20} color="#fff"/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize: isMobile?14:16,color:"var(--white)"}}>CyberShield Pro — FREE</div>
                <div style={{fontSize:11,color:"var(--grey)",fontFamily:"var(--mono)",display:"flex",alignItems:"center",gap:4}}>
                  <span style={{display:"flex",gap:1}}>
                    {[0,1,2,3,4].map(i=><Icon key={i} name="star" size={10} color="#e8001d"/>)}
                  </span>
                  · 10M+ downloads · SAFE
                </div>
              </div>
            </div>
            <div style={{fontSize: isMobile?12:13,color:"var(--grey)",marginBottom:16,lineHeight:1.7}}>
              Install our free scanner to read the full report and protect your system from Trojans.
            </div>
            <button onClick={() => setShowSim(true)} style={{
              width:"100%",padding:"13px",
              background:"linear-gradient(135deg,var(--red),var(--red-dim))",
              border:"none",color:"var(--white)",
              fontFamily:"var(--display)",fontSize: isMobile?19:22,letterSpacing:4,
              cursor:"pointer",borderRadius:4,
              boxShadow:"0 0 20px rgba(232,0,29,0.4)",
              animation:"pulse-red 2s infinite",
              display:"flex",alignItems:"center",justifyContent:"center",gap:12,
            }}>
              <Icon name="download" size={22} color="#fff"/>
              INSTALL TO LEARN MORE
            </button>
            <div style={{fontSize:10,color:"#555",textAlign:"center",marginTop:8,fontFamily:"var(--mono)"}}>
              Free • No credit card • Instant access
            </div>
          </div>
        </div>

        {/* Decorative horse */}
        {!isMobile && (
          <div style={{
            position:"absolute",right:"4%",top:"50%",transform:"translateY(-50%)",
            opacity:0.04,userSelect:"none",pointerEvents:"none",
          }}>
            <Icon name="horse" size={280} color="var(--red)"/>
          </div>
        )}
      </section>

      {/* Stats bar */}
      <div style={{
        background:"var(--black3)",
        borderTop:"1px solid rgba(232,0,29,0.2)",
        borderBottom:"1px solid rgba(232,0,29,0.2)",
        padding: isMobile ? "24px 20px" : "32px 48px",
        display:"grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
        gap: isMobile ? 16 : 24,
      }}>
        {stats.map((s,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{
              width:40,height:40,border:"1px solid rgba(232,0,29,0.4)",
              borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",
              flexShrink:0,
            }}>
              <Icon name={s.icon} size={20}/>
            </div>
            <div>
              <div style={{fontFamily:"var(--display)",fontSize: isMobile?22:28,color:"var(--red)",letterSpacing:2}}>
                {s.val}
              </div>
              <div style={{fontSize: isMobile?10:12,color:"var(--grey)",fontFamily:"var(--mono)",lineHeight:1.3}}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </>
  );
};

// ─── DISCUSSION PAGE ──────────────────────────────────────────────────────────
const DiscussionPage = () => {
  const { isMobile } = useBreakpoint();
  const types = [
    {name:"Remote Access Trojan (RAT)",icon:"eye",severity:"CRITICAL",
      desc:"The most dangerous type. RATs give attackers full control — viewing webcams, keylogging, accessing files, and executing commands. Famous RATs include DarkComet and BlackShades.",
      example:"Example: In 2013, 'Blackshades' RAT infected over 500,000 computers in 100+ countries. Victims' webcams were activated without their knowledge."},
    {name:"Banking Trojan",icon:"bank",severity:"HIGH",
      desc:"Designed to steal financial information. They intercept banking sessions, inject fake login pages, and steal credentials. Zeus and TrickBot are notorious examples.",
      example:"Example: Zeus Trojan infected 3.6 million PCs in the US alone, stealing banking credentials and causing $100M+ in losses."},
    {name:"Downloader Trojan",icon:"arrow-down",severity:"HIGH",
      desc:"Acts as a delivery mechanism. The initial infection appears harmless, but it silently downloads and installs additional malware from remote servers.",
      example:"Example: Emotet started as a banking Trojan but evolved into a major downloader, distributing ransomware to businesses worldwide."},
    {name:"Rootkit Trojan",icon:"wrench",severity:"CRITICAL",
      desc:"Hides deep in the operating system, making detection extremely difficult. Can survive reboots and antivirus scans by modifying core OS files.",
      example:"Example: Sony BMG's 2005 copy-protection software secretly installed a rootkit on millions of customers' computers."},
    {name:"Ransomware Trojan",icon:"lock",severity:"CRITICAL",
      desc:"Encrypts all files and demands payment (usually crypto) for the decryption key. Often spreads through email attachments disguised as invoices or documents.",
      example:"Example: WannaCry (2017) infected 230,000 computers in 150 countries, causing $4 billion in damages targeting hospitals, banks, and telecoms."},
  ];

  const spreadMethods = [
    {icon:"mail",      m:"Phishing Emails",   d:"Malicious attachments disguised as invoices or documents"},
    {icon:"globe",     m:"Fake Downloads",    d:"Cracked software, pirated games, or counterfeit security tools"},
    {icon:"radio",     m:"Social Media",      d:"Malicious links in DMs promising free gifts or prizes"},
    {icon:"usb",       m:"USB Drives",        d:"Infected physical media left in public places"},
    {icon:"smartphone",m:"Malicious Apps",   d:"Fake apps on unofficial stores or sideloading"},
    {icon:"cursor",    m:"Drive-by",          d:"Visiting compromised websites triggers automatic downloads"},
  ];

  return (
    <section style={{padding: isMobile?"80px 20px 60px":"100px 48px 80px",maxWidth:1000,margin:"0 auto"}}>
      <SectionTitle>TYPES & MECHANICS</SectionTitle>
      <p style={{color:"var(--grey)",fontSize: isMobile?13:15,lineHeight:1.9,marginTop:16,marginBottom:40,
        borderLeft:"3px solid var(--red)",paddingLeft:16}}>
        Trojan Horses operate through social engineering — exploiting human psychology rather than system vulnerabilities.
        Understanding how they work is the first line of defense.
      </p>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {types.map((t,i) => (
          <div key={i} style={{
            background:"var(--black3)",border:"1px solid rgba(232,0,29,0.15)",
            padding: isMobile ? 20 : 28,borderRadius:4,
            borderLeft:`4px solid ${t.severity==="CRITICAL"?"var(--red)":"var(--red-dim)"}`,
          }}>
            <div style={{display:"flex",alignItems:"flex-start",gap: isMobile ? 14 : 20}}>
              <div style={{flexShrink:0,marginTop:2}}>
                <Icon name={t.icon} size={isMobile?28:36}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontFamily:"var(--display)",fontSize: isMobile?17:22,letterSpacing:2}}>{t.name}</span>
                  <span style={{
                    fontFamily:"var(--mono)",fontSize:9,padding:"3px 8px",borderRadius:2,
                    background:t.severity==="CRITICAL"?"rgba(232,0,29,0.2)":"rgba(155,0,19,0.2)",
                    color:t.severity==="CRITICAL"?"var(--red)":"var(--red-dim)",
                    border:`1px solid ${t.severity==="CRITICAL"?"var(--red)":"var(--red-dim)"}`,
                    whiteSpace:"nowrap",
                  }}>{t.severity}</span>
                </div>
                <p style={{color:"var(--grey)",fontSize: isMobile?13:14,lineHeight:1.8,marginBottom:10}}>{t.desc}</p>
                <div style={{
                  background:"rgba(0,0,0,0.4)",padding:"10px 14px",borderRadius:4,
                  fontFamily:"var(--mono)",fontSize: isMobile?10:12,color:"#aaa",
                  borderLeft:"2px solid rgba(232,0,29,0.3)",
                }}>{t.example}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:52}}>
        <SectionTitle small>HOW TROJANS SPREAD</SectionTitle>
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)",
          gap:14,marginTop:24,
        }}>
          {spreadMethods.map((s,i) => (
            <div key={i} style={{
              background:"var(--black2)",border:"1px solid rgba(232,0,29,0.15)",
              padding: isMobile ? 16 : 20,borderRadius:4,
            }}>
              <div style={{marginBottom:8}}>
                <Icon name={s.icon} size={20}/>
              </div>
              <div style={{fontWeight:700,fontSize: isMobile?12:14,marginBottom:5,color:"var(--white)"}}>
                {s.m}
              </div>
              <div style={{fontSize: isMobile?11:12,color:"var(--grey)",lineHeight:1.7}}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── ARTICLES PAGE ────────────────────────────────────────────────────────────
const ArticlesPage = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const articles = [
    {title:"What Was the WannaCry Ransomware Attack?",source:"Cloudflare Learning",date:"May 2017",tag:"RANSOMWARE",
      desc:"In May 2017, WannaCry spread to over 200,000 computers in 150+ countries using a stolen NSA exploit. Notable victims included FedEx, Honda, and the UK's NHS, which was forced to divert ambulances to alternate hospitals.",
      url:"https://www.cloudflare.com/learning/security/ransomware/wannacry-ransomware/"},
    {title:"The Big Four Banking Trojans — Zeus, Citadel, SpyEye & Carberp",source:"Kaspersky Official Blog",date:"2013",tag:"BANKING TROJAN",
      desc:"Zeus (Zbot), one of the most notorious banking Trojans ever built, infected tens of millions of machines and resulted in the theft of hundreds of millions of dollars. After its source code leaked in 2011, countless variants emerged globally.",
      url:"https://www.kaspersky.com/blog/the-big-four-banking-trojans/2956/"},
    {title:"Operation Aurora: 2010's Major Breach by Chinese Hackers",source:"Exabeam Security Blog",date:"Jan 2010",tag:"ESPIONAGE",
      desc:"A sophisticated Trojan-delivered attack infiltrated Google, Adobe, Yahoo, and 30+ corporations. Attributed to China's Elderwood Group, the operation stole intellectual property and targeted Gmail accounts of human rights activists.",
      url:"https://www.exabeam.com/blog/infosec-trends/operation-aurora-2010s-major-breach-by-chinese-hackers/"},
    {title:"You Only Click Twice: FinFisher's Global Proliferation",source:"The Citizen Lab",date:"Mar 2013",tag:"SPYWARE",
      desc:"Citizen Lab researchers found FinFisher government spyware deployed in 25 countries, targeting human rights activists and opposition leaders in Bahrain, Ethiopia, and beyond — recording Skype calls, keystrokes, and webcams.",
      url:"https://citizenlab.ca/2013/03/you-only-click-twice-finfishers-global-proliferation-2/"},
    {title:"Emotet's Back and It Isn't Wasting Any Time",source:"Malwarebytes Labs",date:"Dec 2021",tag:"BOTNET",
      desc:"Ten months after a global law enforcement takedown, Emotet — the world's most dangerous banking Trojan turned botnet — returned in November 2021 via TrickBot, immediately launching mass spam campaigns to re-infect corporate networks.",
      url:"https://blog.malwarebytes.com/trojans/2021/12/emotets-back-and-it-isnt-wasting-any-time"},
    {title:"Top Prevalent Malware with a Thousand Campaigns Migrates to macOS",source:"Check Point Research",date:"Jul 2021",tag:"CROSS-PLATFORM",
      desc:"Check Point Research revealed XLoader — a successor to FormBook — is the first widely distributed Trojan targeting both Windows and macOS. Available for $49 on darknet forums, it harvested credentials from victims in 69 countries.",
      url:"https://research.checkpoint.com/2021/top-prevalent-malware-with-a-thousand-campaigns-migrates-to-macos/"},
  ];

  return (
    <section style={{padding: isMobile?"80px 20px 60px":"100px 48px 80px",maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle>THREAT INTELLIGENCE FEED</SectionTitle>
      <p style={{color:"var(--grey)",fontSize: isMobile?12:15,lineHeight:1.9,marginTop:12,marginBottom:40,
        fontFamily:"var(--mono)"}}>
        // Real-world Trojan Horse attacks documented by cybersecurity researchers
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)",
        gap: isMobile?16:24,
      }}>
        {articles.map((a,i) => (
          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{
            background:"var(--black3)",border:"1px solid rgba(232,0,29,0.15)",
            borderRadius:4,overflow:"hidden",
            transition:"transform 0.2s,border-color 0.2s",cursor:"pointer",
            display:"block", textDecoration:"none",
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="rgba(232,0,29,0.5)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(232,0,29,0.15)";}}
          >
            <div style={{
              background:"rgba(232,0,29,0.08)",padding:"14px 20px",
              borderBottom:"1px solid rgba(232,0,29,0.1)",
              display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,
            }}>
              <span style={{
                fontFamily:"var(--mono)",fontSize:9,padding:"3px 8px",
                background:"rgba(232,0,29,0.15)",color:"var(--red)",
                border:"1px solid rgba(232,0,29,0.3)",borderRadius:2,whiteSpace:"nowrap",
              }}>{a.tag}</span>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--grey)",flexShrink:0}}>{a.date}</span>
            </div>
            <div style={{padding: isMobile?"18px":"24px"}}>
              <div style={{fontFamily:"var(--display)",fontSize: isMobile?16:18,letterSpacing:1,color:"var(--white)",marginBottom:6,lineHeight:1.3}}>
                {a.title}
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--red)",marginBottom:10}}>
                SOURCE: {a.source}
              </div>
              <div style={{fontSize: isMobile?12:13,color:"var(--grey)",lineHeight:1.8}}>{a.desc}</div>
              <div style={{marginTop:14,fontFamily:"var(--mono)",fontSize:11,color:"var(--red)",display:"flex",alignItems:"center",gap:6}}>
                READ FULL REPORT ↗
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

// ─── REFLECTION PAGE ──────────────────────────────────────────────────────────
const ReflectionPage = () => {
  const { isMobile } = useBreakpoint();
  return (
    <section style={{padding: isMobile?"80px 20px 60px":"100px 48px 80px",maxWidth:800,margin:"0 auto"}}>
      <SectionTitle>PERSONAL REFLECTION</SectionTitle>
      <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--grey)",marginTop:10,marginBottom:40,letterSpacing:2}}>
        // MY OWN PERSPECTIVE ON CYBERSECURITY
      </div>

      {[
        {n:"01",title:"The Illusion of Safety",
          body:`Before diving deep into this topic, I thought cybersecurity was something only large corporations needed to worry about. I was wrong. Studying Trojan Horses revealed how vulnerable ordinary people are — not because of technical flaws in their systems, but because of fundamental flaws in how we trust. The simulation on this website wasn't designed to scare you, but to make you feel, even briefly, the urgency that millions of real victims experience every year. The moment you hesitated before clicking "Install" — or the moment you didn't hesitate and clicked anyway — that was the lesson. Social engineering exploits trust, familiarity, and urgency. It doesn't need to be technically complex to be devastatingly effective.`},
        {n:"02",title:"Technology as a Double-Edged Sword",
          body:`What struck me most while researching this topic was how the same technologies that connect and empower us can be weaponized against us. Banking apps make our lives easier — and banking Trojans exploit that convenience. Remote access tools help IT professionals — and Remote Access Trojans give criminals the same power over innocent victims. FinFisher was ostensibly built for law enforcement — and was used to silence journalists and activists. I found myself grappling with a difficult question: Can we ever fully separate the legitimate uses of powerful technology from its potential for abuse? I don't have an easy answer, but I believe awareness is the first and most critical step.`},
        {n:"03",title:"Education as the Real Firewall",
          body:`After completing this project, I'm convinced that the most effective cybersecurity tool isn't a sophisticated antivirus or a next-generation firewall — it's an informed user. The technical defenses we build are only as strong as the human beings who interact with them. WannaCry spread because organizations hadn't patched a known vulnerability. Zeus succeeded because users clicked phishing emails. Emotet thrived because people trusted familiar-looking email threads. Every major Trojan attack succeeded because someone, somewhere, was not equipped with the knowledge to recognize the threat. That's why I built this simulation — not as a homework exercise, but as a genuine attempt to make one more person stop, think, and question before they click.`},
      ].map((p,i) => (
        <div key={i} style={{
          marginBottom:28,padding: isMobile ? "20px 20px 20px 20px" : 36,
          background:"var(--black3)",border:"1px solid rgba(232,0,29,0.15)",
          borderLeft:"4px solid var(--red)",borderRadius:4,position:"relative",
        }}>
          <div style={{
            position:"absolute",top: isMobile?10:20,right: isMobile?12:24,
            fontFamily:"var(--display)",fontSize: isMobile?40:60,
            color:"rgba(232,0,29,0.06)",letterSpacing:4,lineHeight:1,
          }}>{p.n}</div>
          <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--red)",letterSpacing:3,marginBottom:10}}>
            PARAGRAPH {p.n}
          </div>
          <div style={{fontFamily:"var(--display)",fontSize: isMobile?20:24,letterSpacing:3,color:"var(--white)",marginBottom:12}}>
            {p.title}
          </div>
          <div style={{fontSize: isMobile?13:15,color:"#bbb",lineHeight:2}}>{p.body}</div>
        </div>
      ))}
    </section>
  );
};

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
const AboutPage = () => {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section style={{padding: isMobile?"80px 20px 60px":"100px 48px 80px",maxWidth:900,margin:"0 auto"}}>
      <SectionTitle>ABOUT THE CREATOR</SectionTitle>

      <div style={{
        display:"grid",
        gridTemplateColumns: isMobile||isTablet ? "1fr" : "220px 1fr",
        gap: isMobile ? 28 : 48,
        marginTop:40,alignItems:"start",
      }}>
        {/* Avatar */}
        <div style={{display:"flex",flexDirection: isMobile?"row":"column",gap:20,alignItems: isMobile?"center":"flex-start"}}>
          <div style={{
            width: isMobile?100:180,height: isMobile?100:180,
            background:"linear-gradient(135deg,var(--black3),#1a0005)",
            border:"2px solid var(--red)",borderRadius:4,
            display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,
            boxShadow:"0 0 40px rgba(232,0,29,0.2)",
          }}>
            <img src="./pic.jpg" alt="" className="w-full h-full object-cover"/>
          </div>
          <div style={{
            background:"rgba(232,0,29,0.08)",border:"1px solid rgba(232,0,29,0.3)",
            padding:"12px 14px",borderRadius:4,
            fontFamily:"var(--mono)",fontSize:11,lineHeight:2,flex: isMobile?1:"auto",
          }}>
            <div style={{color:"var(--red)"}}>STATUS: ONLINE</div>
            <div style={{color:"var(--grey)"}}>ROLE: Student</div>
            <div style={{color:"var(--grey)"}}>COURSE: BSIT</div>
            <div style={{color:"var(--grey)"}}>YEAR: 3RD</div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{fontFamily:"var(--display)",fontSize:"clamp(32px,6vw,48px)",letterSpacing:4,marginBottom:4}}>
            LAWRENCE <span style={{color:"var(--red)"}}>MACABABAYAO</span>
          </div>
          <div style={{fontFamily:"var(--mono)",fontSize: isMobile?10:12,color:"var(--grey)",marginBottom:24,letterSpacing:1,lineHeight:1.6}}>
            INFORMATION TECHNOLOGY STUDENT — GINGOOG CITY COLLEGES
          </div>

          <p style={{fontSize: isMobile?13:15,color:"#bbb",lineHeight:2,marginBottom:20}}>
            Hello! I’m a third-year IT student who is passionate about web development and creating interactive websites. I enjoy designing websites that are simple, modern, and easy to use while also learning how different systems work behind the scenes. I like working on projects that combine creativity and functionality, especially websites related to technology.
          </p>
          <p style={{fontSize: isMobile?13:15,color:"#bbb",lineHeight:2,marginBottom:28}}>
            I continue to improve my skills in programming and backend development while creating systems that are useful and easy to use. My goal: <strong style={{color:"var(--white)"}}>become a successful web developer, build a high-end PC, and play all the games I want.</strong>
          </p>

          <div style={{
            display:"grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
            gap:12,marginBottom:28,
          }}>
            {[
              {l:"Email",   v:"pencilgon2@gmail.com", icon:"mail"},
              {l:"Course",  v:"BS Information Technology",  icon:"graduation"},
              {l:"School",  v:"Gingoog City Colleges",   icon:"building"},
              {l:"Year",    v:"3rd Year",          icon:"calendar"},
            ].map((d,i)=>(
              <div key={i} style={{
                background:"var(--black2)",border:"1px solid rgba(232,0,29,0.15)",
                padding: isMobile?"14px":"16px",borderRadius:4,
              }}>
                <div style={{marginBottom:6}}>
                  <Icon name={d.icon} size={18}/>
                </div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--red)",marginBottom:4,letterSpacing:2}}>
                  {d.l.toUpperCase()}
                </div>
                <div style={{fontSize: isMobile?11:13,color:"var(--white)",fontWeight:600}}>{d.v}</div>
              </div>
            ))}
          </div>

          <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--grey)",letterSpacing:3,marginBottom:12}}>
            TECHNICAL SKILLS
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["HTML/CSS","JavaScript","React","PHP","C#"].map((s,i)=>(
              <span key={i} style={{
                fontFamily:"var(--mono)",fontSize: isMobile?10:11,padding:"5px 12px",
                background:"rgba(232,0,29,0.08)",
                border:"1px solid rgba(232,0,29,0.25)",
                color:"var(--grey)",borderRadius:2,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const SectionTitle = ({ children, small }) => (
  <div style={{display:"flex",alignItems:"center",gap:14}}>
    <div style={{width:4,height:small?26:34,background:"var(--red)",flexShrink:0}}/>
    <h2 style={{
      fontFamily:"var(--display)",
      fontSize: small ? "clamp(18px,3vw,26px)" : "clamp(24px,4vw,44px)",
      letterSpacing:4,color:"var(--white)",lineHeight:1,
    }}>{children}</h2>
  </div>
);

const Footer = () => {
  const { isMobile } = useBreakpoint();
  return (
    <footer style={{
      background:"var(--black3)",borderTop:"1px solid rgba(232,0,29,0.15)",
      padding: isMobile ? "24px 20px" : "32px 48px",
      display:"flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent:"space-between",alignItems: isMobile?"flex-start":"center",
      gap:16,
    }}>
      <div>
        <div style={{fontFamily:"var(--display)",fontSize:20,letterSpacing:4,display:"flex",alignItems:"center",gap:10}}>
          <Icon name="horse" size={22}/>
          TROJAN <span style={{color:"var(--red)"}}>HORSE</span>
        </div>
        <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--grey)",marginTop:4}}>
          CYBERSECURITY SIMULATION — EDUCATIONAL PROJECT
        </div>
      </div>
      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"#444",textAlign: isMobile?"left":"right"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,justifyContent: isMobile?"flex-start":"flex-end"}}>
          <Icon name="warning" size={12} color="#444"/>
          FOR EDUCATIONAL PURPOSES ONLY
        </div>
        <div style={{marginTop:4}}>No real malware. No actual system access. Stay safe online.</div>
      </div>
    </footer>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [active, setActive] = useState("Home");

  const renderPage = () => {
    switch(active) {
      case "Home":       return <HomePage />;
      case "Discussion": return <DiscussionPage />;
      case "Articles":   return <ArticlesPage />;
      case "Reflection": return <ReflectionPage />;
      case "About":      return <AboutPage />;
      default:           return <HomePage />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <CustomCursor />
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <div style={{
        opacity: splashDone ? 1 : 0,
        transition:"opacity 0.6s ease",
        minHeight:"100vh",display:"flex",flexDirection:"column",
      }}>
        <Navbar active={active} setActive={setActive} />
        <main style={{flex:1}}>{renderPage()}</main>
      </div>
    </>
  );
}
