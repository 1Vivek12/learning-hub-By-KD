import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learning Hub Privacy Policy.',
  robots: 'noindex' // Legal pages often noindexed, but this ensures it complies with proper SEO structure if requested
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p><strong>Last Updated:</strong> [Date Configurable in Admin/Settings]</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, purchase courses, or communicate with us. This may include your name, email address, and encrypted password.</p>
        
        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to deliver our educational services, process your transactions securely, and send you important technical updates.</p>
        
        <h2>3. Data Security</h2>
        <p>Your privacy is important to us. We implement security measures designed to protect your information, including standard encryption for sensitive credentials.</p>
        
        <h2>4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@learning-hub-by-kd.vercel.app.</p>
        
        <p className="text-xs text-slate-500 mt-8 border-t border-slate-200 dark:border-white/10 pt-4">
          <em>Note: Legal details and jurisdiction information should be configured in your business settings.</em>
        </p>
      </div>
    </div>
  );
}
