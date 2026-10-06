// @ts-nocheck
import React, { useState } from 'react';
import { HomepageSectionConfig } from '@/types';
import { StorageService } from '@/services/storageService';
import { useSession } from 'next-auth/react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  Save,
  CheckCircle2,
  Layers,
  Globe,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AdminHomepageCMS: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [sections, setSections] = useState<HomepageSectionConfig[]>(() =>
    StorageService.getHomepageSections()
  );
  const [editingSection, setEditingSection] = useState<HomepageSectionConfig | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hinglish' | 'hi'>('en');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleVisibility = (sec: HomepageSectionConfig) => {
    const updated = sections.map((s) => (s.id === sec.id ? { ...s, isVisible: !s.isVisible } : s));
    setSections(updated);
    StorageService.saveHomepageSections(updated);
    StorageService.logAuditAction(
      user.email,
      'UPDATE_HOMEPAGE_CMS',
      `Toggled visibility of section "${sec.id}" to ${!sec.isVisible}`
    );
    showToast(`Updated section ${sec.id} visibility`);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-assign order numbers
    newSections.forEach((s, idx) => (s.order = idx + 1));

    setSections(newSections);
    StorageService.saveHomepageSections(newSections);
    StorageService.logAuditAction(
      user.email,
      'REORDER_HOMEPAGE_CMS',
      `Moved section "${temp.id}" ${direction}`
    );
    showToast(`Reordered section order`);
  };

  const handleSaveSectionEdits = () => {
    if (!editingSection) return;
    const updated = sections.map((s) => (s.id === editingSection.id ? editingSection : s));
    setSections(updated);
    StorageService.saveHomepageSections(updated);
    StorageService.logAuditAction(
      user.email,
      'EDIT_HOMEPAGE_SECTION',
      `Edited copy for section ${editingSection.id}`
    );
    showToast(`Saved changes to section ${editingSection.id}`);
    setEditingSection(null);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset homepage sections to factory defaults?')) {
      localStorage.removeItem('skillforge_homepage_sections_v2');
      const reset = StorageService.getHomepageSections();
      setSections(reset);
      StorageService.logAuditAction(user.email, 'RESET_HOMEPAGE_CMS', `Reset homepage layout to default`);
      showToast('Reset homepage sections to defaults');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>Homepage Builder & Section CMS</span>
          </h2>
          <p className="text-xs text-slate-400">
            Reorder landing page blocks, toggle visibility, and customize multi-language copywriting in English, Hinglish, and Hindi.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Sections Drag/Reorder List */}
      <div className="rounded-2xl border bg-slate-900/60 border-white/10 overflow-hidden dark:bg-slate-900/60 light:bg-white light:border-slate-200 divide-y divide-white/5">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              !section.isVisible ? 'opacity-50 bg-slate-950/40' : 'hover:bg-white/5'
            }`}
          >
            {/* Left info */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <span className="font-mono text-xs font-bold text-sky-400 w-6">
                #{section.order}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                    {section.title.en}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    type: {section.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{section.subtitle.en}</p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setEditingSection(JSON.parse(JSON.stringify(section)))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Copy</span>
              </button>

              <button
                onClick={() => handleToggleVisibility(section)}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  section.isVisible
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-slate-800 text-slate-500'
                }`}
                title={section.isVisible ? 'Disable Section' : 'Enable Section'}
              >
                {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Language Section Copy Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e1424] shadow-2xl overflow-hidden flex flex-col text-slate-100 dark:bg-[#0e1424] light:bg-white light:border-slate-300 light:text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  Edit Section Copy & Translations
                </h3>
                <span className="text-xs text-sky-400 font-mono">
                  Section ID: {editingSection.id}
                </span>
              </div>

              {/* Language Switch Tabs */}
              <div className="flex rounded-lg bg-slate-900 p-0.5 border border-white/10 text-xs">
                {(['en', 'hinglish', 'hi'] as const).map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLang(code)}
                    className={`px-3 py-1 rounded-md font-semibold capitalize ${
                      selectedLang === code
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {code === 'en' ? 'English' : code === 'hinglish' ? 'Hinglish' : 'Hindi'}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Section Title ({selectedLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={editingSection.title[selectedLang]}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      title: { ...editingSection.title, [selectedLang]: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Section Subtitle / Tagline ({selectedLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={editingSection.subtitle[selectedLang]}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      subtitle: { ...editingSection.subtitle, [selectedLang]: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>

              {editingSection.buttonText && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      CTA Button Label ({selectedLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={editingSection.buttonText[selectedLang]}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          buttonText: {
                            ...editingSection.buttonText!,
                            [selectedLang]: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">CTA Button URL</label>
                    <input
                      type="text"
                      value={editingSection.buttonUrl || ''}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          buttonUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveSectionEdits}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sky-400 to-teal-300 hover:opacity-95 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Section Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
