import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  MessageCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Ruler,
  Layers,
  ArrowRight,
  ZoomIn,
  Clock,
  Package
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useQuoteModal } from '../context/QuoteModalContext';
import { siteConfig } from '../config/siteConfig';
import { resolveImagePath, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils';

export const ProductQuickViewModal = ({ product, isOpen, onClose, onOpenSizeGuide, onOpenLightbox }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { openQuoteModal } = useQuoteModal();
  const navigate = useNavigate();

  const productImages = useMemo(() => {
    if (!product) return [];
    const list = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || DEFAULT_FALLBACK_IMAGE];
    return Array.from(new Set(list.map(img => resolveImagePath(img)).filter(Boolean)));
  }, [product]);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const favorited = isFavorite(product.id);

  const handleQuoteClick = () => {
    onClose();
    openQuoteModal({
      productName: product.name,
      category: product.category || product.badge || 'Manufacturing',
      type: product.leadTime ? 'manufacturing' : 'school-uniform',
      notes: `Inquiring about ${product.name} (${product.fabric || 'Institutional Quality'}). MOQ: ${product.minOrder || 'Standard bulk'}`
    });
  };

  const handleViewInCatalog = () => {
    onClose();
    navigate(`/catalog?item=${product.id}`);
  };

  const whatsappMessage = siteConfig.whatsappTemplates.productEnquiry(
    product.name,
    `${product.category || ''}${product.badge ? ` - ${product.badge}` : ''}${product.fabric ? `, Fabric: ${product.fabric}` : ''}`
  );

  const currentMainSrc = productImages[activeImageIndex] || productImages[0] || DEFAULT_FALLBACK_IMAGE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-slate-100/90 hover:bg-slate-200 rounded-full transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left: Image Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              {/* Main Image with Zoom Trigger */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm cursor-zoom-in group"
                onClick={() => onOpenLightbox && onOpenLightbox(productImages, activeImageIndex)}
              >
                <img
                  src={currentMainSrc}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-navy-950/80 backdrop-blur-md text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to Zoom</span>
                </div>

                {/* Badge Overlay */}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-navy-950/90 backdrop-blur-md text-gold-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-navy-800 pointer-events-none">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1">
                  {productImages.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-brand-600 shadow-md ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={imgSrc} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Assurance & Spec Strip */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-2 text-xs text-slate-600">
              {product.fabric && (
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    <span>Certified Fabric Specification:</span>
                  </div>
                  <div className="font-semibold text-navy-950 text-xs">
                    {product.fabric} {product.gsm ? `(${product.gsm})` : ''}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/70 px-3 py-1.5 rounded-lg border border-emerald-200/60 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Anti-Shrinkage & Color Fastness Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Category & Wishlist */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider rounded-md border border-brand-200">
                  {product.category || 'Direct Manufacturing'} {product.gender ? `• ${product.gender}` : ''}
                </span>

                <button
                  onClick={() => toggleFavorite(product)}
                  className={`p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                    favorited
                      ? 'text-red-600 bg-red-50'
                      : 'text-slate-500 hover:text-red-500 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500' : ''}`} />
                  <span>{favorited ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-navy-950">
                  {product.name}
                </h3>
                {product.tagline && (
                  <p className="text-xs font-semibold text-brand-600 mt-0.5">
                    {product.tagline}
                  </p>
                )}
              </div>

              {/* Manufacturing MOQ & Lead Time Badges */}
              {(product.minOrder || product.leadTime) && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {product.minOrder && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                        <Package className="w-3 h-3 text-brand-600" />
                        <span>Minimum Order</span>
                      </span>
                      <span className="font-bold text-navy-950 text-xs mt-0.5 block">
                        {product.minOrder}
                      </span>
                    </div>
                  )}
                  {product.leadTime && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold-600" />
                        <span>Production Lead Time</span>
                      </span>
                      <span className="font-bold text-navy-950 text-xs mt-0.5 block">
                        ⚡ {product.leadTime}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Notice */}
              <div className="flex items-center gap-2 bg-brand-50/70 border border-brand-200/80 px-3 py-1.5 rounded-lg w-fit">
                <span className="text-xs font-bold text-brand-800">Wholesale Institutional Pricing:</span>
                <span className="text-xs text-brand-700 font-semibold">Provided on Enquiry / Tender</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Sizes Available + Size Guide Trigger */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    <span>Available Sizes</span>
                    {onOpenSizeGuide && (
                      <button
                        onClick={onOpenSizeGuide}
                        className="text-brand-600 hover:text-brand-700 flex items-center gap-1 font-semibold normal-case text-xs cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>View Size Chart</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features / Specifications List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Key Specifications & Features:
                  </div>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleQuoteClick}
                  className="w-full sm:flex-1 py-3 bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-700 hover:to-navy-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Institutional Quote</span>
                </button>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* View in Full Catalog button */}
              <button
                onClick={handleViewInCatalog}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Lookbook in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
