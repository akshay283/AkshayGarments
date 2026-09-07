import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Award,
  PenTool,
  Copy,
  Check
} from 'lucide-react';
import {
  getStoredReviews,
  REVIEW_UPDATE_EVENT,
  copyReviewLinkToClipboard
} from '../utils/reviewStorage';
import { SubmitReviewModal } from './SubmitReviewModal';
import { useQuoteModal } from '../context/QuoteModalContext';

export const ReviewSlider = ({
  title = "Verified Customer Reviews & Feedback",
  subtitle = "Direct feedback from Principals, Administrative Officers, Event Coordinators & Clients"
}) => {
  // Initialize with stored reviews immediately to prevent any empty render flash
  const [reviews, setReviews] = useState(() => {
    try {
      return getStoredReviews() || [];
    } catch (e) {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const autoPlayRef = useRef(null);
  const { openQuoteModal } = useQuoteModal();

  // Load reviews and subscribe to real-time events
  const loadReviews = () => {
    try {
      const list = getStoredReviews() || [];
      setReviews(list);
      setCurrentIndex((prev) => (prev >= list.length ? 0 : prev));
    } catch (err) {
      console.error('Error reloading reviews:', err);
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();

    const handleUpdate = () => {
      loadReviews();
    };

    const handleStorage = (e) => {
      if (e.key === 'akshay_garments_reviews_v1') {
        loadReviews();
      }
    };

    window.addEventListener(REVIEW_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    // Auto-open review modal if URL hash or search param indicates review action
    const checkUrlForReview = () => {
      if (typeof window !== 'undefined') {
        const hash = (window.location.hash || '').toLowerCase();
        const search = (window.location.search || '').toLowerCase();
        if (
          hash === '#write-review' ||
          hash === '#review' ||
          hash === '#reviews' ||
          search.includes('review=true') ||
          search.includes('action=review')
        ) {
          setIsReviewModalOpen(true);
        }
      }
    };

    checkUrlForReview();
    window.addEventListener('hashchange', checkUrlForReview);

    return () => {
      window.removeEventListener(REVIEW_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hashchange', checkUrlForReview);
    };
  }, []);

  const totalReviews = Array.isArray(reviews) ? reviews.length : 0;

  const nextSlide = () => {
    if (totalReviews > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }
  };

  const prevSlide = () => {
    if (totalReviews > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
    }
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < totalReviews) {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (isAutoPlaying && totalReviews > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, currentIndex, totalReviews]);

  const handleCopyLink = async () => {
    const success = await copyReviewLinkToClipboard();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Safe active review resolution
  const activeReview = (totalReviews > 0 && reviews[currentIndex]) ? reviews[currentIndex] : (reviews[0] || null);
  const safeRating = Math.min(5, Math.max(1, Math.round(Number(activeReview?.rating) || 5)));

  return (
    <section
      id="reviews-section"
      className="relative bg-gradient-to-b from-slate-900 via-navy-950 to-navy-900 text-white py-10 sm:py-14 rounded-2xl overflow-hidden border border-navy-800 shadow-xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Subtle Background Glows */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-wider">
            <Award className="w-3 h-3" />
            <span>Customer Testimonials & Ratings</span>
          </div>

          <h2 className="font-display font-extrabold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            {title}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Dynamic Presentation: Empty State OR Live Reviews Slider */}
        {totalReviews === 0 || !activeReview ? (
          /* --- CLEAN COMPACT EMPTY STATE (When 0 reviews exist) --- */
          <div className="max-w-lg mx-auto bg-navy-900/80 backdrop-blur-xl border border-dashed border-navy-700 rounded-2xl p-6 sm:p-8 text-center shadow-xl relative">
            <h3 className="font-display font-black text-lg sm:text-xl text-white mb-2">
              Review Akshay Garments!
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed max-w-md mx-auto mb-5">
              Are you an institutional client, school principal, coordinator, or buyer?
              Click below to submit your rating and review.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Submit Your Review Now</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-navy-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gold-400" />
                    <span>Copy Review Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* --- COMPACT SMALL BOX REVIEWS SLIDER --- */
          <div className="max-w-2xl mx-auto">

            <div className="bg-navy-900/85 backdrop-blur-xl border border-navy-700/80 rounded-2xl p-5 sm:p-7 shadow-xl relative transition-all duration-500">

              {/* Top Row: Rating Stars + Verified Badge + Quote Icon */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(safeRating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400 drop-shadow-sm" />
                  ))}
                  <span className="ml-1.5 text-[11px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/30">
                    {Number(activeReview?.rating || 5).toFixed(1)} Rating
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Verified Review</span>
                  </span>

                  <Quote className="w-6 h-6 text-brand-500/25" />
                </div>
              </div>

              {/* Review Title if present */}
              {activeReview?.title && (
                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                  "{activeReview.title}"
                </h3>
              )}

              {/* Main Review Quote */}
              <blockquote className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed italic mb-4">
                "{activeReview?.content || 'Exceptional quality uniform manufacturer.'}"
              </blockquote>

              {/* Tags if present */}
              {activeReview?.tags && Array.isArray(activeReview.tags) && activeReview.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-4 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Manufactured:</span>
                  {activeReview.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-brand-300 bg-brand-950/70 border border-brand-500/30 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Profile Footer */}
              <div className="pt-4 border-t border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                  {activeReview?.avatar ? (
                    <img
                      src={activeReview.avatar}
                      alt={activeReview.name || 'Client'}
                      className="w-10 h-10 rounded-xl object-cover border border-brand-500 shadow-sm ring-2 ring-navy-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-navy-800 flex items-center justify-center font-display font-bold text-sm text-white border border-brand-400 ring-2 ring-navy-800 shadow-sm">
                      {activeReview?.initials || 'AG'}
                    </div>
                  )}

                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {activeReview?.name || 'Verified Client'}
                    </h4>
                    <div className="text-[11px] text-brand-400 font-semibold">
                      {activeReview?.role || 'Partner'} {activeReview?.school ? `• ${activeReview.school}` : ''}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{activeReview?.location || 'India'}</span>
                      {activeReview?.dateFormatted && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">{activeReview.dateFormatted}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slider Prev / Next Controls */}
                {totalReviews > 1 && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous Review"
                      className="p-2 rounded-lg bg-navy-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shadow-sm active:scale-90 border border-navy-700 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-[11px] font-bold text-slate-400 font-mono px-1">
                      <span className="text-white">{currentIndex + 1}</span> / {totalReviews}
                    </div>
                    <button
                      onClick={nextSlide}
                      aria-label="Next Review"
                      className="p-2 rounded-lg bg-navy-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shadow-sm active:scale-90 border border-navy-700 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Slider Pagination Dots */}
            {totalReviews > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentIndex === idx
                        ? 'w-5 h-1.5 bg-brand-500 shadow-sm shadow-brand-500/50'
                        : 'w-1.5 h-1.5 bg-navy-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Review Submission Modal Dialog */}
      <SubmitReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => {
          loadReviews();
          setCurrentIndex(0);
        }}
      />

    </section>
  );
};
