'use client'

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import LeftBar from '../components/LeftBar';
import GallerySection from '../components/Gallery';

/* ─── /works — tam sayfa portfolyo galerisi ─────────────── */
export default function WorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Ana sayfadakiyle aynı smooth scroll hissi
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.2,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.lenis = lenis;
    return () => { lenis.destroy(); delete window.lenis; };
  }, []);

  // Menü açıkken kaydırmayı kilitle
  useEffect(() => {
    if (menuOpen) window.lenis?.stop();
    else window.lenis?.start();
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Works dışındaki menü hedefleri ana sayfadaki bölümlere gider
  const goPage = (p) => {
    if (p === 'works') return; // zaten buradayız
    window.location.href = '/#' + p;
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--black)', paddingLeft:'clamp(52px, 7vw, 160px)', paddingRight:'clamp(52px, 7vw, 160px)' }}>

      <LeftBar menuOpen={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} onNav={goPage} activePage="works" />

      {/* Sağ çubuk — ana sayfanın contact bölümüne döner */}
      <div className="side-bar side-bar--right" onClick={() => { window.location.href = '/#contact'; }}>
        <span>Contacts</span>
      </div>

      <section style={{ borderTop:'1px solid var(--sep)' }}>
        {/* Logo — ana sayfaya döner */}
        <div style={{ padding:'20px 20px 0', position:'relative', zIndex:3, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <a href="/" aria-label="Home">
            <img src="/images/logo.svg" alt="Banko Arts" style={{ width:'clamp(60px, 6vw, 100px)', height:'auto', display:'block' }} />
          </a>
          <a href="/" style={{ fontSize:12, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6, transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--black)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>
            ← Back to home
          </a>
        </div>

        <div style={{ height:'clamp(40px, 5vw, 80px)' }} />
        <GallerySection />
      </section>
    </div>
  );
}
