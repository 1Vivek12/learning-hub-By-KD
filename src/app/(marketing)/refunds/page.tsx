import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Learning Hub Refund and Cancellation Policy.',
  robots: 'noindex'
};

export default function RefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Refund & Cancellation Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p><strong>Last Updated:</strong> [Date Configurable in Admin/Settings]</p>
        
        <h2>1. Course Refunds</h2>
        <p>We want you to be satisfied with your learning experience. Eligible course purchases may be refunded within the period defined by our platform settings, provided you have not completed a significant portion of the course material or generated a certificate.</p>
        
        <h2>2. Live Masterclasses</h2>
        <p>Cancellations for live masterclass sessions must be made prior to the scheduled start time to be eligible for any applicable refunds.</p>
        
        <h2>3. Process</h2>
        <p>To request a refund, please contact our support team. Approved refunds will be issued to the original payment method used during the purchase.</p>
        
        <p className="text-xs text-slate-500 mt-8 border-t border-slate-200 dark:border-white/10 pt-4">
          <em>Note: Legal details and specific day-windows should be configured in your business settings.</em>
        </p>
      </div>
    </div>
  );
}
