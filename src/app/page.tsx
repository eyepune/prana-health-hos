/// <reference path="../types/globals.d.ts" />
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Stethoscope, 
  Search,
  Building2,
  Heart,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import PranaLogo3 from "@/components/PranaLogo3";

export default function LandingPage() {
  const { lang, setLang, t } = useLanguage();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="bg-white selection:bg-teal/10 font-outfit">
      
      {/* 🧠 NAVBAR - RECONSTRUCTED */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
        <div className="glass-card bg-white/70 backdrop-blur-2xl border-white/50 px-8 py-4 flex items-center justify-between shadow-2xl shadow-black/5 rounded-[32px]">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <PranaLogo3 size={32} pulse={false} />
              <span className="font-outfit font-black text-xl tracking-tighter uppercase text-authority group-hover:text-[#0D6E5E] transition-colors leading-none mt-1">
                Prana<span className="text-[#0D6E5E]/40 font-bold">Health</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-authority/40">
              <Link href="#" className="hover:text-authority transition-colors">{t.nav.reports}</Link>
              <Link href="#" className="hover:text-authority transition-colors">{t.nav.symptoms}</Link>
              <Link href="#" className="hover:text-authority transition-colors">{t.nav.scanner}</Link>
              <Link href="#" className="hover:text-authority transition-colors">{t.nav.how_it_works}</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-sage/5 rounded-full border border-sage/10 group cursor-default">
                <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span className="text-[9px] font-black text-sage uppercase tracking-widest">{lang === 'EN' ? 'SECURE_NODE_ACTIVE' : 'सुरक्षित_नोड_सक्रिय'}</span>
             </div>
             
             <button 
               onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
               className="flex items-center gap-2 hover:bg-authority/5 px-4 py-2 rounded-full transition-all border border-transparent hover:border-authority/10"
             >
               <Globe className="w-4 h-4 text-authority/40" />
               <span className="text-[10px] font-bold text-authority">{lang}</span>
             </button>

             <Link 
               href="/onboarding"
               className="px-8 py-4 bg-[#0D6E5E] text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#0D6E5E]/90 transition-all shadow-xl shadow-[#0D6E5E]/20"
             >
               {t.nav.get_started}
             </Link>
          </div>
        </div>
      </nav>

      {/* 🟣 HERO SECTION - FLIPPED & IMPROVED */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-[#f0f7f6] to-[#e6f2f0] pt-32 pb-32">
        {/* Soft Shifting Gradients Background */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#0D6E5E]/5 rounded-full blur-[150px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center justify-items-center relative z-10 w-full">
          {/* LEFT: ANIMATED CIRCULAR SYSTEM */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex justify-center flex-1 relative order-2 lg:order-1"
          >
            <div className="relative w-[350px] h-[350px] md:w-[550px] md:h-[550px] flex items-center justify-center">
              {/* Rotating Outer Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-[#0D6E5E]/10 rounded-full"
              >
                 {/* Status Nodes on Ring */}
                 {[0, 90, 180, 270].map((deg) => (
                   <div 
                     key={deg} 
                     className="absolute w-2 h-2 rounded-full bg-[#0D6E5E]/20 shadow-lg shadow-[#0D6E5E]/20"
                     style={{ 
                       left: `calc(50% + ${Math.cos(deg * Math.PI/180) * 50}%)`,
                       top: `calc(50% + ${Math.sin(deg * Math.PI/180) * 50}%)`
                     }}
                   />
                 ))}
              </motion.div>

              {/* Central Active Core */}
              <div className="relative z-10 scale-90 md:scale-100">
                <PranaLogo3 size={450} pulse={true} />
              </div>
              
              {/* Floating Intelligence Nodes */}
              <div className="absolute inset-0 pointer-events-none">
                 {[
                   { icon: FileText, label: t.features.reports_title, delay: 0, x: -35, y: -35 },
                   { icon: Stethoscope, label: t.features.symptoms_title, delay: 1, x: 35, y: -35 },
                   { icon: Search, label: t.features.scanner_title, delay: 2, x: 0, y: 45 }
                 ].map((node, i) => (
                   <motion.div
                     key={i}
                     animate={{ 
                       y: [0, -15, 0],
                       opacity: [0.8, 1, 0.8] 
                     }}
                     transition={{ duration: 4, repeat: Infinity, delay: node.delay }}
                     className="absolute p-6 glass-card bg-white/80 border-white rounded-[24px] shadow-2xl flex flex-col items-center gap-3 group"
                     style={{ 
                        left: `${50 + node.x}%`, 
                        top: `${50 + node.y}%`,
                        transform: 'translate(-50%, -50%)'
                     }}
                   >
                     <div className="w-10 h-10 rounded-xl bg-[#0D6E5E]/5 flex items-center justify-center text-[#0D6E5E]">
                        <node.icon className="w-5 h-5" />
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-authority/40">{node.label}</span>
                   </motion.div>
                 ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: USER-CENTRIC CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-12 order-1 lg:order-2 text-center"
          >
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-outfit font-black text-authority tracking-tighter leading-[0.95]">
                {t.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-authority/40 font-medium leading-[1.6] max-w-xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start">
              <Link 
                href="/onboarding"
                className="px-10 py-6 bg-[#0D6E5E] text-white rounded-[20px] font-black text-xs uppercase tracking-[0.4em] hover:bg-[#0D6E5E]/90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#0D6E5E]/30 group"
              >
                {t.hero.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-10 py-6 border-2 border-authority/10 text-authority rounded-[20px] font-black text-xs uppercase tracking-[0.4em] hover:border-[#0D6E5E] transition-all bg-white/50 backdrop-blur-sm">
                {t.hero.secondary_cta}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🟢 TRUST STRIP - IMMEDIATE ANCHOR */}
      <div className="w-full bg-white py-12 border-y border-black/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#0D6E5E]/5 flex items-center justify-center text-[#0D6E5E]">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <span className="text-sm font-black text-authority/80 uppercase tracking-widest leading-none">
               {t.trust_strip.main}
             </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {t.trust_strip.points.map((point: string, i: number) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0D6E5E]/30 group-hover:bg-[#0D6E5E] transition-colors" />
                <span className="text-[11px] font-bold text-authority/40 uppercase tracking-widest">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🧠 FEATURE CARDS - REFINED */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: t.features.reports_title, desc: t.features.reports_desc, icon: FileText },
            { title: t.features.symptoms_title, desc: t.features.symptoms_desc, icon: Stethoscope },
            { title: t.features.scanner_title, desc: t.features.scanner_desc, icon: Search }
          ].map((f, i) => (
            <motion.div 
              key={i}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: i * 0.1 }}
              className="p-12 rounded-[32px] bg-white border border-black/5 shadow-xl shadow-black/[0.01] group hover:border-[#0D6E5E]/20 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0D6E5E]/5 flex items-center justify-center text-[#0D6E5E] mb-10 group-hover:bg-[#0D6E5E] group-hover:text-white transition-all duration-500 shadow-lg shadow-[#0D6E5E]/5">
                <f.icon className="w-8 h-8 font-light" />
              </div>
              <h3 className="text-3xl font-outfit font-black text-authority mb-4 tracking-tighter uppercase leading-tight">{f.title}</h3>
              <p className="text-authority/40 leading-relaxed font-medium text-[16px]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 👨💼 FOUNDER SECTION - MOVED DOWN */}
      <section className="py-40 px-6 max-w-7xl mx-auto border-t border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div {...fadeIn} className="aspect-[4/5] bg-[#f8f9f8] rounded-[40px] overflow-hidden border border-black/5 relative group bg-gradient-to-br from-[#f8f9f8] to-[#e6f2f0]">
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 flex items-center justify-center text-[#0D6E5E]/5 font-black text-[12rem] leading-none select-none tracking-tighter animate-pulse">PRANA</div>
          </motion.div>
          <motion.div {...fadeIn} className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-outfit font-black text-authority tracking-tighter uppercase leading-[0.9]">
                {t.founder.title}
              </h2>
              <p className="text-3xl text-authority/50 font-normal leading-[1.4] italic">
                "{t.founder.desc}"
              </p>
            </div>
            <button className="px-10 py-6 border-2 border-authority/10 text-authority rounded-[24px] font-black text-xs uppercase tracking-[0.5em] hover:border-[#0D6E5E] hover:text-[#0D6E5E] transition-all flex items-center gap-3">
              {t.founder.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 🚀 FINAL CTA - SHARPER */}
      <section className="py-40 px-6 bg-[#0D6E5E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.2),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
          <motion.h2 {...fadeIn} className="text-7xl md:text-9xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.8]">
            {t.final_cta.title}
          </motion.h2>
          <motion.div {...fadeIn}>
            <Link 
              href="/onboarding"
              className="inline-flex px-16 py-8 bg-white text-[#0D6E5E] rounded-[24px] font-black text-sm uppercase tracking-[0.6em] hover:bg-cream transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:translate-y-[-5px]"
            >
              {t.final_cta.cta}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER - MINIMAL */}
      <footer className="py-20 px-6 border-t border-black/5 text-center bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="flex justify-center flex-col items-center gap-6">
              <PranaLogo3 size={48} pulse={false} />
              <p className="text-[10px] font-black text-authority/20 tracking-[1em] uppercase">SYSTEM_STATE: OPERATIONAL</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-bold uppercase tracking-widest text-authority/30">
              <Link href="#" className="hover:text-authority transition-colors">Privacy Fortress</Link>
              <Link href="#" className="hover:text-authority transition-colors">Clinical Disclosure</Link>
              <Link href="#" className="hover:text-authority transition-colors">Terms of Sovereignty</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
