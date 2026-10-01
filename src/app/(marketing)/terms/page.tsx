import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Learning Hub Terms and Conditions.',
  robots: 'noindex'
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms & Conditions</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p><strong>Last Updated:</strong> [Date Configurable in Admin/Settings]</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using Learning Hub, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Educational Content</h2>
        <p>All courses, videos, and materials provided on the platform are the intellectual property of Learning Hub or its instructors. You are granted a limited, non-exclusive license to access this content for personal, non-commercial use.</p>
        
        <h2>3. User Accounts</h2>
        <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
        
        <h2>4. Modifications</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
        
        <p className="text-xs text-slate-500 mt-8 border-t border-slate-200 dark:border-white/10 pt-4">
          <em>Note: Legal details and jurisdiction information should be configured in your business settings.</em>
        </p>
      </div>
    </div>
  );
}
