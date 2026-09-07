import React, { useState } from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  Star,
  Building2,
  Sparkles
} from 'lucide-react';
import { deleteStoredReview, clearAllStoredReviews } from '../utils/reviewStorage';

export const ManageReviewsModal = ({ isOpen, onClose, reviews = [], onReviewsChanged }) => {
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDeleteSingle = (id) => {
    deleteStoredReview(id);
    setReviewToDelete(null);
    if (onReviewsChanged) onReviewsChanged();
  };

  const handleClearAll = () => {
    clearAllStoredReviews();
    setShowClearConfirm(false);
    if (onReviewsChanged) onReviewsChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-navy-900 border border-navy-700/90 text-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 my-auto animate-slide-up flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-navy-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Owner Control Panel</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              Manage & Delete Reviews ({reviews.length})
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              Review, moderate, or remove any feedback submitted by clients or testers.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors border border-navy-700 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body / List of Reviews */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-navy-800 flex items-center justify-center text-slate-500 mb-3">
                <Star className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-300 text-sm">No reviews currently in storage.</p>
              <p className="text-xs text-slate-500">All submitted reviews will appear here where you can manage or delete them.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-navy-950/70 border border-navy-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-navy-700 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex text-gold-400">
                      {[...Array(Math.min(5, Math.max(1, Math.round(Number(rev.rating) || 5))))].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-white">{rev.name}</span>
                    {rev.role && (
                      <span className="text-xs text-brand-400 font-medium">({rev.role})</span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rev.school || 'Educational Institute'}</span>
                    {rev.location && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">{rev.location}</span>
                      </>
                    )}
                  </div>

                  {rev.title && (
                    <div className="text-xs font-semibold text-slate-200 italic">
                      "{rev.title}"
                    </div>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {rev.content}
                  </p>
                </div>

                {/* Delete Button for this Review */}
                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setReviewToDelete(rev)}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-600/40 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Delete this review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-navy-800 bg-navy-950/40 flex items-center justify-between gap-4 shrink-0">
          {reviews.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Reviews</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-6 py-2.5 bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-navy-700"
          >
            Done
          </button>
        </div>

      </div>

      {/* Confirmation Dialog for Single Delete */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-rose-600/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-600/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-white">Delete Review?</h4>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-navy-950 p-3.5 rounded-xl border border-navy-800">
              Are you sure you want to permanently remove the review from <strong>"{reviewToDelete.name}"</strong> ({reviewToDelete.school})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSingle(reviewToDelete.id)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-rose-600/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-600/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-white">Clear All Reviews?</h4>
                <p className="text-xs text-slate-400">Permanently delete all {reviews.length} reviews.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-navy-950 p-3.5 rounded-xl border border-navy-800">
              This will reset the review section to 0 reviews (empty state).
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
