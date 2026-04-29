"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const languages = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "HI", name: "हिन्दी", flag: "🇮🇳" },
  { code: "TE", name: "తెలుగు", flag: "🇮🇳" },
  { code: "TA", name: "தமிழ்", flag: "🇮🇳" },
  { code: "MR", name: "मराठी", flag: "🇮🇳" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "AR", name: "العربية", flag: "🇸🇦" }
];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white transition-all shadow-lg group"
      >
        <Globe className="w-4 h-4 text-teal group-hover:rotate-45 transition-transform duration-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-authority">{currentLang.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-3xl z-[120] overflow-hidden p-3"
            >
              <div className="grid grid-cols-1 gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as any);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                      lang === l.code ? 'bg-teal text-white' : 'hover:bg-teal/5 text-authority/60 hover:text-teal'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg">{l.flag}</span>
                      <span className="text-[11px] font-black uppercase tracking-widest">{l.name}</span>
                    </div>
                    {lang === l.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
