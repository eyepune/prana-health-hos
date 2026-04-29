"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, X, ShieldCheck, AlertCircle, Plus, Activity, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase';
import { useUser } from '@/context/UserContext';

interface HealthRecordsModalProps {
  onClose: () => void;
  onRecordAdded?: () => void;
}

export default function HealthRecordsModal({ onClose, onRecordAdded }: HealthRecordsModalProps) {
  const { t } = useLanguage();
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
          profile: profile
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const content = data.content;
      setAnalysisResult(content);

      // Attempt to parse and save to Supabase
      // Simplified parser for common markers
      const lines = content.split('\n');
      for (const line of lines) {
        // Look for common patterns like "Vitamin D: 24 ng/mL"
        const match = line.match(/(Vitamin D|HbA1c|B12|Cholesterol|Glucose)[:\s]+([\d.]+)\s*([%\w\/]+)/i);
        if (match) {
          const [_, name, value, unit] = match;
          await supabase.from('vitality_records').insert([{
            user_id: profile.id,
            marker_name: name.trim(),
            marker_value: value,
            optimal_range: unit === '%' ? '4.0 - 5.6' : '30-100', // Mock optimal ranges
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-authority/60 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card max-w-5xl w-full h-[85vh] overflow-hidden flex flex-col bg-white border-white/50 shadow-3xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-authority/5 flex items-center justify-between bg-saffron text-authority">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter leading-none">Record Interpreter</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mt-1">Sovereign Health Vault Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 border-4 border-dashed border-authority/5 rounded-[40px]">
              <div className="w-32 h-32 rounded-full bg-saffron/5 flex items-center justify-center text-saffron/40">
                <Plus className="w-16 h-16" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-outfit font-black text-authority tracking-tighter uppercase leading-none italic">Upload Lab Report</h3>
                <p className="text-authority/40 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-widest font-black">Supported: Blood Work, MRI, Clinical Notes</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-10 py-5 bg-authority text-cream rounded-antigravity font-black text-xs uppercase tracking-[0.4em] hover:bg-authority/90 transition-all flex items-center gap-3"
              >
                <Upload className="w-4 h-4" /> Select File
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div className="space-y-8">
                  <div className="aspect-[3/4] rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-cream relative group">
                    <img src={image} className="w-full h-full object-cover" alt="Report" />
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-2 bg-saffron shadow-[0_0_30px_#FFB800] z-10"
                      />
                    )}
                  </div>
                  {!analysisResult && !isAnalyzing && (
                    <button 
                      onClick={analyzeReport}
                      className="w-full py-6 bg-saffron text-authority rounded-antigravity font-black text-xs uppercase tracking-[0.4em] hover:scale-[1.02] transition-all"
                    >
                      Extract Biomarkers
                    </button>
                  )}
               </div>

               <div className="space-y-10">
                  {isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                      <div className="w-20 h-20 rounded-full border-[6px] border-authority/5 border-t-saffron animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-authority/30">Syncing with Bharat Intelligence Engine...</p>
                    </div>
                  ) : analysisResult ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-12"
                    >
                       <div className="p-8 bg-sage/5 rounded-[32px] border border-sage/20 flex items-center gap-6">
                          <ShieldCheck className="w-10 h-10 text-sage" />
                          <div>
                            <h4 className="text-xl font-outfit font-black text-authority leading-none">VITALITY SYNCED</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-authority/40 mt-1">Biomarkers added to your Life-Map™</p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-authority/30 pl-4 border-l-4 border-saffron">Clinical Interpretation</h3>
                          <div className="prose prose-sm prose-authority max-w-none">
                             <div className="text-authority/80 leading-relaxed font-medium whitespace-pre-wrap italic bg-cream/50 p-8 rounded-[32px]">
                                {analysisResult}
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={() => setImage(null)}
                         className="w-full py-6 border-2 border-authority/5 text-authority/40 rounded-antigravity font-black text-[10px] uppercase tracking-[0.4em] hover:border-authority/20 transition-all"
                       >
                         Upload Another Report
                       </button>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                       <TrendingUp className="w-16 h-16" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Calibration</p>
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
