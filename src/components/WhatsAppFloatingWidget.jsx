import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Sparkles, 
  Building2, 
  Layers, 
  Ruler
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const WhatsAppFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickOptions = [
    {
      title: "Bulk School Uniform Enquiry",
      desc: "For Principals, Trustees & Procurement Managers",
      icon: Building2,
      msg: siteConfig.whatsappTemplates.bulkSchool
    },
    {
      title: "Request Free Fabric Swatch Box",
      desc: "Get certified Poly-Viscose & Cotton swatches",
      icon: Layers,
      msg: "Hello Akshay Garments! We would like to request a physical fabric swatch box for our school review committee."
    },
    {
      title: "Campus Sizing Fit Kit Trial",
      desc: "Zero sizing mistakes with sample size run",
      icon: Ruler,
      msg: siteConfig.whatsappTemplates.fitKit
    },
    {
      title: "Custom Crest & Embroidery",
      desc: "Replicate your school coat-of-arms logo",
      icon: Sparkles,
      msg: "Hello! We would like to customize uniforms with our school coat-of-arms crest embroidery."
    }
  ];

  const handleOpenChat = (customText) => {
    const text = customText || siteConfig.whatsappTemplates.general;
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      
      {/* Pop-up Quick Selector Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  AG
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm">Akshay Garments Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>Replies typically within 15 mins</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-emerald-200 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action List */}
          <div className="p-3 bg-slate-50 space-y-2 max-h-72 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
              Select an Inquiry Topic:
            </div>
            {quickOptions.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleOpenChat(opt.msg)}
                  className="w-full p-2.5 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                      {opt.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Direct Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => handleOpenChat()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start General WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp Support"
        className="group relative flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
      >
        {/* Pulsing Ripple */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping opacity-60 pointer-events-none"></span>

        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider pr-1">
          WhatsApp Us
        </span>
      </button>

    </div>
  );
};
