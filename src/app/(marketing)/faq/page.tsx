import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Learning Hub courses and platform.',
};

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h1>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-300">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How do I access my courses?</h3>
          <p>Once enrolled, you can access your courses directly from the Student Dashboard. Content is available 24/7.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Are certificates verified?</h3>
          <p>Yes, all certificates generated upon completion are cryptographically verified and can be shared on LinkedIn.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How do live masterclasses work?</h3>
          <p>Live masterclasses use high-quality WebRTC infrastructure. If you have an active enrollment, you can join directly via the dashboard at the scheduled time.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Can I get a refund?</h3>
          <p>Please refer to our Refund & Cancellation Policy for detailed information on eligibility and procedures.</p>
        </div>
      </div>
    </div>
  );
}
