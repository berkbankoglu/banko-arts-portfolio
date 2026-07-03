'use client'

import { useState, useRef, useEffect } from 'react';

/* ─── Full gallery + lightbox ───────────────────────────── */
const GALLERY_ITEMS = [
  { id:'ex1',   title:'Exterior — Residential',   category:'exterior',  image:'/images/architecture/Exterior 1.png' },
  { id:'ex2',   title:'Exterior — Garden View',   category:'exterior',  image:'/images/architecture/Exterior 2.png' },
  { id:'ex3',   title:'Exterior — Facade',        category:'exterior',  image:'/images/architecture/Exterior 3.png' },
  { id:'ex31',  title:'Exterior — Detail',        category:'exterior',  image:'/images/architecture/Exterior 3.1.png' },
  { id:'ex32',  title:'Exterior — Night',         category:'exterior',  image:'/images/architecture/Exterior 3.2.png' },
  { id:'ex0',   title:'Exterior — Full View',     category:'exterior',  image:'/images/architecture/Exterior.png' },
  { id:'rt',    title:'Rooftop Terrace',          category:'exterior',  image:'/images/architecture/RoofTop.png' },
  { id:'lv',    title:'Living Room',              category:'interior',  image:'/images/architecture/Living Room.png' },
  { id:'bd',    title:'Bedroom',                  category:'interior',  image:'/images/architecture/Bedroom.png' },
  { id:'kt',    title:'Kitchen',                  category:'interior',  image:'/images/architecture/Kitchen.png' },
  { id:'kt2',   title:'Kitchen — II',             category:'interior',  image:'/images/architecture/Kitchen2.jpg' },
  { id:'bt',    title:'Bathroom',                 category:'interior',  image:'/images/architecture/Bathroom.png' },
  { id:'bt2',   title:'Bathroom — II',            category:'interior',  image:'/images/architecture/Bathroom 2.png' },
  { id:'v-both',title:'Both Views — Animation',   category:'animation', image:'/images/architecture/Both.png',        video:'/videos/both_views_animation.mp4' },
  { id:'v-bd',  title:'Bedroom — Animation',      category:'animation', image:'/images/architecture/Bedroom.png',     video:'/videos/bedroom_animation.mp4' },
  { id:'v-lv',  title:'Living Room — Animation',  category:'animation', image:'/images/architecture/Living Room.png', video:'/videos/livingroom_animation.mp4' },
  { id:'v-kt',  title:'Kitchen — Animation',      category:'animation', image:'/images/architecture/Kitchen.png',     video:'/videos/kitchen_animation.mp4' },
  { id:'v-ex1', title:'Exterior I — Animation',   category:'animation', image:'/images/architecture/Exterior 1.png',  video:'/videos/exterior1_animation.mp4' },
  { id:'v-ex2', title:'Exterior II — Animation',  category:'animation', image:'/images/architecture/Exterior 2.png',  video:'/videos/exterior2_animation.mp4' },
  { id:'v-ex3', title:'Exterior III — Animation', category:'animation', image:'/images/architecture/Exterior 3.png',  video:'/videos/exterior3_animation.mp4' },
  { id:'v-ex31',title:'Exterior IV — Animation',  category:'animation', image:'/images/architecture/Exterior 3.1.png',video:'/videos/exterior3_1_animation.mp4' },
  { id:'v-rt',  title:'Rooftop — Animation',      category:'animation', image:'/images/architecture/RoofTop.png',     video:'/videos/rooftop_animation.mp4' },
];

const GALLERY_FILTERS = [
  ['all', 'All'],
  ['exterior', 'Exterior'],
  ['interior', 'Interior'],
  ['animation', 'Animation'],
];

/* Başlık reveal'ı — page.js'teki RevealHeading ile aynı görsel dil */
function RevealHeading({ children, style }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { setActive(true); }, 150);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position:'relative', overflow:'hidden', display:'table' }}>
      {active && <div className="reveal-box" style={{ animationDelay:'0s, 0.4s' }} />}
      <h2 className={active ? 'reveal-text' : ''} style={{ opacity: active ? undefined : 0, animationDelay:'0.4s', ...style }}>
        {children}
      </h2>
    </div>
  );
}

function GalleryCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position:'relative', overflow:'hidden', cursor:'pointer', background:'#f0efed' }}>
      <img src={item.image} alt={item.title} loading="lazy" decoding="async" draggable={false}
        style={{ display:'block', width:'100%', aspectRatio:'16/9', objectFit:'cover',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition:'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }} />
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
        opacity: hovered ? 1 : 0, transition:'opacity 0.35s ease', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'14px 16px',
        transform: hovered ? 'translateY(0)' : 'translateY(6px)', opacity: hovered ? 1 : 0,
        transition:'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s cubic-bezier(0.22,1,0.36,1)',
        pointerEvents:'none' }}>
        <p style={{ fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600, color:'#fff' }}>{item.title}</p>
      </div>
      {item.video && (
        <div style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:'50%',
          background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M5 3l9 5-9 5V3z" fill="white"/></svg>
        </div>
      )}
    </div>
  );
}

function GalleryLightbox({ items, index, onClose, onNav }) {
  const [open, setOpen] = useState(false);
  const item = items[index];

  // Açılışta smooth scroll ve arka plan kaydırmasını durdur
  useEffect(() => {
    const t = requestAnimationFrame(() => setOpen(true));
    window.lenis?.stop();
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(t);
      window.lenis?.start();
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => { setOpen(false); setTimeout(onClose, 260); };

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onNav]);

  const navBtn = { position:'absolute', top:'50%', transform:'translateY(-50%)', width:44, height:44,
    background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff',
    fontSize:22, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, cursor:'pointer', transition:'background 0.2s' };

  return (
    <div className={`lightbox-backdrop${open ? ' open' : ''}`} onClick={handleClose}>
      <button onClick={handleClose} style={{ position:'absolute', top:24, right:28, background:'none', border:'none',
        color:'rgba(255,255,255,0.5)', fontSize:26, lineHeight:1, zIndex:10, cursor:'pointer', transition:'color 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.color='#fff'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>×</button>
      <button onClick={e=>{e.stopPropagation(); onNav(-1);}} style={{...navBtn, left:20}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>‹</button>
      <button onClick={e=>{e.stopPropagation(); onNav(1);}} style={{...navBtn, right:20}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>›</button>
      <div className="lightbox-content" style={{ maxWidth:'88vw', maxHeight:'84vh', position:'relative' }}
        onClick={e=>e.stopPropagation()}>
        {item.video
          ? <video key={item.id} src={item.video} poster={item.image} controls autoPlay
              style={{ maxWidth:'88vw', maxHeight:'78vh', display:'block' }} />
          : <img key={item.id} src={item.image} alt={item.title}
              style={{ maxWidth:'88vw', maxHeight:'78vh', display:'block', objectFit:'contain' }} />}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase' }}>
            {item.title}
          </p>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, letterSpacing:'0.1em' }}>
            {index + 1} / {items.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [lbIndex, setLbIndex] = useState(null);
  const filtered = filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === filter);
  const nav = (dir) => setLbIndex(i => (i + dir + filtered.length) % filtered.length);

  return (
    <div style={{ padding:'0 20px 96px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:40 }}>
        <div>
          <p style={{ fontSize:12, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:8 }}>Portfolio</p>
          <RevealHeading style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9 }}>All Works</RevealHeading>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {GALLERY_FILTERS.map(([key, label]) => {
            const active = filter === key;
            return (
              <button key={key} onClick={() => setFilter(key)}
                style={{ padding:'9px 20px', fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600,
                  border:'1px solid', borderColor: active ? 'var(--black)' : 'var(--border)',
                  background: active ? 'var(--black)' : 'transparent',
                  color: active ? '#fff' : 'var(--muted)', cursor:'pointer', transition:'background 0.25s ease, color 0.25s ease, border-color 0.25s ease' }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid-gallery">
        {filtered.map((item, i) => (
          <GalleryCard key={item.id} item={item} onClick={() => setLbIndex(i)} />
        ))}
      </div>
      {lbIndex !== null && (
        <GalleryLightbox items={filtered} index={lbIndex} onClose={() => setLbIndex(null)} onNav={nav} />
      )}
    </div>
  );
}
