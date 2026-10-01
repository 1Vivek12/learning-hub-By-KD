import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { language } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        en: 'How do the live interactive classes work?',
        hinglish: 'Live interactive classes kaise hoti hain?',
        hi: 'लाइव इंटरैक्टिव कक्षाएं कैसे काम करती हैं?',
      },
      a: {
        en: 'All live classes utilize real browser WebRTC SFU technology. You can turn on your microphone, camera, and share your screen to get real-time code and formula debugging directly from the instructor.',
        hinglish: 'Sabhi classes high-speed WebRTC par chalti hain. Aap mic on karke direct doubt pooch sakte ho aur apni Excel file ya SQL query screen share karke debug kara sakte ho.',
        hi: 'सभी लाइव कक्षाएं ब्राउज़र वेबआरटीसी तकनीक का उपयोग करती हैं। आप अपने संदेह पूछने के लिए माइक और स्क्रीन शेयर कर सकते हैं।',
      },
    },
    {
      q: {
        en: 'Are the certificates recognized by top MNCs and recruiters?',
        hinglish: 'Kya certificates top companies me recognize hote hain?',
        hi: 'क्या प्रमाणपत्र शीर्ष कंपनियों द्वारा मान्यता प्राप्त हैं?',
      },
      a: {
        en: 'Yes. Every certificate is issued with a permanent unique verification hash, QR code, and accredited portfolio project references that you can embed directly on LinkedIn and your resume.',
        hinglish: 'Ji haan. Har certificate ke sath ek unique verification code aur QR milta hai jise aap seedhe apne LinkedIn aur resume me share kar sakte hain.',
        hi: 'हाँ। प्रत्येक प्रमाणपत्र एक विशिष्ट सत्यापन कोड और क्यूआर कोड के साथ जारी किया जाता है जिसे आप लिंक्डइन और बायोडाटा पर जोड़ सकते हैं।',
      },
    },
    {
      q: {
        en: 'What if I miss a live cohort session?',
        hinglish: 'Agar meri live class miss ho jaye to kya hoga?',
        hi: 'यदि मेरी कोई लाइव क्लास छूट जाए तो क्या होगा?',
      },
      a: {
        en: 'Every single live session is recorded in 1080p 60fps and automatically uploaded to your course curriculum dashboard within 2 hours, complete with download files and cheat sheets.',
        hinglish: 'Har live masterclass ki full HD recording 2 ghante ke andar aapke student portal me add ho jati hai with exercise files.',
        hi: 'प्रत्येक लाइव सत्र 2 घंटे के भीतर अभ्यास फ़ाइलों के साथ आपके छात्र पोर्टल पर अपलोड किया जाता है।',
      },
    },
    {
      q: {
        en: 'What is your refund policy?',
        hinglish: 'Refund policy kya hai?',
        hi: 'रिफंड नीति क्या है?',
      },
      a: {
        en: 'We offer an unconditional 30-day 100% money-back guarantee. If you are not satisfied with the course material, simply click refund in your portal or contact support.',
        hinglish: 'Puri 30-day money-back guarantee hai. Agar aapko course pasand nahi aaya to 1-click refund mil jayega bina kisi sawal ke.',
        hi: 'हम 30 दिनों की मनी-बैक गारंटी प्रदान करते हैं। यदि आप संतुष्ट नहीं हैं, तो पूरा रिफंड मिलता है।',
      },
    },
  ];

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-400">Everything you need to know about Learning Hub.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 dark:border-white/10 light:bg-white light:border-slate-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                  {faq.q[language]}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed border-t border-white/5 dark:border-white/5 light:border-slate-100">
                  {faq.a[language]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
