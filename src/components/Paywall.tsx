"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Check, Zap, Users, Calendar } from "lucide-react";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Paywall({ isOpen, onClose }: PaywallProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-authority/60 backdrop-blur-md flex items-center justify-center p-6 text-authority">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card max-w-4xl w-full p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldCheck className="w-40 h-40" />
        </div>

        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron/10 text-saffron text-xs font-bold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3 fill-current" /> Sachet Pricing Active
           </div>
           <h2 className="text-4xl font-outfit font-bold">Choose Your Vitality Plan</h2>
           <p className="text-authority/60 mt-2">Clinical-grade health intelligence for every home in Bharat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* One-Shot Sachet */}
           <div className="glass-card p-6 border-authority/5 flex flex-col justify-between hover:border-authority/20 transition-all cursor-pointer">
              <div>
                <h4 className="font-bold text-sm mb-1">One-Shot</h4>
                <div className="text-2xl font-outfit font-bold mb-4">₹99</div>
                <ul className="space-y-2 text-[10px] text-authority/60">
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-sage" /> Single Interpretation</li>
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-sage" /> 4-Pillar Recovery</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2 rounded-antigravity bg-authority/5 text-xs font-bold hover:bg-authority/10 transition-colors">Select</button>
           </div>

           {/* Individual */}
           <div className="glass-card p-6 border-sage/20 bg-sage/[0.02] flex flex-col justify-between hover:border-sage/40 transition-all cursor-pointer ring-2 ring-sage/5">
              <div>
                <h4 className="font-bold text-sm mb-1 text-sage">Individual</h4>
                <div className="text-2xl font-outfit font-bold mb-4">₹299<span className="text-xs font-normal opacity-40">/mo</span></div>
                <ul className="space-y-2 text-[10px] text-authority/60">
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-sage" /> Unlimited Consults</li>
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-sage" /> Full Life-Map™</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2 rounded-antigravity bg-sage text-cream text-xs font-bold hover:bg-sage-dark shadow-md shadow-sage/10 transition-colors">Best for You</button>
           </div>

           {/* Family - The Shield */}
           <div className="glass-card p-6 border-saffron/20 bg-saffron/[0.02] flex flex-col justify-between hover:border-saffron/40 transition-all cursor-pointer ring-2 ring-saffron/5">
              <div className="absolute top-0 right-0 py-1 px-3 bg-saffron text-authority text-[8px] font-bold rounded-bl-md uppercase">The Shield</div>
              <div>
                <h4 className="font-bold text-sm mb-1 text-saffron-dark">Family</h4>
                <div className="text-2xl font-outfit font-bold mb-4">₹499<span className="text-xs font-normal opacity-40">/mo</span></div>
                <ul className="space-y-2 text-[10px] text-authority/60">
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-saffron" /> 4 Individual Profiles</li>
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-saffron" /> Family Dashboard</li>
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-saffron" /> ₹125 / person</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2 rounded-antigravity bg-saffron text-authority text-xs font-bold hover:bg-saffron-dark shadow-md shadow-saffron/10 transition-colors">Most Popular</button>
           </div>

           {/* Annual */}
           <div className="glass-card p-6 border-authority/5 flex flex-col justify-between hover:border-authority/20 transition-all cursor-pointer">
              <div>
                <h4 className="font-bold text-sm mb-1">Annual</h4>
                <div className="text-2xl font-outfit font-bold mb-4">₹1,499<span className="text-xs font-normal opacity-40">/yr</span></div>
                <ul className="space-y-2 text-[10px] text-authority/60">
                   <li className="flex items-center gap-2"><Calendar className="w-3 h-3 text-sage" /> 12 Months Access</li>
                   <li className="flex items-center gap-2"><Check className="w-3 h-3 text-sage" /> Value: Save 60%</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2 rounded-antigravity bg-authority/5 text-xs font-bold hover:bg-authority/10 transition-colors">Select</button>
           </div>
        </div>

        <div className="mt-12 pt-8 border-t border-authority/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[10px] text-authority/40 max-w-sm text-center md:text-left">
             Payments processed securely via Razorpay (India) & Stripe (Global). All plans are private and covered by the 2026 Sovereign Data Guarantee.
           </p>
           <button onClick={onClose} className="text-sm font-bold text-authority/40 hover:text-authority transition-colors">Maybe later</button>
        </div>
      </motion.div>
    </div>
  );
}
