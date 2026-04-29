"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, X, ShieldCheck, AlertCircle, Plus, Activity, TrendingUp, Zap } from 'lucide-react';
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
      console.error('Analysis Error:', err);
      setError('Could not decipher lab report. Ensure image is clear.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-authority/60 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col bg-cream border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[48px]"
      >
        {/* Header */}
        <div className="p-10 border-b border-authority/5 flex items-center justify-between bg-saffron text-authority">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-[24px] bg-white/30 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                 <Activity className="w-3 h-3 text-authority fill-authority" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">BioMap_Protocol_v5</span>
               </div>
              <h2 className="text-4xl font-outfit font-black uppercase tracking-tighter leading-none italic">Report Interpreter</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 border-4 border-dashed border-authority/5 rounded-[40px] bg-white/30">
              <div className="w-40 h-40 rounded-full bg-saffron/5 flex items-center justify-center text-saffron/20">
                <Plus className="w-20 h-20" />
              </div>
              <div className="text-center space-y-6">
                <h3 className="text-5xl font-outfit font-black text-authority tracking-tighter uppercase leading-none italic">Extract Bio-Markers</h3>
                <p className="text-authority/40 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-[0.3em] font-black">Upload blood work, MRI, or clinical notes</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-16 py-8 bg-authority text-white rounded-[32px] font-black text-xs uppercase tracking-[0.5em] hover:bg-teal transition-all flex items-center gap-4 shadow-3xl"
              >
                <Upload className="w-5 h-5" /> Select Report
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">
               <div className="space-y-10">
                  <div className="aspect-[3/4] rounded-[48px] overflow-hidden border-[12px] border-white shadow-3xl bg-cream relative group">
                    <img src={image} className="w-full h-full object-cover" alt="Report" />
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-2 bg-saffron shadow-[0_0_40px_#FFB800] z-10"
                      />
                    )}
                  </div>
                  {!analysisResult && !isAnalyzing && (
                    <button 
                      onClick={analyzeReport}
                      className="w-full py-8 bg-saffron text-authority rounded-[32px] font-black text-xs uppercase tracking-[0.6em] hover:scale-[1.02] transition-all shadow-2xl"
                    >
                      Extract Biomarkers
                    </button>
                  )}
               </div>

               <div className="flex flex-col">
                  {isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-pulse">
                      <div className="w-24 h-24 rounded-full border-[8px] border-authority/5 border-t-saffron animate-spin" />
                      <p className="text-[11px] font-black uppercase tracking-[0.6em] text-authority/20">Syncing with Bharat Engine...</p>
                    </div>
                  ) : analysisResult ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-12"
                    >
                       <div className="p-8 bg-teal/5 rounded-[32px] border border-teal/10 flex items-center gap-6">
                          <ShieldCheck className="w-12 h-12 text-teal" />
                          <div>
                            <h4 className="text-2xl font-outfit font-black text-authority leading-none">VITALITY SYNCED</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-authority/40 mt-2">Markers added to your Life-Map™</p>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="flex items-center gap-4">
                             <TrendingUp className="w-6 h-6 text-teal" />
                             <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-authority/30">Clinical Interpretation</h3>
                          </div>
                          <div className="prose prose-sm prose-authority max-w-none">
                             <div className="text-authority/80 leading-relaxed font-medium whitespace-pre-wrap italic bg-white p-10 rounded-[40px] shadow-inner">
                                {analysisResult}
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={() => setImage(null)}
                         className="w-full py-6 border-2 border-authority/5 text-authority/20 rounded-[32px] font-black text-[10px] uppercase tracking-[0.5em] hover:text-authority transition-all"
                       >
                         Upload New Report
                       </button>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 border-4 border-dashed border-authority/5 rounded-[48px] opacity-10">
                       <TrendingUp className="w-20 h-20 mb-8" />
                       <p className="text-[12px] font-black uppercase tracking-[0.8em]">Awaiting Calibration</p>
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
