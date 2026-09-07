import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  Award,
  Layers,
  Heart
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Footer = () => {
  const { openQuoteModal } = useQuoteModal();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-900 overflow-hidden relative">
      {/* Background subtle glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Institutional Banner inside footer */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-6 sm:p-8 mb-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-display text-lg sm:text-xl font-bold">
                Planning Uniforms for the Upcoming Academic Year?
              </h3>
              <p className="text-slate-400 text-sm mt-0.5">
                Request our complimentary School Swatch Kit & Custom Digital Uniform Mockup with your school crest.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => openQuoteModal({ type: 'bulk-school' })}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center gap-2"
            >
              <span>Request Institutional Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappTemplates.bulkSchool)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* 4-Column Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">

          {/* Col 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <svg className="w-6 h-6 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  AKSHAY <span className="text-brand-400">GARMENTS</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  School Uniforms & Apparel
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {siteConfig.shortDesc}
            </p>

            {/* Quality Badges */}
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Double-Lock Stitching on all Stress Points</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/catalog" className="text-slate-400 hover:text-white transition-colors">What We Manufacture</Link>
              </li>
              <li>
                <Link to="/catalog" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Digital Catalog</span>
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono font-semibold">PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Akshay Garments</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact & Bulk Enquiry</Link>
              </li>
              <li>
                <Link to="/review" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gold-400" />
                  <span>Customer Reviews</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span>Saved Wishlist</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Manufacturing Categories (Plain Info List) */}
          <div>
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2">
              Manufacture Line
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>School Shirts</li>
              <li>Pants & Trousers</li>
              <li>School & College Blazers</li>
              <li>Full Uniform Sets</li>
              <li>Custom & Sports T-Shirts</li>
              <li>Doctor & Lab Aprons</li>
              <li>Driver Uniform Dresses</li>
            </ul>
          </div>

          {/* Col 4: Factory & Contact */}
          <div>
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-1 shrink-0" />
                <span>
                  {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} - {siteConfig.contact.address.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-pink-400 text-sm font-bold">📸</span>
                <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-pink-300 hover:text-pink-200 font-medium">
                  @akshaygarments_uniforms
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>{siteConfig.contact.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Netlify info, copyright & quick legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} {siteConfig.companyName}. All Rights Reserved. Crafted for Educational Institutions across India.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Production Line Active</span>
            </span>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Institutional Procurement Terms</Link>
            <span>•</span>
            <a
              href="https://www.netlify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 font-medium"
            >
              Hosted on Netlify
            </a>
            <span>•</span>
            <Link
              to="/admin"
              className="text-slate-500 hover:text-gold-400 font-medium transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer >
  );
};
