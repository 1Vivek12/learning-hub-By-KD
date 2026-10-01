import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Star, Quote, TrendingUp } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { t, language } = useLanguage();

  const testimonials = [
    {
      name: 'Aditya Sharma',
      role: 'Senior Financial Analyst',
      company: 'Deloitte India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      hike: '+115% Salary Hike',
      quote: {
        en: 'The Excel modeling and SQL performance tuning course directly helped me ace the McKinsey model review round. The live classes are unreal.',
        hinglish: 'Excel modeling aur SQL course ne meri McKinsey technical interview crack kara di. Real company datasets use karke padhaya hai.',
        hi: 'एक्सेल मॉडलिंग और एसक्यूएल कोर्स ने मुझे मैकिन्से टेक्निकल इंटरव्यू क्रैक करने में मदद की। वास्तविक कंपनी डेटासेट पर काम सिखाया गया।',
      },
    },
    {
      name: 'Pooja Nair',
      role: 'BI Engineer',
      company: 'Amazon Web Services',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      hike: 'Promoted to L5',
      quote: {
        en: 'Power BI DAX studio performance diagnostics changed how I build executive dashboards. Rohan explains complex star schemas effortlessly.',
        hinglish: 'DAX studio diagnostics ne mere dashboards ki load speed 10x badha di. Rohan sir ne star schema ko bohot clearly samjhaya.',
        hi: 'डीएएक्स स्टूडियो डायग्नोस्टिक्स ने मेरे डैशबोर्ड की गति को 10 गुना बढ़ा दिया। रोहन सर ने स्टार स्कीमा को बहुत ही स्पष्ट रूप से समझाया।',
      },
    },
    {
      name: 'Karan Mehra',
      role: 'Product Analytics Lead',
      company: 'Razorpay',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      hike: '+80% Salary Hike',
      quote: {
        en: 'The two-way WebRTC classroom where you can literally screen share your broken CTE and have it debugged live is worth 10x the course fee.',
        hinglish: 'Live classroom me screen share karke queries debug karwana sabse best part hai. Aisa live mentorship kisi doosre platform par nahi mila.',
        hi: 'लाइव क्लासरूम में स्क्रीन शेयर करके गलत क्वेरी को सही कराना सबसे अच्छा हिस्सा था। ऐसा मेंटरशिप कहीं और नहीं मिला।',
      },
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
          Proven Career Transformations
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          From manual spreadsheet drudgery to high-impact analytics engineering at leading tech & consulting firms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((tItem, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border p-6 bg-slate-900/60 border-white/10 hover:border-sky-500/30 transition-all dark:bg-slate-900/60 light:bg-white light:border-slate-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(tItem.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                  {tItem.hike}
                </span>
              </div>

              <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed italic">
                "{tItem.quote[language]}"
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-3">
              <img
                src={tItem.avatar}
                alt={tItem.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div>
                <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                  {tItem.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {tItem.role} • <span className="text-sky-400 font-semibold">{tItem.company}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
