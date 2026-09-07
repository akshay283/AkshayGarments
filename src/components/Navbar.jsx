import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Sparkles, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useFavorites } from '../context/FavoritesContext';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { count: favCount } = useFavorites();
  const { openQuoteModal } = useQuoteModal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'What We Manufacture', path: '/catalog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Utility Bar for Institutional Credibility */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-navy-900 transition-all hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Direct Bulk Supply to 85+ Top Educational Institutions</span>
            </span>
          </div>

          <div className="flex items-center space-x-5 text-slate-300">
            <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <span>{siteConfig.contact.email}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-pink-300 hover:text-pink-200 transition-colors font-medium">
              <span>📸</span>
              <span>@akshaygarments_uniforms</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/catalog" className="flex items-center gap-1 text-gold-400 hover:text-gold-300 font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Digital Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5'
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo & Brand Name */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl sm:text-2xl text-navy-950 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                  AKSHAY <span className="text-brand-600">GARMENTS</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                  School Uniforms & Apparel
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                    isActive(link.path)
                      ? 'text-brand-600 bg-brand-50/80 font-bold'
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Search Trigger Button */}
              <button
                onClick={onOpenSearch}
                aria-label="Open Search"
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent sm:border-slate-200"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline text-xs text-slate-500 font-medium">Search...</span>
                <kbd className="hidden md:inline-block text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-300 font-mono">
                  Ctrl K
                </kbd>
              </button>

              {/* Favorites Wishlist Link */}
              <Link
                to="/favorites"
                aria-label="View Favorites"
                className="relative p-2 text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Saved Uniforms & Products"
              >
                <Heart className="w-5 h-5" />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Direct WhatsApp Action */}
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappTemplates.general)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                title="Chat with Uniform Consultant"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>

              {/* Request Quote Button */}
              <button
                onClick={() => openQuoteModal({ type: 'bulk-school' })}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-600 to-navy-800 hover:from-brand-700 hover:to-navy-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all transform active:scale-95"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
                className="lg:hidden p-2 text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl transition-all duration-300 max-h-[85vh] overflow-y-auto px-5 py-6">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                    isActive(link.path)
                      ? 'bg-brand-50 text-brand-600 font-bold border-l-4 border-brand-600'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className={`w-4 h-4 ${isActive(link.path) ? 'text-brand-600' : 'text-slate-400'}`} />
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openQuoteModal({ type: 'bulk-school' });
                  }}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request School Quote</span>
                </button>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappTemplates.general)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    <span>{siteConfig.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-brand-600" />
                    <span>{siteConfig.contact.email}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {siteConfig.contact.businessHours}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
