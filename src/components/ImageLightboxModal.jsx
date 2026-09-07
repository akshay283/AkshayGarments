import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageLightboxModal = ({ images, activeIndex, isOpen, onClose, onIndexChange }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onIndexChange(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
      }
      if (e.key === 'ArrowRight') {
        onIndexChange(activeIndex < images.length - 1 ? activeIndex + 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images, onClose, onIndexChange]);

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

  if (!isOpen || !images || images.length === 0) return null;

  const currentImg = typeof images[activeIndex] === 'string' ? images[activeIndex] : images[activeIndex]?.image;
  const currentCaption = typeof images[activeIndex] === 'object' ? images[activeIndex]?.caption || images[activeIndex]?.title : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 backdrop-blur-lg p-4"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-20 pointer-events-none">
        <div className="bg-navy-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-semibold">
          {activeIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Close (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-20"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main High-Res Image */}
      <div 
        className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImg}
          alt=""
          className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl animate-fade-in"
        />

        {currentCaption && (
          <div className="text-slate-300 text-xs sm:text-sm text-center mt-3 bg-navy-900/60 backdrop-blur-md px-4 py-2 rounded-xl">
            {currentCaption}
          </div>
        )}
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(activeIndex < images.length - 1 ? activeIndex + 1 : 0);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-20"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
