"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Scan, ShieldCheck, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductLensProps {
  onClose: () => void;
}

export default function ProductLens({ onClose }: ProductLensProps) {
  const { t, lang } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setIsScanning(true);
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
                { type: 'text', text: 'Analyze this product/medicine. Provide the 4-Pillar analysis: Clinical Urgency, Medical Ingredients & Red Shield Check, Diet impact, and Prana Vitality action.' },
                { type: 'image', src: image }
              ]
            }
          ],
          profile: { name: "Resident", sex: "Unknown", age: "Unknown" },
          lang: lang === 'HI' ? 'Hindi' : lang === 'TE' ? 'Telugu' : lang === 'TA' ? 'Tamil' : lang === 'ES' ? 'Spanish' : lang === 'AR' ? 'Arabic' : 'English'
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.content);
    } catch (err: any) {
      console.error('Scan Error:', err);
      setError('Intelligence Sync Failed. Please try a clearer image.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col bg-[#0a0a0a]"
      >
        {/* Header */}
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-primary text-black">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-[24px] bg-black/10 flex items-center justify-center">
              <Scan className="w-8 h-8 text-black animate-pulse" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                 <Zap className="w-3 h-3 text-black fill-black" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Guardian_Protocol_v6.1</span>
               </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Product Lens</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 border-4 border-dashed border-authority/5 rounded-[40px] bg-white/30">
              <div className="w-40 h-40 rounded-full bg-authority/5 flex items-center justify-center text-authority/10">
                <Camera className="w-20 h-20" />
              </div>
              <div className="text-center space-y-6">
                <h3 className="text-5xl font-outfit font-black text-authority tracking-tighter uppercase leading-none italic">Initialize Scan</h3>
                <p className="text-authority/40 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-[0.3em] font-black">Upload medication or food packaging</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-16 py-8 bg-authority text-white rounded-[32px] font-black text-xs uppercase tracking-[0.5em] hover:bg-teal transition-all flex items-center gap-4 shadow-3xl"
              >
                <Upload className="w-5 h-5" /> Select Image
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">
              <div className="space-y-10">
                <div className="relative aspect-square rounded-[48px] overflow-hidden border-[12px] border-white shadow-3xl bg-cream group">
                  <img src={image} alt="Scan" className="w-full h-full object-cover" />
                  {isScanning && (
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-2 bg-saffron shadow-[0_0_40px_#FFB800] z-10"
                    />
                  )}
                  <div className="absolute inset-0 bg-authority/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => setImage(null)}
                       className="p-8 bg-white rounded-full text-authority shadow-3xl hover:scale-110 transition-all"
                     >
                        <RefreshCw className="w-10 h-10" />
                     </button>
                  </div>
                </div>
                {!result && !isScanning && (
                  <button 
                    onClick={runAnalysis}
                    className="w-full py-8 bg-saffron text-authority rounded-[32px] font-black text-xs uppercase tracking-[0.6em] hover:scale-[1.02] transition-all shadow-2xl shadow-saffron/20"
                  >
                    Analyze Product
                  </button>
                )}
              </div>

              <div className="flex flex-col">
                {isScanning ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-pulse">
                    <div className="w-24 h-24 rounded-full border-[8px] border-authority/5 border-t-saffron animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-authority/20">Deciphering Bio-Markers...</p>
                  </div>
                ) : result ? (
                  <div className="flex-1 space-y-12">
                    <div className="flex items-center gap-6 p-8 bg-teal/5 rounded-[32px] border border-teal/10">
                      <ShieldCheck className="w-10 h-10 text-teal" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal">Safety_Verified</p>
                        <p className="text-xl font-outfit font-black text-authority leading-none">ANALYSIS COMPLETE</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm prose-authority max-w-none">
                       <div className="text-authority/80 leading-relaxed font-medium whitespace-pre-wrap italic bg-white p-10 rounded-[40px] shadow-inner">
                          {result}
                       </div>
                    </div>

                    <button 
                      onClick={() => setImage(null)}
                      className="w-full py-6 text-authority/20 hover:text-authority transition-colors flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em]"
                    >
                      <RefreshCw className="w-5 h-5" /> New Scan
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-20 border-4 border-dashed border-authority/5 rounded-[48px] opacity-10">
                    <Scan className="w-20 h-20 mb-8" />
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
