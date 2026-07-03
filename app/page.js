'use client'

import React, { useState, useRef, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import Lenis from 'lenis';

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

    const obs2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (e.target.classList.contains('reveal-right')) {
            setTimeout(() => e.target.classList.add('visible'), 300);
          } else {
            e.target.classList.add('visible');
          }
        } else {
          // ikisi birlikte kaybolsun
          document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => el.classList.remove('visible'));
        }
      });
    }, { threshold: 0.15 });

    // Aynı elementi tekrar tekrar observe etmemek için işaretle
    const seen = new WeakSet();
    const attach = () => {
      document.querySelectorAll('.section-wipe').forEach(el => {
        if (!seen.has(el)) { seen.add(el); obs.observe(el); }
      });
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        if (!seen.has(el)) { seen.add(el); obs2.observe(el); }
      });
    };

    attach();

    // Eski hali: her DOM mutasyonunda (hover stil değişimleri dahil) attach()
    // koşuyordu — scroll/hover sırasında sürekli querySelectorAll = jank.
    // Yeni hali: sadece childList mutasyonlarında, debounce'lu çalışır.
    let moTimer = null;
    const mo = new MutationObserver((muts) => {
      if (!muts.some(m => m.addedNodes.length)) return;
      clearTimeout(moTimer);
      moTimer = setTimeout(attach, 200);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { clearTimeout(moTimer); obs.disconnect(); obs2.disconnect(); mo.disconnect(); };
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

/* ─── Work Card ─────────────────────────────────────────── */
function WorkCard({ item, visible, index }) {
  const [hovered, setHovered] = useState(false);

  // Eski hali: hover boyunca requestAnimationFrame döngüsü her karede JS'ten
  // transform yazıyordu (0.0001/frame). Aynı "yavaş zoom" efekti tek bir uzun
  // CSS transition ile compositor'da bedavaya çalışır — ana thread'e sıfır yük.
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${0.05 + index*0.08}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.05 + index*0.08}s`,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ overflow:'hidden' }}>
        <img src={item.image} alt={item.title} draggable={false}
          loading="lazy" decoding="async"
          style={{
            display:'block', width:'100%',
            aspectRatio:'9/16', objectFit:'cover',
            filter: hovered ? 'grayscale(0%)' : 'grayscale(60%)',
            transform: hovered ? 'scale(1.35)' : 'scale(1)',
            transition: hovered
              ? 'transform 58s linear, filter 0.55s cubic-bezier(0.22,1,0.36,1)'
              : 'transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.55s cubic-bezier(0.22,1,0.36,1)',
            willChange: hovered ? 'transform' : 'auto',
            pointerEvents:'none',
          }}
        />
      </div>
      <div style={{ marginTop:14 }}>
        <p style={{ fontSize:14, fontWeight:700, letterSpacing:'-0.01em', marginBottom:4 }}>{item.title}</p>
        <p style={{ fontSize:11, color:'var(--muted)', letterSpacing:'0.04em' }}>{item.sub}</p>
      </div>
    </div>
  );
}

/* ─── Reveal Heading ────────────────────────────────────── */
function RevealHeading({ children, style }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { setActive(true); }, 800);
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
      {/* "Start My Project" panel */}
      <div style={{
        position:'absolute',
        top:0, left:0,
        right: 'calc(-1 * (100vw - 100% - 92px))',
        overflow:'hidden',
        pointerEvents: (showForm && !leaving) ? 'none' : 'all',
        transform: (showForm && !leaving) ? 'translateX(110%)' : 'translateX(0)',
        transition:'transform 2.1s cubic-bezier(0.77,0,0.18,1)',
        zIndex: (showForm || leaving) ? 0 : 1,
      }}>
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center',
          background:'var(--bg)',
          padding:'clamp(48px, 6vw, 80px) clamp(32px, 4vw, 60px)',
          minHeight:'clamp(480px, 55vh, 700px)',
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
        <div style={{ position:'relative', zIndex:1, padding:'clamp(24px, 3vw, 40px)', border:'2px solid var(--yellow)', background:'var(--bg)' }}>
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
      <div className="grid-contact">

        {/* Sol — hiç değişmez */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-80px)',
          transition:'opacity 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s',
        }}>
          <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:16 }}>Get in touch</p>
          <RevealHeading style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:32 }}>
            Let's Build<br/>Something<br/>Remarkable.
          </RevealHeading>
          <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8, maxWidth:320, marginBottom:48 }}>
            Photorealistic architectural visualizations delivered fast. Tell us about your project and we'll get back within 24 hours.
          </p>
          <div>
            {[
              ['Mail','info@bankoarts.com','mailto:info@bankoarts.com'],
              ['Instagram','@bankoarts','https://instagram.com/bankoarts'],
              ['Upwork','Banko Arts','https://www.upwork.com/freelancers/berkbanko'],
              ['Freelancer','@brkbnkgll','https://www.freelancer.com/u/brkbnkgll'],
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

        {/* Sağ — slide panel */}
        <div style={{ position:'relative' }}>
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
          <RevealHeading style={{ fontSize: 'clamp(48px, 5.5vw, 96px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Track Record</RevealHeading>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 360, textAlign: 'right', lineHeight: 1.7 }}>
          10+ years of freelance work across Upwork and Freelancer.com — click any card to learn more.
        </p>
      </div>
      <div className="grid-4col">
        {STAT_CARDS.map((card, i) => (
          <FlipCard key={i} card={card} index={i} sectionVisible={visible} />
        ))}
      </div>
    </section>
  );
}

/* ─── Works scroll section ──────────────────────────────── */
const GRID_ITEMS = [
  { id:1, title:'Exterior — Residential', sub:'3D Render · Exterior', image:'/images/architecture/Exterior 1.png' },
  { id:2, title:'Interior — Living Room', sub:'3D Render · Interior', image:'/images/architecture/Living Room.png' },
  { id:3, title:'Interior — Kitchen',     sub:'3D Render · Interior', image:'/images/architecture/Kitchen2.jpg' },
  { id:4, title:'Interior — Bedroom',     sub:'3D Render · Interior', image:'/images/architecture/Bedroom.png' },
];

function HScrollSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <div ref={sectionRef} style={{ padding:'0 20px 96px' }}>
      <div className="grid-works">
        {GRID_ITEMS.map((item, i) => (
          <WorkCard key={item.id} item={item} visible={visible} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────── */
export default function BankoArts() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activePage, setActivePage] = useState('works');
  const [inContact, setInContact]   = useState(false);
  useSectionWipe();

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
    // lerp 0.1 fazla "yüzer" hissettiriyordu — 0.14 daha çevik, hâlâ yumuşak.
    const lenis = new Lenis({
      lerp: 0.14,
      wheelMultiplier: 1,
      smoothWheel: true,
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
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--black)', paddingLeft:'clamp(52px, 7vw, 160px)', paddingRight:'clamp(52px, 7vw, 160px)' }}>

      {/* ── Sol çubuk + Menü ── */}
      <LeftBar menuOpen={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} onNav={goPage} activePage={activePage} />

      {/* ── Right bar ── */}
      <div className="side-bar side-bar--right" onClick={toggleContact}>
        <span>{inContact ? 'Back' : 'Contacts'}</span>
      </div>

      {/* ── WORKS ── */}
      <section id="section-works" style={{ borderTop:'1px solid var(--sep)' }}>
        {/* Logo */}
        <div style={{ padding:'20px 20px 0', position:'relative', zIndex:3 }}>
          <img src="/images/logo.svg" alt="Banko Arts" style={{ width:'clamp(60px, 6vw, 100px)', height:'auto' }} />
        </div>

        <div className="hero-flex" style={{ position:'relative', height:'calc(100vh - 160px)', display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden' }}>

          {/* Sol panel */}
          <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'24px 40px 16px 20px' }}>

            {/* Boş üst alan */}
            <div />

            {/* Alt — başlık + açıklama */}
            <div>
              {/* H1 reveal — 0s başlar */}
              <div style={{ position:'relative', overflow:'hidden', marginBottom:24, display:'table' }}>
                <div className="reveal-box" style={{ animationDelay:'0s, 0.4s' }} />
                <h1 className="reveal-text" style={{ fontSize:'clamp(36px, 4.5vw, 72px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.05, color:'var(--black)', margin:0, animationDelay:'0.4s' }}>
                  We are an architectural visualization studio for renders, 3D & animation.
                </h1>
              </div>

              <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8, maxWidth:420, marginBottom:32 }}>
                824+ projects delivered worldwide. Photorealistic exterior, interior renders and animations — fast turnaround, studio quality.
              </p>

              <button
                onClick={() => { const el = document.getElementById('section-contact'); window.lenis?.scrollTo(el, { offset:-20, duration:1.6 }); }}
                style={{ fontSize:12, color:'var(--muted)', background:'none', border:'none', cursor:'pointer', letterSpacing:'0.08em', textTransform:'lowercase', padding:0, display:'flex', alignItems:'center', gap:6 }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--black)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>
                scroll to explore ↓
              </button>
            </div>
          </div>

          {/* Sağ panel */}
          <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>

            {/* Üst büyük — siyah */}
            <div style={{ flex:1, background:'var(--black)' }} />

            {/* Alt iki küçük */}
            <div style={{ height:160, display:'grid', gridTemplateColumns:'1fr 1fr' }}>

              {/* Upwork */}
              <a href="https://www.upwork.com/freelancers/berkbanko" target="_blank" rel="noreferrer"
                style={{ background:'#e8e8e6', padding:'24px 28px', display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'pointer', transition:'background 0.2s', textDecoration:'none' }}
                onMouseEnter={e=>e.currentTarget.style.background='#ddddd9'}
                onMouseLeave={e=>e.currentTarget.style.background='#e8e8e6'}>
                <span style={{ fontSize:18, color:'rgba(0,0,0,0.3)' }}>→</span>
                <div>
                  <p style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.02em', color:'var(--black)', marginBottom:4 }}>Upwork</p>
                  <p style={{ fontSize:12, color:'var(--muted)' }}>Top Rated Plus</p>
                </div>
              </a>

              {/* Freelancer */}
              <a href="https://www.freelancer.com/u/brkbnkgll" target="_blank" rel="noreferrer"
                style={{ background:'#2a2a2a', padding:'24px 28px', display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'pointer', transition:'background 0.2s', textDecoration:'none' }}
                onMouseEnter={e=>e.currentTarget.style.background='#333'}
                onMouseLeave={e=>e.currentTarget.style.background='#2a2a2a'}>
                <span style={{ fontSize:18, color:'rgba(255,255,255,0.3)' }}>→</span>
                <div>
                  <p style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.02em', color:'#fff', marginBottom:4 }}>Freelancer</p>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Preferred Freelancer</p>
                </div>
              </a>

            </div>
          </div>
        </div>
        <div style={{ height:'clamp(80px, 10vw, 160px)' }} />
        <div className="section-wipe"><HScrollSection /></div>
      </section>

      <StatsSection />

      {/* ── SERVICES ── */}
      <section id="section-services" style={{ padding:'120px 20px 80px', borderTop:'1px solid var(--sep)' }}>
        <div className="grid-2col">

          {/* Sol — Services listesi */}
          <div className="reveal-left">
            <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:8 }}>N°001</p>
            <RevealHeading style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:32 }}>Services</RevealHeading>
            <div>
              {[
                ['Exterior Visualization','Photorealistic renders of building facades, landscapes and surroundings.'],
                ['Interior Visualization','High-end interior renders covering every room type with accurate lighting and material detail.'],
                ['3D Animation','Cinematic walkthroughs and flyarounds — let clients experience space before it exists.'],
                ['Floor Plan Rendering','2D and 3D floor plan visualizations that communicate spatial layouts with clarity.'],
                ['Real Estate Visualization','Off-plan renders that help developers market and sell before a single brick is laid.'],
                ['Virtual Staging','Digital furniture placement in empty spaces to accelerate sales and show design potential.'],
              ].map(([t, d], i) => (
                <div key={t} style={{ padding:'20px 0', borderTop:'1px solid var(--border)' }}>
                  <p style={{ fontSize:11, letterSpacing:'0.14em', color:'var(--muted)', textTransform:'uppercase', marginBottom:10 }}>N°{String(i+1).padStart(3,'0')}</p>
                  <p style={{ fontSize:'clamp(16px, 1.4vw, 24px)', fontWeight:700, marginBottom:8, letterSpacing:'-0.01em' }}>{t}</p>
                  <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — About / Profil */}
          <div className="reveal-right">
            <div style={{ display:'flex', alignItems:'flex-start', gap:32, marginBottom:32 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, letterSpacing:'0.18em', color:'var(--muted)', textTransform:'uppercase', marginBottom:8 }}>About</p>
                <RevealHeading style={{ fontSize:'clamp(48px, 5.5vw, 96px)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:0.9, marginBottom:32 }}>Berk Bankoglu</RevealHeading>
                <p style={{ fontSize:15, color:'var(--muted)', lineHeight:1.9, maxWidth:480 }}>
                  3D architectural visualization artist based in Turkey with 10+ years of experience. Specializing in photorealistic exterior and interior renders, animations, and floor plans for architects, developers, and real estate agencies worldwide.
                </p>
              </div>
              <img src="/images/D2.jpg" alt="Berk Bankoglu" loading="lazy" decoding="async" style={{ width:'clamp(160px, 18vw, 260px)', aspectRatio:'3/4', objectFit:'cover', flexShrink:0 }} />
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, marginBottom:48, borderTop:'1px solid var(--border)' }}>
              {[
                ['824+','Completed Projects'],
                ['10 Years','Professional Experience'],
                ['30+','Countries Served'],
                ['5.0','Average Rating'],
              ].map(([val, label]) => (
                <div key={label} style={{ padding:'20px 0', borderBottom:'1px solid var(--border)', paddingRight:24 }}>
                  <p style={{ fontSize:'clamp(24px, 2.5vw, 40px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1, marginBottom:6 }}>{val}</p>
                  <p style={{ fontSize:11, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Profil butonları */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <a href="https://www.upwork.com/freelancers/berkbanko" target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', border:'1px solid var(--border)', textDecoration:'none', transition:'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--black)'; e.currentTarget.style.background='var(--black)'; e.currentTarget.querySelectorAll('span').forEach(s=>s.style.color='#fff'); }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='transparent'; e.currentTarget.querySelectorAll('span').forEach(s=>{ s.style.color=''; }); }}>
                <div>
                  <span style={{ display:'block', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4, transition:'color 0.2s' }}>Upwork</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'var(--black)', transition:'color 0.2s' }}>Top Rated Plus · $70K+ Earned</span>
                </div>
                <span style={{ fontSize:18, color:'var(--black)', transition:'color 0.2s' }}>→</span>
              </a>
              <a href="https://www.freelancer.com/u/brkbnkgll" target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', border:'1px solid var(--border)', textDecoration:'none', transition:'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--black)'; e.currentTarget.style.background='var(--black)'; e.currentTarget.querySelectorAll('span').forEach(s=>s.style.color='#fff'); }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='transparent'; e.currentTarget.querySelectorAll('span').forEach(s=>{ s.style.color=''; }); }}>
                <div>
                  <span style={{ display:'block', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4, transition:'color 0.2s' }}>Freelancer.com</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'var(--black)', transition:'color 0.2s' }}>Preferred Freelancer · 5.0 Rating</span>
                </div>
                <span style={{ fontSize:18, color:'var(--black)', transition:'color 0.2s' }}>→</span>
              </a>
              <a href="https://instagram.com/bankoarts" target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', border:'1px solid var(--border)', textDecoration:'none', transition:'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--black)'; e.currentTarget.style.background='var(--black)'; e.currentTarget.querySelectorAll('span').forEach(s=>s.style.color='#fff'); }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='transparent'; e.currentTarget.querySelectorAll('span').forEach(s=>{ s.style.color=''; }); }}>
                <div>
                  <span style={{ display:'block', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4, transition:'color 0.2s' }}>Instagram</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'var(--black)', transition:'color 0.2s' }}>@bankoarts</span>
                </div>
                <span style={{ fontSize:18, color:'var(--black)', transition:'color 0.2s' }}>→</span>
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* ── CONTACT ── */}
      <ContactSection />


      {/* ── FOOTER ── */}
      <footer className="section-wipe" style={{ background:'var(--yellow)', marginTop:80, padding:'64px 20px 40px' }}>
        <div className="grid-4col" style={{ marginBottom:64 }}>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:16 }}>Banko Arts</p>
            <p style={{ fontSize:13, lineHeight:1.7, color:'rgba(255,255,255,0.7)' }}>Professional 3D Architectural Visualization Studio</p>
          </div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:16 }}>Company</p>
            {['Works','Services','About','Contact'].map(item => (
              <button key={item} onClick={()=>goPage(item.toLowerCase())}
                style={{ display:'block', background:'none', border:'none', fontSize:14, fontWeight:600, marginBottom:10, cursor:'pointer', color:'#fff' }}>
                {item}
              </button>
            ))}
          </div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:16 }}>Follow</p>
            <a href="https://instagram.com/bankoarts" target="_blank" rel="noreferrer"
              style={{ display:'block', fontSize:14, fontWeight:600, marginBottom:10, color:'#fff' }}>Instagram</a>
          </div>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:16 }}>Contact</p>
            <a href="mailto:info@bankoarts.com" style={{ display:'block', fontSize:14, fontWeight:600, marginBottom:10, color:'#fff' }}>info@bankoarts.com</a>
          </div>
        </div>
        <hr style={{ border:'none', borderTop:'1px solid rgba(255,255,255,0.2)', marginBottom:24 }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:13, fontWeight:800, letterSpacing:'0.04em', color:'#fff' }}>BANKO ARTS</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>© {new Date().getFullYear()} Banko Arts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
