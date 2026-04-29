"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, X, ShieldCheck, AlertCircle, Plus, Activity, TrendingUp, Zap, Wind } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase';
import { useUser } from '@/context/UserContext';

interface HealthRecordsModalProps {
  onClose: () => void;
  onRecordAdded?: () => void;
}

export default function HealthRecordsModal({ onClose, onRecordAdded }: HealthRecordsModalProps) {
  const { t, lang } = useLanguage();
  const { profile } = useUser();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeReport = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vision',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract medical markers from this lab report. For each marker found, provide: Marker Name, Value, Unit, and Status (low/normal/high). Format the output as a JSON-like list.' },
                { type: 'image', src: image }
              ]
            }
          ],
          profile: profile,
          lang: lang === 'HI' ? 'Hindi' : lang === 'TE' ? 'Telugu' : lang === 'TA' ? 'Tamil' : lang === 'ES' ? 'Spanish' : lang === 'AR' ? 'Arabic' : 'English'
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const content = data.content;
      setAnalysisResult(content);

      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/(Vitamin D|HbA1c|B12|Cholesterol|Glucose)[:\s]+([\d.]+)\s*([%\w\/]+)/i);
        if (match) {
          const [_, name, value, unit] = match;
          await supabase.from('vitality_records').insert([{
            user_id: profile.id,
            marker_name: name.trim(),
            marker_value: value,
            optimal_range: unit === '%' ? '4.0 - 5.6' : '30-100',
            vitality_score: parseInt(value) > 30 ? 90 : 40
          }]);
        }
      }
      if (onRecordAdded) onRecordAdded();
    } catch (err: any) {
      console.error(err);
      setError('Could not decipher lab report.');
    } finally { setIsAnalyzing(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col bg-[#0a0a0b] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[56px]"
      >
        {/* Header */}
        <div className="p-14 border-b border-white/5 flex items-center justify-between bg-white/5 text-primary">
          <div className="flex items-center gap-12">
            <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center shadow-3xl">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <div>
               <div className="flex items-center gap-4 mb-2">
                 <Wind className="w-4 h-4 text-primary/40" />
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">BioMap_Protocol_v8.2</span>
               </div>
              <h2 className="text-5xl font-playfair font-black uppercase tracking-tighter leading-none italic text-white">Report Interpreter</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-8 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-12 h-12 text-white/20" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-20">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-20 py-24 border-2 border-dashed border-white/5 rounded-[64px] bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center text-primary/10 group-hover:scale-110 transition-transform duration-1000 shadow-3xl">
                <Plus className="w-24 h-24" />
              </div>
              <div className="text-center space-y-10">
                <h3 className="text-6xl font-playfair font-black text-white tracking-tighter uppercase leading-none italic">Extract Bio-Markers</h3>
                <p className="text-white/20 font-medium max-w-sm mx-auto uppercase text-[12px] tracking-[0.6em] font-black">Upload blood work, MRI, or clinical notes</p>
              </div>
              <button 
                className="btn-primary py-12 px-24 shadow-[0_30px_60px_-10px_rgba(0,209,178,0.3)]"
              >
                <Upload className="w-6 h-6 mr-6" /> Select Report
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 h-full">
               <div className="space-y-16">
                  <div className="aspect-[3/4] rounded-[80px] overflow-hidden border-[20px] border-white/5 shadow-3xl bg-black/[0.01] relative group">
                    <img src={image} className="w-full h-full object-cover" alt="Report" />
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-1.5 bg-primary shadow-[0_0_40px_#00D1B2] z-10"
                      />
                    )}
                  </div>
                  {!analysisResult && !isAnalyzing && (
                    <button 
                      onClick={analyzeReport}
                      className="btn-primary w-full py-12 shadow-3xl uppercase tracking-[0.8em]"
                    >
                      Extract Biomarkers
                    </button>
                  )}
               </div>

               <div className="flex flex-col">
                  {isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 animate-pulse">
                      <div className="w-32 h-32 rounded-full border-[8px] border-white/5 border-t-primary animate-spin" />
                      <p className="text-[12px] font-black uppercase tracking-[1em] text-primary/20">Neural_Sync_Bharat_v7...</p>
                    </div>
                  ) : analysisResult ? (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-20">
                       <div className="p-12 bg-primary/10 rounded-[48px] border border-primary/20 flex items-center gap-10 shadow-3xl">
                          <ShieldCheck className="w-20 h-20 text-primary" />
                          <div>
                            <h4 className="text-3xl font-playfair font-black text-white italic leading-none uppercase tracking-tighter">BIOMAP SYNCED</h4>
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/20 mt-4 font-outfit">Markers integrated into your Life-Map™</p>
                          </div>
                       </div>

                       <div className="space-y-12">
                          <div className="flex items-center gap-8">
                             <TrendingUp className="w-10 h-10 text-primary/20" />
                             <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20">Neural Interpretation</h3>
                          </div>
                          <div className="prose prose-2xl prose-primary max-w-none">
                             <div className="text-white/70 leading-relaxed font-medium whitespace-pre-wrap italic bg-white/[0.01] p-14 rounded-[64px] border border-white/5 shadow-inner text-2xl font-playfair tracking-tight">
                                {analysisResult}
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={() => setImage(null)}
                         className="w-full py-10 text-white/10 hover:text-primary transition-colors flex items-center justify-center gap-10 text-[12px] font-black uppercase tracking-[1em]"
                       >
                         <RefreshCw className="w-8 h-8" /> Initialize New Protocol
                       </button>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-28 border-2 border-dashed border-white/5 rounded-[80px] opacity-10 grayscale">
                       <TrendingUp className="w-32 h-32 mb-12" />
                       <p className="text-[14px] font-black uppercase tracking-[2em]">Awaiting_Calibration</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
