"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Scan,
  Cpu,
  Zap,
  Lock,
  Sparkles,
  ChevronDown,
  Wind,
  Globe
} from "lucide-react";
import Link from "next/link";
import PranaLogo3 from "@/components/PranaLogo3";
import LanguageSelector from "@/components/LanguageSelector";

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] overflow-x-hidden selection:bg-primary/20 font-outfit">
      
      {/* 🌑 EXECUTIVE NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-10">
        <div className="max-w-7xl mx-auto glass-panel bg-black/40 backdrop-blur-3xl px-12 py-6 flex items-center justify-between border-white/5 shadow-2xl">
          <Link href="/" className="flex items-center gap-5 group">
            <PranaLogo3 size={36} pulse={true} color="#00D1B2" />
            <span className="font-playfair font-black text-3xl tracking-tighter text-white">
              Prana<span className="text-primary italic">.</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-14 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <Link href="/dashboard" className="hover:text-primary transition-all">Command_Center</Link>
            <Link href="/dashboard" className="hover:text-primary transition-all">Bio_Sovereignty</Link>
            <Link href="/dashboard" className="hover:text-primary transition-all">Clinical_Nodes</Link>
          </div>

          <div className="flex items-center gap-8">
             <LanguageSelector />
             <Link 
               href="/onboarding"
               className="btn-primary py-4 px-10 text-[10px] tracking-[0.4em]"
             >
               Initialize
             </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 THE MIDNIGHT HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] right-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-24 items-center relative z-10">
          <div className="lg:col-span-7 space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
              className="space-y-12"
            >
              <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Bharat Clinical Engine v7.0</span>
              </div>
              
              <h1 className="text-8xl md:text-[10rem] font-playfair font-black text-white tracking-tighter leading-[0.8] uppercase">
                Sovereign <br /> <span className="italic text-primary">Wellness.</span>
              </h1>
              
              <p className="text-2xl text-white/30 font-medium leading-relaxed max-w-2xl font-outfit">
                The world’s first high-performance Health Operating System. <br />
                <span className="text-white/60">Clinical precision meets biological harmony.</span>
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-8 pt-8">
              <Link 
                href="/onboarding"
                className="btn-primary py-10 px-16 text-xs shadow-[0_20px_50px_-10px_rgba(0,209,178,0.3)]"
              >
                Launch Intelligence <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="btn-secondary py-10 px-16 text-xs">
                Protocol Whitepaper
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
             <div className="relative">
                {/* Orbital Rings (Sample 1 influence) */}
                <div className="absolute inset-0 -m-20 border border-white/5 rounded-full animate-spin-slow opacity-20" />
                <div className="absolute inset-0 -m-40 border border-primary/10 rounded-full animate-reverse-spin-slow opacity-10" />
                
                <div className="relative z-10 drop-shadow-[0_0_80px_rgba(0,209,178,0.2)]">
                  <PranaLogo3 size={380} pulse={true} color="#00D1B2" />
                </div>
                
                {/* Executive Micro-Stats (Sample 2 influence) */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-12 -right-12 glass-panel p-10 bg-black/60 border-white/10"
                >
                  <Activity className="w-6 h-6 text-primary mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Sync_Status</p>
                  <p className="text-3xl font-playfair font-black text-white uppercase italic">Optimal</p>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 🔳 THE INTELLIGENCE GRID */}
      <section className="py-60 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-40 space-y-8">
           <h2 className="text-6xl font-playfair font-black text-white uppercase tracking-tighter italic">Clinical Nodes.</h2>
           <p className="text-primary font-black uppercase tracking-[0.8em] text-[10px]">High-Performance Health Mapping</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Cpu, title: "Analyst", desc: "Neural clinical triage powered by Llama 3.1. Zero-latency diagnostic logic.", color: "primary" },
            { icon: Scan, title: "Scanner", desc: "Advanced vision extraction for lab reports and clinical pharmacy labels.", color: "primary" },
            { icon: Lock, title: "Sovereign", desc: "Private biometric nodes encrypted at the biological edge. No cloud compromise.", color: "primary" }
          ].map((f, i) => (
            <motion.div 
              key={i}
              {...fadeIn}
              transition={{ delay: i * 0.2 }}
              className="stats-card p-16 bg-white/[0.01] border-white/5"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-14 group-hover:bg-primary group-hover:text-black transition-all duration-700 shadow-[0_0_20px_rgba(0,209,178,0.1)]">
                <f.icon className="w-10 h-10" />
              </div>
              <h3 className="text-4xl font-playfair font-black text-white tracking-tighter mb-8 uppercase italic">{f.title}</h3>
              <p className="text-white/30 leading-relaxed font-medium text-lg font-outfit">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 FINAL INITIALIZATION */}
      <section className="py-80 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/[0.03] rounded-full blur-[200px] -z-10" />
        <motion.div {...fadeIn} className="max-w-5xl mx-auto space-y-32">
           <h2 className="text-8xl md:text-[13rem] font-playfair font-black text-white tracking-tighter leading-[0.7] uppercase italic">
              Your <br /> Code <br /> <span className="text-primary italic underline decoration-white/10 underline-offset-[30px]">Vitality.</span>
           </h2>
           <Link 
              href="/onboarding"
              className="btn-primary inline-flex py-12 px-28 text-sm"
           >
              Initialize hOS 7.0
           </Link>
           <div className="pt-40 opacity-10 flex flex-col items-center gap-10 grayscale">
              <PranaLogo3 size={80} pulse={false} color="#FFF" />
              <p className="text-[11px] font-black uppercase tracking-[1em] text-white">Bharat Sovereign Intelligence</p>
           </div>
        </motion.div>
      </section>

      <footer className="py-24 px-8 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
          <div className="flex gap-20">
            <Link href="#" className="hover:text-primary transition-all">Clinical_Disclosure</Link>
            <Link href="#" className="hover:text-primary transition-all">Data_Sovereignty</Link>
          </div>
          <div>© 2026 Bharat Health Intelligence. Designed by EyE PunE.</div>
        </div>
      </footer>
    </div>
  );
}
