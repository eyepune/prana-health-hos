/// <reference path="../globals.d.ts" />
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Activity, 
  User, 
  Heart,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import PranaLogo3 from "@/components/PranaLogo3";
import { useUser } from "@/context/UserContext";

type Step = "greeting" | "identity" | "vitality" | "access";

export default function Onboarding() {
  const router = useRouter();
  const { profile, updateProfile } = useUser();
  const [step, setStep] = useState("greeting" as Step);
  const [formData, setFormData] = useState({
    name: profile.name || "",
    sex: profile.sex || "" as "male" | "female" | "other" | "",
    age: profile.age || "",
    weight: profile.weight || "",
    conditions: profile.conditions || [] as string[]
  });

  const nextStep = (next: Step) => setStep(next);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-sage/10 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="fixed top-12 left-12">
        <PranaLogo3 size={48} pulse={true} />
      </div>

      <AnimatePresence mode="wait">
        {step === "greeting" && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-xl text-center space-y-12"
          >
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl font-outfit font-black tracking-tighter text-authority leading-[0.8] uppercase">
                Initialize <br /> <span className="text-sage">Bharat</span> <br /> Yatra.
              </h1>
              <p className="text-authority/60 text-xl leading-relaxed italic max-w-md mx-auto">
                "Calibration for the 1.4 Billion. Sovereign Health. Clinical Precision."
              </p>
            </div>
            <button 
              onClick={() => nextStep("identity")}
              className="px-10 py-5 bg-[#0D6E5E] text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-[#0D6E5E]/90 transition-all shadow-2xl flex items-center gap-4 group mx-auto w-fit"
            >
              Initialize Yatra <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === "identity" && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-lg space-y-12"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-outfit font-bold text-authority tracking-tighter uppercase italic">Bharat Identity</h2>
              <p className="text-authority/40 text-xs font-black uppercase tracking-[0.3em]">Sovereign Phase 01</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/20 ml-2">Clinical Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Resident Name..."
                  className="w-full bg-white p-8 rounded-antigravity border-2 border-authority/5 outline-none focus:border-sage transition-all text-authority font-black uppercase text-sm tracking-widest placeholder:text-authority/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["male", "female"].map((s: any) => (
                  <button 
                    key={s}
                    onClick={() => setFormData((prev: any) => ({ ...prev, sex: s as any }))}
                    className={`p-8 rounded-antigravity border-2 transition-all text-[10px] font-black uppercase tracking-[0.4em] ${
                      formData.sex === s ? "bg-sage border-sage text-cream shadow-2xl shadow-sage/40" : "bg-white border-authority/5 text-authority/20 hover:border-sage/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-12">
              <button onClick={() => nextStep("greeting")} className="text-authority/10 hover:text-authority transition-colors flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                <ChevronLeft className="w-5 h-5" /> RE-CALIBRATE
              </button>
              <button 
                onClick={() => nextStep("vitality")}
                disabled={!formData.name || !formData.sex}
                className="px-12 py-6 bg-sage text-cream rounded-antigravity font-black text-xs uppercase tracking-[0.2em] hover:bg-sage/90 transition-all disabled:opacity-20 shadow-2xl shadow-sage/30"
              >
                PHASE 02
              </button>
            </div>
          </motion.div>
        )}

        {step === "vitality" && (
           <motion.div 
             key="step3"
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -50 }}
             className="w-full max-w-lg space-y-12"
           >
             <div className="space-y-2">
               <h2 className="text-4xl font-outfit font-bold text-authority tracking-tighter uppercase italic">Vitality Stats</h2>
               <p className="text-authority/40 text-xs font-black uppercase tracking-[0.3em]">Sovereign Phase 02</p>
             </div>

             <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/20 ml-2">Resident Age</label>
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full bg-white p-8 rounded-antigravity border-2 border-authority/5 outline-none focus:border-saffron transition-all text-authority font-black text-xl" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/20 ml-2">Weight (KG)</label>
                  <input 
                    type="number" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full bg-white p-8 rounded-antigravity border-2 border-authority/5 outline-none focus:border-saffron transition-all text-authority font-black text-xl" 
                  />
               </div>
             </div>

             <div className="flex justify-between items-center pt-12">
               <button onClick={() => nextStep("identity")} className="text-authority/10 hover:text-authority transition-colors flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                 <ChevronLeft className="w-5 h-5" /> RE-CALIBRATE
               </button>
               <button 
                 onClick={() => nextStep("access")}
                 disabled={!formData.age || !formData.weight}
                 className="px-12 py-6 bg-saffron text-cream rounded-antigravity font-black text-xs uppercase tracking-[0.2em] hover:bg-saffron/90 transition-all disabled:opacity-20 shadow-2xl shadow-saffron/30"
               >
                 Finalize Yatra
               </button>
             </div>
           </motion.div>
        )}

        {step === "access" && (
           <motion.div 
             key="step4"
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-xl text-center space-y-16"
           >
              <div className="w-32 h-32 rounded-full bg-sage/5 flex items-center justify-center text-sage mx-auto shadow-inner">
                <ShieldCheck className="w-16 h-16 animate-pulse" />
              </div>
              <div className="space-y-8">
                <h2 className="text-6xl font-outfit font-black text-authority uppercase tracking-tighter leading-none">Bharat <br /> Sovereign <br /> Ready.</h2>
                <p className="text-authority/40 leading-relaxed italic font-medium px-8">
                  "Your clinical history is now encrypted on Indian soil. Your sovereign health yatra begins."
                </p>
              </div>
              <button 
                onClick={() => {
                  updateProfile({ ...formData, onboardingComplete: true });
                  router.push("/dashboard");
                }}
                className="w-full py-8 bg-authority text-cream rounded-antigravity font-black text-xs uppercase tracking-[0.5em] hover:bg-authority/90 transition-all shadow-[0_30px_60px_-15px_rgba(26,29,30,0.3)]"
              >
                Launch Bharat Dashboard
              </button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
