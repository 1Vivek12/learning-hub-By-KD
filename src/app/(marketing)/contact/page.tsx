import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Learning Hub support team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Us</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p>
          Have questions or need support? Reach out to us.
        </p>
        
        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10">
          <h3 className="text-lg font-bold mb-4">Support & Inquiries</h3>
          <p className="mb-2"><strong>Email:</strong> support@learninghub.io</p>
          <p className="text-xs text-slate-500 mt-4">
            <em>[Company Address / Registration placeholder - To be configured via settings]</em>
          </p>
        </div>
      </div>
    </div>
  );
}
