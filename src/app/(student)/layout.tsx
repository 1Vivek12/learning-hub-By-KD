"use client";
import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { SearchModal } from '@/components/common/SearchModal';
import { useRouter } from 'next/navigation';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 dark:bg-[#0b0f19] dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-300">
      <Navbar
        currentRoute="dashboard"
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
