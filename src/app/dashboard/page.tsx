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
   Clock,
   Search,
   User,
   Cpu,
   BarChart3
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
      } catch (error) {
         console.error("Chat Error:", error);
      } finally {
         setIsLoading(false);
      }
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

   useEffect(() => {
      if (navigator && navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((pos) => {
            setUserLocation(`LAT: ${pos.coords.latitude.toFixed(2)}, LNG: ${pos.coords.longitude.toFixed(2)}`);
         }, (err) => setUserLocation("ACCESS DENIED"));
      }
   }, []);

   return (
      <div className="min-h-screen bg-[#050505] p-6 md:p-12 space-y-12 overflow-hidden">
         
         {/* 🧬 TOP BAR (MED-OS STYLE) */}
         <header className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-10">
               <div className="p-4 glass-panel bg-primary/10 border-primary/20">
                  <PranaLogo3 size={48} pulse={true} color="#00FF85" />
               </div>
               <div className="space-y-1">
                  <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                     MED-OS <span className="text-primary opacity-50">PRO</span>
                  </h1>
                  <div className="flex items-center gap-4">
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Sovereign_Active</span>
                     <div className="w-[1px] h-3 bg-white/10" />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Node: Bharat_01</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden lg:flex items-center gap-6 px-10 py-5 glass-panel bg-white/5 border-white/5">
                  <div className="text-right">
                     <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Resident_ID</p>
                     <p className="text-[10px] font-bold text-white uppercase tracking-widest">{profile?.name || "Initializing..."}</p>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="text-right">
                     <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Encryption</p>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Quantum_Safe</p>
                  </div>
               </div>
               <LanguageSelector />
               <button className="p-5 glass-panel bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-primary">
                  <Settings className="w-7 h-7" />
               </button>
            </div>
         </header>

         {/* 🧩 MAIN MED-GRID */}
         <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 h-full">
            
            {/* LEFT: BIO-STATISTICS */}
            <div className="lg:col-span-4 space-y-10">
               <div className="glass-panel bg-black/40 p-12 border-white/5 flex flex-col items-center text-center space-y-12 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 overflow-hidden">
                     <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-1/2 h-full bg-primary" />
                  </div>
                  
                  <div className="relative">
                     <svg className="w-64 h-64 -rotate-90">
                        <circle cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                        <circle cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={690} strokeDashoffset={690 - (690 * vitalityScore) / 100} strokeLinecap="round" className="text-primary drop-shadow-[0_0_15px_rgba(0,255,133,0.5)] transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-black text-white leading-none">{vitalityScore || "--"}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-4">Vitality_Score</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                     <div className="stats-card p-6 bg-white/[0.02]">
                        <BarChart3 className="w-5 h-5 text-primary opacity-40 mb-2" />
                        <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Metabolic</p>
                        <p className="text-xl font-black text-white uppercase">Optimal</p>
                     </div>
                     <div className="stats-card p-6 bg-white/[0.02]">
                        <Zap className="w-5 h-5 text-accent opacity-40 mb-2" />
                        <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Resilience</p>
                        <p className="text-xl font-black text-white uppercase">High</p>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={() => setIsEmergency(true)}
                  className="w-full stats-card bg-primary text-black flex-row items-center justify-between p-10 hover:shadow-[0_0_40px_rgba(0,255,133,0.3)] border-none"
               >
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Security_Node</p>
                     <p className="text-4xl font-black uppercase italic leading-tight">Emergency <br /> Raksha</p>
                  </div>
                  <div className="p-6 bg-black text-primary rounded-full">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
               </button>
            </div>

            {/* CENTER: CORE INTELLIGENCE */}
            <div className="lg:col-span-5 space-y-10">
               <div className="grid grid-cols-2 gap-8">
                  {[
                     { id: "consult", title: "Analyst", icon: MessageCircle, color: "primary", desc: "Symptom Logic" },
                     { id: "records", title: "BioMap", icon: FileText, color: "secondary", desc: "Data Extract" },
                     { id: "lens", title: "Scanner", icon: Scan, color: "primary", desc: "Safety Sync" },
                     { id: "appointments", title: "Routing", icon: Calendar, color: "accent", desc: "Clinical Link" }
                  ].map((mod) => (
                     <button
                        key={mod.id}
                        onClick={() => setActiveModule(mod.id as any)}
                        className="stats-card p-10 bg-white/[0.02] border-white/5 items-start gap-12 group"
                     >
                        <div className={`p-5 rounded-2xl bg-white/5 text-white group-hover:bg-primary group-hover:text-black transition-all duration-500`}>
                           <mod.icon className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{mod.title}</h3>
                           <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-4">{mod.desc}</p>
                        </div>
                     </button>
                  ))}
               </div>

               <div className="glass-panel p-10 bg-white/5 flex items-center justify-between group cursor-pointer border-white/5 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-8">
                     <div className="p-5 rounded-2xl bg-primary/10 text-primary animate-pulse-soft">
                        <Activity className="w-8 h-8" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Active_Extraction</p>
                        <p className="text-xl font-black text-white uppercase mt-1">{records[0]?.marker || "No Scans Yet"}</p>
                     </div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
               </div>
            </div>

            {/* RIGHT: SYSTEM QUEUE */}
            <div className="lg:col-span-3">
               <div className="glass-panel h-full bg-white/[0.01] p-10 border-white/5 flex flex-col">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-2xl font-black uppercase tracking-tighter text-white">System Queue</h3>
                     <button onClick={() => setActiveModule("reminders")} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-black transition-all">
                        <Plus className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                     {reminders.length > 0 ? reminders.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className={`w-3 h-3 rounded-full ${r.is_taken ? 'bg-primary shadow-[0_0_10px_#00FF85]' : 'bg-accent animate-pulse'}`} />
                              <span className="text-[11px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{r.medication_name}</span>
                           </div>
                           <span className="text-base font-black text-white/20 group-hover:text-primary">{r.time_of_day}</span>
                        </div>
                     )) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 space-y-6 py-20">
                           <Cpu className="w-16 h-16" />
                           <p className="text-[10px] font-black uppercase tracking-widest">No_Active_Tasks</p>
                        </div>
                     )}
                  </div>

                  {reminders[0] && (
                     <div className="mt-12 p-10 bg-secondary/10 border border-secondary/20 rounded-[40px] relative overflow-hidden group">
                        <div className="relative z-10">
                           <div className="flex items-center gap-4 mb-6">
                              <Clock className="w-5 h-5 text-secondary" />
                              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary">Next_Protocol</span>
                           </div>
                           <p className="text-3xl font-black text-white uppercase italic leading-tight">{reminders[0].medication_name}</p>
                           <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-6">Time_Locked: {reminders[0].time_of_day}</p>
                        </div>
                        <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  )}
               </div>
            </div>

         </main>

         {/* 🧠 MODAL INTERFACES (FUTURISTIC) */}
         <AnimatePresence mode="wait">
            {activeModule === "consult" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl">
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-panel max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden bg-[#0a0a0a]">
                     <div className="p-10 border-b border-white/5 flex items-center justify-between bg-primary text-black">
                        <div className="flex items-center gap-8">
                           <PranaLogo3 size={48} pulse={true} color="#000" />
                           <h2 className="text-4xl font-black uppercase tracking-tighter italic">Neural Analyst</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-5 hover:bg-black/10 rounded-full transition-colors"><X className="w-8 h-8" /></button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12 space-y-12">
                        {messages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-10 rounded-[40px] max-w-[80%] text-lg leading-relaxed shadow-2xl relative group ${msg.role === 'user' ? 'bg-primary text-black rounded-tr-none font-black' : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'}`}>
                                 {msg.content}
                                 {msg.role === 'assistant' && (
                                    <button onClick={() => speakContent(msg.content)} className="absolute -right-16 top-0 p-5 bg-white/5 text-primary rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100"><Activity className="w-6 h-6" /></button>
                                 )}
                              </div>
                           </div>
                        ))}
                        {isLoading && <div className="flex justify-start"><div className="bg-white/5 p-10 rounded-[40px] rounded-tl-none animate-pulse text-primary font-black uppercase tracking-[0.5em]">Syncing_Bharat_Engine...</div></div>}
                     </div>

                     <div className="p-12 bg-white/[0.02] border-t border-white/5">
                        <div className="flex items-center gap-8">
                           <div className="flex-1 relative">
                              <input type="text" placeholder={isListening ? "Listening_Voice_Protocol..." : "DESCRIBE_SYMPTOMS_..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="input-field py-8 px-12 uppercase text-sm font-black tracking-widest" />
                              <button onClick={toggleListening} className={`absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all ${isListening ? 'bg-primary text-black animate-pulse shadow-[0_0_20px_#00FF85]' : 'bg-white/5 text-white/20 hover:text-primary'}`}><Activity className="w-7 h-7" /></button>
                           </div>
                           <button onClick={handleSendMessage} className="p-10 bg-primary text-black rounded-full hover:scale-105 transition-all"><ArrowRight className="w-8 h-8" /></button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "records" && <HealthRecordsModal onClose={() => setActiveModule(null)} onRecordAdded={fetchData} />}
            {activeModule === "lens" && <ProductLens onClose={() => setActiveModule(null)} />}
            {activeModule === "appointments" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl">
                  <motion.div initial={{ scale: 0.9 }} className="glass-panel max-w-5xl w-full h-[80vh] flex flex-col bg-[#0a0a0a]">
                     <div className="p-12 border-b border-white/5 flex items-center justify-between bg-white/5 text-white">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Clinical Routing</h2>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-white/10 rounded-full"><X className="w-8 h-8" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-12">
                        {appointments.length > 0 ? (
                           <div className="grid grid-cols-2 gap-8">
                              {appointments.map((app, i) => (
                                 <div key={i} className="glass-panel p-10 bg-white/[0.02] hover:border-primary/30 transition-all flex justify-between items-center group">
                                    <div>
                                       <h4 className="text-2xl font-black text-white uppercase">{app.doctor_name}</h4>
                                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">{app.specialty}</p>
                                       <div className="mt-8 inline-flex items-center gap-4 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-6 py-3 rounded-full">
                                          <Calendar className="w-4 h-4" /> {new Date(app.appointment_date).toLocaleString()}
                                       </div>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-all">
                                       <ShieldCheck className="w-8 h-8" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-10">
                              <Calendar className="w-32 h-32" />
                              <p className="text-[12px] font-black uppercase tracking-[1em]">No_Routes_Found</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
                </motion.div>
            )}

            {activeModule === "reminders" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl">
                  <motion.div initial={{ scale: 0.9 }} className="glass-panel max-w-4xl w-full h-[70vh] flex flex-col bg-[#0a0a0a]">
                     <div className="p-12 border-b border-white/5 flex items-center justify-between bg-accent text-black">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Vitals Queue</h2>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-black/10 rounded-full"><X className="w-8 h-8" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-12 space-y-8">
                        {reminders.map((rem, i) => (
                           <div key={i} className="flex items-center justify-between p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-accent/30 transition-all group">
                              <div className="flex items-center gap-8">
                                 <div className={`w-5 h-5 rounded-full ${rem.is_taken ? 'bg-primary shadow-[0_0_15px_#00FF85]' : 'bg-accent shadow-[0_0_15px_#FFB800] animate-pulse'}`} />
                                 <div>
                                    <p className="text-3xl font-black text-white uppercase tracking-tighter">{rem.medication_name}</p>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mt-4">{rem.time_of_day} • {rem.dosage}</p>
                                 </div>
                              </div>
                              <button className={`neo-button px-10 py-5 ${rem.is_taken ? 'bg-primary text-black' : 'bg-white/5 text-white/20 hover:text-accent hover:bg-accent/10 hover:border-accent/30'}`}>
                                 {rem.is_taken ? 'Locked' : 'Authorize'}
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
