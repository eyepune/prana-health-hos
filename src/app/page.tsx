"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  FileText, 
  Stethoscope, 
  Search,
  Globe,
  Zap,
  Lock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import PranaLogo3 from "@/components/PranaLogo3";
import LanguageSelector from "@/components/LanguageSelector";

export default function LandingPage() {
  const { lang, setLang, t } = useLanguage();

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="bg-cream selection:bg-teal/10 font-outfit overflow-x-hidden">
      
      {/* 🧠 ELITE NAVIGATION */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
        <div className="glass-card bg-white/40 backdrop-blur-3xl border-white/20 px-10 py-5 flex items-center justify-between rounded-[40px] shadow-2xl shadow-black/[0.03]">
          <div className="flex items-center gap-16">
            <Link href="/" className="flex items-center gap-4 group">
              <PranaLogo3 size={32} pulse={false} />
              <span className="font-outfit font-black text-2xl tracking-tighter uppercase text-authority">
                Prana<span className="text-teal opacity-30">hOS</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-authority/30">
              <Link href="/dashboard" className="hover:text-teal transition-colors">Intelligence</Link>
              <Link href="/dashboard" className="hover:text-teal transition-colors">Sovereignty</Link>
              <Link href="/dashboard" className="hover:text-teal transition-colors">Red Shield™</Link>
            </div>
          </div>

          <div className="flex items-center gap-8">
             <LanguageSelector />

             <Link 
               href="/onboarding"
               className="px-10 py-5 bg-authority text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-teal transition-all shadow-xl shadow-authority/20"
             >
               Initialize
             </Link>
          </div>
        </div>
      </nav>

      {/* 🟣 THE GENESIS HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Deep Field background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-teal/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-teal/5 border border-teal/10 rounded-full text-teal">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Bharat Sovereign Engine v5.0</span>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-outfit font-black text-authority tracking-tighter leading-[0.85] uppercase">
                The Health <br /> <span className="text-teal">Operating</span> <br /> System.
              </h1>
              
              <p className="text-xl md:text-2xl text-authority/40 font-medium leading-relaxed max-w-2xl italic">
                "Clinical-grade intelligence for the 1.4 Billion. Encrypted on Indian soil. Your lifelong Life-Map™ starts here."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 pt-4"
            >
              <Link 
                href="/onboarding"
                className="px-12 py-7 bg-teal text-white rounded-[24px] font-black text-xs uppercase tracking-[0.5em] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_-10px_rgba(13,110,94,0.4)] group"
              >
                Launch hOS <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="px-12 py-7 border-2 border-authority/10 text-authority rounded-[24px] font-black text-xs uppercase tracking-[0.5em] hover:bg-white transition-all">
                Clinical Disclosure
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative flex justify-center"
            >
              <div className="relative z-10">
                <PranaLogo3 size={550} pulse={true} />
              </div>
              
              {/* Data Floating Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-authority/5 rounded-full"
              />
              
              {/* Orbiting Status Nodes */}
              {[0, 120, 240].map((deg, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 1.5 }}
                  className="absolute p-6 glass-card rounded-3xl flex flex-col items-center gap-3 border-white/50 shadow-2xl"
                  style={{ 
                    left: `${50 + Math.cos(deg * Math.PI/180) * 45}%`, 
                    top: `${50 + Math.sin(deg * Math.PI/180) * 45}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {i === 0 && <Activity className="w-6 h-6 text-teal" />}
                  {i === 1 && <Lock className="w-6 h-6 text-saffron" />}
                  {i === 2 && <Zap className="w-6 h-6 text-teal" />}
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Active_Node</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🟢 THE CLINICAL TRIAD - FEATURE GRID */}
      <section className="py-60 px-8 max-w-7xl mx-auto">
        <div className="space-y-32">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-teal">Tri-Intelligence Architecture</h2>
            <h3 className="text-6xl md:text-8xl font-outfit font-black text-authority tracking-tighter uppercase leading-[0.85]">
              One Engine. <br /> Three Pillars.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Stethoscope, title: "Symptom Analyst", desc: "Real-time clinical triage powered by Llama 3.1. 🟢/🟡/🔴 urgency routing in seconds.", color: "teal" },
              { icon: FileText, title: "Report Interpreter", desc: "Scan lab reports and translate medical jargon into actionable Vitality Scores.", color: "saffron" },
              { icon: Search, title: "Product Lens", desc: "The Guardian protocol. Instant safety analysis for food and medication via Vision AI.", color: "teal" }
            ].map((f, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.2 }}
                className="group relative p-16 rounded-[48px] bg-white border border-black/5 hover:border-teal/20 transition-all duration-700 shadow-xl shadow-black/[0.01] hover:shadow-2xl hover:translate-y-[-10px]"
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-12 transition-all duration-700 ${f.color === 'teal' ? 'bg-teal/5 text-teal group-hover:bg-teal group-hover:text-white' : 'bg-saffron/5 text-saffron group-hover:bg-saffron group-hover:text-white'}`}>
                  <f.icon className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h4 className="text-3xl font-outfit font-black text-authority mb-6 tracking-tighter uppercase">{f.title}</h4>
                <p className="text-authority/40 leading-relaxed font-medium text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔒 DATA SOVEREIGNTY STRIP */}
      <div className="w-full bg-authority py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-cream text-4xl md:text-6xl font-outfit font-black uppercase tracking-tighter italic leading-none">Sovereign <br /> Encryption</h2>
            <p className="text-cream/30 text-[10px] font-black uppercase tracking-[0.5em]">Privacy Fortress Active</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-cream/40 text-[10px] font-bold uppercase tracking-[0.4em]">
            <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Zero Knowledge</span>
            <span className="flex items-center gap-3"><Lock className="w-4 h-4" /> HIPAA Compliant</span>
            <span className="flex items-center gap-3"><Activity className="w-4 h-4" /> On-Device First</span>
          </div>
        </div>
      </div>

      {/* 🚀 FINAL CALL TO ACTION */}
      <section className="py-60 px-8 text-center bg-white relative overflow-hidden">
        <motion.div {...fadeIn} className="max-w-5xl mx-auto space-y-16">
           <h2 className="text-8xl md:text-[12rem] font-outfit font-black text-authority tracking-[ -0.05em] leading-[0.75] uppercase italic">
              Ready <br /> to Heal?
           </h2>
           <Link 
              href="/onboarding"
              className="inline-flex px-20 py-8 bg-teal text-white rounded-[32px] font-black text-sm uppercase tracking-[0.7em] hover:bg-authority transition-all shadow-3xl hover:translate-y-[-10px] relative z-10"
           >
              Initialize Life-Map™
           </Link>
           <div className="pt-20 flex justify-center flex-col items-center gap-8 opacity-20">
              <PranaLogo3 size={64} pulse={false} />
              <p className="text-[10px] font-black uppercase tracking-[1em]">Prana Health Intelligence Pvt. Ltd.</p>
           </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-8 border-t border-black/5 bg-cream">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-authority/20">
             <Link href="#" className="hover:text-authority transition-colors">Clinical Disclosure</Link>
             <Link href="#" className="hover:text-authority transition-colors">Data Residency</Link>
             <Link href="#" className="hover:text-authority transition-colors">Sovereignty Terms</Link>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-authority/10">
             © 2026 Bharat Health Engine. Designed by EyE PunE.
          </div>
        </div>
      </footer>
    </div>
  );
}
