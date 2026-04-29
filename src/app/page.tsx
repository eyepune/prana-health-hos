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
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import PranaLogo3 from "@/components/PranaLogo3";
import LanguageSelector from "@/components/LanguageSelector";

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-primary/20">
      
      {/* 🌌 FUTURISTIC NAV */}
      <nav className="fixed top-0 left-0 w-full z-[100] p-8">
        <div className="max-w-7xl mx-auto glass-panel bg-black/40 backdrop-blur-2xl border-white/5 px-10 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <PranaLogo3 size={32} pulse={true} color="#00FF85" />
            <span className="font-outfit font-black text-2xl tracking-tighter uppercase text-white">
              Prana<span className="text-primary">.hOS</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Neural_Link</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Bio_Records</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Sovereignty</Link>
          </div>

          <div className="flex items-center gap-6">
             <LanguageSelector />
             <Link 
               href="/onboarding"
               className="btn-primary"
             >
               Initialize
             </Link>
          </div>
        </div>
      </nav>

      {/* ⚡ GENESIS SECTION */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Bharat Bio-Engine v6.0</span>
              </div>
              
              <h1 className="text-8xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] uppercase">
                Human <br /> <span className="text-primary italic">Optimized.</span>
              </h1>
              
              <p className="text-2xl text-white/40 font-medium leading-relaxed max-w-2xl">
                Sovereign health intelligence for the biological era. <br />
                <span className="text-primary/60 italic">Your code. Your data. Your vitality.</span>
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link 
                href="/onboarding"
                className="btn-primary py-8 px-12 text-sm shadow-[0_20px_60px_-10px_rgba(0,255,133,0.3)]"
              >
                Launch hOS <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary py-8 px-12 text-sm">
                Clinical Whitepaper
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center h-[600px]">
             <div className="relative">
                {/* Orbital Rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-white/5 rounded-full"
                    style={{ margin: `-${i * 40}px` }}
                  />
                ))}
                
                <div className="relative z-10 drop-shadow-[0_0_50px_rgba(0,255,133,0.3)]">
                  <PranaLogo3 size={400} pulse={true} color="#00FF85" />
                </div>
                
                {/* Floating Bio-Stats */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-20 glass-panel p-6 border-primary/20"
                >
                  <Activity className="w-6 h-6 text-primary mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Bio_Sync</p>
                  <p className="text-xl font-black text-white">98.4%</p>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 🧪 THE INTELLIGENCE GRID */}
      <section className="py-60 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: "Symptom Analyst", desc: "Neural clinical triage with 🟢/🟡/🔴 logic. Real-time recovery mapping.", color: "primary" },
            { icon: Scan, title: "Bio-Vision", desc: "Scan reports and food packaging. Instant toxin and marker extraction.", color: "secondary" },
            { icon: Lock, title: "Sovereign ID", desc: "Zero-knowledge medical encryption. Your data stays on Indian soil.", color: "accent" }
          ].map((f, i) => (
            <motion.div 
              key={i}
              {...fadeIn}
              transition={{ delay: i * 0.2 }}
              className="stats-card p-12 bg-white/[0.02]"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 bg-white/5 text-white group-hover:bg-primary group-hover:text-black`}>
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{f.title}</h3>
              <p className="text-white/40 leading-relaxed font-medium text-lg">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧬 THE VITALITY GRAPHIC */}
      <section className="py-40 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-20">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              Your <br /> <span className="text-primary">Life-Map™</span>
            </h2>
            <p className="text-xl text-white/40 max-w-md">Every biomarker, every scan, every consult — woven into a single, sovereign intelligence layer.</p>
          </div>
          <div className="flex-1 flex justify-center">
             <div className="grid grid-cols-4 gap-4 h-64 items-end">
                {[40, 70, 55, 90, 85, 60, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-12 bg-primary/20 rounded-full border border-primary/30 relative group"
                  >
                     <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-[0_0_20px_#00FF85]" />
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL INITIALIZATION */}
      <section className="py-60 px-8 text-center relative">
        <motion.div {...fadeIn} className="max-w-4xl mx-auto space-y-20">
           <h2 className="text-8xl md:text-[12rem] font-black text-white tracking-tighter leading-[0.8] uppercase italic">
              Code <br /> Your <br /> <span className="text-primary underline decoration-primary/20 underline-offset-[20px]">Vitality.</span>
           </h2>
           <Link 
              href="/onboarding"
              className="btn-primary inline-flex py-10 px-24 text-lg"
           >
              Initialize Life-Map
           </Link>
           <div className="pt-40 opacity-10 flex flex-col items-center gap-8">
              <PranaLogo3 size={64} pulse={false} color="#00FF85" />
              <p className="text-[10px] font-black uppercase tracking-[1em]">Bharat Sovereign Engine v6.0</p>
           </div>
        </motion.div>
      </section>

      <footer className="py-20 px-8 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-widest text-white/20">
          <div className="flex gap-12">
            <Link href="#" className="hover:text-primary">Clinical Disclosure</Link>
            <Link href="#" className="hover:text-primary">Sovereign Encryption</Link>
          </div>
          <div>© 2026 Bharat Health Intelligence. Designed by EyE PunE.</div>
        </div>
      </footer>
    </div>
  );
}
