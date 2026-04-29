"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Scan, ShieldCheck, AlertCircle, RefreshCw, Zap, Wind } from 'lucide-react';
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[48px]"
      >
        {/* Header */}
        <div className="p-12 border-b border-black/5 flex items-center justify-between bg-primary text-white">
          <div className="flex items-center gap-10">
            <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center shadow-inner">
              <Scan className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                 <Wind className="w-3 h-3 text-white/40" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 uppercase">Guardian_Protocol_v7.0</span>
               </div>
              <h2 className="text-4xl font-playfair font-black uppercase tracking-tighter leading-none italic">Product Lens</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-6 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-10 h-10" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-16">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-16 py-24 border-2 border-dashed border-black/5 rounded-[48px] bg-black/[0.01] hover:bg-black/[0.02] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-40 h-40 rounded-full bg-primary/5 flex items-center justify-center text-primary/10 group-hover:scale-110 transition-transform duration-700">
                <Camera className="w-20 h-20" />
              </div>
              <div className="text-center space-y-8">
                <h3 className="text-5xl font-playfair font-black text-primary tracking-tighter uppercase leading-none italic">Initialize Scan</h3>
                <p className="text-primary/30 font-medium max-w-sm mx-auto uppercase text-[11px] tracking-[0.4em] font-black">Upload medication or food packaging</p>
              </div>
              <button 
                className="btn-primary py-10 px-20 shadow-2xl"
              >
                <Upload className="w-5 h-5 mr-4" /> Select Image
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 h-full">
              <div className="space-y-12">
                <div className="relative aspect-square rounded-[64px] overflow-hidden border-[16px] border-white shadow-2xl bg-black/[0.01] group">
                  <img src={image} alt="Scan" className="w-full h-full object-cover" />
                  {isScanning && (
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1 bg-primary/40 shadow-[0_0_30px_rgba(30,57,50,0.5)] z-10"
                    />
                  )}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                     <button 
                       onClick={() => setImage(null)}
                       className="p-10 bg-white rounded-full text-primary shadow-2xl hover:scale-110 transition-all"
                     >
                        <RefreshCw className="w-12 h-12" />
                     </button>
                  </div>
                </div>
                {!result && !isScanning && (
                  <button 
                    onClick={runAnalysis}
                    className="btn-primary w-full py-10 shadow-2xl"
                  >
                    Analyze Biological Impact
                  </button>
                )}
              </div>

              <div className="flex flex-col">
                {isScanning ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-pulse">
                    <div className="w-24 h-24 rounded-full border-[6px] border-primary/5 border-t-primary animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] text-primary/20">Syncing_Clinical_Nodes...</p>
                  </div>
                ) : result ? (
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-16">
                    <div className="flex items-center gap-8 p-10 bg-primary/5 rounded-[40px] border border-primary/10">
                      <ShieldCheck className="w-12 h-12 text-primary" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Sovereign_Verified</p>
                        <p className="text-2xl font-playfair font-black text-primary italic leading-none mt-1">Extraction Complete</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-lg prose-primary max-w-none">
                       <div className="text-primary/70 leading-relaxed font-medium whitespace-pre-wrap italic bg-black/[0.01] p-12 rounded-[48px] border border-black/[0.02] shadow-inner text-xl font-playfair">
                          {result}
                       </div>
                    </div>

                    <button 
                      onClick={() => setImage(null)}
                      className="w-full py-8 text-primary/20 hover:text-primary transition-colors flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.6em]"
                    >
                      <RefreshCw className="w-6 h-6" /> Initialize New Protocol
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-24 border-2 border-dashed border-black/5 rounded-[64px] opacity-10 grayscale">
                    <Scan className="w-24 h-24 mb-10" />
                    <p className="text-[12px] font-black uppercase tracking-[1.5em]">Awaiting_Input</p>
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
