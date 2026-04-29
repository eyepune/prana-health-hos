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
   Cpu
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
   const [isIncognito, setIsIncognito] = useState(false);
   const [userLocation, setUserLocation] = useState("LOCATING...");
   const [inputValue, setInputValue] = useState("");
   const [isSpeaking, setIsSpeaking] = useState(false);
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
      
      // 1. Fetch Vitality Records
      const { data: vData } = await supabase
         .from('vitality_records')
         .select('*')
         .eq('user_id', profile.id)
         .order('created_at', { ascending: false });

      if (vData) {
         setRecords(vData.map(r => ({
            marker: r.marker_name,
            value: r.marker_value,
            unit: "", 
            status: r.vitality_score > 70 ? 'normal' : 'low',
            date: new Date(r.created_at).toLocaleDateString()
         })));
         const avg = vData.reduce((acc, curr) => acc + (curr.vitality_score || 0), 0) / vData.length;
         setVitalityScore(Math.round(avg || 0));
      }

      // 2. Fetch Consultations (Chat History)
      const { data: cData } = await supabase
         .from('consultations')
         .select('*')
         .eq('user_id', profile.id)
         .order('created_at', { ascending: true });

      if (cData && cData.length > 0) {
         const history = cData.flatMap(c => [
            { role: "user", content: c.query },
            { role: "assistant", content: c.response?.content || "" }
         ]);
         setMessages([{ role: "assistant", content: t.dashboard.consult_welcome }, ...history]);
      }

      // 3. Fetch Appointments
      const { data: aData } = await supabase
         .from('appointments')
         .select('*')
         .eq('user_id', profile.id)
         .order('appointment_date', { ascending: true });
      if (aData) setAppointments(aData);

      // 4. Fetch Reminders
      const { data: rData } = await supabase
         .from('reminders')
         .select('*')
         .eq('user_id', profile.id)
         .order('created_at', { ascending: true });
      if (rData) setReminders(rData);
   };

   useEffect(() => {
      fetchData();
   }, [profile?.id]);

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
         if (data.content) {
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
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

   const toggleListening = () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
         alert("Speech recognition not supported in this browser.");
         return;
      }

      if (isListening) {
         setIsListening(false);
         return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
         const transcript = event.results[0][0].transcript;
         setInputValue(transcript);
         setIsListening(false);
      };

      recognition.start();
   };

   const speakContent = (text: string) => {
      if (isSpeaking) {
         window.speechSynthesis.cancel();
         setIsSpeaking(false);
         return;
      }

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
         }, (err) => {
            setUserLocation("ACCESS DENIED");
         });
      }
   }, []);

   return (
      <div className="min-h-screen bg-[#F0F2F0] selection:bg-teal/10 p-4 md:p-12 space-y-12">
         
         {/* 🛠 TOP BAR CONTROL */}
         <header className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="p-4 glass-card bg-white rounded-3xl">
                  <PranaLogo3 size={40} pulse={true} />
               </div>
               <div>
                  <h1 className="text-4xl font-outfit font-black tracking-tighter text-authority uppercase leading-none">
                     Command Center
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                     <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-authority/30">Resident: {profile?.name || "Initializing..."}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-6 px-8 py-4 glass-card bg-white/50 rounded-full border-white/50">
                  <div className="flex flex-col items-end">
                     <span className="text-[8px] font-black text-authority/20 uppercase tracking-widest">System_State</span>
                     <span className="text-[10px] font-bold text-teal uppercase tracking-widest">Operational</span>
                  </div>
                  <div className="w-[1px] h-6 bg-authority/5" />
                  <div className="flex flex-col items-end">
                     <span className="text-[8px] font-black text-authority/20 uppercase tracking-widest">Sovereign_Node</span>
                     <span className="text-[10px] font-bold text-authority uppercase tracking-widest">Bharat_Mainnet</span>
                  </div>
               </div>
               <LanguageSelector />
               <button className="p-4 glass-card bg-white rounded-full hover:scale-110 transition-all text-authority/40 hover:text-teal">
                  <Bell className="w-6 h-6" />
               </button>
               <button className="p-4 glass-card bg-white rounded-full hover:scale-110 transition-all text-authority/40 hover:text-teal">
                  <Settings className="w-6 h-6" />
               </button>
            </div>
         </header>

         {/* 🧩 MAIN OPERATIONAL GRID */}
         <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: VITALITY & EMERGENCY */}
            <div className="lg:col-span-4 space-y-8">
               {/* Vitality Core */}
               <div className="glass-card bg-white p-10 rounded-[48px] border-none shadow-2xl shadow-black/[0.02] flex flex-col items-center text-center space-y-10">
                  <div className="relative">
                     <svg className="w-56 h-56 -rotate-90">
                        <circle cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-authority/5" />
                        <circle cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={628} strokeDashoffset={628 - (628 * vitalityScore) / 100} strokeLinecap="round" className="text-teal transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-outfit font-black text-authority leading-none">{vitalityScore || "--"}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/20 mt-2">Vitality</span>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-outfit font-black uppercase tracking-tight text-authority">
                        {vitalityScore > 80 ? "Peak State" : vitalityScore > 50 ? "Balanced" : "Calibrating..."}
                     </h3>
                     <p className="text-[11px] font-medium text-authority/40 leading-relaxed uppercase tracking-widest px-8">
                        Your biological map is now synchronizing with hOS Clinical protocols.
                     </p>
                  </div>
                  <button 
                     onClick={() => setActiveModule("records")}
                     className="w-full py-6 bg-teal/5 text-teal border border-teal/10 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-teal hover:text-white transition-all"
                  >
                     View Full Bio-Map™
                  </button>
               </div>

               {/* Raksha Shield */}
               <div className="glass-card bg-authority p-10 rounded-[48px] text-white flex flex-col justify-between aspect-square md:aspect-auto md:h-80 overflow-hidden relative group">
                  <div className="space-y-4 relative z-10">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Security_Protocol</h4>
                     <p className="text-5xl font-outfit font-black tracking-tighter uppercase italic leading-none">Raksha<br />Shield</p>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-saffron animate-ping" />
                        <span className="text-[9px] font-black tracking-widest uppercase">{userLocation}</span>
                     </div>
                     <button 
                        onClick={() => setIsEmergency(true)}
                        className="p-6 bg-white text-authority rounded-full hover:scale-110 transition-all shadow-2xl"
                     >
                        <Zap className="w-6 h-6 fill-authority" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal/20 rounded-full blur-[100px] -mr-32 -mt-32" />
               </div>
            </div>

            {/* CENTER COLUMN: INTELLIGENCE MODULES */}
            <div className="lg:col-span-5 space-y-8">
               <div className="grid grid-cols-2 gap-6">
                  {[
                     { id: "consult", title: "Analyst", icon: MessageCircle, color: "teal", desc: "Symptom Logic" },
                     { id: "records", title: "Records", icon: FileText, color: "saffron", desc: "Bio-Markers" },
                     { id: "lens", title: "Lens", icon: Scan, color: "teal", desc: "Safety Scan" },
                     { id: "appointments", title: "Clinics", icon: Calendar, color: "authority", desc: "Local Routing" }
                  ].map((mod) => (
                     <button
                        key={mod.id}
                        onClick={() => setActiveModule(mod.id as any)}
                        className="glass-card bg-white p-10 rounded-[40px] flex flex-col items-start gap-12 group hover:translate-y-[-8px] transition-all duration-500 border-none shadow-xl shadow-black/[0.01]"
                     >
                        <div className={`p-4 rounded-2xl ${mod.color === 'teal' ? 'bg-teal/5 text-teal group-hover:bg-teal group-hover:text-white' : mod.color === 'saffron' ? 'bg-saffron/5 text-saffron group-hover:bg-saffron group-hover:text-white' : 'bg-authority/5 text-authority group-hover:bg-authority group-hover:text-white'} transition-all duration-500`}>
                           <mod.icon className="w-8 h-8" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-outfit font-black text-authority uppercase tracking-tighter leading-none">{mod.title}</h3>
                           <p className="text-[10px] font-bold text-authority/20 uppercase tracking-[0.3em] mt-3">{mod.desc}</p>
                        </div>
                     </button>
                  ))}
               </div>

               {/* Quick History Strip */}
               <div className="glass-card bg-white/40 p-8 rounded-[40px] border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                        <TrendingUp className="w-6 h-6" />
                     </div>
                     <div>
                        <span className="text-[10px] font-black text-authority/20 uppercase tracking-widest">Recent_Activity</span>
                        <p className="text-sm font-bold text-authority uppercase mt-0.5">{records[0]?.marker || "No Scans Yet"} extracted</p>
                     </div>
                  </div>
                  <button 
                     onClick={() => setActiveModule("records")}
                     className="text-teal hover:translate-x-2 transition-transform"
                  >
                     <ArrowRight className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* RIGHT COLUMN: MEDICATIONS & STATS */}
            <div className="lg:col-span-3 space-y-8">
               <div className="glass-card bg-white p-10 rounded-[48px] h-full flex flex-col">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-xl font-outfit font-black uppercase tracking-tighter text-authority">Vitals Queue</h3>
                     <button 
                        onClick={() => setActiveModule("reminders")}
                        className="p-2 bg-teal/5 text-teal rounded-lg hover:bg-teal hover:text-white transition-all"
                     >
                        <Plus className="w-4 h-4" />
                     </button>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                     {reminders.length > 0 ? reminders.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-cream/50 rounded-3xl border border-white">
                           <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${r.is_taken ? 'bg-teal' : 'bg-saffron animate-pulse'}`} />
                              <span className="text-[11px] font-black text-authority/60 uppercase tracking-widest">{r.medication_name}</span>
                           </div>
                           <span className="text-base font-outfit font-bold text-authority">{r.time_of_day}</span>
                        </div>
                     )) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                           <Cpu className="w-12 h-12" />
                           <p className="text-[10px] font-black uppercase tracking-widest">No Active Reminders</p>
                        </div>
                     )}
                  </div>

                  {reminders[0] && (
                     <div className="mt-12 p-8 bg-teal text-white rounded-antigravity shadow-2xl shadow-teal/30">
                        <div className="flex items-center gap-4 mb-4">
                           <Clock className="w-5 h-5 opacity-40" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Next_Reminder</span>
                        </div>
                        <p className="text-xl font-outfit font-black leading-tight uppercase">{reminders[0].medication_name}</p>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-4">Scheduled: {reminders[0].time_of_day}</p>
                     </div>
                  )}
               </div>
            </div>

         </main>

         {/* 🧠 INTELLIGENCE OVERLAYS */}
         <AnimatePresence mode="wait">
            {activeModule === "consult" && (
               <motion.div
                  key="consult-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-authority/60 backdrop-blur-2xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 50 }}
                     className="glass-card max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-3xl bg-cream border-white/50 rounded-[48px]"
                  >
                     <div className="p-10 border-b border-authority/5 flex items-center justify-between bg-teal text-white">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter">hOS Analyst</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-white/10 rounded-full transition-colors">
                           <X className="w-6 h-6" />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12 space-y-10">
                        {messages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-8 rounded-[32px] max-w-[80%] text-base leading-relaxed shadow-xl relative group ${msg.role === 'user' ? 'bg-authority text-white rounded-tr-none' : 'bg-white text-authority/80 rounded-tl-none italic'
                                 }`}>
                                 {msg.content}
                                 {msg.role === 'assistant' && (
                                    <button 
                                       onClick={() => speakContent(msg.content)}
                                       className="absolute -right-12 top-0 p-3 bg-white text-teal rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                       {isSpeaking ? <ShieldOff className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                    </button>
                                 )}
                              </div>
                           </div>
                        ))}
                        {isLoading && (
                           <div className="flex justify-start">
                              <div className="bg-white/50 p-8 rounded-[32px] rounded-tl-none flex gap-3">
                                 <div className="w-2.5 h-2.5 rounded-full bg-teal animate-bounce" />
                                 <div className="w-2.5 h-2.5 rounded-full bg-teal animate-bounce [animation-delay:-.3s]" />
                                 <div className="w-2.5 h-2.5 rounded-full bg-teal animate-bounce [animation-delay:-.5s]" />
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="p-10 bg-white border-t border-authority/5">
                        <div className="flex items-center gap-8">
                           <div className="flex-1 relative">
                              <input
                                 type="text"
                                 placeholder={isListening ? "Listening (Bharat Voice Engine)..." : "Describe Symptom or Query..."}
                                 value={inputValue}
                                 onChange={(e) => setInputValue(e.target.value)}
                                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                 className={`w-full bg-cream rounded-full px-10 py-7 text-lg font-medium border-2 transition-all shadow-inner outline-none ${isListening ? 'border-teal ring-4 ring-teal/5' : 'border-transparent focus:border-teal'}`}
                              />
                              <button 
                                 onClick={toggleListening}
                                 className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${isListening ? 'bg-teal text-white animate-pulse' : 'bg-authority/5 text-authority/40 hover:bg-authority/10'}`}
                              >
                                 <Activity className="w-6 h-6" />
                              </button>
                           </div>
                           <button
                              onClick={handleSendMessage}
                              disabled={isLoading}
                              className="p-8 bg-teal text-white rounded-full shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                           >
                              <ArrowRight className="w-8 h-8" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}

            {activeModule === "records" && (
               <HealthRecordsModal 
                  onClose={() => setActiveModule(null)}
                  onRecordAdded={fetchData}
               />
            )}

            {activeModule === "lens" && (
               <ProductLens 
                  onClose={() => setActiveModule(null)}
               />
            )}

            {activeModule === "appointments" && (
               <motion.div
                  key="appointments-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-authority/60 backdrop-blur-2xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="glass-card max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-3xl bg-cream border-white/50 rounded-[48px]"
                  >
                     <div className="p-10 border-b border-authority/5 flex items-center justify-between bg-teal text-white">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter">Clinical Routing</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-white/10 rounded-full transition-colors">
                           <X className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-12 space-y-12">
                        {appointments.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {appointments.map((app, i) => (
                                 <div key={i} className="glass-card p-8 bg-white rounded-3xl shadow-xl flex justify-between items-center">
                                    <div>
                                       <h4 className="text-xl font-black uppercase text-authority">{app.doctor_name}</h4>
                                       <p className="text-[10px] font-black uppercase text-authority/30 tracking-widest mt-1">{app.specialty}</p>
                                       <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal/5 text-teal rounded-full text-[10px] font-black uppercase">
                                          <Calendar className="w-3 h-3" /> {new Date(app.appointment_date).toLocaleString()}
                                       </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${app.status === 'scheduled' ? 'bg-teal/10 text-teal' : 'bg-authority/10 text-authority'}`}>
                                       <ShieldCheck className="w-6 h-6" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 py-20">
                              <Calendar className="w-24 h-24" />
                              <p className="text-[12px] font-black uppercase tracking-[1em]">No Scheduled Appointments</p>
                              <button 
                                 className="px-10 py-5 bg-authority text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] opacity-100"
                              >
                                 Find Doctor
                              </button>
                           </div>
                        )}
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
                  className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-authority/60 backdrop-blur-2xl"
               >
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="glass-card max-w-4xl w-full h-[70vh] flex flex-col overflow-hidden shadow-3xl bg-cream border-white/50 rounded-[48px]"
                  >
                     <div className="p-10 border-b border-authority/5 flex items-center justify-between bg-saffron text-authority">
                        <div className="flex items-center gap-6">
                           <PranaLogo3 size={40} pulse={true} />
                           <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter italic">Vitals Queue</h2>
                        </div>
                        <button onClick={() => setActiveModule(null)} className="p-4 hover:bg-black/5 rounded-full transition-colors">
                           <X className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-12 space-y-8">
                        {reminders.length > 0 ? (
                           <div className="space-y-6">
                              {reminders.map((rem, i) => (
                                 <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[32px] shadow-xl group hover:border-saffron/30 border border-transparent transition-all">
                                    <div className="flex items-center gap-6">
                                       <div className={`w-4 h-4 rounded-full ${rem.is_taken ? 'bg-teal' : 'bg-saffron animate-pulse'}`} />
                                       <div>
                                          <p className="text-2xl font-black uppercase text-authority tracking-tighter">{rem.medication_name}</p>
                                          <p className="text-[10px] font-black uppercase text-authority/30 tracking-widest mt-1">{rem.time_of_day} • {rem.dosage}</p>
                                       </div>
                                    </div>
                                    <button 
                                       className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${rem.is_taken ? 'bg-teal text-white' : 'border-2 border-authority/5 text-authority/20 hover:border-saffron hover:text-saffron'}`}
                                    >
                                       {rem.is_taken ? 'Taken' : 'Mark Taken'}
                                    </button>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 py-20">
                              <Clock className="w-24 h-24" />
                              <p className="text-[12px] font-black uppercase tracking-[1em]">Queue Empty</p>
                           </div>
                        )}
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
