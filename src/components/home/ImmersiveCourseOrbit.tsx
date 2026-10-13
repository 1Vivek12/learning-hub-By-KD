"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Orbit, Sparkles } from "lucide-react";
import { Course } from "@/types";
import { useLanguage } from "@/i18n/LanguageContext";

interface ImmersiveCourseOrbitProps {
  courses: Course[];
}

const fallbackCourses = [
  { id: "sql", title: "SQL & Databases", category: "DATA FOUNDATIONS", description: "Query with confidence." },
  { id: "analytics", title: "Business Analytics", category: "ANALYTICS", description: "Turn data into decisions." },
  { id: "powerbi", title: "Power BI", category: "VISUALIZATION", description: "Build beautiful dashboards." },
  { id: "excel", title: "Advanced Excel", category: "PRODUCTIVITY", description: "Work smarter with data." },
  { id: "python", title: "Python for Data", category: "PROGRAMMING", description: "Automate the repetitive." },
  { id: "career", title: "Career Mastery", category: "CAREER", description: "Turn skills into momentum." },
];

export default function ImmersiveCourseOrbit({ courses }: ImmersiveCourseOrbitProps) {
  const orbitRef = useRef<HTMLElement>(null);
  const { l } = useLanguage();
  const visibleCourses = courses.slice(0, 8);
  const cards = visibleCourses.length > 0
    ? visibleCourses.map((course) => ({
        id: course.id,
        title: l(course.title),
        category: course.category || "LEARNING PATH",
        description: l(course.shortDescription),
        href: `/courses/${course.slug}`,
        image: course.thumbnail,
      }))
    : fallbackCourses.map((course) => ({ ...course, href: "/courses", image: "" }));

  useEffect(() => {
    const section = orbitRef.current;
    if (!section) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let target = 0;
    let current = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height + window.innerHeight);
      target = Math.max(-0.8, Math.min(1.2, (window.innerHeight - rect.top) / range));
    };
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      current += (target - current) * (reducedMotion ? 1 : 0.06);
      section.style.setProperty("--orbit-scroll", `${current * 210}deg`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    animate();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={orbitRef} id="course-orbit" className="relative isolate overflow-hidden bg-[#070b18] py-24 text-white sm:py-32" aria-labelledby="course-orbit-title" style={{ "--orbit-scroll": "0deg" } as React.CSSProperties}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(37,99,235,0.2),transparent_40%),radial-gradient(ellipse_at_80%_70%,rgba(139,92,246,0.14),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-violet-200/[0.06] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-violet-100"><Orbit className="h-3.5 w-3.5" /> Explore your next move</span>
          <h2 id="course-orbit-title" className="mt-6 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">Your next skill is <span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">in orbit.</span></h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Explore practical courses, live learning and career-building skills in a more immersive way.</p>
        </div>

        <div className="relative mx-auto mt-16 h-[470px] max-w-5xl [perspective:1200px] sm:mt-20 sm:h-[540px]">
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/20 bg-cyan-300/[0.035] shadow-[0_0_100px_rgba(34,211,238,0.12)] sm:h-64 sm:w-64" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/20 sm:h-96 sm:w-96" />
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07] sm:h-[560px] sm:w-[560px]" />
          <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2rem] border border-cyan-100/25 bg-[#0b1630]/90 shadow-[0_0_80px_rgba(34,211,238,0.16)] backdrop-blur-2xl sm:h-36 sm:w-36"><Sparkles className="h-7 w-7 text-cyan-200 sm:h-9 sm:w-9" /><span className="mt-2 text-center text-[9px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[10px]">Learning Hub</span></div>

          <div className="absolute inset-0 hidden items-center justify-center md:flex" style={{ transform: "rotateX(-8deg)" }}>
            {cards.map((course, index) => {
              const angle = (360 / cards.length) * index;
              const depth = cards.length > 6 ? 300 : 240;
              const lift = Math.sin((angle * Math.PI) / 180) * 34;
              return (
                <Link key={course.id} href={course.href} className="group absolute left-1/2 top-1/2 block w-52 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#101a34]/90 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-cyan-200/60 hover:shadow-[0_0_45px_rgba(34,211,238,0.18)]" style={{ transform: `translate(-50%, -50%) rotateY(calc(${angle}deg + var(--orbit-scroll, 0deg))) translateZ(${depth}px) translateY(${lift}px) rotateY(calc(-1 * (${angle}deg + var(--orbit-scroll, 0deg))))`, transformStyle: "preserve-3d" }}>
                  <div className="relative mb-3 h-24 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-violet-500/20">
                    {course.image ? <img src={course.image} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-100" loading="lazy" /> : <div className="absolute inset-0 flex items-center justify-center"><Orbit className="h-8 w-8 text-cyan-100/80" /></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/70 to-transparent" /><span className="absolute bottom-2 left-2 rounded-full border border-white/15 bg-black/30 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider text-cyan-100 backdrop-blur">{course.category}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2"><div><h3 className="line-clamp-2 text-sm font-extrabold text-white">{course.title}</h3><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-400">{course.description}</p></div><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
                </Link>
              );
            })}
          </div>

          <div className="grid h-full grid-cols-1 gap-3 overflow-y-auto pb-2 md:hidden">
            {cards.slice(0, 4).map((course) => (
              <Link key={course.id} href={course.href} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3 backdrop-blur-xl">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20">{course.image ? <img src={course.image} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center"><Orbit className="h-5 w-5 text-cyan-100" /></div>}</div>
                <div className="min-w-0 flex-1"><p className="text-[9px] font-extrabold uppercase tracking-wider text-cyan-200">{course.category}</p><h3 className="mt-1 truncate text-sm font-bold text-white">{course.title}</h3><p className="mt-1 line-clamp-1 text-xs text-slate-400">{course.description}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-cyan-200" />
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Scroll to rotate · Select a course to explore</p>
      </div>
    </section>
  );
}
