import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Building2,
  User,
  MapPin,
  CheckCircle2,
  Send,
  Award,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveStoredReview, copyReviewLinkToClipboard, getReviewShareUrl } from '../utils/reviewStorage';
import { ReviewSlider } from '../components/ReviewSlider';

const AVAILABLE_TAGS = [
  'School Shirts',
  'Pants & Trousers',
  'School Blazers',
  'Sports Kits',
  'T-Shirts & Polos',
  'Punjabi & Salwar',
  'Vascoat & Tunics',
  'Lab Aprons',
  'Driver Uniforms',
  'Bulk Supply'
];

const RATING_LABELS = {
  1: '1 Star - Needs Improvement',
  2: '2 Stars - Fair Quality',
  3: '3 Stars - Good & Satisfactory',
  4: '4 Stars - Very Good Quality & Fit',
  5: '5 Stars - Outstanding / Highly Recommended'
};

export const ReviewPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    role: 'Principal',
    school: '',
    location: '',
    rating: 5,
    title: '',
    content: '',
    studentsCount: '',
    tags: ['School Shirts', 'Pants & Trousers']
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Submit Institutional Review & Feedback | Akshay Garments';
  }, []);

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
      setErrorMsg('Please write a brief review testimonial.');
      return;
    }

    setIsSubmitting(true);

    try {
      saveStoredReview(formData);

      // Fire celebratory confetti
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 100,
            spread: 75,
            origin: { y: 0.5 }
          });
        }
      } catch (confettiErr) {
        console.log('Confetti effect bypassed:', confettiErr);
      }

      setIsSuccess(true);
      setIsSubmitting(false);

      // Scroll to confirmation message
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting review:', err);
      setErrorMsg('An error occurred while saving your review. Please try again.');
      setIsSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating || formData.rating;

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden py-12 sm:py-20">
      {/* Decorative Glow Background */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-navy-950/80 px-4 py-2 rounded-xl border border-navy-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-navy-800/80 px-4 py-2 rounded-xl border border-navy-700 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Review URL Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gold-400" />
                <span>Share Review Link</span>
              </>
            )}
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Client Feedback & Testimonials</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Share Your Review
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your feedback helps educational institutions and organizations choose quality uniform manufacturing with confidence.
          </p>
        </div>

        {/* Success Confirmation Card */}
        {isSuccess ? (
          <div className="bg-navy-950/90 border border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-slide-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                Thank You for Your Review!
              </h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Your testimonial for <strong>"{formData.school}"</strong> has been recorded and published to our verified reviews showcase.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                View on Homepage
              </Link>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    name: '',
                    role: 'Principal',
                    school: '',
                    location: '',
                    rating: 5,
                    title: '',
                    content: '',
                    studentsCount: '',
                    tags: ['School Shirts', 'Pants & Trousers']
                  });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-navy-700 transition-all cursor-pointer"
              >
                Submit Another Review
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form Card */
          <div className="bg-navy-950/90 border border-navy-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating Selector */}
              <div className="bg-navy-900/90 border border-navy-800 p-6 rounded-2xl text-center space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Overall Rating <span className="text-gold-400">*</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-gold-400 hover:scale-125 transition-transform focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                          star <= currentDisplayRating
                            ? 'fill-gold-400 text-gold-400 drop-shadow-md'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-gold-400">
                  {RATING_LABELS[currentDisplayRating]}
                </div>
              </div>

              {/* Personal & School Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Your Full Name <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Designation / Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Your Role / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Principal, Admin Officer, Trustee, Parent"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* School / Institution */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    School / Organization Name <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi Public School / St. Mary's Academy"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Location / City */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    City & State
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad, Telangana"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

              </div>

              {/* Student Count / Batch Size (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Approx. Student Strength / Order Batch (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,200+ Students or 800 Sets"
                  value={formData.studentsCount}
                  onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Review Headline / Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flawless stitching, durable cloth and timely bulk supply!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Review Testimonial Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Your Detailed Feedback / Testimonial <span className="text-gold-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience regarding fabric quality, stitching precision, sizing fit, delivery timeline, and staff support..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-navy-800 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Manufactured Items Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Select Uniform Items Manufactured for You:
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const selected = formData.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selected
                            ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-sm'
                            : 'bg-navy-900 border-navy-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Review...' : 'Publish Verified Review'}</span>
              </button>

            </form>
          </div>
        )}

        {/* Existing Testimonials Preview */}
        <div className="pt-10">
          <ReviewSlider
            title="Read What Other Schools Say"
            subtitle="Explore genuine ratings and testimonials from institution leaders across the country"
          />
        </div>

      </div>
    </div>
  );
};
