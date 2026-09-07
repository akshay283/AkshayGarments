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
  Check, 
  MessageCircle, 
  Trash2, 
  Settings, 
  AlertTriangle
} from 'lucide-react';
import { 
  getStoredReviews, 
  REVIEW_UPDATE_EVENT, 
  getReviewWhatsAppShareUrl, 
  copyReviewLinkToClipboard,
  deleteStoredReview
} from '../utils/reviewStorage';
import { SubmitReviewModal } from './SubmitReviewModal';
import { ManageReviewsModal } from './ManageReviewsModal';
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
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [reviewToDeleteDirect, setReviewToDeleteDirect] = useState(null);
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
        } else if (hash === '#manage-reviews') {
          setIsManageModalOpen(true);
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

  const handleDeleteActiveReview = (id) => {
    deleteStoredReview(id);
    setReviewToDeleteDirect(null);
    loadReviews();
  };

  // Safe active review resolution
  const activeReview = (totalReviews > 0 && reviews[currentIndex]) ? reviews[currentIndex] : (reviews[0] || null);
  const safeRating = Math.min(5, Math.max(1, Math.round(Number(activeReview?.rating) || 5)));

  return (
    <section 
      id="reviews-section"
      className="relative bg-gradient-to-b from-slate-900 via-navy-950 to-navy-900 text-white py-16 sm:py-24 rounded-3xl overflow-hidden border border-navy-800 shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Decorative Gradients & Mesh Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Customer Testimonials & Ratings</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {title}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Action Bar: Write Review, Copy Link, WhatsApp & Manage Reviews */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            
            {/* Write Review Button */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>

            {/* Copy Shareable Link Button */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/90 hover:bg-navy-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-navy-700 transition-all cursor-pointer"
              title="Copy shareable link to send to clients via WhatsApp or Email"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Review Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gold-400" />
                  <span>Copy Review Link</span>
                </>
              )}
            </button>

            {/* WhatsApp Share Button */}
            <a
              href={getReviewWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold border border-emerald-600/50 transition-all"
              title="Send review request link on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </a>

            {/* Owner Control: Manage Reviews Button */}
            {totalReviews > 0 && (
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-800/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-medium border border-navy-700/80 hover:border-rose-700/50 transition-all cursor-pointer"
                title="Owner Control: Delete or moderate reviews"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage / Delete ({totalReviews})</span>
              </button>
            )}

          </div>
        </div>

        {/* Dynamic Presentation: Empty State OR Live Reviews Slider */}
        {totalReviews === 0 || !activeReview ? (
          /* --- CLEAN EMPTY STATE (When 0 reviews exist) --- */
          <div className="max-w-2xl mx-auto bg-navy-900/80 backdrop-blur-xl border border-dashed border-navy-700 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4 shadow-inner">
              <Star className="w-8 h-8 fill-gold-400" />
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-2">
              Be the First to Review Akshay Garments!
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto mb-6">
              Are you an institutional client, school principal, coordinator, or buyer? 
              Click below to submit your rating and review, or share the direct link with your committee.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>Submit Your Review Now</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-6 py-3.5 bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-navy-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gold-400" />
                    <span>Copy Review Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Note on Netlify deployment */}
            <div className="mt-8 pt-6 border-t border-navy-800/80 text-[11px] text-slate-400">
              💡 <span className="font-semibold text-slate-300">Tip:</span> When you deploy this website to Netlify, clicking <strong>"Copy Review Link"</strong> will generate your live Netlify URL (e.g. <code className="bg-navy-950 px-1.5 py-0.5 rounded text-brand-300">https://your-site.netlify.app/#write-review</code>) which opens the review form directly for any recipient.
            </div>
          </div>
        ) : (
          /* --- REVIEWS SLIDER (When >= 1 reviews exist) --- */
          <div className="max-w-4xl mx-auto">
            
            <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/80 rounded-3xl p-6 sm:p-12 shadow-2xl relative transition-all duration-500">
              
              {/* Top Row: Rating Stars + Verified Badge + Delete Button */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(safeRating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400 drop-shadow-sm" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/30">
                    {Number(activeReview?.rating || 5).toFixed(1)} Rating
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Review</span>
                  </span>

                  {/* Direct Delete Button for Owner */}
                  <button
                    onClick={() => setReviewToDeleteDirect(activeReview)}
                    className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-navy-700 hover:border-rose-600/50 transition-colors"
                    title="Delete this review"
                    aria-label="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-brand-500/20" />
                </div>
              </div>

              {/* Review Title if present */}
              {activeReview?.title && (
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-3">
                  "{activeReview.title}"
                </h3>
              )}

              {/* Main Review Quote */}
              <blockquote className="text-sm sm:text-lg text-slate-200 font-normal leading-relaxed italic mb-8">
                "{activeReview?.content || 'Exceptional quality uniform manufacturer.'}"
              </blockquote>

              {/* Tags if present */}
              {activeReview?.tags && Array.isArray(activeReview.tags) && activeReview.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Manufactured Items:</span>
                  {activeReview.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-brand-300 bg-brand-950/70 border border-brand-500/30 px-2.5 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Profile Footer */}
              <div className="pt-6 border-t border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                  {activeReview?.avatar ? (
                    <img
                      src={activeReview.avatar}
                      alt={activeReview.name || 'Client'}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-md ring-4 ring-navy-800"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-navy-800 flex items-center justify-center font-display font-bold text-lg text-white border-2 border-brand-400 ring-4 ring-navy-800 shadow-md">
                      {activeReview?.initials || 'AG'}
                    </div>
                  )}

                  <div>
                    <h4 className="font-display font-bold text-base text-white">
                      {activeReview?.name || 'Verified Client'}
                    </h4>
                    <div className="text-xs text-brand-400 font-semibold">
                      {activeReview?.role || 'Partner'} {activeReview?.school ? `• ${activeReview.school}` : ''}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{activeReview?.location || 'India'}</span>
                      {activeReview?.dateFormatted && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">{activeReview.dateFormatted}</span>
                        </>
                      )}
                      {activeReview?.studentsCount && (
                        <>
                          <span>•</span>
                          <span className="text-gold-400 font-medium">{activeReview.studentsCount}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slider Prev / Next Controls */}
                {totalReviews > 1 && (
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous Review"
                      className="p-3 rounded-xl bg-navy-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shadow-md active:scale-90 border border-navy-700 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-xs font-bold text-slate-400 font-mono">
                      <span className="text-white">{currentIndex + 1}</span> / {totalReviews}
                    </div>
                    <button
                      onClick={nextSlide}
                      aria-label="Next Review"
                      className="p-3 rounded-xl bg-navy-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shadow-md active:scale-90 border border-navy-700 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Slider Pagination Dots */}
            {totalReviews > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-8">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentIndex === idx
                        ? 'w-8 h-2.5 bg-brand-500 shadow-md shadow-brand-500/50'
                        : 'w-2.5 h-2.5 bg-navy-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Bottom Quick Action Banner */}
        <div className="mt-14 max-w-2xl mx-auto text-center p-6 bg-navy-900/60 rounded-2xl border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-0.5">
            <div className="text-xs font-bold text-white">Join 85+ Top Institutions Across India</div>
            <div className="text-[11px] text-slate-400">Request sample swatches and direct manufacturer quotes for your school or event.</div>
          </div>
          <button
            onClick={() => openQuoteModal({ type: 'bulk-school', notes: 'Inquiring after reading partner testimonials' })}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            Get School Quote
          </button>
        </div>

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

      {/* Review Management / Deletion Modal */}
      <ManageReviewsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        reviews={reviews}
        onReviewsChanged={() => {
          loadReviews();
          setCurrentIndex(0);
        }}
      />

      {/* Direct Delete Confirmation Modal for Active Slide */}
      {reviewToDeleteDirect && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-rose-600/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-600/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-white">Delete This Review?</h4>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-navy-950 p-3.5 rounded-xl border border-navy-800">
              Are you sure you want to permanently remove the review from <strong>"{reviewToDeleteDirect.name}"</strong> ({reviewToDeleteDirect.school})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReviewToDeleteDirect(null)}
                className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteActiveReview(reviewToDeleteDirect.id)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
