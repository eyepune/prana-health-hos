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
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[48px]"
      >
        {/* Header */}
        <div className="p-12 border-b border-black/5 flex items-center justify-between bg-white text-primary">
          <div className="flex items-center gap-10">
            <div className="w-16 h-16 rounded-[24px] bg-primary/5 flex items-center justify-center shadow-inner">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                 <Wind className="w-3 h-3 text-primary/40" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 uppercase">BioMap_Sync_v7.2</span>
               </div>
              <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter leading-none italic">Report Interpreter</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-6 hover:bg-black/[0.02] rounded-full transition-colors">
            <X className="w-10 h-10 text-primary/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-16">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-16 py-24 border-2 border-dashed border-black/5 rounded-[48px] bg-black/[0.01] hover:bg-black/[0.02] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-40 h-40 rounded-full bg-primary/5 flex items-center justify-center text-primary/10 group-hover:scale-110 transition-transform duration-700">
                <Plus className="w-20 h-20" />
              </div>
              <div className="text-center space-y-8">
                <h3 className="text-5xl font-playfair font-black text-primary tracking-tighter uppercase leading-none italic">Extract Bio-Markers</h3>
                <p className="text-primary/30 font-medium max-w-sm mx-auto uppercase text-[11px] tracking-[0.4em] font-black">Upload blood work, MRI, or clinical notes</p>
              </div>
              <button 
                className="btn-primary py-10 px-24 shadow-2xl"
              >
                <Upload className="w-5 h-5 mr-4" /> Select Report
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 h-full">
               <div className="space-y-12">
                  <div className="aspect-[3/4] rounded-[64px] overflow-hidden border-[16px] border-white shadow-2xl bg-black/[0.01] relative group">
                    <img src={image} className="w-full h-full object-cover" alt="Report" />
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-1 bg-primary/40 shadow-[0_0_30px_rgba(30,57,50,0.5)] z-10"
                      />
                    )}
                  </div>
                  {!analysisResult && !isAnalyzing && (
                    <button 
                      onClick={analyzeReport}
                      className="btn-primary w-full py-10 shadow-2xl"
                    >
                      Analyze Report Markers
                    </button>
                  )}
               </div>

               <div className="flex flex-col">
                  {isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-pulse">
                      <div className="w-24 h-24 rounded-full border-[6px] border-primary/5 border-t-primary animate-spin" />
                      <p className="text-[11px] font-black uppercase tracking-[0.8em] text-primary/20">Syncing_Bharat_Engine...</p>
                    </div>
                  ) : analysisResult ? (
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-16">
                       <div className="p-10 bg-primary/5 rounded-[40px] border border-primary/10 flex items-center gap-8">
                          <ShieldCheck className="w-14 h-14 text-primary" />
                          <div>
                            <h4 className="text-2xl font-playfair font-black text-primary italic leading-none">BIOMAP SYNCED</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mt-3 font-outfit">Markers integrated into your Life-Map™</p>
                          </div>
                       </div>

                       <div className="space-y-10">
                          <div className="flex items-center gap-6">
                             <TrendingUp className="w-7 h-7 text-primary/20" />
                             <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/30">Clinical Interpretation</h3>
                          </div>
                          <div className="prose prose-lg prose-primary max-w-none">
                             <div className="text-primary/70 leading-relaxed font-medium whitespace-pre-wrap italic bg-black/[0.01] p-12 rounded-[48px] border border-black/[0.02] shadow-inner text-xl font-playfair">
                                {analysisResult}
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={() => setImage(null)}
                         className="w-full py-8 text-primary/20 hover:text-primary transition-colors flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.6em]"
                       >
                         <RefreshCw className="w-6 h-6" /> Upload New Protocol
                       </button>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-24 border-2 border-dashed border-black/5 rounded-[64px] opacity-10 grayscale">
                       <TrendingUp className="w-24 h-24 mb-10" />
                       <p className="text-[12px] font-black uppercase tracking-[1.5em]">Awaiting_Calibration</p>
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
