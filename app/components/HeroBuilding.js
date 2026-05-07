'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroBuilding() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    mount.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c10);
    scene.fog = new THREE.FogExp2(0x080c10, 0.022);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 300);
    camera.position.set(0, 6, 38);
    camera.lookAt(0, 8, 0);

    // ── Materials ──
    const concreteDark = new THREE.MeshStandardMaterial({ color: 0x0e1318, roughness: 0.9, metalness: 0.0 });
    const concreteMid  = new THREE.MeshStandardMaterial({ color: 0x141c22, roughness: 0.85, metalness: 0.05 });
    const glassBlue    = new THREE.MeshStandardMaterial({ color: 0x1a3a52, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.8 });
    const glassLit     = new THREE.MeshStandardMaterial({ color: 0xffe8a0, roughness: 0.05, metalness: 0.3, emissive: new THREE.Color(0xffcc44), emissiveIntensity: 0.6, transparent: true, opacity: 0.85 });
    const glassLit2    = new THREE.MeshStandardMaterial({ color: 0xadd8ff, roughness: 0.05, metalness: 0.3, emissive: new THREE.Color(0x88bbff), emissiveIntensity: 0.4, transparent: true, opacity: 0.85 });
    const metalDark    = new THREE.MeshStandardMaterial({ color: 0x1a2028, roughness: 0.3, metalness: 0.9 });
    const groundMat    = new THREE.MeshStandardMaterial({ color: 0x090c0f, roughness: 1.0, metalness: 0.0 });

    // ── Building factory ──
    const group = new THREE.Group();
    scene.add(group);

    function addBox(w, h, d, mat, x, y, z, parent = group) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    }

    // ── Ground plane ──
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ground reflection strip
    const reflectGeo = new THREE.PlaneGeometry(60, 8);
    const reflectMat = new THREE.MeshStandardMaterial({
      color: 0x001830, roughness: 0.0, metalness: 1.0,
      transparent: true, opacity: 0.18,
    });
    const reflect = new THREE.Mesh(reflectGeo, reflectMat);
    reflect.rotation.x = -Math.PI / 2;
    reflect.position.y = 0.01;
    scene.add(reflect);

    // ── TOWER 1 — central hero tower ──
    // Core
    addBox(6, 32, 5.5, concreteDark, 0, 16, 0);
    // Glass curtain wall front
    for (let i = 0; i < 16; i++) {
      const mat = i % 5 === 0 ? glassLit : (i % 3 === 0 ? glassLit2 : glassBlue);
      addBox(5.8, 1.6, 0.12, mat, 0, 1 + i * 2, 2.82);
      addBox(5.8, 1.6, 0.12, mat.clone(), 0, 1 + i * 2, -2.82);
    }
    // Side glass
    for (let i = 0; i < 16; i++) {
      const mat = i % 4 === 1 ? glassLit2 : glassBlue;
      addBox(0.12, 1.6, 5.3, mat, 3.07, 1 + i * 2, 0);
      addBox(0.12, 1.6, 5.3, mat.clone(), -3.07, 1 + i * 2, 0);
    }
    // Roof cap
    addBox(6.2, 0.6, 5.7, metalDark, 0, 32.3, 0);
    addBox(4, 2, 3.5, concreteMid, 0, 33.3, 0);
    // Antenna
    const antGeo = new THREE.CylinderGeometry(0.04, 0.06, 6, 8);
    const ant = new THREE.Mesh(antGeo, metalDark);
    ant.position.set(0, 37, 0);
    group.add(ant);

    // ── TOWER 2 — left, shorter ──
    addBox(4.5, 22, 4, concreteMid, -9, 11, 1);
    for (let i = 0; i < 11; i++) {
      const mat = i % 4 === 2 ? glassLit : glassBlue;
      addBox(4.3, 1.4, 0.1, mat, -9, 1 + i * 2, 3.06);
      addBox(4.3, 1.4, 0.1, mat.clone(), -9, 1 + i * 2, -1.06);
    }
    addBox(4.6, 0.5, 4.1, metalDark, -9, 22.25, 1);
    addBox(2.5, 1.5, 2, concreteDark, -9, 23.25, 1);

    // ── TOWER 3 — right, tall slim ──
    addBox(3.5, 28, 3.5, concreteDark, 10, 14, -1);
    for (let i = 0; i < 14; i++) {
      const mat = i % 5 === 0 ? glassLit : (i % 2 === 0 ? glassBlue : glassBlue.clone());
      addBox(3.3, 1.5, 0.1, mat, 10, 1 + i * 2, 1.81);
      addBox(3.3, 1.5, 0.1, mat.clone(), 10, 1 + i * 2, -2.81);
    }
    addBox(3.6, 0.5, 3.6, metalDark, 10, 28.25, -1);
    const ant2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 5, 8), metalDark);
    ant2.position.set(10, 31, -1);
    group.add(ant2);

    // ── TOWER 4 — far left background ──
    addBox(5, 18, 4.5, concreteMid, -18, 9, -3);
    for (let i = 0; i < 9; i++) {
      addBox(4.8, 1.3, 0.1, i % 3 === 0 ? glassLit2 : glassBlue, -18, 1 + i * 2, 2.36);
    }
    addBox(5.1, 0.4, 4.6, metalDark, -18, 18.2, -3);

    // ── TOWER 5 — far right background ──
    addBox(4, 24, 4, concreteDark, 19, 12, -4);
    for (let i = 0; i < 12; i++) {
      addBox(3.8, 1.4, 0.1, i % 6 === 0 ? glassLit : glassBlue, 19, 1 + i * 2, 1.96);
    }
    addBox(4.1, 0.4, 4.1, metalDark, 19, 24.2, -4);

    // ── PODIUM connecting base ──
    addBox(22, 3, 7, concreteMid, 0, 1.5, 0);
    addBox(22.1, 2.4, 0.12, glassBlue, 0, 1.5, 3.56);
    addBox(22.1, 0.2, 7.1, metalDark, 0, 3.1, 0);

    // Podium entrance canopy
    addBox(6, 0.2, 3, metalDark, 0, 3.2, 5);
    addBox(0.15, 3.2, 0.15, metalDark, -2.8, 1.6, 6.4);
    addBox(0.15, 3.2, 0.15, metalDark, 2.8, 1.6, 6.4);

    // ── Street details ──
    // Road lines
    for (let i = -3; i <= 3; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.02, 10),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      line.position.set(i * 4, 0.01, 20);
      scene.add(line);
    }

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0x101820, 1.0);
    scene.add(ambient);

    // Moon/key light
    const moon = new THREE.DirectionalLight(0x8899cc, 1.4);
    moon.position.set(-20, 40, 20);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 120;
    moon.shadow.camera.left = -35;
    moon.shadow.camera.right = 35;
    moon.shadow.camera.top = 50;
    moon.shadow.camera.bottom = -10;
    scene.add(moon);

    // Warm fill from right
    const fill = new THREE.DirectionalLight(0xffaa44, 0.3);
    fill.position.set(30, 15, 10);
    scene.add(fill);

    // Interior glow points
    const pts = [
      [0, 10, 3, 0xffcc44, 2.5, 14],
      [0, 22, 3, 0x88bbff, 1.8, 12],
      [-9, 8, 3, 0xffcc44, 1.5, 10],
      [10, 14, 2, 0xaaddff, 1.5, 10],
      [19, 10, 2, 0xffcc44, 1.2, 9],
    ];
    const pointLights = pts.map(([x, y, z, color, intensity, distance]) => {
      const pl = new THREE.PointLight(color, intensity, distance);
      pl.position.set(x, y, z);
      scene.add(pl);
      return pl;
    });

    // Ground street lights
    for (let i = -2; i <= 2; i++) {
      const sl = new THREE.PointLight(0xff9944, 0.8, 8);
      sl.position.set(i * 9, 3.5, 10);
      scene.add(sl);
      // Pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 4, 6),
        metalDark
      );
      pole.position.set(i * 9, 2, 10);
      scene.add(pole);
    }

    // ── Particle stars ──
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = Math.random() * 80 + 20;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 10;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.7 }));
    scene.add(stars);

    // ── Mouse parallax ──
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ──
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animate ──
    let frameId;
    const clock = new THREE.Clock();
    let camX = 0, camY = 6;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow camera drift (cinematic pan)
      camX += (mouse.x * 3 - camX) * 0.025;
      camY += (-mouse.y * 1.5 + 6 - camY) * 0.025;
      camera.position.x = camX + Math.sin(t * 0.08) * 1.5;
      camera.position.y = camY + Math.sin(t * 0.05) * 0.3;
      camera.lookAt(0, 10, 0);

      // Breathing interior lights
      pointLights.forEach((pl, i) => {
        pl.intensity = pts[i][3 + 1] * (0.85 + Math.sin(t * (0.7 + i * 0.3) + i) * 0.15);
      });

      // Stars slow drift
      stars.rotation.y = t * 0.003;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Gradient fade bottom → works grid'e yumuşak geçiş */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 180,
        background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Brand + tagline */}
      <div style={{
        position: 'absolute', bottom: 80, left: 56,
        zIndex: 10, pointerEvents: 'none',
      }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>
          Architectural Visualization Studio
        </p>
        <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', fontWeight: 200, letterSpacing: '-0.03em', lineHeight: 1, color: '#fff', margin: 0 }}>
          Banko Arts
        </h1>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, right: 48,
        zIndex: 10, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <p style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
          Scroll
        </p>
        <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }} />
      </div>

    </div>
  );
}
