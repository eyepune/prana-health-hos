"use client";

import { motion } from "framer-motion";
import { AlertCircle, Phone, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmergencyProps {
  isActive: boolean;
  location: string;
  onClose: () => void;
}

export default function EmergencyGlow({ isActive, location, onClose }: EmergencyProps) {
  const { t } = useLanguage();
  
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-red-600/20 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl glass-card bg-red-950/90 border-red-500/50 p-8 md:p-12 text-white relative overflow-hidden"
      >
        {/* Pulsing Red Glow Effect */}
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500 mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-red-500/50">
            <AlertCircle className="w-10 h-10 text-white animate-bounce" />
          </div>

          <h2 className="text-4xl font-outfit font-bold mb-4">{t.dashboard.critical_alert}</h2>
          <p className="text-red-200 text-lg mb-12">
            {t.dashboard.urgency_detect}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <a 
              href="tel:102" 
              className="flex items-center justify-center gap-3 bg-white text-red-600 py-6 rounded-antigravity font-bold text-2xl hover:bg-neutral-100 transition-all shadow-xl"
            >
              <Phone className="w-6 h-6" /> {t.dashboard.ambulance} (102)
            </a>
            <a 
              href={`https://www.google.com/maps/search/hospitals+near+${encodeURIComponent(location)}`} 
              target="_blank"
              className="flex items-center justify-center gap-3 bg-red-500 text-white py-6 rounded-antigravity font-bold text-xl hover:bg-red-400 transition-all shadow-xl"
            >
              <Navigation className="w-6 h-6" /> {t.dashboard.find_er}
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-300 opacity-60">
              {t.dashboard.nearest_in} {location}
            </h4>
            <div className="space-y-3">
               {[1, 2, 3].map((_, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-antigravity border border-white/10">
                    <div className="flex items-center gap-3">
                       <MapPin className="w-4 h-4 text-red-400" />
                       <span className="text-sm font-medium">{t.dashboard.routing_active}</span>
                    </div>
                    <button className="text-xs bg-white/10 px-3 py-1 rounded-full">{t.dashboard.launch}</button>
                 </div>
               ))}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="mt-12 text-sm text-red-300/40 hover:text-red-300 transition-colors"
          >
            {t.dashboard.disarm}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
