/**
 * Persistent Customer Review Storage & Dynamic Link Generator
 * Automatically works on localhost, Vite dev server, custom domains, and Netlify deployments.
 */

import { testimonials as defaultTestimonials } from '../data/testimonials';

const STORAGE_KEY = 'akshay_garments_reviews_v1';
export const REVIEW_UPDATE_EVENT = 'akshay_reviews_updated';

/**
 * Retrieve all reviews from persistent local storage.
 * Defaults to empty dataset if none exist.
 */
export const getStoredReviews = () => {
  if (typeof window === 'undefined') return defaultTestimonials || [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTestimonials || [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTestimonials || [];
  } catch (error) {
    console.error('Error reading stored reviews from localStorage:', error);
    return defaultTestimonials || [];
  }
};

/**
 * Save a new customer review to persistent storage and emit a live update event.
 */
export const saveStoredReview = (reviewData) => {
  if (typeof window === 'undefined') return null;
  try {
    const currentReviews = getStoredReviews();
    
    // Generate clean avatar fallback if none provided
    const nameFormatted = (reviewData.name || 'Valued Partner').trim();
    const initials = nameFormatted
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AG';

    const avatarUrl = reviewData.avatar || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(nameFormatted)}&background=025ba2&color=ffffff&bold=true&size=128`;

    const newReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: nameFormatted,
      role: (reviewData.role || 'Institution Partner').trim(),
      school: (reviewData.school || 'Premier Educational Institution').trim(),
      location: (reviewData.location || 'India').trim(),
      avatar: avatarUrl,
      initials: initials,
      rating: Number(reviewData.rating) || 5,
      title: (reviewData.title || '').trim(),
      content: (reviewData.content || '').trim(),
      tags: Array.isArray(reviewData.tags) && reviewData.tags.length > 0 ? reviewData.tags : ['Uniform Manufacturing'],
      studentsCount: reviewData.studentsCount ? reviewData.studentsCount.trim() : 'Verified Client',
      verified: true,
      createdAt: new Date().toISOString(),
      dateFormatted: new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date())
    };

    const updatedReviews = [newReview, ...currentReviews];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));

    // Dispatch custom event for real-time reactivity in current tab
    window.dispatchEvent(new CustomEvent(REVIEW_UPDATE_EVENT, { detail: newReview }));

    return newReview;
  } catch (error) {
    console.error('Error saving review to localStorage:', error);
    return null;
  }
};

/**
 * Generates the live shareable URL for collecting reviews.
 * Seamlessly resolves to the current Netlify domain, custom domain, or localhost.
 */
export const getReviewShareUrl = () => {
  if (typeof window === 'undefined') return 'https://akshaygarments.netlify.app/#write-review';
  const origin = window.location.origin;
  return `${origin}/#write-review`;
};

/**
 * Generates a pre-filled WhatsApp share link to invite school principals,
 * event coordinators, and buyers to submit their review.
 */
export const getReviewWhatsAppShareUrl = () => {
  const shareUrl = getReviewShareUrl();
  const message = `Namaste! We value your partnership with Akshay Garments. Please take a moment to share your review and feedback about our uniform quality & service here:\n\n👉 ${shareUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

/**
 * Copy shareable review link to clipboard with Promise return
 */
export const copyReviewLinkToClipboard = async () => {
  const url = getReviewShareUrl();
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.warn('Clipboard API write failed, attempting fallback...', err);
    }
  }

  // Fallback for older browsers or restricted iframe environments
  try {
    const tempInput = document.createElement('textarea');
    tempInput.value = url;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(tempInput);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
};

/**
 * Delete a specific review (optional administrative control)
 */
export const deleteStoredReview = (id) => {
  if (typeof window === 'undefined') return;
  try {
    const currentReviews = getStoredReviews();
    const filtered = currentReviews.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(REVIEW_UPDATE_EVENT, { detail: { id, deleted: true } }));
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};

/**
 * Clear all stored reviews
 */
export const clearAllStoredReviews = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(REVIEW_UPDATE_EVENT, { detail: { cleared: true } }));
  } catch (error) {
    console.error('Error clearing reviews:', error);
  }
};
