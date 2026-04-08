/// <reference path="../app/globals.d.ts" />
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Globe, ShieldCheck, ShieldOff } from "lucide-react";
import PranaLogo3 from "./PranaLogo3";
import { useLanguage } from "@/context/LanguageContext";

export default function FloatingNav() {
  const { lang, setLang, t } = useLanguage();
  const [isPrivacy, setIsPrivacy] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="glass-card bg-white/70 px-8 py-4 flex items-center justify-between border-white/50 shadow-xl shadow-sage/5">
        <Link href="/" className="flex items-center gap-3 group">
          <PranaLogo3 size={32} pulse={true} className="group-hover:scale-110 transition-transform" />
          <div className="flex flex-col">
            <span className="text-xl font-outfit font-black uppercase tracking-tighter text-authority">Prana<span className="text-sage">Health</span></span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-authority/40">Sovereign OS</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-authority/70">
          <Link href="#consult" className="hover:text-sage transition-colors">{t.nav.consult}</Link>
          <Link href="#records" className="hover:text-sage transition-colors">{t.nav.records}</Link>
          <Link href="#lens" className="hover:text-sage transition-colors">{t.nav.lens}</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/5 hover:bg-sage/10 transition-colors text-xs font-bold text-sage"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang}
          </button>

          <button 
            onClick={() => setIsPrivacy(!isPrivacy)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-bold ${
              isPrivacy ? "bg-saffron text-authority" : "bg-authority/5 text-authority/40 hover:bg-authority/10"
            }`}
          >
            {isPrivacy ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {isPrivacy ? "Private" : "Secure"}
          </button>
          
          <Link href="/onboarding" className="btn-sage py-2 text-sm">
            {t.nav.launch}
          </Link>
        </div>
      </div>
    </nav>
  );
}
