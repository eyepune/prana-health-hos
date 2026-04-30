/// <reference path="../../types/globals.d.ts" />
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
   MessageCircle,
   FileText,
   Activity,
   Zap,
   ShieldCheck,
   AlertCircle,
   X,
   Plus,
   ArrowRight,
   TrendingUp,
   Scan,
   Calendar,
   Clock,
   Cpu,
   Leaf,
   Wind,
   Settings
} from "lucide-react";
import PranaLogo3 from "@/components/PranaLogo3";
import EmergencyGlow from "@/components/EmergencyGlow";
import ProductLens from "@/components/ProductLens";
import HealthRecordsModal from "@/components/HealthRecordsModal";
import LanguageSelector from "@/components/LanguageSelector";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/utils/supabase";

export default function Dashboard() {
   const { lang, t } = useLanguage();
   const { profile } = useUser();
   const [activeModule, setActiveModule] = useState(null as "consult" | "records" | "lens" | "appointments" | "reminders" | null);
   const [isEmergency, setIsEmergency] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [userLocation, setUserLocation] = useState("LOCATING...");
   const [inputValue, setInputValue] = useState("");
   const [messages, setMessages] = useState([
      { role: "assistant", content: t.dashboard.consult_welcome }
   ] as { role: string; content: string }[]);
   
   const [records, setRecords] = useState([] as any[]);
   const [appointments, setAppointments] = useState([] as any[]);
   const [reminders, setReminders] = useState([] as any[]);
   const [isLoading, setIsLoading] = useState(false);
   const [vitalityScore, setVitalityScore] = useState(0);

   const fetchData = async () => {
      if (!profile?.id) return;
      const { data: vData } = await supabase.from('vitality_records').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      if (vData) {
         setRecords(vData.map(r => ({ marker: r.marker_name, value: r.marker_value, status: r.vitality_score > 70 ? 'normal' : 'low' })));
         const avg = vData.reduce((acc, curr) => acc + (curr.vitality_score || 0), 0) / vData.length;
         setVitalityScore(Math.round(avg || 0));
      }
      const { data: cData } = await supabase.from('consultations').select('*').eq('user_id', profile.id).order('created_at', { ascending: true });
      if (cData && cData.length > 0) {
         const history = cData.flatMap(c => [{ role: "user", content: c.query }, { role: "assistant", content: c.response?.content || "" }]);
         setMessages([{ role: "assistant", content: t.dashboard.consult_welcome }, ...history]);
      }
      const { data: aData } = await supabase.from('appointments').select('*').eq('user_id', profile.id).order('appointment_date', { ascending: true });
      if (aData) setAppointments(aData);
      const { data: rData } = await supabase.from('reminders').select('*').eq('user_id', profile.id).order('created_at', { ascending: true });
      if (rData) setReminders(rData);
   };

   useEffect(() => { fetchData(); }, [profile?.id]);

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
               profile: profile,
               lang: lang === 'HI' ? 'Hindi' : lang === 'TE' ? 'Telugu' : lang === 'TA' ? 'Tamil' : lang === 'ES' ? 'Spanish' : lang === 'AR' ? 'Arabic' : 'English'
            })
         });
         const data = await response.json();
         if (data.content) setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
   };

   const toggleListening = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      if (isListening) { setIsListening(false); return; }
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => { setInputValue(event.results[0][0].transcript); setIsListening(false); };
      recognition.start();
   };

   const speakContent = (text: string) => {
      if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
   };

   return (
      <div className="min-h-screen bg-[#0A0A0B] p-6 md:p-12 space-y-12 font-outfit selection:bg-primary/20">
         
         {/* 🌑 COMMAND CENTER NAVIGATION */}
         <header className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-10">
               <div className="p-5 glass-panel bg-primary/10 border-primary/20">
                  <PranaLogo3 size={48} pulse={true} color="#00D1B2" />
               </div>
               <div>
                  <h1 className="text-5xl font-playfair font-black text-white tracking-tighter italic leading-none">
                     hOS<span className="text-primary italic">.</span>7
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                     <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#00D1B2] animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Active_Resident: {profile?.name || "Initializing..."}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="hidden lg:flex items-center gap-10 px-12 py-6 glass-panel bg-white/5 border-white/5">
                  <div className="text-right">
                     <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Sovereignty</p>
                     <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Mainnet_Linked</p>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="text-right">
                     <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Encryption</p>
                     <p className="text-[11px] font-bold text-white uppercase tracking-widest">Quantum_Safe</p>
                  </div>
               </div>
               <LanguageSelector />
               <button className="p-5 glass-panel bg-white/5 hover:bg-white/10 text-white/20 hover:text-primary transition-all">
                  <Settings className="w-7 h-7" />
               </button>
            </div>
         </header>

         {/* 🧩 THE HYBRID GRID */}
         <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 h-full">
            
            {/* LEFT: PERFORMANCE VITALITY */}
            <div className="lg:col-span-4 space-y-10">
               <div className="glass-panel bg-black/40 p-16 flex flex-col items-center text-center space-y-14 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                     <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-1/3 h-full bg-primary shadow-[0_0_20px_#00D1B2]" />
                  </div>
                  
                  <div className="relative group">
                     <svg className="w-72 h-72 -rotate-90 relative z-10">
                        <circle cx="144" cy="144" r="130" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                        <circle cx="144" cy="144" r="130" fill="transparent" stroke="currentColor" strokeWidth="14" strokeDasharray={816} strokeDashoffset={816 - (816 * vitalityScore) / 100} strokeLinecap="round" className="text-primary drop-shadow-[0_0_20px_#00D1B2] transition-all duration-1000 ease-out" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <span className="text-8xl font-playfair font-black text-white leading-none">{vitalityScore || "--"}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-6">Vitality_Node</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full">
                     <div className="stats-card p-8 bg-white/[0.02] border-white/5 items-center">
                        <Activity className="w-6 h-6 text-primary mb-4" />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Biometric</p>
                        <p className="text-xl font-playfair font-black text-white italic uppercase tracking-tighter">Optimal</p>
                     </div>
                     <div className="stats-card p-8 bg-white/[0.02] border-white/5 items-center">
                        <Zap className="w-6 h-6 text-secondary mb-4" />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Resilience</p>
                        <p className="text-xl font-playfair font-black text-white italic uppercase tracking-tighter">High</p>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={() => setIsEmergency(true)}
                  className="stats-card bg-primary text-black border-none items-center justify-between flex-row py-14 px-14 group shadow-[0_30px_60px_-15px_rgba(0,209,178,0.3)]"
               >
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Guard_Mode_Active</p>
                     <h4 className="text-5xl font-playfair font-black italic uppercase leading-none">Raksha</h4>
                  </div>
                  <div className="p-8 bg-black text-primary rounded-full group-hover:scale-110 transition-transform shadow-2xl">
                     <ShieldCheck className="w-10 h-10" />
                  </div>
               </button>
            </div>

            {/* CENTER: INTELLIGENCE NODES */}
            <div className="lg:col-span-5 space-y-10">
               <div className="grid grid-cols-2 gap-8">
                  {[
                     { id: "consult", title: "Analyst", icon: MessageCircle, color: "primary", desc: "Neural Logic" },
                     { id: "records", title: "Bio-Map", icon: FileText, color: "primary", desc: "Sovereign Sync" },
                     { id: "lens", title: "Scanner", icon: Scan, color: "primary", desc: "Bio-Vision" },
                     { id: "appointments", title: "Clinics", icon: Calendar, color: "primary", desc: "Local Routing" }
                  ].map((mod) => (
                     <button
                        key={mod.id}
                        onClick={() => setActiveModule(mod.id as any)}
                        className="stats-card bg-white/[0.01] p-12 border-white/5 items-start gap-14 group"
                     >
                        <div className="w-20 h-20 rounded-[32px] bg-white/5 text-white flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                           <mod.icon className="w-9 h-9" />
                        </div>
                        <div className="text-left">
                           <h3 className="text-4xl font-playfair font-black text-white uppercase tracking-tighter leading-none italic">{mod.title}</h3>
                           <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mt-5 font-outfit">{mod.desc}</p>
                        </div>
                     </button>
                  ))}
               </div>

               <div className="glass-panel p-12 bg-white/[0.02] border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-10">
                     <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,209,178,0.1)]">
                        <TrendingUp className="w-10 h-10" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Neural_Extraction_Recent</p>
                        <p className="text-3xl font-playfair font-black text-white italic leading-none mt-2 uppercase">{records[0]?.marker || "Ready_to_Scan"}</p>
                     </div>
                  </div>
                  <ArrowRight className="w-10 h-10 text-white/10 group-hover:text-primary group-hover:translate-x-4 transition-all" />
               </div>
            </div>

            {/* RIGHT: VITAL SYSTEM QUEUE */}
            <div className="lg:col-span-3">
               <div className="glass-panel h-full bg-white/[0.01] p-12 border-white/5 flex flex-col">
                  <div className="flex items-center justify-between mb-16">
                     <h3 className="text-3xl font-playfair font-black uppercase tracking-tighter text-white">System Queue</h3>
                     <button onClick={() => setActiveModule("reminders")} className="p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-black transition-all shadow-xl">
                        <Plus className="w-6 h-6" />
                     </button>
                  </div>
                  
                  <div className="flex-1 space-y-8">
                     {reminders.length > 0 ? reminders.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-10 bg-white/[0.01] rounded-[40px] border border-white/5 hover:border-primary/30 transition-all group">
                           <div className="flex items-center gap-8">
                              <div className={`w-4 h-4 rounded-full ${r.is_taken ? 'bg-primary shadow-[0_0_15px_#00D1B2]' : 'bg-secondary/40 animate-pulse'}`} />
                              <span className="text-[11px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">{r.medication_name}</span>
                           </div>
                           <span className="text-lg font-black text-white/5 group-hover:text-primary font-playfair italic uppercase">{r.time_of_day}</span>
                        </div>
                     )) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 space-y-12 grayscale">
                           <Wind className="w-24 h-24" />
                           <p className="text-[12px] font-black uppercase tracking-[1.5em]">Calibration_Complete</p>
                        </div>
                     )}
                  </div>

                  {reminders[0] && (
                     <div className="mt-16 p-14 bg-secondary/5 rounded-[56px] border border-secondary/10 group relative overflow-hidden">
                        <div className="relative z-10">
                           <div className="flex items-center gap-6 mb-10">
                              <Clock className="w-6 h-6 text-secondary" />
                              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary/40">Upcoming_Protocol</span>
                           </div>
                           <p className="text-4xl font-playfair font-black text-white leading-tight italic uppercase tracking-tighter">{reminders[0].medication_name}</p>
                           <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.6em] mt-10">Time_Locked: {reminders[0].time_of_day}</p>
                        </div>
                        <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  )}
               </div>
            </div>

         </main>

         {/* 🧠 MODALS (MIDNIGHT LUXE) */}
         <AnimatePresence mode="wait">
            {activeModule === "consult" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-panel max-w-6xl w-full h-[85vh] flex flex-col overflow-hidden bg-[#0a0a0b]">
                     <div className="p-14 border-b border-white/5 flex items-center justify-between bg-primary text-black">
                        <div className="flex items-center gap-12">
                           <PranaLogo3 size={56} pulse={true} color="#000" />
                           <h2 className="text-5xl font-playfair font-black uppercase tracking-tighter italic">Neural Analyst</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-6 hover:bg-black/10 rounded-full transition-colors"><X className="w-10 h-10" /></button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-20 space-y-16">
                        {messages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-14 rounded-[56px] max-w-[80%] text-xl leading-relaxed shadow-3xl relative group ${msg.role === 'user' ? 'bg-primary text-black rounded-tr-none font-black uppercase tracking-tight' : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5 italic font-playfair'}`}>
                                 {msg.content}
                                 {msg.role === 'assistant' && (
                                    <button onClick={() => speakContent(msg.content)} className="absolute -right-20 top-0 p-6 bg-white/5 text-primary rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-2xl"><Activity className="w-8 h-8" /></button>
                                 )}
                              </div>
                           </div>
                        ))}
                        {isLoading && <div className="flex justify-start"><div className="bg-white/5 p-12 rounded-[56px] rounded-tl-none text-primary font-black uppercase tracking-[0.8em] text-xs animate-pulse">Neural_Sync_Bharat_v7...</div></div>}
                     </div>

                     <div className="p-14 bg-white/[0.01] border-t border-white/5">
                        <div className="flex items-center gap-12">
                           <div className="flex-1 relative">
                              <input type="text" placeholder={isListening ? "Listening_to_BioSignals..." : "DESCRIBE_YOUR_VITAL_STATE_..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="input-field py-10 px-20 text-lg font-black uppercase tracking-widest bg-white/5" />
                              <button onClick={toggleListening} className={`absolute right-12 top-1/2 -translate-y-1/2 p-5 rounded-full transition-all ${isListening ? 'bg-primary text-black animate-pulse shadow-[0_0_30px_#00D1B2]' : 'text-white/20 hover:text-primary'}`}><Activity className="w-9 h-9" /></button>
                           </div>
                           <button onClick={handleSendMessage} className="p-12 bg-primary text-black rounded-full hover:scale-105 transition-all shadow-3xl"><ArrowRight className="w-10 h-10" /></button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "records" && <HealthRecordsModal onClose={() => setActiveModule(null)} onRecordAdded={fetchData} />}
            {activeModule === "lens" && <ProductLens onClose={() => setActiveModule(null)} />}
            
            {/* Appointments and Reminders follow the same hybrid Luxe pattern */}
            {activeModule === "appointments" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
                  <motion.div initial={{ scale: 0.95 }} className="glass-panel max-w-6xl w-full h-[80vh] flex flex-col bg-[#0a0a0b]">
                     <div className="p-14 border-b border-white/5 flex items-center justify-between bg-white/5 text-white">
                        <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter italic">Clinical Routing</h2>
                        <button onClick={() => setActiveModule(null)} className="p-6 hover:bg-white/10 rounded-full"><X className="w-10 h-10" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-20">
                        {appointments.length > 0 ? (
                           <div className="grid grid-cols-2 gap-12">
                              {appointments.map((app, i) => (
                                 <div key={i} className="glass-panel p-14 bg-white/[0.02] border-white/5 hover:border-primary/30 transition-all flex justify-between items-center group">
                                    <div className="space-y-6">
                                       <h4 className="text-3xl font-playfair font-black text-white leading-none uppercase italic tracking-tighter">{app.doctor_name}</h4>
                                       <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mt-4">{app.specialty}</p>
                                       <div className="mt-12 inline-flex items-center gap-6 text-primary font-black uppercase text-[11px] tracking-[0.4em] bg-primary/10 px-10 py-5 rounded-full shadow-2xl">
                                          <Calendar className="w-5 h-5" /> {new Date(app.appointment_date).toLocaleString()}
                                       </div>
                                    </div>
                                    <div className="p-8 bg-white/5 shadow-3xl rounded-full text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                       <ShieldCheck className="w-12 h-12" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-16 grayscale">
                              <Calendar className="w-40 h-40" />
                              <p className="text-[14px] font-black uppercase tracking-[1.5em]">No_Routes_Active</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
                </motion.div>
            )}

            {activeModule === "reminders" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
                  <motion.div initial={{ scale: 0.95 }} className="glass-panel max-w-5xl w-full h-[70vh] flex flex-col bg-[#0a0a0b]">
                     <div className="p-14 border-b border-white/5 flex items-center justify-between bg-primary text-black">
                        <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter italic text-black">Vitals Queue</h2>
                        <button onClick={() => setActiveModule(null)} className="p-6 hover:bg-black/10 rounded-full"><X className="w-10 h-10" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-16 space-y-12">
                        {reminders.map((rem, i) => (
                           <div key={i} className="flex items-center justify-between p-14 bg-white/[0.01] border border-white/5 rounded-[64px] hover:border-primary/30 transition-all group shadow-2xl">
                              <div className="flex items-center gap-12">
                                 <div className={`w-6 h-6 rounded-full ${rem.is_taken ? 'bg-primary shadow-[0_0_20px_#00D1B2]' : 'bg-secondary/40 shadow-[0_0_20px_#D4AF37] animate-pulse'}`} />
                                 <div>
                                    <p className="text-4xl font-playfair font-black text-white uppercase tracking-tighter italic leading-none">{rem.medication_name}</p>
                                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em] mt-6 font-outfit">{rem.time_of_day} • {rem.dosage}</p>
                                 </div>
                              </div>
                              <button className={`neo-button px-14 py-7 text-[11px] tracking-[0.5em] ${rem.is_taken ? 'bg-primary text-black' : 'bg-white/5 text-white/20 hover:text-primary hover:bg-primary/5 hover:border-primary/30'}`}>
                                 {rem.is_taken ? 'Authorized' : 'Sign-Off'}
                              </button>
                           </div>
                        ))}
                     </div>
                  </motion.div>
                </motion.div>
            )}

            {isEmergency && <EmergencyGlow isActive={isEmergency} location={userLocation} onClose={() => setIsEmergency(false)} />}
         </AnimatePresence>
      </div>
   );
}
