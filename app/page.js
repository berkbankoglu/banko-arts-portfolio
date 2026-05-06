'use client'

import React, { useState, useRef, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import Lenis from 'lenis';

/* ─── data ─────────────────────────────────────────────── */
const projects = [
  { id:1,  title:'Exterior — Residential', category:'exterior', type:'render', image:'/images/architecture/Exterior 1.png' },
  { id:2,  title:'Exterior — Garden View', category:'exterior', type:'render', image:'/images/architecture/Exterior 2.png' },
  { id:3,  title:'Exterior — Facade',      category:'exterior', type:'render', image:'/images/architecture/Exterior 3.png' },
  { id:4,  title:'Exterior — Detail',      category:'exterior', type:'render', image:'/images/architecture/Exterior 3.1.png' },
  { id:5,  title:'Exterior — Night',       category:'exterior', type:'render', image:'/images/architecture/Exterior 3.2.png' },
  { id:6,  title:'Exterior — Full View',   category:'exterior', type:'render', image:'/images/architecture/Exterior.png' },
  { id:7,  title:'Living Room',            category:'interior', type:'render', image:'/images/architecture/Living Room.png' },
  { id:8,  title:'Bedroom',               category:'interior', type:'render', image:'/images/architecture/Bedroom.png' },
  { id:9,  title:'Kitchen',               category:'interior', type:'render', image:'/images/architecture/Kitchen.png' },
  { id:10, title:'Bathroom',              category:'interior', type:'render', image:'/images/architecture/Bathroom.png' },
  { id:11, title:'Bathroom — II',         category:'interior', type:'render', image:'/images/architecture/Bathroom 2.png' },
  { id:12, title:'Rooftop',               category:'interior', type:'render', image:'/images/architecture/RoofTop.png' },
  { id:13, title:'Both Views',            category:'animation',type:'video',  image:'/images/architecture/Both.png',        video:'/videos/both_views_animation.mp4' },
  { id:14, title:'Bedroom Animation',     category:'animation',type:'video',  image:'/images/architecture/Bedroom.png',     video:'/videos/bedroom_animation.mp4' },
  { id:15, title:'Living Room Animation', category:'animation',type:'video',  image:'/images/architecture/Living Room.png', video:'/videos/livingroom_animation.mp4' },
  { id:16, title:'Kitchen Animation',     category:'animation',type:'video',  image:'/images/architecture/Kitchen.png',     video:'/videos/kitchen_animation.mp4' },
  { id:17, title:'Exterior Animation I',  category:'animation',type:'video',  image:'/images/architecture/Exterior 1.png',  video:'/videos/exterior1_animation.mp4' },
  { id:18, title:'Exterior Animation II', category:'animation',type:'video',  image:'/images/architecture/Exterior 2.png',  video:'/videos/exterior2_animation.mp4' },
  { id:19, title:'Exterior Animation III',category:'animation',type:'video',  image:'/images/architecture/Exterior 3.png',  video:'/videos/exterior3_animation.mp4' },
  { id:20, title:'Rooftop Animation',     category:'animation',type:'video',  image:'/images/architecture/RoofTop.png',     video:'/videos/rooftop_animation.mp4' },
];

/* ─── Section wipe hook ─────────────────────────────────── */
function useSectionWipe() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('leaving');
          e.target.classList.add('visible');
        } else {
          const goingUp = e.boundingClientRect.top > 0;
          if (goingUp) {
            e.target.classList.remove('visible');
            e.target.classList.remove('leaving');
          } else {
            e.target.classList.remove('visible');
            e.target.classList.add('leaving');
          }
        }
      });
    }, { threshold: 0.15 });

    const attach = () => {
      document.querySelectorAll('.section-wipe').forEach(el => obs.observe(el));
    };

    attach();

    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { obs.disconnect(); mo.disconnect(); };
  }, []);
}

/* ─── Menu overlay ─────────────────────────────────────── */
/* ─── Sol çubuk + Menü tek element ─────────────────────── */
function LeftBar({ menuOpen, onOpen, onClose, onNav, activePage }) {
  const navItems = ['Works', 'Services', 'About', 'Contact'];
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => setContentVisible(true), 320);
      return () => clearTimeout(t);
    } else {
      setContentVisible(false);
    }
  }, [menuOpen]);

  const item = (delay) => ({
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  return (
    <>
      <div className={`menu-backdrop${menuOpen ? ' open' : ''}`} onClick={onClose} />

      <div className={`side-bar side-bar--left${menuOpen ? ' menu-open' : ''}`}
        onClick={!menuOpen ? onOpen : undefined}
        style={{ flexDirection:'column', justifyContent: menuOpen ? 'flex-start' : 'center' }}>

        {!menuOpen && <span>Menu</span>}

        {menuOpen && (
          <div style={{ display:'flex', flexDirection:'column', height:'100%', width:'100%' }}>

            {/* Logo — büyük, ortada */}
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:32, ...item(0) }}>
              <img src="/images/logo-white.svg" alt="Banko Arts" style={{ display:'block', width:180, height:'auto' }} />
            </div>

            {/* Kapat butonu */}
            <div style={{ position:'absolute', top:24, right:24, ...item(0.05) }}>
              <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:26, lineHeight:1, transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>×</button>
            </div>

            {/* Divider */}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', marginBottom:24, ...item(0.1) }} />

            {/* Nav label */}
            <div style={{ ...item(0.15) }}>
              <p style={{ fontSize:10, letterSpacing:'0.14em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:18 }}>Navigation</p>
            </div>

            {/* Nav links */}
            {navItems.map((navItem, i) => (
              <div key={navItem} style={{ ...item(0.2 + i * 0.07) }}>
                <button onClick={() => { onNav(navItem.toLowerCase()); onClose(); }}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    background:'none', border:'none', padding:'10px 0', width:'100%', textAlign:'left',
                    fontSize:36, fontWeight:700, letterSpacing:'-0.02em',
                    color: activePage === navItem.toLowerCase() ? 'var(--yellow)' : '#fff',
                    borderBottom:'1px solid rgba(255,255,255,0.08)', transition:'color 0.2s',
                  }}
                  onMouseEnter={e => { if (activePage !== navItem.toLowerCase()) e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}
                  onMouseLeave={e => { if (activePage !== navItem.toLowerCase()) e.currentTarget.style.color='#fff'; }}>
                  {activePage === navItem.toLowerCase() && <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--yellow)', flexShrink:0 }} />}
                  {navItem}
                </button>
              </div>
            ))}

            {/* Alt */}
            <div style={{ marginTop:'auto', ...item(0.55) }}>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', marginBottom:18 }} />
              <p style={{ fontSize:10, letterSpacing:'0.14em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:12 }}>Contact</p>
              <a href="mailto:info@bankoarts.com" style={{ fontSize:13, color:'rgba(255,255,255,0.55)', display:'block', marginBottom:6, transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}>
                info@bankoarts.com
              </a>
              <a href="https://instagram.com/bankoarts" target="_blank" rel="noreferrer"
                style={{ fontSize:13, color:'rgba(255,255,255,0.55)', transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}>
                Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── ProjectCard ───────────────────────────────────────── */
function ProjectCard({ project, onClick }) {
  const videoRef = useRef(null);
  const wrapRef  = useRef(null);
  const cardRef  = useRef(null);
  const glareRef = useRef(null);
  const rafRef   = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top)  / rect.height;
      card.style.transform = `perspective(900px) rotateX(${(y-0.5)*-12}deg) rotateY(${(x-0.5)*12}deg) scale3d(1.03,1.03,1.03)`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${x*100}% ${y*100}%, rgba(255,255,255,0.1) 0%, transparent 65%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (project.type === 'video' && videoRef.current) videoRef.current.play().catch(()=>{});
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
    if (project.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div ref={wrapRef} className="reveal" style={{ perspective:'900px' }}>
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} onClick={() => onClick(project)}
        style={{
          position:'relative', overflow:'hidden', cursor:'pointer', background:'#f0efed',
          transformStyle:'preserve-3d',
          transition:'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        }}>
        <img src={project.image} alt={project.title}
          style={{ display:'block', width:'100%', height:'auto',
            transition:'opacity 0.4s cubic-bezier(0.22,1,0.36,1)',
            opacity: hovered && project.type==='video' ? 0 : 1 }}
        />
        {project.type === 'video' && (
          <video ref={videoRef} src={project.video} muted loop playsInline
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
              opacity: hovered ? 1 : 0, transition:'opacity 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
        )}
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0, transition:'opacity 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
        <div ref={glareRef} style={{ position:'absolute', inset:0, opacity:0, pointerEvents:'none', transition:'opacity 0.3s ease' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'16px 18px',
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          opacity: hovered ? 1 : 0,
          transition:'transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s cubic-bezier(0.22,1,0.36,1)' }}>
          <p style={{ fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600, color:'#fff' }}>{project.title}</p>
          {project.type==='video' && <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginTop:2 }}>Animation</p>}
        </div>
        {project.type==='video' && (
          <div style={{ position:'absolute', top:'50%', left:'50%',
            transform: hovered ? 'translate(-50%,-50%) scale(0)' : 'translate(-50%,-50%) scale(1)',
            transition:'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
            width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)',
            backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M5 3l9 5-9 5V3z" fill="white"/></svg>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Lightbox ──────────────────────────────────────────── */
function Lightbox({ project, onClose, onNext, onPrev }) {
  const videoRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (project?.type === 'video' && videoRef.current) videoRef.current.play().catch(()=>{});
  }, [project]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key==='Escape') handleClose();
      if (e.key==='ArrowRight') onNext();
      if (e.key==='ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onNext, onPrev]);

  const handleClose = () => { setOpen(false); setTimeout(onClose, 280); };
  if (!visible) return null;

  const navBtn = { position:'absolute', top:'50%', transform:'translateY(-50%)',
    width:44, height:44, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)',
    color:'#fff', fontSize:22, display:'flex', alignItems:'center', justifyContent:'center',
    backdropFilter:'blur(8px)', zIndex:10, transition:'background 0.2s' };

  return (
    <div className={`lightbox-backdrop${open?' open':''}`} onClick={handleClose}>
      <button onClick={handleClose} style={{ position:'absolute', top:24, right:28,
        background:'none', border:'none', color:'rgba(255,255,255,0.5)',
        fontSize:26, lineHeight:1, zIndex:10, transition:'color 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.color='#fff'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>×</button>
      <button onClick={e=>{e.stopPropagation();onPrev();}} style={{...navBtn,left:20}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>‹</button>
      <button onClick={e=>{e.stopPropagation();onNext();}} style={{...navBtn,right:20}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>›</button>
      <div className="lightbox-content" style={{ maxWidth:'88vw', maxHeight:'84vh', position:'relative' }}
        onClick={e=>e.stopPropagation()}>
        {project.type==='video'
          ? <video ref={videoRef} src={project.video} controls autoPlay style={{ maxWidth:'88vw', maxHeight:'84vh', display:'block' }}/>
          : <img src={project.image} alt={project.title} style={{ maxWidth:'88vw', maxHeight:'84vh', display:'block', objectFit:'contain' }}/>}
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:14 }}>
          {project.title}
        </p>
      </div>
    </div>
  );
}

/* ─── Dot Grid (WebGL) ───────────────────────────────────── */
function DotGrid() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef([-9999, -9999]);
  const rafRef    = useRef(null);
  const glRef     = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    glRef.current = gl;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform vec2  u_res;
      uniform vec2  u_mouse;
      uniform float u_dpr;
      void main() {
        float spacing = 14.0 * u_dpr;
        float radius  = 200.0 * u_dpr;
        vec2 px = gl_FragCoord.xy;
        px.y = u_res.y - px.y;
        vec2 cell = floor(px / spacing);
        vec2 dot  = (cell + 0.5) * spacing;
        vec2 diff = px - dot;
        float d   = length(diff);
        if (d > spacing * 0.5) { discard; return; }
        vec2  dm   = dot - u_mouse * u_dpr;
        float dist = length(dm);
        float inf  = max(0.0, 1.0 - dist / radius);
        float r    = (1.4 + inf * 2.0) * u_dpr;
        float dotD = length(diff);
        if (dotD > r) { discard; return; }
        float alpha = 0.22 + inf * 0.55;
        float aa    = 1.0 - smoothstep(r - 1.0, r, dotD);
        gl_FragColor = vec4(0.04, 0.04, 0.04, alpha * aa);
      }
    `;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uDpr   = gl.getUniformLocation(prog, 'u_dpr');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let W, H, dpr;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      W   = canvas.offsetWidth;
      H   = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = [e.clientX - rect.left, e.clientY - rect.top];
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uDpr,   dpr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
    />
  );
}

/* ─── Work Card ─────────────────────────────────────────── */
function WorkCard({ item, visible, index, imgRef }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      flexShrink:0, width:'clamp(280px, 26vw, 560px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(120px)',
      transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${0.1 + index*0.15}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${0.1 + index*0.15}s`,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ overflow:'hidden', borderRadius:4 }}>
        <img ref={imgRef} src={item.image} alt={item.title} draggable={false}
          style={{
            display:'block', width:'100%',
            aspectRatio:'3/4', objectFit:'cover',
            filter: hovered ? 'grayscale(0%)' : 'grayscale(60%)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition:'filter 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)',
            pointerEvents:'none',
          }}
        />
      </div>
      <div style={{ marginTop:18 }}>
        <p style={{ fontSize:16, fontWeight:700, letterSpacing:'-0.01em', marginBottom:6 }}>{item.title}</p>
        <p style={{ fontSize:12, color:'var(--muted)', letterSpacing:'0.04em' }}>{item.sub}</p>
      </div>
    </div>
  );
}

/* ─── Hero Title ─────────────────────────────────────────── */
function HeroTitle() {
  return (
    <div style={{ position:'relative', zIndex:1, width:'100%' }}>
      {/* BANKO ARTS büyük başlık */}
      <div style={{ display:'inline-block', background:'#f5e200', padding:'0.02em 0.08em 0.04em 0', marginBottom:'0.04em' }}>
        <span style={{ display:'block', fontSize:'clamp(88px, 11vw, 180px)', fontFamily:'var(--font-hero), sans-serif', fontWeight:700, letterSpacing:'-0.02em', lineHeight:0.95, color:'#0a0a0a', userSelect:'none' }}>BANKO</span>
      </div>
      <br/>
      <span style={{ display:'inline-block', fontSize:'clamp(88px, 11vw, 180px)', fontFamily:'var(--font-hero), sans-serif', fontWeight:700, letterSpacing:'-0.02em', lineHeight:0.95, color:'#0a0a0a', filter:'drop-shadow(5px 8px 0px rgba(0,0,0,0.13)) drop-shadow(10px 18px 28px rgba(0,0,0,0.09))', position:'relative', zIndex:2, userSelect:'none' }}>ARTS</span>
    </div>
  );
}

/* ─── Our Works Label ───────────────────────────────────── */
function OurWorksLabel({ imgHeight, visible }) {
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(80);

  useEffect(() => {
    if (!imgHeight || !textRef.current) return;
    let lo = 10, hi = 400, fs = 80;
    for (let i = 0; i < 20; i++) {
      fs = (lo + hi) / 2;
      textRef.current.style.fontSize = fs + 'px';
      const h = textRef.current.offsetHeight;
      if (h < imgHeight) lo = fs;
      else hi = fs;
    }
    setFontSize(Math.floor(lo));
  }, [imgHeight]);

  return (
    <div style={{
      width:'clamp(80px, 8vw, 140px)', flexShrink:0,
      height: imgHeight ? `${imgHeight}px` : '520px',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      opacity: visible ? 1 : 0,
      transition:'opacity 0.8s cubic-bezier(0.22,1,0.36,1)',
      position:'relative', zIndex:1,
    }}>
      <p ref={textRef} style={{
        writingMode:'vertical-rl',
        transform:'rotate(180deg)',
        fontSize: fontSize + 'px',
        fontFamily:'var(--font-anton), Impact, sans-serif',
        fontWeight:400,
        letterSpacing:'0.04em',
        textTransform:'uppercase',
        color:'var(--black)', userSelect:'none',
        lineHeight:1,
        whiteSpace:'nowrap',
        display:'block',
      }}>OUR WORKS</p>
    </div>
  );
}

/* ─── Contact Slide (viewport-pinned panels) ────────────── */
function ContactSlide({ showForm, leaving, openForm, closeForm }) {
  return (
    <>

      {/*
        Clip wrapper: sol kenar bu grid hücresinin sol kenarı,
        sağ kenar viewport'tan 92px içeride (sidebar sol kenarı).
        "right" negatif değer = sağa taşma.
        100vw - 100% = bu elementin sağ tarafından viewport sağına olan mesafe.
        Ondan 92px çıkartırsak sidebar sol kenarına dayanırız.
      */}
      {/* "Start My Project" panel — tam yükseklik, clip için wrapper gerekli */}
      <div style={{
        position:'absolute',
        top:0, bottom:0, left:0,
        right: 'calc(-1 * (100vw - 100% - 92px))',
        overflow:'hidden',
        pointerEvents: (showForm && !leaving) ? 'none' : 'all',
        transform: (showForm && !leaving) ? 'translateX(110%)' : 'translateX(0)',
        transition:'transform 2.1s cubic-bezier(0.77,0,0.18,1)',
        zIndex: (showForm || leaving) ? 0 : 1,
      }}>
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center',
          background:'var(--bg)', borderRadius:8,
          padding:'clamp(48px, 6vw, 80px) clamp(32px, 4vw, 60px)',
        }}>
          <h3 style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:24 }}>
            Start My Project
          </h3>
          <p style={{ fontSize:15, color:'var(--muted)', lineHeight:1.8, maxWidth:320, marginBottom:48 }}>
            Every standout project begins with one simple conversation. Tell us your vision and we'll get back personally.
          </p>
          <button onClick={openForm}
            style={{ padding:'16px 48px', background:'var(--black)', color:'#fff', border:'none', fontSize:13, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:4, cursor:'pointer', transition:'opacity 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.opacity='0.75'}
            onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
            Contact Us →
          </button>
        </div>
      </div>

      {/* Form panel — arka plan sağa uzanır ama form içeriği grid hücre genişliğinde kalır */}
      <div style={{
        position:'relative',
        zIndex: (showForm || leaving) ? 1 : 0,
        transform: leaving ? 'translateX(110%)' : showForm ? 'translateX(0)' : 'translateX(110%)',
        transition:'transform 2.1s cubic-bezier(0.77,0,0.18,1)',
        pointerEvents: (showForm && !leaving) ? 'all' : 'none',
        visibility: (showForm || leaving) ? 'visible' : 'hidden',
      }}>
        {/* Arka plan sağa viewport - 92px kadar uzanır */}
        <div style={{
          position:'absolute', inset:0,
          right: 'calc(-1 * (100vw - 100% - 92px))',
          background:'var(--yellow)', borderRadius:8,
          zIndex:0,
        }} />
        {/* İçerik grid hücre genişliğinde */}
        <div style={{ position:'relative', zIndex:1, padding:'clamp(24px, 3vw, 40px)' }}>
          <button onClick={closeForm}
            style={{ background:'none', border:'none', fontSize:12, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:24, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--black)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>
            ← Back
          </button>
          <ContactForm />
        </div>
      </div>
    </>
  );
}

/* ─── Contact Section ───────────────────────────────────── */
function ContactSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); else setVisible(false); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openForm = () => { setLeaving(false); setShowForm(true); };
  const closeForm = () => {
    setLeaving(true);
    setTimeout(() => { setShowForm(false); setLeaving(false); }, 2100);
  };

  return (
    <section id="section-contact" ref={ref} style={{ borderTop:'1px solid var(--sep)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'start', gap:80, padding:'120px 20px 100px' }}>

        {/* Sol — hiç değişmez */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-80px)',
          transition:'opacity 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s',
        }}>
          <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:16 }}>Get in touch</p>
          <h2 style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:32 }}>
            Let's Build<br/>Something<br/>Remarkable.
          </h2>
          <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8, maxWidth:320, marginBottom:48 }}>
            Photorealistic architectural visualizations delivered fast. Tell us about your project and we'll get back within 24 hours.
          </p>
          <div>
            {[
              ['Mail','info@bankoarts.com','mailto:info@bankoarts.com'],
              ['Instagram','@bankoarts','https://instagram.com/bankoarts'],
              ['Upwork','Banko Arts','https://upwork.com'],
              ['Freelancer','@brkbnkgll','https://freelancer.com'],
            ].map(([label,val,href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                style={{ display:'flex', gap:16, padding:'16px 0', borderBottom:'1px solid var(--border)', textDecoration:'none', transition:'opacity 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='0.6'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                <span style={{ fontSize:11, color:'var(--muted)', width:80, flexShrink:0, letterSpacing:'0.08em', textTransform:'uppercase', paddingTop:2 }}>{label}</span>
                <span style={{ fontSize:15, fontWeight:700, letterSpacing:'-0.01em' }}>{val}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sağ — slide panel: fixed-position clip container, viewport'a göre 92px'de biter */}
        <div style={{ position:'relative', minHeight:'clamp(480px, 55vh, 700px)' }}>
          {/* Bu div layout alanını tutar, içindeki fixed div viewport'a uzanır */}
          <ContactSlide
            showForm={showForm}
            leaving={leaving}
            openForm={openForm}
            closeForm={closeForm}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Flip Card Stats ───────────────────────────────────── */
const STAT_CARDS = [
  {
    icon: '◎',
    value: 'Top Rated Plus',
    sub: '$70K+ · 100 Jobs · 1,474 Hours',
    label: 'Upwork',
    back: 'Top Rated Plus on Upwork — awarded to the top 3% of freelancers. Over $70,000 in completed contracts across 100 jobs and 1,474 hours of architectural visualization and 3D rendering for clients worldwide.',
  },
  {
    icon: '✦',
    value: 'Preferred Freelancer',
    sub: '5.0 Rating · 342 Reviews · 99%',
    label: 'Freelancer.com',
    back: 'Preferred Freelancer badge with a perfect 5.0 rating, 342 client reviews and 99% job completion rate. Recognition given to top-performing freelancers with proven reliability and quality.',
  },
  {
    icon: '◆',
    value: '824+',
    sub: 'Completed Projects',
    label: 'Total Work',
    back: 'Over 824 architectural visualization projects completed across both platforms — exterior renders, interior scenes, 3D animations, and floor plans for clients in 30+ countries.',
  },
  {
    icon: '○',
    value: '10 Years',
    sub: 'Professional Experience',
    label: 'Since 2015',
    back: '10 years of professional 3D architectural visualization experience. From early freelance work to building a studio-level output — consistently delivering photorealistic renders that move projects forward.',
  },
];

function FlipCard({ card, index, sectionVisible }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{
        perspective: '1000px',
        cursor: 'pointer',
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 + index * 0.1}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 + index * 0.1}s`,
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: 280,
        transformStyle: 'preserve-3d',
        transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          border: '1px solid var(--border)',
          padding: '32px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#fff', textAlign: 'center', gap: 10,
        }}>
          <p style={{ fontSize: 'clamp(24px, 2vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{card.value}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>{card.sub}</p>
          <p style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{card.label}</p>
        </div>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          border: '1px solid var(--border)',
          padding: '32px 28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: 'var(--black)',
        }}>
          <span style={{ fontSize: 22, lineHeight: 1, color: 'var(--yellow)' }}>{card.icon}</span>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>{card.back}</p>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-wipe" style={{ padding: '120px 20px 80px', borderTop: '1px solid var(--sep)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Verified</p>
          <h2 style={{ fontSize: 'clamp(48px, 5.5vw, 96px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Track Record</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 360, textAlign: 'right', lineHeight: 1.7 }}>
          10+ years of freelance work across Upwork and Freelancer.com — click any card to learn more.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {STAT_CARDS.map((card, i) => (
          <FlipCard key={i} card={card} index={i} sectionVisible={visible} />
        ))}
      </div>
    </section>
  );
}

/* ─── Works scroll section ──────────────────────────────── */
const HSCROLL_ITEMS = [
  { id:1, title:'Exterior — Residential', sub:'3D Render · Exterior', image:'/images/architecture/Exterior 1.png' },
  { id:2, title:'Interior — Living Room', sub:'3D Render · Interior', image:'/images/architecture/Living Room.png' },
  { id:3, title:'Exterior — Facade',      sub:'3D Render · Exterior', image:'/images/architecture/Exterior 3.png' },
  { id:4, title:'Interior — Bedroom',     sub:'3D Render · Interior', image:'/images/architecture/Bedroom.png' },
  { id:5, title:'Exterior — Night',       sub:'3D Render · Exterior', image:'/images/architecture/Exterior 3.2.png' },
  { id:6, title:'Interior — Kitchen',     sub:'3D Render · Interior', image:'/images/architecture/Kitchen.png' },
];

function HScrollSection() {
  const scrollRef   = useRef(null);
  const sectionRef  = useRef(null);
  const firstImgRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgHeight, setImgHeight] = useState(0);
  const drag = useRef({ active:false, startX:0, scrollLeft:0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const measure = () => {
      if (firstImgRef.current) setImgHeight(firstImgRef.current.offsetHeight);
    };
    const ro = new ResizeObserver(measure);
    if (firstImgRef.current) ro.observe(firstImgRef.current);
    if (firstImgRef.current?.complete) measure();
    firstImgRef.current?.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      firstImgRef.current?.removeEventListener('load', measure);
      window.removeEventListener('resize', measure);
    };
  }, [visible]);

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    drag.current = { active:true, startX: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    scrollRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };
  const onMouseUp = () => {
    drag.current.active = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const bgImgs = [
    { src:'/images/architecture/Exterior 1.png',   top:'5%',  left:'-4%',  w:'22vw', rot:'-6deg',  op:0.07 },
    { src:'/images/architecture/Living Room.png',   top:'10%', right:'-3%', w:'18vw', rot:'5deg',   op:0.06 },
    { src:'/images/architecture/Exterior 3.2.png',  top:'45%', left:'8%',   w:'16vw', rot:'8deg',   op:0.07 },
    { src:'/images/architecture/Bedroom.png',       top:'55%', right:'2%',  w:'20vw', rot:'-4deg',  op:0.06 },
    { src:'/images/architecture/Kitchen.png',       top:'20%', left:'35%',  w:'14vw', rot:'3deg',   op:0.05 },
  ];

  return (
    <div ref={sectionRef} style={{ display:'flex', paddingBottom:96, minHeight:560, alignItems:'flex-start', position:'relative', overflow:'hidden' }}>

      {/* Background ghost images */}
      {bgImgs.map((bg, i) => (
        <img key={i} src={bg.src} alt="" aria-hidden="true" style={{
          position:'absolute',
          top: bg.top, left: bg.left, right: bg.right,
          width: bg.w, height:'auto',
          objectFit:'cover',
          transform: `rotate(${bg.rot})`,
          opacity: bg.op,
          filter:'grayscale(100%)',
          pointerEvents:'none',
          userSelect:'none',
          zIndex:0,
        }} />
      ))}

      {/* Left sticky label — fotoğrafla tam boydan boya */}
      <OurWorksLabel imgHeight={imgHeight} visible={visible} />

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        style={{
          flex:1, display:'flex', gap:24,
          overflowX:'auto', overflowY:'hidden',
          scrollbarWidth:'none', msOverflowStyle:'none',
          cursor:'grab', alignItems:'flex-end',
          paddingLeft:'clamp(40px, 7vw, 120px)',
          paddingRight:'50vw',
          position:'relative', zIndex:1,
        }}>
        {HSCROLL_ITEMS.map((item, i) => (
          <WorkCard key={item.id} item={item} visible={visible} index={i} imgRef={i === 0 ? firstImgRef : null} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────── */
export default function BankoArts() {
  const [menuOpen, setMenuOpen]               = useState(false);
  const [activePage, setActivePage]           = useState('works');
  const [lightboxProject, setLightboxProject] = useState(null);
  const [inContact, setInContact]             = useState(false);
  useSectionWipe();

  const allProjects = projects;
  const lightboxIndex = lightboxProject ? allProjects.findIndex(p => p.id === lightboxProject.id) : -1;
  const openLightbox  = (p) => { document.body.style.overflow='hidden'; setLightboxProject(p); };
  const closeLightbox = () => { document.body.style.overflow=''; setLightboxProject(null); };
  const nextProject   = () => setLightboxProject(allProjects[(lightboxIndex+1) % allProjects.length]);
  const prevProject   = () => setLightboxProject(allProjects[(lightboxIndex-1+allProjects.length) % allProjects.length]);

  const goPage = (p) => {
    const map = { about:'section-about', works:'section-works', services:'section-services', contact:'section-contact' };
    const el = document.getElementById(map[p] || 'section-works');
    if (el) window.lenis?.scrollTo(el, { offset: -20, duration: 1.6 });
  };

  const toggleContact = () => {
    const contactEl = document.getElementById('section-contact');
    if (!contactEl) return;
    if (inContact) {
      setInContact(false);
      window.lenis?.scrollTo(0, { duration: 1.6 });
    } else {
      setInContact(true);
      window.lenis?.scrollTo(contactEl, { offset: -20, duration: 1.6 });
    }
  };



  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.lenis = lenis;
    return () => { lenis.destroy(); delete window.lenis; };
  }, []);

  // lock scroll when menu open
  useEffect(() => {
    if (menuOpen) window.lenis?.stop();
    else window.lenis?.start();
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);


  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--black)', paddingLeft:'clamp(100px, 7vw, 160px)', paddingRight:'clamp(100px, 7vw, 160px)' }}>

      {/* ── Sol çubuk + Menü ── */}
      <LeftBar menuOpen={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} onNav={goPage} activePage={activePage} />

      {/* ── Right bar ── */}
      <div className="side-bar side-bar--right" onClick={toggleContact}>
        <span>{inContact ? 'Back' : 'Contacts'}</span>
      </div>

      {/* ── WORKS ── */}
      <section id="section-works" style={{ borderTop:'1px solid var(--sep)' }}>
        <div style={{ position:'relative', padding:'48px 20px 0 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-end', minHeight:'60vh', gap:0 }}>
          <DotGrid />
          <img src="/images/logo.svg" alt="Banko Arts" style={{ position:'absolute', top:24, left:20, width:'clamp(60px, 6vw, 100px)', height:'auto', zIndex:2 }} />
          <div style={{ flex:1, minWidth:0, position:'relative', zIndex:1 }}>
            <HeroTitle />
          </div>
          <div style={{ width:'clamp(300px, 32vw, 640px)', flexShrink:0, marginTop:0, marginLeft:'-6vw', position:'relative', zIndex:1 }}>
            <img src="/images/D2.jpg" alt="Banko Arts" style={{ width:'100%', display:'block', objectFit:'cover', aspectRatio:'3/4' }}/>
          </div>
        </div>
        <div style={{ margin:'40px 20px 0', borderTop:'1px solid var(--sep)' }} />
        <div className="section-wipe" style={{ padding:'56px 20px 80px' }}>
          <p style={{ fontSize:'clamp(24px, 2.2vw, 44px)', fontWeight:400, letterSpacing:'-0.02em', lineHeight:1.2, maxWidth:1200 }}>
            We believe beauty is born from precision, not chance. Every render tells a story — before the foundation is even laid.
          </p>
        </div>
        <div style={{ height:'clamp(80px, 10vw, 160px)' }} />
        <div className="section-wipe"><HScrollSection /></div>
      </section>

      <StatsSection />

      {/* ── SERVICES ── */}
      <section id="section-services" className="section-wipe" style={{ padding:'120px 20px 80px', borderTop:'1px solid var(--sep)' }}>
        <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:8 }}>N°001</p>
        <h2 style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:64 }}>Services</h2>
        <hr className="ba-divider" style={{ marginBottom:64 }}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, maxWidth:1600 }}>
          {[
            ['Exterior Visualization','Photorealistic renders of building facades, landscapes and surroundings — life before construction begins.'],
            ['Interior Visualization','High-end interior renders covering every room type with accurate lighting and material detail.'],
            ['3D Animation','Cinematic walkthroughs and flyarounds — let clients experience space before it exists.'],
            ['Floor Plan Rendering','2D and 3D floor plan visualizations that communicate spatial layouts with clarity.'],
            ['Real Estate Visualization','Off-plan renders that help developers market and sell before a single brick is laid.'],
            ['Virtual Staging','Digital furniture placement in empty spaces to accelerate sales and show design potential.'],
          ].map(([t, d], i) => (
            <div key={t} style={{ padding:'32px 0', borderTop:'1px solid var(--border)' }}>
              <p style={{ fontSize:11, letterSpacing:'0.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom:14 }}>N°{String(i+1).padStart(3,'0')}</p>
              <p style={{ fontSize:'clamp(18px, 1.6vw, 28px)', fontWeight:700, marginBottom:12, letterSpacing:'-0.01em' }}>{t}</p>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ── CONTACT ── */}
      <ContactSection />


      {/* ── FOOTER ── */}
      <footer className="section-wipe" style={{ background:'var(--yellow)', marginTop:80, padding:'64px 20px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, marginBottom:64 }}>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.45)', marginBottom:16 }}>Banko Arts</p>
            <p style={{ fontSize:13, lineHeight:1.7, color:'rgba(0,0,0,0.6)' }}>Professional 3D Architectural Visualization Studio</p>
          </div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.45)', marginBottom:16 }}>Company</p>
            {['Works','Services','About','Contact'].map(item => (
              <button key={item} onClick={()=>goPage(item.toLowerCase())}
                style={{ display:'block', background:'none', border:'none', fontSize:14, fontWeight:600, marginBottom:10, cursor:'pointer' }}>
                {item}
              </button>
            ))}
          </div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.45)', marginBottom:16 }}>Follow</p>
            <a href="https://instagram.com/bankoarts" target="_blank" rel="noreferrer"
              style={{ display:'block', fontSize:14, fontWeight:600, marginBottom:10 }}>Instagram</a>
          </div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.45)', marginBottom:16 }}>Contact</p>
            <a href="mailto:info@bankoarts.com" style={{ display:'block', fontSize:14, fontWeight:600, marginBottom:10 }}>info@bankoarts.com</a>
          </div>
        </div>
        <hr style={{ border:'none', borderTop:'1px solid rgba(0,0,0,0.15)', marginBottom:24 }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:13, fontWeight:800, letterSpacing:'0.04em' }}>BANKO ARTS</p>
          <p style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>© {new Date().getFullYear()} Banko Arts. All rights reserved.</p>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={closeLightbox} onNext={nextProject} onPrev={prevProject}/>
      )}
    </div>
  );
}
