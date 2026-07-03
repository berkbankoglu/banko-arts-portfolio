'use client'

import { useState, useEffect } from 'react';

/* ─── Sol çubuk + Menü tek element ─────────────────────── */
export default function LeftBar({ menuOpen, onOpen, onClose, onNav, activePage }) {
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
