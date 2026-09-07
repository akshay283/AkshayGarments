import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Check,
  ArrowRight,
  Layers,
  Ruler,
  Award,
  Phone,
  MessageCircle,
  FileText,
  ChevronDown,
  Scissors,
  Truck,
  Building2,
  HelpCircle
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { manufacturingItems } from '../data/manufacturing';
import { faqs } from '../data/faqs';
import { UniformEstimator } from '../components/UniformEstimator';
import { ReviewSlider } from '../components/ReviewSlider';
import { CardImageSlider } from '../components/CardImageSlider';
import { useQuoteModal } from '../context/QuoteModalContext';
import { resolveImagePath } from '../utils/imageUtils';

export const Home = ({ onQuickView, onOpenLightbox }) => {
  const navigate = useNavigate();
  const { openQuoteModal } = useQuoteModal();
  const [openFaq, setOpenFaq] = useState(0);

  const partnerSchools = [
    { name: "St. Mary's School", icon: "🏫" },
    { name: "SanMaria School", icon: "🎓" },
    { name: "Aurobindo School", icon: "🏛️" },
    { name: "GMS School", icon: "📘" },
    { name: "SPR School", icon: "✨" },
    { name: "St. Paul's School", icon: "🛡️" },
    { name: "Greenwood School", icon: "🌲" },
    { name: "Greenland School", icon: "🌿" },
    { name: "AGS Scholars", icon: "🎖️" },
    { name: "Geetanjali School", icon: "🏆" }
  ];

  const whyChooseUsFeatures = [
    {
      icon: Scissors,
      title: "Custom School Identity",
      desc: "Computerized coat-of-arms crest embroidery, customized tartan plaids, and tailored piping matching your heritage.",
      badge: "Bespoke Design"
    },
    {
      icon: Ruler,
      title: "Zero-Error Campus Sizing",
      desc: "Complimentary Sizing Fit Kits and on-campus trial camps that eliminate wrong-size exchanges.",
      badge: "Fit Guarantee"
    },
    {
      icon: Building2,
      title: "Bulk Institutional Supply",
      desc: "Proven manufacturing capacity supplying over 10,000 garments annually to 85+ premier institutions across India.",
      badge: "10000+ Clothed"
    },
    {
      icon: Award,
      title: "Direct Wholesale Pricing",
      desc: "Manufacturer-direct transparent quotes with no middlemen markups, maximizing value for schools and parents.",
      badge: "Transparent"
    },
    {
      icon: Truck,
      title: "Guaranteed Term Delivery",
      desc: "Strict adherence to academic calendar timelines with backup emergency inventory buffer for mid-session admissions.",
      badge: "On-Time Supply"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Choose Fabric & Texture",
      desc: "Select from our certified Poly-Viscose, Poly-Cotton, or Sports Mesh swatches based on climate and grade level."
    },
    {
      num: "02",
      title: "Select Uniform Design",
      desc: "Customize collars, pleats, blazers, and custom school crest embroidery with our textile designers."
    },
    {
      num: "03",
      title: "Confirm Sizing & Quantity",
      desc: "Use our campus Sizing Fit Kits or student measurement rosters to finalize size-wise piece requirements."
    },
    {
      num: "04",
      title: "Precision Production & Delivery",
      desc: "Automated cutting, computerized embroidery, double-lock stitching, and doorstep school delivery."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-navy-950 text-white pt-10 pb-20 lg:pt-16 lg:pb-32">
        {/* Background Gradients & Grid Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Hero Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier School Garment Manufacturer Since 2005</span>
              </div>

              {/* Large Main Heading */}
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-white">
                Uniforms That Define <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-gold-400">Every School</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Premium school uniforms, quality fabrics and carefully crafted designs for schools, students and families. Certified durable weaves, precision tailoring, and on-time institutional bulk supply.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <span>Explore What We Manufacture</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => openQuoteModal({ type: 'bulk-school' })}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                >
                  <FileText className="w-4 h-4 text-gold-400" />
                  <span>Request a Quote</span>
                </button>
              </div>

              {/* Hero Credibility Strip */}
              <div className="pt-6 border-t border-navy-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                {siteConfig.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-display font-black text-xl sm:text-2xl text-white">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right: Interactive Collage & Floating Badges (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-navy-700/80 shadow-2xl bg-navy-900 group aspect-[4/5]">
                  <img
                    src={resolveImagePath('/images/manufacture/Home_Dashboard/home.png')}
                    alt="Akshay Garments Direct Institutional Uniform & Apparel Manufacturing"
                    onError={(e) => {
                      e.currentTarget.src = '/images/manufacture/uniforms/uniform-1.jpg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-navy-950/90 backdrop-blur-md border border-navy-800 text-xs text-slate-300">
                    <div className="flex items-center justify-between font-bold text-white mb-1">
                      <span>Heritage Academy Edition</span>
                      <span className="text-gold-400">240 GSM PV Suiting</span>
                    </div>
                    <div>Permanent Knife-Pleats & Oxford Weave Button-Downs</div>
                  </div> */}
                </div>

                {/* Floating Card 1: Fabric Spec */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white text-navy-950 p-3.5 rounded-2xl shadow-xl border border-slate-200 hidden sm:flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  {/* <div>
                    <div className="text-xs font-bold">Anti-Wrinkle PV Blend</div>
                    <div className="text-[10px] text-slate-500">Grade 4.5+ Color Fastness</div>
                  </div> */}
                </div>

                {/* Floating Card 2: ISO Badge */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white text-navy-950 p-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 animate-float" style={{ animationDelay: '3s' }}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  {/* <div>
                    <div className="text-xs font-bold">ISO 9001:2015</div>
                    <div className="text-[10px] text-slate-500">Quality Certified Stitching</div>
                  </div> */}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5 PARTNER SCHOOLS SCROLLING TICKER */}
      <section className="bg-white border-y border-slate-200/90 py-7 relative overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trusted Partner for 85+ Educational Institutions:
              </span>
            </div>
          </div>
        </div>

        {/* Marquee Track with Left and Right Fade Masks */}
        <div className="relative w-full overflow-hidden">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-1">
            {/* Duplicated array for seamless infinite looping */}
            {[...partnerSchools, ...partnerSchools].map((school, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 hover:bg-brand-50/80 border border-slate-200/90 hover:border-brand-300 transition-all duration-300 shrink-0 group cursor-default shadow-xs hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-sm shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                  {school.icon}
                </div>
                <div className="font-display font-extrabold text-sm sm:text-base text-navy-950 group-hover:text-brand-700 transition-colors whitespace-nowrap">
                  {school.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SECTION A: WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>The Akshay Garments Distinction</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
            Why Premier Schools & Colleges Trust Us
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            We bridge the gap between durable institutional manufacturing and high-end apparel aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseUsFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-brand-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-700 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-navy-950 group-hover:text-brand-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* 2.5 SECTION: WHAT WE MANUFACTURE SHOWCASE (seasonaldesigns inspired) */}
      <section className="bg-slate-100/80 py-16 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Scissors className="w-3.5 h-3.5" />
                <span>Core Apparel Production</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
                What We Manufacture
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Explore our 13 institutional, college, medical & event apparel lines manufactured with certified fabrics and precision stitching.
              </p>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors shrink-0"
            >
              <span>View Full Manufacturing Lookbook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of 6 Featured Manufacturing Lines with Auto-Slide Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {manufacturingItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-500 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden bg-slate-100">
                    <CardImageSlider
                      images={item.images || [item.image]}
                      alt={item.name}
                      aspectRatioClass="aspect-[16/10]"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-navy-950/80 backdrop-blur-md text-gold-400 text-[10px] font-bold rounded-lg uppercase z-10 pointer-events-none">
                      {item.badge}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 bg-white/95 text-slate-800 text-[10px] font-bold rounded-lg uppercase shadow-xs z-10 pointer-events-none">
                      ⚡ {item.leadTime}
                    </span>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3
                      onClick={() => onQuickView && onQuickView(item)}
                      className="font-display font-bold text-lg text-navy-950 mt-1 group-hover:text-brand-600 transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4 gap-2">
                  <button
                    onClick={() => onQuickView ? onQuickView(item) : null}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Quick View & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openQuoteModal({ productName: item.name, category: item.category, type: 'manufacturing' })}
                    className="px-3 py-1.5 bg-navy-950 hover:bg-brand-600 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    Inquire Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>




      {/* 6. SECTION E: HOW WE WORK (4-STEP PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Smooth Institutional Execution</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
            How We Partner With Schools
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            A seamless 4-step workflow from fabric selection to hassle-free delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between group hover:border-brand-500 transition-all hover:shadow-lg"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-display font-black text-xl mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < 3 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* 7. SECTION F: INTERACTIVE UNIFORM ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UniformEstimator />
      </section>


      {/* 8. SECTION G: SCHOOLS / BULK ORDERS CONTRAST CTA */}
      <section className="bg-gradient-mesh text-white py-16 sm:py-24 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 border border-navy-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Institutional Procurement & School Tenders</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Looking for Uniforms for Your Entire School?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              We work directly with school trusts, boards, and PTAs to provide customized uniform designs, certified fabrics, customized sizing camps, and doorstep bulk fulfillment.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Complimentary Physical Swatch Box</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>On-Campus Sizing Fit Trials</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Computerized Logo Crest Embroidery</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={() => openQuoteModal({ type: 'bulk-school' })}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request School Quote</span>
            </button>

            <Link
              to="/contact"
              className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Uniform Consultants</span>
            </Link>
          </div>

        </div>
      </section>


      {/* 9. SECTION H: TESTIMONIALS SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewSlider />
      </section>


      {/* 10. SECTION I: FREQUENTLY ASKED QUESTIONS (Q&A SESSION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Column: Heading & Quick Support Box */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Got Questions? We Have Answers</span>
                </div>

                <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950 tracking-tight">
                  Frequently Asked Questions
                </h2>

                <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                  Everything you need to know about our institutional uniform manufacturing, custom fabrics, minimum order quantities, and campus sizing trials.
                </p>
              </div>

              {/* Quick Consultation Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy-950">Have a Specific Query?</h4>
                    <p className="text-xs text-slate-500">Speak directly with our uniform specialists</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Akshay Garments, I have a question about school uniform manufacturing.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Us</span>
                  </a>
                  <Link
                    to="/contact"
                    className="flex-1 py-2.5 px-3 bg-navy-950 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Team</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Accordion Q&A Items */}
            <div className="lg:col-span-7 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.id || idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                      ? 'bg-white border-brand-500/80 shadow-md ring-1 ring-brand-500/20'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 select-none"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md transition-colors ${isOpen ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                          Q{idx + 1}
                        </span>
                        <span className={`font-display font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-brand-900' : 'text-navy-950 hover:text-brand-600'
                          }`}>
                          {faq.question}
                        </span>
                      </div>
                      <div className={`p-1.5 rounded-full transition-transform duration-200 shrink-0 ${isOpen ? 'bg-brand-50 text-brand-600 rotate-180' : 'bg-slate-100 text-slate-400'
                        }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 animate-fade-in text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100/80 mt-1">
                        <div className="pt-3">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>


      {/* 11. SECTION J: FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-navy-900 rounded-3xl p-8 sm:p-16 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Let's Create the Perfect Uniform for Your School.
            </h2>
            <p className="text-slate-200 text-sm sm:text-lg max-w-xl mx-auto">
              Schedule a consultation with our garment experts, review physical fabric swatches, and experience the Akshay Garments quality standard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-navy-950 font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Contact Us Today
              </Link>
              <Link
                to="/catalog"
                className="w-full sm:w-auto px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
              >
                View Complete Digital Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
