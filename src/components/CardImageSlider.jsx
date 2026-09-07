import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers, ZoomIn } from 'lucide-react';
import { resolveImagePath, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils';
import { ImageLightboxModal } from './ImageLightboxModal';

export const CardImageSlider = ({ 
  images = [], 
  alt = 'Garment photo', 
  interval = 3500,
  className = "w-full h-full object-cover",
  aspectRatioClass = "aspect-[16/11]",
  enableLightbox = true
}) => {
  // Normalize images to an initial list
  const initialList = Array.isArray(images) && images.length > 0 
    ? images 
    : typeof images === 'string' && images 
      ? [images] 
      : [DEFAULT_FALLBACK_IMAGE];

  const [validImages, setValidImages] = useState(initialList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  // Validate and filter available images dynamically
  useEffect(() => {
    let isMounted = true;
    const candidates = Array.isArray(images) && images.length > 0 ? images : [DEFAULT_FALLBACK_IMAGE];
    
    // If only 1 image or already fallback, no need to probe
    if (candidates.length <= 1) {
      setValidImages(candidates);
      return;
    }

    const verified = [];
    let pending = candidates.length;

    candidates.forEach((src) => {
      const resolved = resolveImagePath(src);
      const img = new Image();
      img.onload = () => {
        if (isMounted) {
          verified.push(src);
          pending--;
          if (pending === 0) {
            setValidImages(verified.length > 0 ? verified : [DEFAULT_FALLBACK_IMAGE]);
          }
        }
      };
      img.onerror = () => {
        if (isMounted) {
          pending--;
          if (pending === 0) {
            setValidImages(verified.length > 0 ? verified : [DEFAULT_FALLBACK_IMAGE]);
          }
        }
      };
      img.src = resolved;
    });

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(images)]);

  const total = validImages.length;

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const selectImage = (idx, e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(idx);
  };

  const handleCardClick = (e) => {
    if (!enableLightbox) return;
    setIsLightboxOpen(true);
  };

  // Auto-slide effect
  useEffect(() => {
    if (total <= 1 || isHovered || isLightboxOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isHovered, isLightboxOpen, interval]);

  const activeSrc = validImages[currentIndex]
    ? resolveImagePath(validImages[currentIndex])
    : DEFAULT_FALLBACK_IMAGE;

  return (
    <>
      <div 
        className={`relative ${aspectRatioClass} overflow-hidden bg-slate-100 group/slider select-none cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        title="Click to open full-size image popup"
      >
        {/* Sliding / Crossfading Images */}
        <img
          src={activeSrc}
          alt={`${alt} - View ${currentIndex + 1}`}
          onError={() => {
            setValidImages((prev) => {
              const next = prev.filter((_, idx) => idx !== currentIndex);
              return next.length > 0 ? next : [DEFAULT_FALLBACK_IMAGE];
            });
          }}
          loading="lazy"
          className={`${className} transition-transform duration-700 ease-out group-hover:scale-105`}
        />

        {/* Subtle Gradient Overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Click to Zoom Overlay Indicator on Hover */}
        <div className="absolute inset-0 bg-navy-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-navy-950/85 backdrop-blur-md text-white text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
            <span>Click to Enlarge</span>
          </div>
        </div>

        {/* Multiple Photos Indicator Badge (e.g. Set 1 of 5) */}
        {total > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-navy-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider border border-white/10 flex items-center gap-1 shadow-sm pointer-events-none">
            <Layers className="w-2.5 h-2.5 text-gold-400" />
            <span>{currentIndex + 1}/{total} Photos</span>
          </div>
        )}

        {/* Interactive Prev / Next Navigation Controls */}
        {total > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-navy-950/70 hover:bg-brand-600 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all shadow-md active:scale-90 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-navy-950/70 hover:bg-brand-600 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all shadow-md active:scale-90 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicator Navigation Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-navy-950/60 backdrop-blur-md border border-white/10">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => selectImage(idx, e)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === idx
                      ? 'w-4 h-1.5 bg-brand-400 shadow-xs'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Full-screen Lightbox Popup Modal */}
      {enableLightbox && (
        <ImageLightboxModal
          images={validImages.map((img) => ({
            image: resolveImagePath(img),
            caption: `${alt} (${currentIndex + 1} of ${validImages.length})`
          }))}
          activeIndex={currentIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          onIndexChange={(newIdx) => setCurrentIndex(newIdx)}
        />
      )}
    </>
  );
};
