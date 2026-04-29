"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Scan, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductLensProps {
  onClose: () => void;
}

export default function ProductLens({ onClose }: ProductLensProps) {
  const { t } = useLanguage();
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
          profile: { name: "Resident", sex: "Unknown", age: "Unknown" }
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-authority/60 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-white border-white/50 shadow-3xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-authority/5 flex items-center justify-between bg-authority text-cream">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Scan className="w-6 h-6 text-saffron animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter leading-none">Product Lens</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mt-1">Guardian™ Safety Protocol Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 border-4 border-dashed border-authority/5 rounded-[40px]">
              <div className="w-32 h-32 rounded-full bg-authority/5 flex items-center justify-center text-authority/20">
                <Camera className="w-16 h-16" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-outfit font-black text-authority tracking-tighter uppercase leading-none">Initialize Scan</h3>
                <p className="text-authority/40 font-medium max-w-sm mx-auto">Upload a photo of any medication or food product for instant clinical intelligence.</p>
              </div>
              <div className="flex gap-6">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-10 py-5 bg-authority text-cream rounded-antigravity font-black text-xs uppercase tracking-[0.4em] hover:bg-authority/90 transition-all flex items-center gap-3"
                >
                  <Upload className="w-4 h-4" /> Upload Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
              {/* Image Preview */}
              <div className="space-y-8">
                <div className="relative aspect-square rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-cream group">
                  <img src={image} alt="Scan preview" className="w-full h-full object-cover" />
                  {isScanning && (
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1 bg-saffron shadow-[0_0_20px_#FFB800] z-10"
                    />
                  )}
                  <div className="absolute inset-0 bg-authority/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => setImage(null)}
                       className="p-6 bg-white rounded-full text-authority shadow-2xl hover:scale-110 transition-all"
                     >
                        <RefreshCw className="w-8 h-8" />
                     </button>
                  </div>
                </div>
                {!result && !isScanning && (
                  <button 
                    onClick={runAnalysis}
                    className="w-full py-6 bg-saffron text-authority rounded-antigravity font-black text-xs uppercase tracking-[0.4em] hover:bg-saffron/90 transition-all shadow-xl shadow-saffron/20"
                  >
                    Analyze Product
                  </button>
                )}
              </div>

              {/* Analysis Result */}
              <div className="flex flex-col h-full">
                {isScanning ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-pulse">
                    <div className="w-20 h-20 rounded-full border-4 border-authority/5 border-t-saffron animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-authority/40">Deciphering Biomarkers...</p>
                  </div>
                ) : result ? (
                  <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4 p-6 bg-sage/5 rounded-antigravity border border-sage/20">
                      <ShieldCheck className="w-8 h-8 text-sage" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sage">Guardian Intelligence</p>
                        <p className="text-lg font-outfit font-black text-authority leading-none">ANALYSIS COMPLETE</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm prose-authority max-w-none">
                       <div className="text-authority/80 leading-relaxed font-medium whitespace-pre-wrap">
                          {result}
                       </div>
                    </div>

                    <div className="pt-8 border-t border-authority/5">
                       <button 
                         onClick={() => setImage(null)}
                         className="text-[10px] font-black uppercase tracking-[0.3em] text-authority/20 hover:text-authority transition-colors flex items-center gap-2"
                       >
                         <RefreshCw className="w-4 h-4" /> Start New Scan
                       </button>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                    <p className="text-authority/60 font-medium">{error}</p>
                    <button 
                      onClick={runAnalysis}
                      className="px-8 py-4 bg-authority/5 text-authority rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-authority/10 transition-all"
                    >
                      Retry Analysis
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-authority/5 rounded-[40px] text-authority/20">
                    <Scan className="w-12 h-12 mb-6 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Analysis</p>
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
