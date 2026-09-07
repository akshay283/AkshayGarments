import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Building2,
  User,
  MapPin,
  CheckCircle2,
  Send,
  Award,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveStoredReview, copyReviewLinkToClipboard } from '../utils/reviewStorage';

const AVAILABLE_TAGS = [
  'School Shirts',
  'Pants',
  'Blazers',
  'Punjabi',
  'Vascoat',
  'Custom Event T-Shirt',
  'Shorts',
  'Pizama',
  'Sports Kits',
  'Bulk School Supply'
];

const RATING_LABELS = {
  1: '1 Star - Needs Improvement',
  2: '2 Stars - Fair Quality',
  3: '3 Stars - Good & Satisfactory',
  4: '4 Stars - Very Good Quality & Fit',
  5: '5 Stars - Outstanding / Highly Recommended'
};

export const SubmitReviewModal = ({ isOpen, onClose, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    school: '',
    location: '',
    rating: 5,
    title: '',
    content: '',
    studentsCount: '',
    tags: ['School Shirts', 'Pants']
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setErrorMsg('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      if (exists) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const handleCopyLink = async () => {
    const success = await copyReviewLinkToClipboard();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.school.trim()) {
      setErrorMsg('Please enter your school, college, or organization name.');
      return;
    }
    if (!formData.content.trim()) {
      setErrorMsg('Please write a brief review of your experience.');
      return;
    }

    setIsSubmitting(true);

    try {
      const savedReview = saveStoredReview(formData);
      
      // Fire celebration confetti safely
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (confettiErr) {
        console.log('Confetti effect bypassed:', confettiErr);
      }

      setIsSuccess(true);
      setIsSubmitting(false);

      if (onReviewSubmitted) {
        onReviewSubmitted(savedReview);
      }

      // Smooth scroll to reviews section
      setTimeout(() => {
        const reviewElem = document.getElementById('reviews-section') || document.getElementById('reviews');
        if (reviewElem) {
          reviewElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 800);

      // Auto close after brief delay
      setTimeout(() => {
        onClose();
        // Reset form
        setFormData({
          name: '',
          role: '',
          school: '',
          location: '',
          rating: 5,
          title: '',
          content: '',
          studentsCount: '',
          tags: ['School Shirts', 'Pants']
        });
        setIsSuccess(false);
      }, 2200);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save review. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-navy-900 border border-navy-700/90 text-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 my-auto animate-slide-up">
        
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="p-6 sm:p-8 border-b border-navy-800 relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Review Submission</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Share Your Experience
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              Your feedback helps schools, colleges, and event organizers discover our quality uniform manufacturing.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-800/80 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors border border-navy-700 shrink-0"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto relative z-10">
          
          {isSuccess ? (
            <div className="text-center py-10 sm:py-14 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-display font-black text-2xl sm:text-3xl text-white">
                Thank You For Your Review!
              </h4>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Your review has been successfully submitted and is now published directly in the verified reviews section.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  View on Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating Selector */}
              <div className="bg-navy-950/60 p-5 rounded-2xl border border-navy-800 space-y-2 text-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-400">
                  Overall Rating *
                </label>
                
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || formData.rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            isFilled
                              ? 'fill-gold-400 text-gold-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                              : 'text-navy-700 hover:text-navy-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-semibold text-slate-300">
                  {RATING_LABELS[hoverRating || formData.rating]}
                </div>
              </div>

              {/* Personal & Institutional Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Anirudh Sengupta / Rajesh Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Role / Designation */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Role / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Principal, Admin Officer, Event Lead, PTA"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* School / College Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    School / College / Organization <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Xavier's International School"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    City & State
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Ahmedabad, Gujarat / Pune, MH"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

              </div>

              {/* Review Headline / Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unmatched Fabric Durability & Timely Bulk Supply"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Detailed Review Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Your Detailed Review / Experience <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about the fabric quality, stitching, sizing fit, delivery timeline, or customer support..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-4 bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none leading-relaxed"
                />
              </div>

              {/* Multi-Select Tags for Manufactured Items */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Select Items Manufactured / Supplied For You:
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = formData.tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                          isSelected
                            ? 'bg-brand-500/20 border-brand-400 text-brand-300 shadow-sm'
                            : 'bg-navy-950/60 border-navy-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {tag} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3.5 bg-rose-950/70 border border-rose-600/50 rounded-xl text-rose-200 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-navy-800">
                
                {/* Shareable Link Helper */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-800/80 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-navy-700 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Review Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gold-400" />
                      <span>Copy Direct Review Link</span>
                    </>
                  )}
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing...' : 'Submit & Publish Review'}</span>
                </button>

              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
