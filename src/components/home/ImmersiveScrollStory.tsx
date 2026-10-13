"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { ArrowDown, ArrowRight, BookOpen, GraduationCap, Radio, Sparkles } from "lucide-react";

const chapters = [
  { eyebrow: "01 / DISCOVER", title: "A new world of learning.", body: "Your next skill is closer than you think.", icon: Sparkles, cta: "Explore courses", href: "/courses" },
  { eyebrow: "02 / BUILD", title: "Turn curiosity into capability.", body: "Learn by doing, with practical courses built around real skills.", icon: BookOpen, cta: "Find your course", href: "/courses" },
  { eyebrow: "03 / CONNECT", title: "Learn together. Go further.", body: "Bring your questions into live classes and learn with guidance.", icon: Radio, cta: "See live classes", href: "/live-list" },
  { eyebrow: "04 / BECOME", title: "Make your next move count.", body: "Build momentum one lesson, one project and one new skill at a time.", icon: GraduationCap, cta: "Start learning", href: "/courses" },
];

export default function ImmersiveScrollStory() {
  const hostRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapter = chapters[activeChapter];
  const Icon = chapter.icon;

  useEffect(() => {
    const host = hostRef.current;
    const story = storyRef.current;
    if (!host || !story) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let current = 0;
    let frame = 0;
    let lastChapter = -1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070b18");
    scene.fog = new THREE.FogExp2("#070b18", 0.04);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 9;
    const renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    host.replaceChildren(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x9bc8ff, 0x160c3c, 2));
    const cyan = new THREE.PointLight(0x22d3ee, 28, 24);
    cyan.position.set(2, 2, 4);
    scene.add(cyan);
    const violet = new THREE.PointLight(0x8b5cf6, 25, 22);
    violet.position.set(-3, -2, 1);
    scene.add(violet);

    const portal = new THREE.Group();
    scene.add(portal);
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.025, 10, 144), new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.92 })),
      new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.014, 8, 144), new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.75 })),
      new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.009, 8, 144), new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.55 })),
    ];
    rings[0].rotation.set(0.2, 0.3, 0.1);
    rings[1].rotation.set(0.9, -0.45, 0.6);
    rings[2].rotation.set(-0.45, 0.7, -0.35);
    rings.forEach((ring) => portal.add(ring));
    portal.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 2), new THREE.MeshPhysicalMaterial({ color: 0x123c72, metalness: 0.65, roughness: 0.2, emissive: 0x0e7490, emissiveIntensity: 1.1 })));
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.94, 1), new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.45 }));
    portal.add(wire);

    const orbit = new THREE.Group();
    portal.add(orbit);
    const colors = [0x22d3ee, 0xa78bfa, 0x34d399, 0xf0abfc, 0xfbbf24, 0x60a5fa];
    for (let i = 0; i < 6; i += 1) {
      const node = new THREE.Mesh(i % 2 ? new THREE.OctahedronGeometry(0.13) : new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: colors[i], emissive: colors[i], emissiveIntensity: 1.2 }));
      const angle = (i / 6) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 2.65, Math.sin(angle) * 1.7, Math.sin(angle * 2) * 0.6);
      orbit.add(node);
    }
    const count = window.innerWidth < 768 ? 160 : 360;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x9be7ff, size: 0.026, transparent: true, opacity: 0.72, depthWrite: false })));

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const updateProgress = () => {
      const rect = story.getBoundingClientRect();
      target = THREE.MathUtils.clamp(-rect.top / Math.max(1, story.offsetHeight - window.innerHeight), 0, 1);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    updateProgress();

    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      current += (target - current) * (reducedMotion ? 1 : 0.075);
      const p = current;
      const time = performance.now() * 0.00025;
      portal.rotation.y = (reducedMotion ? 0 : time * 0.4) + p * Math.PI * 1.4;
      portal.rotation.x = Math.sin(p * Math.PI * 2) * 0.16;
      portal.scale.setScalar(1 + Math.sin(p * Math.PI) * 0.12);
      wire.rotation.x = -time * 1.2;
      wire.rotation.y = time * 1.6 + p * 2;
      orbit.rotation.y = -time * 0.8 - p * 2.2;
      camera.position.z = 9 - p * 4.3;
      camera.position.x = Math.sin(p * Math.PI * 1.5) * 0.8;
      camera.position.y = Math.cos(p * Math.PI * 1.7) * 0.35;
      camera.lookAt(0, 0, 0);
      cyan.intensity = 24 + Math.sin(p * Math.PI * 4) * 6;
      renderer.render(scene, camera);
      const nextChapter = Math.min(chapters.length - 1, Math.floor(p * chapters.length));
      if (nextChapter !== lastChapter) {
        lastChapter = nextChapter;
        setActiveChapter(nextChapter);
      }
    };
    animate();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section ref={storyRef} aria-label="Learning Hub immersive story" className="relative h-[360vh] bg-[#070b18] text-white">
      <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden">
        <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_67%_45%,rgba(77,153,219,0.12),transparent_34%),linear-gradient(90deg,rgba(5,10,20,0.96)_0%,rgba(5,10,20,0.78)_33%,rgba(5,10,20,0.16)_72%,rgba(5,10,20,0.08)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 py-20 sm:px-10 lg:px-[7.2vw]">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0a1220]/45 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#c6eaf5] backdrop-blur-2xl">
              <Icon className="h-4 w-4" /> {chapter.eyebrow}
            </div>
            <div aria-live="polite" aria-atomic="true" key={activeChapter} className="animate-[storyReveal_650ms_ease_both]">
              <h2 className="max-w-[10ch] text-[clamp(2.8rem,5.2vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.065em] text-white [text-wrap:balance] sm:max-w-[11ch]">{chapter.title}</h2>
              <p className="mt-7 max-w-[30rem] text-[0.98rem] font-normal leading-[1.8] tracking-[-0.01em] text-slate-300/90 sm:text-[1.05rem]">{chapter.body}</p>
              <Link href={chapter.href} className="pointer-events-auto mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#eaf8ff] px-6 py-3 text-[13px] font-semibold tracking-[-0.01em] text-[#09111e] shadow-[0_8px_40px_rgba(125,211,252,0.16)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100">
                {chapter.cta}<ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute bottom-8 left-5 right-5 z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:left-8 sm:right-8 lg:left-10 lg:right-10">
            <span>Learning Hub by KD</span>
            <div className="flex items-center gap-3" aria-label={`Chapter ${activeChapter + 1} of ${chapters.length}`}>
              {chapters.map((item, index) => <span key={item.eyebrow} className={`h-1 rounded-full transition-all duration-500 ${index === activeChapter ? "w-10 bg-cyan-200" : "w-4 bg-white/25"}`} />)}
            </div>
            <span className="hidden items-center gap-2 sm:flex"><ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Scroll to travel</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes storyReveal {
          from { opacity: 0; transform: translate3d(0, 18px, 0); filter: blur(8px); }
          to { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.animate-\\[storyReveal_650ms_ease_both\\]) { animation: none; }
        }
      `}</style>
    </section>
  );
}
