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
   BarChart3,
   Leaf
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
      <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12 space-y-12 font-outfit selection:bg-primary/5">
         
         {/* 🍵 NAVIGATION (ZEN STYLE) */}
         <header className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-10">
               <div className="p-5 glass-panel bg-white border-black/[0.03]">
                  <PranaLogo3 size={40} pulse={true} color="#1E3932" />
               </div>
               <div>
                  <h1 className="text-4xl font-playfair font-black text-primary tracking-tighter italic">
                     Command Center
                  </h1>
                  <div className="flex items-center gap-4 mt-1">
                     <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Resident: {profile?.name || "Calibrating..."}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden lg:flex items-center gap-8 px-10 py-5 glass-panel bg-white/40">
                  <div className="text-right">
                     <p className="text-[8px] font-black text-primary/20 uppercase tracking-[0.3em]">State</p>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Sovereign</p>
                  </div>
                  <div className="w-[1px] h-8 bg-black/5" />
                  <div className="text-right">
                     <p className="text-[8px] font-black text-primary/20 uppercase tracking-[0.3em]">Node</p>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Bharat_Mainnet</p>
                  </div>
               </div>
               <LanguageSelector />
               <button className="p-5 glass-panel bg-white hover:bg-black/[0.02] text-primary/20 hover:text-primary transition-all">
                  <Settings className="w-6 h-6" />
               </button>
            </div>
         </header>

         {/* 🧩 THE GRID (ZEN LAYOUT) */}
         <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 h-full">
            
            {/* LEFT: VITALITY RING */}
            <div className="lg:col-span-4 space-y-10">
               <div className="glass-panel bg-white p-16 flex flex-col items-center text-center space-y-12">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-1000" />
                     <svg className="w-64 h-64 -rotate-90 relative z-10">
                        <circle cx="128" cy="128" r="115" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-black/5" />
                        <circle cx="128" cy="128" r="115" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray={722} strokeDashoffset={722 - (722 * vitalityScore) / 100} strokeLinecap="round" className="text-primary transition-all duration-1000 ease-out" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <span className="text-7xl font-playfair font-black text-primary leading-none">{vitalityScore || "--"}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20 mt-4">Vitality_Score</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-2xl font-playfair font-black text-primary italic uppercase tracking-tight">Optimal Balance</h3>
                     <p className="text-sm font-medium text-primary/40 leading-relaxed max-w-[200px] mx-auto">Your biological rhythms are synchronized with hOS protocols.</p>
                  </div>

                  <button className="w-full py-6 bg-primary/5 text-primary rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all">
                     View Bio-Map™
                  </button>
               </div>

               <div 
                  onClick={() => setIsEmergency(true)}
                  className="stats-card bg-primary text-white border-none items-center justify-between flex-row py-12 px-12 group"
               >
                  <div className="space-y-3">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Guard_Mode</p>
                     <h4 className="text-4xl font-playfair font-black italic leading-none">Raksha</h4>
                  </div>
                  <div className="p-6 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
               </div>
            </div>

            {/* CENTER: MODULES */}
            <div className="lg:col-span-5 space-y-10">
               <div className="grid grid-cols-2 gap-8">
                  {[
                     { id: "consult", title: "Analyst", icon: MessageCircle, color: "primary", desc: "Clinical Logic" },
                     { id: "records", title: "Bio-Map", icon: FileText, color: "primary", desc: "Lab Extraction" },
                     { id: "lens", title: "Lens", icon: Scan, color: "primary", desc: "Safety Scan" },
                     { id: "appointments", title: "Clinics", icon: Calendar, color: "primary", desc: "Local Routing" }
                  ].map((mod) => (
                     <button
                        key={mod.id}
                        onClick={() => setActiveModule(mod.id as any)}
                        className="stats-card bg-white p-12 border-black/[0.02] items-start gap-12 group"
                     >
                        <div className="w-16 h-16 rounded-3xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                           <mod.icon className="w-7 h-7" />
                        </div>
                        <div className="text-left">
                           <h3 className="text-3xl font-playfair font-black text-primary tracking-tighter leading-none">{mod.title}</h3>
                           <p className="text-[10px] font-bold text-primary/20 uppercase tracking-[0.3em] mt-4 font-outfit">{mod.desc}</p>
                        </div>
                     </button>
                  ))}
               </div>

               <div className="glass-panel p-10 bg-white border-black/[0.02] flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-8">
                     <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                        <TrendingUp className="w-8 h-8" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-primary/20 uppercase tracking-[0.4em]">Recent_Marker</p>
                        <p className="text-2xl font-playfair font-black text-primary italic leading-none mt-1">{records[0]?.marker || "No Activity"}</p>
                     </div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-primary/20 group-hover:text-primary group-hover:translate-x-3 transition-all" />
               </div>
            </div>

            {/* RIGHT: VITAL LOGS */}
            <div className="lg:col-span-3">
               <div className="glass-panel h-full bg-white p-12 border-black/[0.01] flex flex-col">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-2xl font-playfair font-black text-primary uppercase tracking-tighter">Queue</h3>
                     <button onClick={() => setActiveModule("reminders")} className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Plus className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                     {reminders.length > 0 ? reminders.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-8 bg-black/[0.01] rounded-[32px] border border-black/5 hover:border-primary/20 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className={`w-3 h-3 rounded-full ${r.is_taken ? 'bg-primary' : 'bg-accent/40 animate-pulse'}`} />
                              <span className="text-[11px] font-black text-primary/30 uppercase tracking-widest group-hover:text-primary transition-colors">{r.medication_name}</span>
                           </div>
                           <span className="text-base font-bold text-primary/10 group-hover:text-primary font-playfair italic">{r.time_of_day}</span>
                        </div>
                     )) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 space-y-8 py-20 grayscale">
                           <Leaf className="w-20 h-20" />
                           <p className="text-[10px] font-black uppercase tracking-[0.8em]">All_Clear</p>
                        </div>
                     )}
                  </div>

                  {reminders[0] && (
                     <div className="mt-12 p-12 bg-primary/5 rounded-[48px] border border-primary/10 group">
                        <div className="flex items-center gap-5 mb-8">
                           <Clock className="w-5 h-5 text-primary/40" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">Upcoming</span>
                        </div>
                        <p className="text-4xl font-playfair font-black text-primary leading-tight italic">{reminders[0].medication_name}</p>
                        <p className="text-[10px] font-bold text-primary/20 uppercase tracking-[0.5em] mt-8">Time: {reminders[0].time_of_day}</p>
                     </div>
                  )}
               </div>
            </div>

         </main>

         {/* 🧠 MODALS (ZEN LUXE) */}
         <AnimatePresence mode="wait">
            {activeModule === "consult" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-3xl">
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-panel max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden bg-white">
                     <div className="p-12 border-b border-black/5 flex items-center justify-between bg-primary text-white">
                        <div className="flex items-center gap-10">
                           <PranaLogo3 size={40} pulse={true} color="#FFF" />
                           <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter italic">Clinical Analyst</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-6 hover:bg-white/10 rounded-full transition-colors"><X className="w-8 h-8" /></button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-16 space-y-12">
                        {messages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-12 rounded-[40px] max-w-[80%] text-xl leading-relaxed shadow-lg relative group ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-black/[0.02] text-primary/80 rounded-tl-none border border-black/5 italic'}`}>
                                 {msg.content}
                                 {msg.role === 'assistant' && (
                                    <button onClick={() => speakContent(msg.content)} className="absolute -right-16 top-0 p-5 bg-white shadow-xl text-primary rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"><Activity className="w-6 h-6" /></button>
                                 )}
                              </div>
                           </div>
                        ))}
                        {isLoading && <div className="flex justify-start"><div className="bg-primary/5 p-10 rounded-[40px] rounded-tl-none text-primary font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Analyzing_Bharat_Protocols...</div></div>}
                     </div>

                     <div className="p-12 bg-black/[0.01] border-t border-black/5">
                        <div className="flex items-center gap-10">
                           <div className="flex-1 relative">
                              <input type="text" placeholder={isListening ? "Listening_to_Resident..." : "DESCRIBE_YOUR_VITAL_STATE_..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="input-field py-10 px-16 text-lg font-bold" />
                              <button onClick={toggleListening} className={`absolute right-10 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all ${isListening ? 'bg-primary text-white animate-pulse' : 'text-primary/20 hover:text-primary'}`}><Activity className="w-8 h-8" /></button>
                           </div>
                           <button onClick={handleSendMessage} className="p-10 bg-primary text-white rounded-full hover:scale-105 transition-all shadow-xl"><ArrowRight className="w-8 h-8" /></button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "records" && <HealthRecordsModal onClose={() => setActiveModule(null)} onRecordAdded={fetchData} />}
            {activeModule === "lens" && <ProductLens onClose={() => setActiveModule(null)} />}
            {activeModule === "appointments" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-3xl">
                  <motion.div initial={{ scale: 0.95 }} className="glass-panel max-w-5xl w-full h-[80vh] flex flex-col bg-white">
                     <div className="p-12 border-b border-black/5 flex items-center justify-between bg-primary text-white">
                        <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter italic">Local Routing</h2>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-white/10 rounded-full"><X className="w-8 h-8" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-16">
                        {appointments.length > 0 ? (
                           <div className="grid grid-cols-2 gap-10">
                              {appointments.map((app, i) => (
                                 <div key={i} className="glass-panel p-12 bg-black/[0.01] hover:border-primary/30 transition-all flex justify-between items-center group">
                                    <div>
                                       <h4 className="text-3xl font-playfair font-black text-primary leading-none uppercase">{app.doctor_name}</h4>
                                       <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mt-3">{app.specialty}</p>
                                       <div className="mt-10 inline-flex items-center gap-4 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/5 px-8 py-4 rounded-full">
                                          <Calendar className="w-4 h-4" /> {new Date(app.appointment_date).toLocaleString()}
                                       </div>
                                    </div>
                                    <div className="p-6 bg-white shadow-xl rounded-full text-primary">
                                       <ShieldCheck className="w-10 h-10" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-12 grayscale">
                              <Calendar className="w-32 h-32" />
                              <p className="text-[12px] font-black uppercase tracking-[1.2em]">No_Routes_Found</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
                </motion.div>
            )}

            {activeModule === "reminders" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-3xl">
                  <motion.div initial={{ scale: 0.95 }} className="glass-panel max-w-4xl w-full h-[70vh] flex flex-col bg-white">
                     <div className="p-12 border-b border-black/5 flex items-center justify-between bg-primary text-white">
                        <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter italic text-secondary">Vitality Queue</h2>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-white/10 rounded-full"><X className="w-8 h-8" /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-16 space-y-10">
                        {reminders.map((rem, i) => (
                           <div key={i} className="flex items-center justify-between p-12 bg-black/[0.01] border border-black/5 rounded-[48px] hover:border-primary/20 transition-all group shadow-sm">
                              <div className="flex items-center gap-10">
                                 <div className={`w-5 h-5 rounded-full ${rem.is_taken ? 'bg-primary' : 'bg-accent/40 animate-pulse'}`} />
                                 <div>
                                    <p className="text-4xl font-playfair font-black text-primary uppercase tracking-tighter italic leading-none">{rem.medication_name}</p>
                                    <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.6em] mt-5 font-outfit">{rem.time_of_day} • {rem.dosage}</p>
                                 </div>
                              </div>
                              <button className={`btn-primary px-12 py-6 text-[10px] tracking-widest ${rem.is_taken ? 'opacity-40 pointer-events-none' : ''}`}>
                                 {rem.is_taken ? 'Completed' : 'Authorize'}
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
