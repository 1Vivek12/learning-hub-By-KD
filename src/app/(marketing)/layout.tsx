"use client";
import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { SearchModal } from '@/components/common/SearchModal';
import { useRouter } from 'next/navigation';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-[#0a0f1c] dark:text-slate-100 transition-colors duration-300">
      <Navbar
        currentRoute="home"
        onNavigate={(view) => {
          if (view === 'courses') router.push('/courses');
          else if (view === 'dashboard') router.push('/dashboard');
          else if (view === 'admin') router.push('/admin');
          else router.push('/');
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer onNavigate={(view) => {
        if (view === 'courses') router.push('/courses');
        else if (view === 'about') router.push('/about');
        else if (view === 'contact') router.push('/contact');
        else if (view === 'faq') router.push('/faq');
        else if (view === 'privacy') router.push('/privacy');
        else if (view === 'terms') router.push('/terms');
        else if (view === 'refunds') router.push('/refunds');
        else if (view === 'dashboard') router.push('/dashboard');
        else if (view === 'admin') router.push('/admin');
        else if (view === 'paths') router.push('/paths');
        else if (view === 'live-list') router.push('/live-list');
        else router.push('/');
      }} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCourse={(slug) => router.push(`/courses/${slug}`)}
      />
    </div>
  );
}
