"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { ArrowDown, ArrowRight, BookOpen, CheckCircle2, Play, Sparkles, Video } from "lucide-react";
import { Course } from "@/types";
import { useLanguage } from "@/i18n/LanguageContext";

interface ImmersiveHeroSectionProps {
  featuredCourse?: Course;
}

export default function ImmersiveHeroSection({ featuredCourse }: ImmersiveHeroSectionProps) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { t, l } = useLanguage();

  useEffect(() => {
    const host = canvasHostRef.current;
    const section = sectionRef.current;
    if (!host || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b18, 0.035);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 10.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x070b18, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.replaceChildren(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x9db8ff, 1.7));
    const cyanLight = new THREE.PointLight(0x2dd4ff, 26, 24);
    cyanLight.position.set(4, 3, 5);
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x8b5cf6, 24, 22);
    violetLight.position.set(-4, -2, 3);
    scene.add(violetLight);

    const world = new THREE.Group();
    scene.add(world);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.18, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x172d63,
        metalness: 0.68,
        roughness: 0.19,
        transmission: 0.12,
        thickness: 0.8,
        emissive: 0x153d85,
        emissiveIntensity: 1.15,
        flatShading: true,
      }),
    );
    core.position.set(1.2, 0.05, 0);
    world.add(core);

    const innerCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.58, 1),
      new THREE.MeshStandardMaterial({
        color: 0x60eaff,
        emissive: 0x0891b2,
        emissiveIntensity: 2.4,
        metalness: 0.6,
        roughness: 0.24,
        wireframe: true,
      }),
    );
    innerCore.position.copy(core.position);
    world.add(innerCore);

    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.82 }),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.75 }),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.48 }),
    ];
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.018, 8, 128), ringMaterials[0]),
      new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.012, 8, 128), ringMaterials[1]),
      new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.008, 8, 128), ringMaterials[2]),
    ];
    rings[0].rotation.set(0.8, 0.3, 0.2);
    rings[1].rotation.set(1.2, -0.6, 0.9);
    rings[2].rotation.set(0.25, 1.05, -0.5);
    rings.forEach((ring) => {
      ring.position.copy(core.position);
      world.add(ring);
    });

    const nodeGroup = new THREE.Group();
    world.add(nodeGroup);
    const nodeColors = [0x38bdf8, 0xa78bfa, 0x34d399, 0xf0abfc, 0xfbbf24];
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i += 1) {
      const geometry = i % 2 === 0
        ? new THREE.BoxGeometry(0.32, 0.32, 0.32)
        : new THREE.OctahedronGeometry(0.22, 0);
      const material = new THREE.MeshStandardMaterial({
        color: nodeColors[i],
        emissive: nodeColors[i],
        emissiveIntensity: 0.85,
        metalness: 0.45,
        roughness: 0.25,
      });
      const node = new THREE.Mesh(geometry, material);
      const angle = (i / 5) * Math.PI * 2;
      node.position.set(1.2 + Math.cos(angle) * 2.65, Math.sin(angle) * 1.6, Math.sin(angle * 1.7) * 0.7);
      node.rotation.set(angle * 0.4, angle, angle * 0.2);
      nodes.push(node);
      nodeGroup.add(node);
    }

    const particleCount = window.innerWidth < 768 ? 100 : 240;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x91dfff,
        size: window.innerWidth < 768 ? 0.025 : 0.035,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;
    let frameId = 0;
    const clock = new THREE.Clock();

    const updateSize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 1.2;
      pointerY = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 0.8;
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height * 0.85), 0, 1);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(host);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    updateSize();
    onScroll();

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      targetX += (pointerX - targetX) * 0.035;
      targetY += (pointerY - targetY) * 0.035;
      world.rotation.y = (reducedMotion ? 0 : time * 0.09) + targetX * 0.18 + scrollProgress * 0.72;
      world.rotation.x = targetY * 0.1 + scrollProgress * 0.12;
      core.rotation.x = time * 0.12 + scrollProgress * 0.5;
      core.rotation.y = time * 0.16;
      innerCore.rotation.x = -time * 0.22;
      innerCore.rotation.y = time * 0.3;
      rings[0].rotation.z += reducedMotion ? 0 : 0.0018;
      rings[1].rotation.x += reducedMotion ? 0 : 0.0012;
      rings[2].rotation.y -= reducedMotion ? 0 : 0.0015;
      nodes.forEach((node, index) => {
        node.position.y += reducedMotion ? 0 : Math.sin(time * 1.15 + index * 1.7) * 0.0018;
        node.rotation.x += reducedMotion ? 0 : 0.002;
        node.rotation.y += reducedMotion ? 0 : 0.003;
      });
      particles.rotation.y = reducedMotion ? 0 : time * 0.012 + scrollProgress * 0.2;
      camera.position.x = targetX * 0.3 + scrollProgress * 0.85;
      camera.position.y = 0.2 - scrollProgress * 0.65 + targetY * 0.2;
      camera.position.z = 10.5 - scrollProgress * 1.15;
      camera.lookAt(0.8 + scrollProgress * 0.45, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
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
    <section
      ref={sectionRef}
      className="relative isolate min-h-[780px] overflow-hidden bg-[#070b18] text-white sm:min-h-[820px] lg:min-h-[min(900px,calc(100svh-4rem))]"
      aria-labelledby="learning-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_48%,rgba(30,64,175,0.28),transparent_34%),radial-gradient(ellipse_at_18%_70%,rgba(8,145,178,0.15),transparent_32%),linear-gradient(120deg,#070b18_10%,#0b1124_58%,#090c1b)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_95%)]" />
      <div ref={canvasHostRef} className="pointer-events-none absolute inset-0 z-0 opacity-90" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[#070b18] to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[780px] max-w-7xl grid-cols-1 items-center gap-6 px-5 pb-24 pt-24 sm:px-8 lg:min-h-[min(900px,calc(100svh-4rem))] lg:grid-cols-12 lg:gap-4 lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-20 max-w-2xl lg:col-span-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/[0.055] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-cyan-300" /><span>{t("hero.eyebrow")}</span>
          </div>
          <h1 id="learning-hero-title" className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.25rem] xl:text-[6rem]">{t("hero.title")}</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-8">{t("hero.description")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-[0_12px_40px_rgba(34,211,238,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-cyan-200 hover:shadow-[0_18px_55px_rgba(34,211,238,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">
              <span>{t("hero.ctaPrimary")}</span><ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/live-list" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.055] px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">
              <Video className="h-4 w-4 text-cyan-200" /><span>{t("hero.ctaSecondary")}</span>
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs font-semibold text-slate-300 sm:text-sm">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{t("hero.certBadge")}</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-cyan-200" />Learn by doing</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-300" />Interactive learning</span>
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-4 w-full max-w-md lg:col-span-5 lg:mt-0 lg:max-w-none">
          <div className="relative rounded-[2rem] border border-white/15 bg-slate-950/45 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:border-cyan-100/30">
            <div className="relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-[#101a37]/95 to-[#10112b]/95">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.18),transparent_40%)]" />
              <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-200">Learning Hub by KD</p><p className="mt-1 text-sm font-semibold text-white">Your next skill starts here</p></div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Sparkles className="h-4 w-4" /></span>
              </div>
              {featuredCourse ? (
                <Link href={`/courses/${featuredCourse.slug}`} className="group relative block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={featuredCourse.thumbnail} alt={l(featuredCourse.title, "Featured course")} className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-lg">{featuredCourse.category || "Featured course"}</span>
                    <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-xs font-bold text-white backdrop-blur-lg"><Play className="h-3.5 w-3.5 fill-current" /> Preview course</span>
                  </div>
                  <div className="relative p-5">
                    <h2 className="text-lg font-extrabold text-white">{l(featuredCourse.title)}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{l(featuredCourse.shortDescription)}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Course access</span><span className="text-lg font-black text-cyan-200">₹{featuredCourse.price?.toLocaleString("en-IN")}</span></div>
                  </div>
                </Link>
              ) : (
                <div className="relative p-6 sm:p-7">
                  <div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><BookOpen className="h-6 w-6" /></div><div><p className="font-bold text-white">Your learning universe</p><p className="text-xs text-slate-400">Courses · Live classes · Certificates</p></div></div>
                  <div className="grid grid-cols-2 gap-3">{["Learn a new skill", "Join live classes", "Build real projects", "Earn certificates"].map((label, index) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.045] p-3 text-xs font-semibold text-slate-200"><span className="mb-2 block text-[10px] text-cyan-200">0{index + 1}</span>{label}</div>)}</div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -right-2 -top-4 hidden items-center gap-2 rounded-2xl border border-white/15 bg-[#101a37]/90 px-4 py-3 text-xs font-bold text-white shadow-xl backdrop-blur-xl sm:flex lg:-right-5"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" /> Learn at your pace</div>
          <div className="absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-2xl border border-white/15 bg-[#101a37]/90 px-4 py-3 text-xs font-bold text-white shadow-xl backdrop-blur-xl sm:flex lg:-left-5"><Sparkles className="h-4 w-4 text-violet-300" /> Skills for the real world</div>
        </div>
      </div>

      <a href="#course-orbit" className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 transition hover:text-cyan-200 sm:flex"><ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Scroll to explore</a>
    </section>
  );
}
