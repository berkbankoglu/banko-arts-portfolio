'use client'

import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    label: 'Exterior Visualization',
    title: 'Where vision\nmeets reality.',
    sub: 'Photorealistic 3D renders that sell projects before the first brick is laid.',
  },
  {
    label: 'Interior Rendering',
    title: 'Every detail,\nperfectly lit.',
    sub: 'From living rooms to commercial lobbies — interiors brought to life with precision.',
  },
  {
    label: '3D Animation',
    title: 'Move through\nyour design.',
    sub: 'Cinematic walkthroughs that let clients experience space before it exists.',
  },
];

// easing helper
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeOut   = (t) => 1 - Math.pow(1 - t, 3);

export default function HeroScroll() {
  const sectionRef = useRef(null);
  const [progress, setProgress]         = useState(0);
  const [stepIndex, setStepIndex]       = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect   = el.getBoundingClientRect();
      const totalH = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalH));
      setProgress(p);

      const perStep = 1 / STEPS.length;
      const idx = Math.min(Math.floor(p / perStep), STEPS.length - 1);
      const sp  = (p - idx * perStep) / perStep;
      setStepIndex(idx);
      setStepProgress(Math.max(0, Math.min(1, sp)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Phase 0→0.25: tablet açılıyor (alt tarafı yukarı kalkıyor, 3D fold)
  // ── Phase 0.25→0.75: steps gösteriliyor
  // ── Phase 0.75→1: tablet küçülüp yukarı çıkıyor
  const phase1 = Math.min(1, progress / 0.25);          // fold açılma
  const phase2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.5)); // steps
  const phase3 = Math.max(0, (progress - 0.75) / 0.25); // çıkış

  // Tablet fold: rotateX 90→0 (sanki yerden kalkıyor)
  const foldAngle  = (1 - easeOut(phase1)) * 82;    // 82deg→0
  const tabletY    = (1 - easeOut(phase1)) * 160     // aşağıdan yukarı gelme
                   - easeOut(phase3) * 200;           // sonunda yukarı çıkma
  const tabletScale = 0.6 + easeOut(phase1) * 0.4    // büyüme
                    - easeOut(phase3) * 0.25;          // küçülme

  // Text fade
  const textOpacity = stepProgress < 0.12
    ? stepProgress / 0.12
    : stepProgress > 0.82
      ? 1 - (stepProgress - 0.82) / 0.18
      : 1;

  const step = STEPS[stepIndex];

  // shadow intensity
  const shadowBlur    = 60 + easeOut(phase1) * 60;
  const shadowOpacity = 0.08 + easeOut(phase1) * 0.18 - easeOut(phase3) * 0.15;

  return (
    <div ref={sectionRef} style={{ height: '500vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Subtle bg gradient per step */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: stepIndex === 0
            ? 'radial-gradient(ellipse 80% 60% at 55% 45%, #f2efea 0%, #fff 65%)'
            : stepIndex === 1
              ? 'radial-gradient(ellipse 80% 60% at 45% 55%, #edf0f5 0%, #fff 65%)'
              : 'radial-gradient(ellipse 80% 60% at 50% 35%, #f5f0ec 0%, #fff 65%)',
          transition: 'background 1.4s ease',
        }} />

        {/* Step dots + label */}
        <div style={{
          position: 'absolute', top: 88, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: phase2 > 0 ? textOpacity : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === stepIndex ? 22 : 6, height: 6,
                borderRadius: 3,
                background: i === stepIndex ? '#0a0a0a' : 'rgba(0,0,0,0.15)',
                transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>
          <p style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase' }}>
            {step.label}
          </p>
        </div>

        {/* ── TABLET ── */}
        <div style={{
          position: 'relative', zIndex: 2,
          perspective: '1400px',
          perspectiveOrigin: '50% 80%',
        }}>
          <div style={{
            transformOrigin: '50% 100%',   // alt kenardan katlanır
            transform: `
              translateY(${tabletY}px)
              rotateX(${foldAngle}deg)
              scale(${tabletScale})
            `,
            willChange: 'transform',
            transformStyle: 'preserve-3d',
          }}>

            {/* Tablet frame */}
            <div style={{
              width: 760,
              height: 540,
              background: 'linear-gradient(145deg, #2a2a2a 0%, #111 100%)',
              borderRadius: 32,
              padding: '14px 14px 24px',
              position: 'relative',
              boxShadow: `
                0 ${shadowBlur}px ${shadowBlur * 2}px rgba(0,0,0,${shadowOpacity}),
                0 12px 30px rgba(0,0,0,0.06),
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 0 0 1px rgba(255,255,255,0.04)
              `,
            }}>

              {/* Camera */}
              <div style={{
                position: 'absolute', top: 10, left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#222' }} />
              </div>

              {/* Screen */}
              <div style={{
                width: '100%', height: '100%',
                borderRadius: 20,
                overflow: 'hidden',
                position: 'relative',
                background: '#000',
              }}>
                <img
                  src="/images/architecture/Exterior 1.png"
                  alt="Banko Arts Portfolio"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    transform: `scale(${1 + easeOut(phase2) * 0.05})`,
                    transition: 'transform 0.15s linear',
                  }}
                />
                {/* Screen glare */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: `linear-gradient(
                    135deg,
                    rgba(255,255,255,${0.05 + (1 - easeOut(phase1)) * 0.08}) 0%,
                    transparent 55%
                  )`,
                }} />
              </div>

              {/* Home bar */}
              <div style={{
                position: 'absolute', bottom: 9, left: '50%',
                transform: 'translateX(-50%)',
                width: 120, height: 4, borderRadius: 2,
                background: 'rgba(255,255,255,0.18)',
              }} />

              {/* Side buttons */}
              <div style={{ position: 'absolute', left: -3, top: 100, width: 3, height: 32, borderRadius: '2px 0 0 2px', background: '#1a1a1a' }} />
              <div style={{ position: 'absolute', left: -3, top: 148, width: 3, height: 52, borderRadius: '2px 0 0 2px', background: '#1a1a1a' }} />
              <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 72, borderRadius: '0 2px 2px 0', background: '#1a1a1a' }} />
            </div>

            {/* Ground shadow */}
            <div style={{
              position: 'absolute', bottom: -20, left: '50%',
              transform: 'translateX(-50%)',
              width: 600, height: 50,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)',
              filter: 'blur(16px)',
              opacity: easeOut(phase1) * (1 - easeOut(phase3)),
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Text — right */}
        <div style={{
          position: 'absolute',
          right: 'max(48px, 8vw)',
          top: '50%', transform: 'translateY(-50%)',
          maxWidth: 280,
          opacity: phase2 > 0 ? textOpacity : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}>
          <h2 style={{
            fontSize: 'clamp(22px, 2.6vw, 36px)',
            fontWeight: 300, letterSpacing: '-0.025em',
            lineHeight: 1.15, color: '#0a0a0a',
            whiteSpace: 'pre-line', marginBottom: 16,
          }}>
            {step.title}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.42)', lineHeight: 1.82 }}>
            {step.sub}
          </p>
        </div>

        {/* Step counter — left */}
        <div style={{
          position: 'absolute', left: 'max(48px, 6vw)', bottom: 52,
          opacity: phase2 > 0 ? 0.22 : 0, transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 52, fontWeight: 200, letterSpacing: '-0.04em', lineHeight: 1, color: '#0a0a0a' }}>
            {String(stepIndex + 1).padStart(2, '0')}
          </p>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', color: '#0a0a0a', marginTop: 4 }}>
            / {String(STEPS.length).padStart(2, '0')}
          </p>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: 36, right: 48,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: Math.max(0, 1 - progress * 12),
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(0,0,0,0.28)', textTransform: 'uppercase' }}>Scroll</p>
          <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28), transparent)' }} />
        </div>

      </div>
    </div>
  );
}
