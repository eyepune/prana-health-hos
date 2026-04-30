"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Scan, ShieldCheck, RefreshCw, Wind } from 'lucide-react';
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col bg-[#0a0a0b] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[56px]"
      >
        {/* Header */}
        <div className="p-14 border-b border-white/5 flex items-center justify-between bg-primary text-black">
          <div className="flex items-center gap-12">
            <div className="w-20 h-20 rounded-[32px] bg-black/10 flex items-center justify-center shadow-3xl">
              <Scan className="w-10 h-10 text-black animate-pulse" />
            </div>
            <div>
               <div className="flex items-center gap-4 mb-2">
                 <Wind className="w-4 h-4 text-black/40" />
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">Guardian_Protocol_v8.0</span>
               </div>
              <h2 className="text-5xl font-playfair font-black uppercase tracking-tighter leading-none italic">Product Lens</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-8 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-12 h-12" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-20">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-20 py-24 border-2 border-dashed border-white/5 rounded-[64px] bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center text-primary/10 group-hover:scale-110 transition-transform duration-1000 shadow-3xl">
                <Camera className="w-24 h-24" />
              </div>
              <div className="text-center space-y-10">
                <h3 className="text-6xl font-playfair font-black text-white tracking-tighter uppercase leading-none italic">Initialize Scan</h3>
                <p className="text-white/20 font-medium max-w-sm mx-auto uppercase text-[12px] tracking-[0.6em] font-black">Upload medication or food packaging</p>
              </div>
              <button 
                className="btn-primary py-12 px-24 shadow-[0_30px_60px_-10px_rgba(0,209,178,0.3)]"
              >
                <Upload className="w-6 h-6 mr-6" /> Select Image
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 h-full">
              <div className="space-y-16">
                <div className="relative aspect-square rounded-[80px] overflow-hidden border-[20px] border-white/5 shadow-3xl bg-black/[0.01] group">
                  <img src={image} alt="Scan" className="w-full h-full object-cover" />
                  {isScanning && (
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1.5 bg-primary shadow-[0_0_40px_#00D1B2] z-10"
                    />
                  )}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
                     <button 
                       onClick={() => setImage(null)}
                       className="p-12 bg-white rounded-full text-black shadow-3xl hover:scale-110 transition-all"
                     >
                        <RefreshCw className="w-14 h-14" />
                     </button>
                  </div>
                </div>
                {!result && !isScanning && (
                  <button 
                    onClick={runAnalysis}
                    className="btn-primary w-full py-12 shadow-3xl uppercase tracking-[0.8em]"
                  >
                    Analyze Biological Impact
                  </button>
                )}
              </div>

              <div className="flex flex-col">
                {isScanning ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 animate-pulse">
                    <div className="w-32 h-32 rounded-full border-[8px] border-white/5 border-t-primary animate-spin" />
                    <p className="text-[12px] font-black uppercase tracking-[1em] text-primary/20">Syncing_Neural_Nodes...</p>
                  </div>
                ) : result ? (
                  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-20">
                    <div className="flex items-center gap-10 p-12 bg-primary/10 rounded-[48px] border border-primary/20 shadow-3xl">
                      <ShieldCheck className="w-16 h-16 text-primary" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/40">Sovereign_Extraction_v8</p>
                        <p className="text-3xl font-playfair font-black text-white italic leading-none mt-2 uppercase tracking-tighter">Analysis Verified</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-2xl prose-primary max-w-none">
                       <div className="text-white/70 leading-relaxed font-medium whitespace-pre-wrap italic bg-white/[0.02] p-14 rounded-[64px] border border-white/5 shadow-inner text-2xl font-playfair tracking-tight">
                          {result}
                       </div>
                    </div>

                    <button 
                      onClick={() => setImage(null)}
                      className="w-full py-10 text-white/20 hover:text-primary transition-colors flex items-center justify-center gap-8 text-[12px] font-black uppercase tracking-[0.8em]"
                    >
                      <RefreshCw className="w-8 h-8" /> Initialize New Protocol
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-28 border-2 border-dashed border-white/5 rounded-[80px] opacity-10 grayscale">
                    <Scan className="w-32 h-32 mb-12" />
                    <p className="text-[14px] font-black uppercase tracking-[2em]">Awaiting_Input</p>
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
