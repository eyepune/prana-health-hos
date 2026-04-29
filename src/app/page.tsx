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
  Wind
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
    <div className="min-h-screen bg-[#FDFCFB] overflow-x-hidden selection:bg-primary/5 font-outfit">
      
      {/* 🌿 ORGANIC NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8">
        <div className="max-w-7xl mx-auto glass-panel bg-white/40 backdrop-blur-3xl px-12 py-6 flex items-center justify-between border-white/80">
          <Link href="/" className="flex items-center gap-4 group">
            <PranaLogo3 size={32} pulse={true} color="#1E3932" />
            <span className="font-playfair font-black text-2xl tracking-tighter text-primary">
              Prana
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/40">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Consult</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Lab Reports</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Sovereignty</Link>
          </div>

          <div className="flex items-center gap-8">
             <LanguageSelector />
             <Link 
               href="/onboarding"
               className="btn-primary px-10"
             >
               Start Journey
             </Link>
          </div>
        </div>
      </nav>

      {/* 🍵 THE CALM HERO */}
      <section className="relative min-h-[90vh] flex items-center pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary/60">
                <Wind className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pure Clinical Intelligence</span>
              </div>
              
              <h1 className="text-8xl md:text-[9rem] font-playfair font-black text-primary tracking-tighter leading-[0.9]">
                Live in <br /> <span className="italic text-primary/40 font-normal">Harmony.</span>
              </h1>
              
              <p className="text-2xl text-primary/50 font-medium leading-relaxed max-w-2xl font-outfit">
                Prana transforms complex medical data into calm, structured insights. A sovereign health OS built for the modern human.
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:row gap-6 pt-6">
              <Link 
                href="/onboarding"
                className="btn-primary py-8 px-16 text-sm shadow-2xl"
              >
                Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="btn-secondary py-8 px-16 text-sm">
                How it Works
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
             <div className="relative animate-float">
                <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-br from-white to-primary/5 shadow-inner border border-white/50 flex items-center justify-center">
                  <PranaLogo3 size={280} pulse={true} color="#1E3932" />
                </div>
                {/* Floating Micro-Cards */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-10 -right-10 glass-panel p-8 bg-white/90 border-white"
                >
                  <Activity className="w-6 h-6 text-accent mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Vitality_Sync</p>
                  <p className="text-2xl font-playfair font-black text-primary">High</p>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -bottom-10 -left-10 glass-panel p-8 bg-white/90 border-white"
                >
                  <ShieldCheck className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Data_Sovereign</p>
                  <p className="text-2xl font-playfair font-black text-primary">100%</p>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 🍃 THE ZEN GRID */}
      <section className="py-60 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-32 space-y-6">
           <h2 className="text-5xl font-playfair font-black text-primary uppercase tracking-tighter italic">Clinical Clarity.</h2>
           <p className="text-primary/40 font-medium uppercase tracking-[0.4em] text-[10px]">The Three Pillars of Prana</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Cpu, title: "Analyst", desc: "Understand symptoms through structured clinical logic, not confusing search results.", color: "primary" },
            { icon: Scan, title: "Lens", desc: "Instantly scan lab reports and grocery labels to reveal what’s truly inside.", color: "accent" },
            { icon: Lock, title: "Vault", desc: "Your health records are encrypted and stored within your personal sovereign node.", color: "primary" }
          ].map((f, i) => (
            <motion.div 
              key={i}
              {...fadeIn}
              transition={{ delay: i * 0.2 }}
              className="stats-card p-16 bg-white/40 border-white/50"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-12 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <f.icon className="w-10 h-10" />
              </div>
              <h3 className="text-4xl font-playfair font-black text-primary tracking-tighter mb-6">{f.title}</h3>
              <p className="text-primary/50 leading-relaxed font-medium text-lg font-outfit">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🏛️ SOVEREIGN HERITAGE */}
      <section className="py-40 bg-primary/[0.02] border-y border-black/[0.02]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-32">
          <div className="space-y-10">
            <h2 className="text-7xl font-playfair font-black text-primary tracking-tighter italic leading-none">
              Sovereign <br /> <span className="text-primary/30">Heritage.</span>
            </h2>
            <p className="text-xl text-primary/50 max-w-md font-outfit leading-relaxed">
              Prana combines ancient wellness intuition with cutting-edge Bharat medical protocols. A health system that respects your roots.
            </p>
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary font-bold">✓</div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Verified by Prana Protocols</span>
            </div>
          </div>
          <div className="flex-1 w-full glass-panel p-16 bg-white/60">
             <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center justify-between border-b border-black/5 pb-8 last:border-0">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-primary uppercase tracking-tighter">Biomarker_{i * 4}2</p>
                          <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mt-1">Status: Optimal</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-playfair font-black text-primary">{80 + i * 5}%</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 🌿 FINAL JOURNEY */}
      <section className="py-80 px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-[150px] -z-10" />
        <motion.div {...fadeIn} className="max-w-5xl mx-auto space-y-24">
           <h2 className="text-8xl md:text-[11rem] font-playfair font-black text-primary tracking-tighter leading-[0.8] italic">
              Your <br /> Vitality <br /> <span className="text-primary/20">Unlocked.</span>
           </h2>
           <Link 
              href="/onboarding"
              className="btn-primary inline-flex py-10 px-24 text-lg"
           >
              Begin Initialization
           </Link>
           <div className="pt-40 opacity-20 flex flex-col items-center gap-8">
              <PranaLogo3 size={64} pulse={false} color="#1E3932" />
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary">Bharat Health OS v6.5</p>
           </div>
        </motion.div>
      </section>

      <footer className="py-24 px-8 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-primary/20">
          <div className="flex gap-16">
            <Link href="#" className="hover:text-primary transition-colors">Clinical Protocol</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Sovereignty</Link>
          </div>
          <div>© 2026 Bharat Health Intelligence. Designed by EyE PunE.</div>
        </div>
      </footer>
    </div>
  );
}
