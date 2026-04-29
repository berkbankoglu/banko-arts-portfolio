'use client'

import React, { useState, useRef, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import Lenis from '@studio-freight/lenis';

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
function WorkCard({ item, visible, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      flexShrink:0, width:'clamp(280px, 26vw, 560px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 + index*0.08}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 + index*0.08}s`,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ overflow:'hidden', borderRadius:4 }}>
        <img src={item.image} alt={item.title} draggable={false}
          style={{
            display:'block', width:'100%',
            aspectRatio:'3/4', objectFit:'cover',
            filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)',
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
      {/* Logo — sol üst küçük */}
      <img src="/images/logo.svg" alt="Banko Arts" style={{ display:'block', width:'clamp(80px, 10vw, 140px)', height:'auto', marginBottom:24 }} />
      {/* BANKO ARTS büyük başlık */}
      <div style={{ display:'inline-block', background:'#f5e200', padding:'0.02em 0.08em 0.04em 0', marginBottom:'0.04em' }}>
        <span style={{ display:'block', fontSize:'clamp(88px, 14vw, 260px)', fontFamily:'var(--font-hero), sans-serif', fontWeight:700, letterSpacing:'-0.02em', lineHeight:0.95, color:'#0a0a0a', userSelect:'none' }}>BANKO</span>
      </div>
      <br/>
      <span style={{ display:'inline-block', fontSize:'clamp(88px, 14vw, 260px)', fontFamily:'var(--font-hero), sans-serif', fontWeight:700, letterSpacing:'-0.02em', lineHeight:0.95, color:'#0a0a0a', filter:'drop-shadow(5px 8px 0px rgba(0,0,0,0.13)) drop-shadow(10px 18px 28px rgba(0,0,0,0.09))', position:'relative', zIndex:2, userSelect:'none' }}>ARTS</span>
    </div>
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
  const scrollRef  = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
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

  return (
    <div ref={sectionRef} style={{ display:'flex', paddingBottom:96, minHeight:560 }}>

      {/* Left sticky label */}
      <div style={{
        width:'clamp(120px, 10vw, 180px)', flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        opacity: visible ? 1 : 0,
        transition:'opacity 0.8s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <p style={{
          writingMode:'vertical-rl',
          transform:'rotate(180deg)',
          fontSize:'clamp(48px, 6vw, 96px)',
          fontWeight:800, letterSpacing:'-0.03em',
          color:'var(--black)', userSelect:'none',
        }}>Our Works</p>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        style={{
          flex:1, display:'flex', gap:48,
          overflowX:'auto', overflowY:'hidden',
          scrollbarWidth:'none', msOverflowStyle:'none',
          cursor:'grab', alignItems:'flex-start',
          paddingRight:'50vw',
        }}>
        {HSCROLL_ITEMS.map((item, i) => (
          <WorkCard key={item.id} item={item} visible={visible} index={i} />
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
    const rect = contactEl.getBoundingClientRect();
    const inContact = rect.top <= 120 && rect.bottom > 120;
    if (inContact) {
      window.lenis?.scrollTo(0, { duration: 1.6 });
    } else {
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
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--black)', paddingLeft:'clamp(136px, 8vw, 220px)', paddingRight:'clamp(136px, 8vw, 220px)' }}>

      {/* ── Sol çubuk + Menü ── */}
      <LeftBar menuOpen={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} onNav={goPage} activePage={activePage} />

      {/* ── Right bar ── */}
      <div className="side-bar side-bar--right" onClick={toggleContact}>
        <span>Contacts</span>
      </div>

      {/* ── WORKS ── */}
      <section id="section-works" style={{ borderTop:'1px solid var(--sep)' }}>
        <div style={{ position:'relative', padding:'48px 20px 0 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-end', minHeight:'60vh', gap:0 }}>
          <DotGrid />
          <div style={{ flex:1, minWidth:0, position:'relative', zIndex:1 }}>
            <HeroTitle />
          </div>
          <div style={{ width:'clamp(300px, 32vw, 640px)', flexShrink:0, marginTop:0, marginLeft:'-6vw', position:'relative', zIndex:1 }}>
            <img src="/images/D2.jpg" alt="Banko Arts" style={{ width:'100%', display:'block', objectFit:'cover', aspectRatio:'3/4' }}/>
          </div>
        </div>
        <div style={{ margin:'40px 20px 0', borderTop:'1px solid var(--sep)' }} />
        <div style={{ padding:'56px 20px 80px' }}>
          <p style={{ fontSize:'clamp(28px, 3vw, 64px)', fontWeight:400, letterSpacing:'-0.02em', lineHeight:1.2, maxWidth:1200 }}>
            We believe beauty is born from precision, not chance. Every render tells a story — before the foundation is even laid.
          </p>
        </div>
        <HScrollSection />
      </section>

      {/* ── SERVICES ── */}
      <section id="section-services" style={{ padding:'120px 20px 80px', borderTop:'1px solid var(--sep)' }}>
        <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:8 }}>N°001</p>
        <h2 style={{ fontSize:'clamp(48px, 7vw, 130px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:64 }}>Services</h2>
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
      <section id="section-contact" style={{ padding:'120px 20px 80px', borderTop:'1px solid var(--sep)' }}>
        <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:8 }}>N°003</p>
        <h2 style={{ fontSize:'clamp(48px, 7vw, 130px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:64 }}>Get in touch</h2>
        <hr className="ba-divider" style={{ marginBottom:64 }}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
          <div><ContactForm /></div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom:24 }}>Direct</p>
            {[['Mail','info@bankoarts.com','mailto:info@bankoarts.com'],['Instagram','@bankoarts','https://instagram.com/bankoarts']].map(([label,val,href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                style={{ display:'flex', gap:16, padding:'20px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:13, color:'var(--muted)', width:80, flexShrink:0 }}>{label} .</span>
                <span style={{ fontSize:'clamp(16px, 2vw, 22px)', fontWeight:700, letterSpacing:'-0.01em' }}>{val}</span>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <footer style={{ background:'var(--yellow)', marginTop:80, padding:'64px 20px 40px' }}>
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
