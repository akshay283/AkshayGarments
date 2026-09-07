import React from 'react';
import {
  Building2,
  ShieldCheck,
  Sparkles,
  Scissors,
  HeartHandshake,
  Clock
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { resolveImagePath } from '../utils/imageUtils';

export const About = () => {
  const values = [
    {
      title: "Uncompromising Quality",
      desc: "Every yarn lot and fabric roll is tested for shrinkage, pilling resistance, and OEKO-TEX® skin safety compliance before entering our cutting lines.",
      icon: ShieldCheck
    },
    {
      title: "Academic Reliability",
      desc: "We understand that school terms cannot wait. Our guaranteed on-time bulk delivery ensures every student receives their uniform before day one.",
      icon: Clock
    },
    {
      title: "Design Consistency",
      desc: "Our computerized dye recipe archive and CAD patterns ensure that a uniform purchased 5 years later matches the exact shade and fit of today.",
      icon: Scissors
    },
    {
      title: "Transparent Partnership",
      desc: "Direct manufacturer-to-institution pricing without middleman markups, accompanied by complete swatch transparency and sizing trials.",
      icon: HeartHandshake
    }
  ];

  const craftsmanshipPillars = [
    {
      step: "01",
      title: "Precision CAD Pattern Cutting",
      desc: "Computerized Gerber cutting tables ensure millimeter-accurate consistency across all 12 standard student sizes."
    },
    {
      step: "02",
      title: "Multi-Head Computerized Embroidery",
      desc: "High-density Japanese Tajima 15-needle embroidery heads for crisp, photographic reproduction of school coats-of-arms."
    },
    {
      step: "03",
      title: "Double-Lock Bar-Tack Stitching",
      desc: "Reinforced armholes, pocket corners, and trouser crotches engineered to survive rigorous playground sports."
    },
    {
      step: "04",
      title: "4-Stage Quality Check & Pressing",
      desc: "Every single finished garment undergoes dimensional verification, loose thread trimming, and industrial steam finishing."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Our Heritage & Craftsmanship</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Shaping Institutional Identity Through Exceptional Apparel
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Founded in 2005, Akshay Garments has grown into India's trusted school uniform manufacturer, combining modern textile technology with old-world tailoring discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Our Story</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
              From a Passionate Stitching Unit to 85+ Partner Schools
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We started with a simple belief: <em>school uniforms should instill pride in students, ease the minds of parents, and stand as an elegant symbol of the institution's heritage.</em>
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Too often, schools struggled with rough itchy fabrics, loose stitching, irregular shade batches, and stressful sizing camps. Akshay Garments was built to eliminate these pain points completely.
            </p>

            {/* Mission Box */}
            <div className="bg-brand-50/80 border-l-4 border-brand-600 p-5 rounded-r-2xl space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-900">
                Our Core Mission
              </div>
              <p className="text-sm font-semibold text-brand-950 italic">
                "To provide schools and institutes with durable, comfortable and professionally designed uniforms that elevate the daily educational experience."
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative group">
            <div className="rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl aspect-[4/3] bg-slate-100">
              <img
                src={resolveImagePath('/images/fabrics/school_suiting_fabric.jpg')}
                alt="Certified school uniform suiting fabrics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-navy-950 text-white p-6 rounded-2xl shadow-2xl border border-navy-800 hidden sm:block">
              <div className="text-3xl font-black text-gold-400 font-display">20+ Years</div>
              <div className="text-xs text-slate-300">Of Uniform Garments Manufacturing Excellence</div>
            </div>
          </div>

        </div>
      </section>

      {/* Animated Counter Stats */}
      <section className="bg-navy-950 text-white py-16 border-y border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {siteConfig.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-display font-black text-3xl sm:text-5xl text-gold-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>Manufacturing Standards</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
            How Akshay Garments Uniforms Are Made
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftsmanshipPillars.map((p, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md font-mono">
                  {p.step}
                </span>
                <h3 className="font-display font-bold text-base text-navy-950 mt-4">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
              Our Guiding Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-navy-950">
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
