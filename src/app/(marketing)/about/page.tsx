import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Learning Hub and our mission to provide cinematic edtech and live masterclasses.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About Learning Hub</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p>
          Learning Hub is the premier cinematic 3D edtech platform engineered for modern technical practitioners.
          We provide high-quality, production-ready curriculum in data analytics, engineering, and artificial intelligence.
        </p>
        <p>
          Our mission is to bridge the gap between theoretical knowledge and enterprise-level application through
          live masterclasses and interactive learning environments.
        </p>
        <h2>Our Methodology</h2>
        <ul>
          <li><strong>Production-grade Curriculum:</strong> Learn skills directly applicable to real-world tasks.</li>
          <li><strong>Live Virtual Rooms:</strong> Engage directly with instructors via WebRTC SFU technology.</li>
          <li><strong>Verifiable Credentials:</strong> Earn cryptographically verifiable certificates upon completion.</li>
        </ul>
      </div>
    </div>
  );
}
