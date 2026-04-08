/// <reference path="../../types/globals.d.ts" />
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
   MessageCircle,
   FileText,
   Maximize,
   Settings,
   Bell,
   Activity,
   Zap,
   ShieldCheck,
   ShieldOff,
   AlertCircle,
   X,
   Plus,
   ArrowRight,
   TrendingUp,
   Scan,
   Calendar,
   Clock
} from "lucide-react";
import PranaLogo3 from "@/components/PranaLogo3";
import EmergencyGlow from "@/components/EmergencyGlow";

export default function Dashboard() {
   const { lang, t } = useLanguage();
   const [activeModule, setActiveModule] = useState(null as "consult" | "records" | "lens" | "appointments" | "reminders" | null);
   const [isEmergency, setIsEmergency] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const [isIncognito, setIsIncognito] = useState(false);
   const [userLocation, setUserLocation] = useState("LOCATING...");
   const [inputValue, setInputValue] = useState("");
   const [messages, setMessages] = useState([
      { role: "assistant", content: t.dashboard.consult_welcome }
   ] as { role: string; content: string }[]);
   const [records, setRecords] = useState([
      { marker: "Vitamin D", value: "24", unit: "ng/mL", status: "low", date: "2024-03-01" },
      { marker: "HbA1c", value: "5.7", unit: "%", status: "normal", date: "2024-02-15" }
   ] as any[]);
   const [isLoading, setIsLoading] = useState(false);

   const handleSendMessage = async () => {
      if (!inputValue.trim() || isLoading) return;

      const userMessage = { role: "user", content: inputValue };
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
         const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               messages: [...messages, userMessage],
               type: "text",
               profile: { name: "Resident", sex: "Unknown", age: "Unknown" } // Placeholder profile
            })
         });

         const data = await response.json();
         if (data.content) {
            setMessages(prev => [...prev, data.content]);
         } else {
            setMessages(prev => [...prev, { role: "assistant", content: "Sync failed. Please try again." }]);
         }
      } catch (error) {
         console.error("Chat Error:", error);
         setMessages(prev => [...prev, { role: "assistant", content: "Connection Error. Bharat Engine Offline." }]);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (navigator && navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((pos) => {
            setUserLocation(`LAT: ${pos.coords.latitude.toFixed(2)}, LNG: ${pos.coords.longitude.toFixed(2)}`);
         }, (err) => {
            setUserLocation("ACCESS DENIED");
         });
      }
   }, []);

   return (
      <div className="min-h-screen bg-cream selection:bg-sage/10 p-6 md:p-8 space-y-8">
         {/* Header */}
         <header className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
               <h1 className="text-4xl md:text-5xl font-outfit font-black tracking-tighter text-authority leading-none uppercase">
                  {t.dashboard.greeting}
               </h1>
               <div className="flex items-center gap-2 mt-2">
                  <ShieldCheck className="w-4 h-4 text-sage animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-authority/40">{t.dashboard.subtitle}</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="p-3 glass-card rounded-full hover:bg-white transition-colors relative">
                  <Bell className="w-5 h-5 text-authority/60" />
                  <div className="absolute top-3 right-3 w-2 h-2 bg-saffron rounded-full border-2 border-cream" />
               </button>
               <button className="p-3 glass-card rounded-full hover:bg-white transition-colors">
                  <Settings className="w-5 h-5 text-authority/60" />
               </button>
            </div>
         </header>

         {/* Main Grid */}
         <main className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Vitality Hub Card */}
               <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row gap-12 bg-white/70">
                  <div className="flex items-center gap-8">
                     <div className="w-24 h-24 rounded-full border-[6px] border-sage/20 border-t-sage animate-[spin_4s_linear_infinite] p-1">
                        <div className="w-full h-full rounded-full bg-cream flex items-center justify-center font-outfit font-black text-2xl text-sage">72</div>
                     </div>
                     <div>
                        <h4 className="text-authority/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-2">{t.dashboard.vitality_score}</h4>
                        <p className="text-3xl font-outfit font-bold tracking-tight">{t.dashboard.awaiting_calibration}</p>
                        <p className="text-sage text-[10px] font-bold uppercase mt-2 tracking-widest">{t.dashboard.sovereign_link}</p>
                     </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 border-l border-authority/5 pl-0 md:pl-12">
                     {[
                        { label: t.dashboard.heart, val: "--", icon: Activity, color: "text-sage" },
                        { label: t.dashboard.glucose, val: "--", icon: Zap, color: "text-saffron" },
                        { label: t.dashboard.sleep, val: "--", icon: ShieldCheck, color: "text-sage" },
                        { label: t.dashboard.alerts, val: "0", icon: AlertCircle, color: "text-authority/20" }
                     ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-1">
                           <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                           <span className="text-[10px] font-bold text-authority/30 uppercase tracking-[0.2em]">{stat.label}</span>
                           <span className="text-xl font-outfit font-bold">{stat.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Red Shield Card */}
               <div className="glass-card p-10 bg-authority text-cream flex flex-col justify-between overflow-hidden relative group border-none shadow-2xl shadow-authority/20">
                  <div className="space-y-4 relative z-10">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">{t.dashboard.emergency}</h3>
                     <p className="text-4xl font-outfit font-black tracking-tighter uppercase leading-none italic">Raksha<br />Shield</p>
                     <div className="flex items-center gap-2 text-saffron bg-white/5 py-2 px-4 rounded-full w-fit">
                        <div className="w-2 h-2 rounded-full bg-saffron animate-ping" />
                        <span className="text-[10px] font-black tracking-widest uppercase">{userLocation}</span>
                     </div>
                  </div>
                  <button
                     onClick={() => setIsEmergency(true)}
                     className="w-full py-5 bg-white text-authority hover:bg-cream transition-all rounded-antigravity text-[10px] font-black uppercase tracking-[0.3em] mt-12 relative z-20 shadow-xl"
                  >
                     Deploy Shield
                  </button>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-red-500/20 transition-all" />
               </div>
            </div>

            {/* Intelligence Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
               {[
                  { id: "consult" as const, title: t.dashboard.analyst, desc: t.dashboard.analyst_desc, icon: MessageCircle, color: "sage" },
                  { id: "records" as const, title: t.dashboard.records, desc: t.dashboard.records_desc, icon: FileText, color: "saffron" },
                  { id: "lens" as const, title: t.dashboard.lens, desc: t.dashboard.lens_desc, icon: Scan, color: "authority" },
                  { id: "appointments" as const, title: t.dashboard.appointments, desc: t.dashboard.appointments_desc, icon: Calendar, color: "sage" },
                  { id: "reminders" as const, title: t.dashboard.reminders, desc: t.dashboard.reminders_desc, icon: Clock, color: "saffron" }
               ].map((mod) => (
                  <button
                     key={mod.id}
                     onClick={() => setActiveModule(mod.id)}
                     className="glass-card p-8 flex flex-col items-start transition-all duration-500 hover:translate-y-[-10px] group text-left border-authority/5 hover:border-authority/20"
                  >
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 mb-6 ${mod.color === 'sage' ? 'bg-sage/5 text-sage group-hover:bg-sage group-hover:text-cream shadow-sage/10 group-hover:shadow-xl' :
                        mod.color === 'saffron' ? 'bg-saffron/5 text-saffron group-hover:bg-saffron group-hover:text-cream shadow-saffron/10 group-hover:shadow-xl' :
                           'bg-authority/5 text-authority group-hover:bg-authority group-hover:text-cream shadow-authority/10 group-hover:shadow-xl'
                        }`}>
                        <mod.icon className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-outfit font-black text-authority mb-3 tracking-tighter uppercase leading-tight">{mod.title}</h3>
                     <p className="text-authority/50 leading-relaxed text-[10px] font-medium">{mod.desc}</p>
                  </button>
               ))}
            </div>
         </main>

         {/* Logic Overlays */}
         <AnimatePresence mode="wait">
            {activeModule === "consult" && (
               <motion.div
                  key="consult-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-authority/40 backdrop-blur-xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 50 }}
                     className="glass-card max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl bg-cream border-white/50"
                  >
                     <div className="p-8 border-b border-authority/5 flex items-center justify-between bg-sage/5">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter text-authority">{t.dashboard.analyst}</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-3 hover:bg-authority/10 rounded-full transition-colors bg-white/50">
                           <X className="w-6 h-6 text-authority" />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-white/30">
                        {messages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-8 rounded-antigravity max-w-[80%] text-base leading-relaxed border shadow-sm ${msg.role === 'user' ? 'bg-authority text-cream rounded-tr-none border-authority/5' : 'bg-white text-authority/80 rounded-tl-none border-authority/5 italic'
                                 }`}>
                                 {msg.content}
                              </div>
                           </div>
                        ))}
                        {isLoading && (
                           <div className="flex justify-start">
                              <div className="bg-white/50 p-6 rounded-antigravity rounded-tl-none flex gap-2">
                                 <div className="w-2 h-2 rounded-full bg-sage animate-bounce" />
                                 <div className="w-2 h-2 rounded-full bg-sage animate-bounce [animation-delay:-.3s]" />
                                 <div className="w-2 h-2 rounded-full bg-sage animate-bounce [animation-delay:-.5s]" />
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="p-8 bg-cream border-t border-authority/5">
                        <div className="flex items-center gap-6">
                           <div className="flex-1 relative">
                              <input
                                 type="text"
                                 placeholder={isListening ? t.dashboard.listening : t.dashboard.placeholder}
                                 value={inputValue}
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                 className={`w-full bg-white rounded-antigravity px-8 py-6 pr-16 text-lg font-medium border-2 transition-all outline-none shadow-inner ${isListening ? "border-sage shadow-[0_0_30px_rgba(42,126,116,0.2)] placeholder-sage" : "border-authority/5 focus:border-sage shadow-authority/5"
                                    }`}
                              />
                              <button
                                 onClick={() => setIsListening(!isListening)}
                                 className={`absolute right-6 top-1/2 -translate-y-1/2 transition-all p-2 rounded-full ${isListening ? 'bg-sage text-cream animate-pulse' : 'text-authority/20 hover:text-sage hover:bg-sage/5'}`}
                              >
                                 <Activity className="w-6 h-6" />
                              </button>
                           </div>
                           <button
                              onClick={handleSendMessage}
                              disabled={isLoading}
                              className="p-6 bg-authority text-cream rounded-antigravity shadow-2xl shadow-authority/30 hover:translate-y-[-4px] transition-all disabled:opacity-50"
                           >
                              <ArrowRight className="w-6 h-6" />
                           </button>
                        </div>
                        <div className="flex items-center justify-between mt-6 px-4">
                           <button
                              onClick={() => setIsIncognito(!isIncognito)}
                              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all p-2 px-6 rounded-full border-2 ${isIncognito ? "text-saffron bg-white border-saffron/30 shadow-lg shadow-saffron/10" : "text-authority/20 border-transparent hover:border-authority/10"
                                 }`}
                           >
                              {isIncognito ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                              {isIncognito ? t.dashboard.privacy_active : t.dashboard.incognito_medical}
                           </button>
                           <span className="text-[10px] font-black text-authority/10 uppercase tracking-widest">Bytez.js Clinical Protocol 1.0</span>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "records" && (
               <motion.div
                  key="records-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-authority/40 backdrop-blur-xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 50 }}
                     className="glass-card max-w-6xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl bg-cream border-white/50"
                  >
                     <div className="p-8 border-b border-authority/5 flex items-center justify-between bg-saffron/5">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter text-authority">{t.dashboard.records}</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-3 hover:bg-authority/10 rounded-full transition-colors bg-white/50">
                           <X className="w-6 h-6 text-authority" />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12 flex flex-col lg:row gap-16 bg-white/20">
                        <div className="flex-1 space-y-10">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/30 pl-4 border-l-4 border-saffron">{t.dashboard.biomarker_extraction}</h3>
                           <div className="space-y-4">
                              {records.map((r: any, i: number) => (
                                 <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between p-8 bg-white rounded-antigravity border border-authority/5 shadow-xl shadow-authority/5 hover:border-saffron/20 transition-all cursor-pointer group"
                                 >
                                    <div>
                                       <p className="font-black text-lg text-authority tracking-tight uppercase leading-none mb-1">{r.marker}</p>
                                       <p className="text-[10px] text-authority/30 uppercase font-black tracking-widest">{r.date}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className={`text-3xl font-outfit font-black ${r.status === 'low' ? 'text-red-500' : 'text-sage'}`}>
                                          {r.value} <span className="text-[10px] font-black opacity-20 uppercase">{r.unit}</span>
                                       </p>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                           <button className="w-full py-8 border-4 border-dashed border-authority/5 rounded-antigravity text-authority/20 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-saffron hover:border-saffron/20 transition-all group">
                              <Plus className="inline-block mr-2 w-4 h-4 group-hover:rotate-90 transition-transform" /> {t.dashboard.upload_report}
                           </button>
                        </div>

                        <div className="flex-1 space-y-10">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/30 pl-4 border-l-4 border-sage">{t.dashboard.vitality_timeline}</h3>
                           <div className="h-80 glass-card p-12 flex items-end justify-between bg-white shadow-2xl shadow-authority/5 border-none">
                              {[40, 70, 55, 90, 85].map((h, i) => (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-6 h-full justify-end">
                                    <motion.div
                                       initial={{ height: 0 }}
                                       animate={{ height: `${h}%` }}
                                       className={`w-full max-w-[60px] rounded-t-2xl transition-all duration-700 ${i === 3 ? 'bg-sage shadow-2xl shadow-sage/40' : 'bg-sage/5 hover:bg-sage/10'}`}
                                    />
                                    <span className="text-[10px] font-black text-authority/20 tracking-tighter">WEEK {i + 1}</span>
                                 </div>
                              ))}
                           </div>
                           <div className="p-10 bg-sage/5 rounded-antigravity border border-sage/10 relative overflow-hidden group">
                              <TrendingUp className="absolute top-8 right-10 w-20 h-20 text-sage/10 group-hover:scale-110 transition-transform" />
                              <h4 className="font-black text-[10px] text-sage uppercase tracking-[0.5em] mb-6">{t.dashboard.clinical_interpretation}</h4>
                              <p className="text-base text-authority/70 leading-relaxed font-medium italic relative z-10">
                                 {t.dashboard.interpretation_text}
                              </p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "appointments" && (
               <motion.div
                  key="appointments-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-authority/40 backdrop-blur-xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 50 }}
                     className="glass-card max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl bg-cream border-white/50"
                  >
                     <div className="p-8 border-b border-authority/5 flex items-center justify-between bg-sage/5">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter text-authority">{t.dashboard.appointments}</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-3 hover:bg-authority/10 rounded-full transition-colors bg-white/50">
                           <X className="w-6 h-6 text-authority" />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-white/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {[
                              { name: "Dr. Ananya Sharma", spec: "General Physician", available: "Today, 4:00 PM" },
                              { name: "Vaidya Rajesh Kumar", spec: "Ayurvedic Specialist", available: "Tomorrow, 10:00 AM" },
                              { name: "Dr. Vikram Seth", spec: "Cardiologist", available: "Friday, 2:00 PM" }
                           ].map((doc, i) => (
                              <div key={i} className="glass-card p-8 flex items-center justify-between hover:border-sage/30 transition-all cursor-pointer group bg-white/70">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-sage font-black text-xl">
                                       {doc.name.split(' ')[1][0]}
                                    </div>
                                    <div>
                                       <h4 className="font-outfit font-black text-lg text-authority uppercase leading-tight">{doc.name}</h4>
                                       <p className="text-[10px] text-authority/40 uppercase font-black tracking-widest leading-none mt-1">{doc.spec}</p>
                                       <p className="text-sage text-[10px] font-bold mt-4 uppercase tracking-[0.2em] bg-sage/5 px-3 py-1 rounded-full w-fit">Next: {doc.available}</p>
                                    </div>
                                 </div>
                                 <button className="p-4 bg-authority text-cream rounded-xl group-hover:bg-sage transition-all shadow-lg group-hover:translate-x-1">
                                    <ArrowRight className="w-5 h-5" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "reminders" && (
               <motion.div
                  key="reminders-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-authority/40 backdrop-blur-xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 50 }}
                     className="glass-card max-w-4xl w-full h-[70vh] flex flex-col overflow-hidden shadow-2xl bg-cream border-white/50"
                  >
                     <div className="p-8 border-b border-authority/5 flex items-center justify-between bg-saffron/5">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter text-authority">{t.dashboard.reminders}</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-3 hover:bg-authority/10 rounded-full transition-colors bg-white/50">
                           <X className="w-6 h-6 text-authority" />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-white/30">
                        <div className="space-y-4">
                           {[
                              { name: "Metformin 500mg", time: "8:00 AM", status: "Taken" },
                              { name: "Vitamin D3", time: "1:00 PM", status: "Upcoming" },
                              { name: "Ashwagandha", time: "9:00 PM", status: "Upcoming" }
                           ].map((med, i) => (
                              <div key={i} className="flex items-center justify-between p-8 bg-white rounded-antigravity border border-authority/5 shadow-xl shadow-authority/5 group hover:border-saffron/20 transition-all">
                                 <div className="flex items-center gap-6">
                                    <div className={`w-3 h-3 rounded-full ${med.status === 'Taken' ? 'bg-sage' : 'bg-saffron animate-pulse'}`} />
                                    <div>
                                       <p className="font-black text-xl text-authority uppercase tracking-tighter leading-none mb-1">{med.name}</p>
                                       <p className="text-[10px] text-authority/30 uppercase font-black tracking-widest">{med.time}</p>
                                    </div>
                                 </div>
                                 <span className={`text-[10px] font-black uppercase tracking-[0.3em] p-2 px-6 rounded-full border-2 ${med.status === 'Taken' ? 'bg-sage/10 text-sage border-sage/20 shadow-lg shadow-sage/5' : 'bg-saffron/10 text-saffron border-saffron/20 shadow-lg shadow-saffron/5'}`}>
                                    {med.status}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {isEmergency && (
               <EmergencyGlow
                  isActive={isEmergency}
                  location={userLocation}
                  onClose={() => setIsEmergency(false)}
               />
            )}
         </AnimatePresence>
      </div>
   );
}
