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
  ArrowRight,
  Zap,
  Cpu
} from "lucide-react";
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
    <div className="min-h-screen bg-cream selection:bg-teal/10 flex flex-col items-center justify-center p-8 overflow-hidden font-outfit">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[800px] h-[800px] bg-teal/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[120px]" />
      </div>

      <div className="fixed top-12 left-12 p-4 glass-card bg-white rounded-3xl z-50">
        <PranaLogo3 size={40} pulse={true} />
      </div>

      <AnimatePresence mode="wait">
        {step === "greeting" && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="max-w-4xl text-center space-y-20 relative z-10"
          >
            <div className="space-y-12">
              <div className="inline-flex items-center gap-4 px-8 py-3 bg-teal/5 border border-teal/10 rounded-full text-teal">
                <Zap className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Calibration_Phase_0.0</span>
              </div>
              <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-authority leading-[0.75] uppercase italic">
                Initialize <br /> <span className="text-teal">Bharat</span> <br /> Yatra.
              </h1>
              <p className="text-2xl md:text-3xl text-authority/30 font-medium leading-relaxed max-w-2xl mx-auto italic">
                "Clinical precision for the 1.4 Billion. Sovereign. Encrypted. Essential."
              </p>
            </div>
            <button 
              onClick={() => nextStep("identity")}
              className="px-16 py-8 bg-authority text-white rounded-[32px] font-black text-xs uppercase tracking-[0.6em] hover:bg-teal transition-all shadow-3xl flex items-center gap-6 mx-auto group"
            >
              Begin Calibration <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === "identity" && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl space-y-20 relative z-10"
          >
            <div className="space-y-4">
               <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-teal">Sovereign_Phase_01</h2>
               <h3 className="text-7xl font-black text-authority tracking-tighter uppercase italic leading-none">Resident <br /> Identity</h3>
            </div>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-authority/20 ml-6">Legal Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ENTER RESIDENT NAME..."
                  className="w-full bg-white p-10 rounded-[40px] border-none outline-none focus:ring-4 ring-teal/10 transition-all text-authority font-black uppercase text-2xl tracking-tighter placeholder:text-authority/5 shadow-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                {["male", "female"].map((s: any) => (
                  <button 
                    key={s}
                    onClick={() => setFormData((prev: any) => ({ ...prev, sex: s as any }))}
                    className={`p-10 rounded-[40px] border-none transition-all text-sm font-black uppercase tracking-[0.5em] shadow-xl ${
                      formData.sex === s ? "bg-teal text-white scale-105" : "bg-white text-authority/20 hover:text-authority hover:bg-white/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-12">
              <button onClick={() => nextStep("greeting")} className="text-authority/10 hover:text-authority transition-colors flex items-center gap-4 text-[10px] uppercase font-black tracking-widest">
                <ChevronLeft className="w-6 h-6" /> Re-Calibrate
              </button>
              <button 
                onClick={() => nextStep("vitality")}
                disabled={!formData.name || !formData.sex}
                className="px-16 py-8 bg-teal text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] hover:scale-[1.05] transition-all disabled:opacity-20 shadow-2xl shadow-teal/30"
              >
                Next Phase
              </button>
            </div>
          </motion.div>
        )}

        {step === "vitality" && (
           <motion.div 
             key="step3"
             initial={{ opacity: 0, x: 100 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -100 }}
             className="w-full max-w-2xl space-y-20 relative z-10"
           >
             <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-teal">Sovereign_Phase_02</h2>
                <h3 className="text-7xl font-black text-authority tracking-tighter uppercase italic leading-none">Vitality <br /> Calibration</h3>
             </div>

             <div className="grid grid-cols-2 gap-12">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-authority/20 ml-6">Age (Yrs)</label>
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full bg-white p-10 rounded-[40px] border-none outline-none focus:ring-4 ring-teal/10 transition-all text-authority font-black text-4xl text-center" 
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-authority/20 ml-6">Weight (KG)</label>
                  <input 
                    type="number" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full bg-white p-10 rounded-[40px] border-none outline-none focus:ring-4 ring-teal/10 transition-all text-authority font-black text-4xl text-center" 
                  />
               </div>
             </div>

             <div className="flex justify-between items-center pt-12">
               <button onClick={() => nextStep("identity")} className="text-authority/10 hover:text-authority transition-colors flex items-center gap-4 text-[10px] uppercase font-black tracking-widest">
                 <ChevronLeft className="w-6 h-6" /> Re-Calibrate
               </button>
               <button 
                 onClick={() => nextStep("access")}
                 disabled={!formData.age || !formData.weight}
                 className="px-16 py-8 bg-teal text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] hover:scale-[1.05] transition-all disabled:opacity-20 shadow-2xl shadow-teal/30"
               >
                 Finalize Setup
               </button>
             </div>
           </motion.div>
        )}

        {step === "access" && (
           <motion.div 
             key="step4"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="max-w-4xl text-center space-y-20 relative z-10"
           >
              <div className="w-48 h-48 rounded-[48px] bg-teal text-white mx-auto flex items-center justify-center shadow-[0_40px_80px_-20px_rgba(13,110,94,0.5)]">
                <ShieldCheck className="w-24 h-24 animate-pulse" />
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                   <h2 className="text-[10px] font-black uppercase tracking-[1em] text-teal">Protocol_Sync_Ready</h2>
                   <h3 className="text-8xl md:text-[10rem] font-black text-authority uppercase tracking-tighter leading-[0.75] italic">Bharat <br /> Sovereign <br /> Ready.</h3>
                </div>
                <p className="text-2xl text-authority/30 leading-relaxed font-medium px-12 max-w-2xl mx-auto italic">
                  "Your clinical life-map is now encrypted. Your sovereign health journey begins."
                </p>
              </div>
              <button 
                onClick={() => {
                  updateProfile({ ...formData, onboarding_complete: true });
                  router.push("/dashboard");
                }}
                className="w-full py-10 bg-authority text-white rounded-[40px] font-black text-sm uppercase tracking-[0.8em] hover:bg-teal transition-all shadow-[0_30px_100px_-15px_rgba(26,29,30,0.4)]"
              >
                Launch Dashboard
              </button>
           </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progress Indicator */}
      <div className="fixed bottom-12 flex gap-4">
        {["greeting", "identity", "vitality", "access"].map((s, i) => (
          <div 
            key={i} 
            className={`h-1.5 transition-all duration-700 rounded-full ${step === s ? "w-12 bg-teal" : "w-3 bg-authority/10"}`}
          />
        ))}
      </div>
    </div>
  );
}
