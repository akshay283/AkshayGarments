import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Layers, 
  ArrowRight, 
  Eye, 
  Scissors,
  Award,
  Check,
  Tag
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { manufacturingItems } from '../data/manufacturing';
import { useQuoteModal } from '../context/QuoteModalContext';
import { ReviewSlider } from '../components/ReviewSlider';
import { CardImageSlider } from '../components/CardImageSlider';

export const Catalog = ({ onQuickView }) => {
  const { openQuoteModal } = useQuoteModal();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [highlightedId, setHighlightedId] = useState(null);

  const filterCategories = [
    { id: 'all', label: 'All 13 Manufactured Lines' },
    { id: 'school-college', label: 'School & College Uniforms' },
    { id: 'institutional-staff', label: 'Medical Aprons & Driver Dresses' },
    { id: 'tshirts', label: 'Event & Corporate T-Shirts' },
    { id: 'blazer-vascoat', label: 'Blazers & Waistcoats' },
    { id: 'bottoms', label: 'Pants, Shorts & Pizama' },
    { id: 'ethnic', label: 'Punjabi Dress Sets' }
  ];

  // Auto-scroll and highlight when navigating to /catalog?item=xyz or #xyz
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetItem = params.get('item') || (location.hash ? location.hash.replace('#', '') : null);
    const targetCategory = params.get('category');

    if (targetItem) {
      // Find category group to ensure item is visible in filtered list
      if (['uniforms', 'college-uniforms', 'school-shirts'].includes(targetItem)) {
        setActiveFilter('school-college');
      } else if (['doctor-aprons', 'driver-conductor-dresses'].includes(targetItem)) {
        setActiveFilter('institutional-staff');
      } else if (['custom-event-tshirt', 'corporate-event-tshirt'].includes(targetItem)) {
        setActiveFilter('tshirts');
      } else if (['blazer', 'vascoat'].includes(targetItem)) {
        setActiveFilter('blazer-vascoat');
      } else if (['pant', 'short', 'pizama'].includes(targetItem)) {
        setActiveFilter('bottoms');
      } else if (['punjabi'].includes(targetItem)) {
        setActiveFilter('ethnic');
      } else {
        setActiveFilter('all');
      }

      setHighlightedId(targetItem);

      const timer = setTimeout(() => {
        const el = document.getElementById(targetItem);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      const clearTimer = setTimeout(() => {
        setHighlightedId(null);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    } else if (targetCategory) {
      setActiveFilter(targetCategory);
    }
  }, [location.search, location.hash]);

  const filteredItems = manufacturingItems.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'school-college') return ['uniforms', 'college-uniforms', 'school-shirts'].includes(item.id);
    if (activeFilter === 'institutional-staff') return ['doctor-aprons', 'driver-conductor-dresses'].includes(item.id);
    if (activeFilter === 'tshirts') return ['custom-event-tshirt', 'corporate-event-tshirt'].includes(item.id);
    if (activeFilter === 'blazer-vascoat') return ['blazer', 'vascoat'].includes(item.id);
    if (activeFilter === 'bottoms') return ['pant', 'short', 'pizama'].includes(item.id);
    if (activeFilter === 'ethnic') return ['punjabi'].includes(item.id);
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-25 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Scissors className="w-3.5 h-3.5" />
              <span>Direct Manufacturing & Bulk Apparel Supply</span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              What We Manufacture
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our core manufacturing product lines engineered for educational institutions, collegiate sports, school councils, and corporate events. Every garment is crafted with certified fabrics, precision stitching, and custom identity branding.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openQuoteModal({ type: 'bulk-school' })}
                className="px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Tag className="w-4 h-4" />
                <span>Request Institutional Quote</span>
              </button>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hello Akshay Garments, I would like to inquire about bulk uniform & garment manufacturing for our institution.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md"
              >
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHAT WE MANUFACTURE" SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Filter Pills */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Master Production Portfolio</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
            Our Manufacturing Capabilities
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm">
            Manufactured strictly to institutional standards with heavy-duty reinforcements and auto-sliding photo galleries of multiple school sets.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === cat.id
                    ? 'bg-navy-950 text-white shadow-md ring-2 ring-brand-500/40'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 13 Items Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const isHighlighted = highlightedId === item.id;

            return (
              <div
                key={item.id}
                id={item.id}
                className={`group bg-white rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col justify-between scroll-mt-28 ${
                  isHighlighted
                    ? 'border-brand-500 ring-4 ring-gold-400/80 shadow-2xl scale-[1.02] bg-brand-50/20'
                    : 'border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-brand-500/60'
                }`}
              >
                <div>
                  {/* Product Image Box with Auto-Slide Carousel */}
                  <div className="relative overflow-hidden bg-slate-100">
                    <CardImageSlider
                      images={item.images || [item.image]}
                      alt={item.name}
                      aspectRatioClass="aspect-[16/11]"
                    />
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-navy-950/90 backdrop-blur-md text-gold-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-navy-800 z-10 pointer-events-none">
                      {item.badge}
                    </span>

                    {/* Lead Time Badge */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold rounded-lg uppercase shadow-xs z-10 pointer-events-none">
                      ⚡ {item.leadTime}
                    </span>

                    {/* Quick Inspect Button on Hover */}
                    {onQuickView && (
                      <button
                        onClick={() => onQuickView(item)}
                        className="absolute bottom-3 left-3 px-3 py-1.5 bg-navy-950/80 hover:bg-navy-950 text-white text-[11px] font-bold rounded-xl backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 z-10 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-400" />
                        <span>Quick View</span>
                      </button>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h3 
                        onClick={() => onQuickView && onQuickView(item)}
                        className="font-display font-bold text-xl text-navy-950 group-hover:text-brand-600 transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {item.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Fabric Specification Strip */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Certified Fabric Specification:</div>
                      <div className="font-semibold text-navy-900 text-xs flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{item.fabric}</span>
                      </div>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-1.5 pt-1">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Min: <span className="text-navy-950 font-bold">{item.minOrder}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onQuickView && (
                      <button
                        onClick={() => onQuickView(item)}
                        className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                        title="Quick View Details"
                        aria-label="Quick View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    )}

                    <button
                      onClick={() => openQuoteModal({ 
                        productName: item.name, 
                        category: item.category, 
                        type: 'manufacturing',
                        notes: `Inquiring about ${item.name} manufacturing (${item.fabric})`
                      })}
                      className="px-3.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
                    >
                      <span>Request Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 3. REVIEW SLIDES / TESTIMONIALS SLIDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewSlider 
          title="What Our Clients & Schools Say" 
          subtitle="Trusted by over 85+ educational institutions, sports leagues, student councils, and corporate partners across India."
        />
      </section>

      {/* 4. Direct Institutional Procurement CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-navy-900 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Ready to Manufacture Uniforms or Custom Event Garments?
            </h3>
            <p className="text-slate-200 text-xs sm:text-base max-w-xl mx-auto">
              Schedule a consultation with our garment experts, review physical fabric swatches, or request an official institutional rate card.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => openQuoteModal({ type: 'bulk-school' })}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Request Manufacturer Quote
              </button>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hello Akshay Garments, I would like to inquire about bulk garment manufacturing for our institution/event.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
