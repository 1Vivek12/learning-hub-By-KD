import React from 'react';
import { Certificate } from '@/types';
import { Award, ShieldCheck, Download, Printer, X, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl border border-amber-500/40 bg-[#0c1220] shadow-2xl overflow-hidden text-slate-100 p-8 space-y-6">
        {/* Close Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
            <Award className="w-4 h-4" />
            <span>LEARNING_HUB VERIFIED CERTIFICATE • {certificate.id}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="relative border-4 border-double border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center bg-gradient-to-b from-[#0f172a] via-[#0b101c] to-[#070b14] shadow-inner space-y-6">
          {/* Watermark Crest */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-[2px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-amber-300/80 font-bold">
              CERTIFICATE OF ENTERPRISE MASTERY
            </span>
            <p className="text-xs text-slate-400">This is officially presented and accredited to</p>
          </div>

          {/* Student Name */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-serif tracking-wide py-2">
            {certificate.studentName}
          </h2>

          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            for successfully fulfilling all curriculum requirements, hands-on production assignments, and comprehensive evaluation in
          </p>

          {/* Course Name */}
          <h3 className="text-lg sm:text-xl font-bold text-white max-w-xl mx-auto">
            {certificate.courseTitle}
          </h3>

          {/* Signature & Verification Bar */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-xs items-end">
            <div className="text-left space-y-1">
              <div className="font-serif italic text-base text-amber-200">
                {certificate.instructorName}
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-1">
                Faculty Lead & Program Chair
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-md flex items-center justify-center">
                {/* QR Placeholder */}
                <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center text-[8px] font-mono text-amber-400">
                  QR VERIFY
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-500">ID: {certificate.id}</span>
            </div>

            <div className="text-right space-y-1">
              <div className="font-mono text-xs text-slate-300 font-bold">
                {certificate.completionDate}
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-1">
                Date of Accreditation
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically signed on Learning Hub Network</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
