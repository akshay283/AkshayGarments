/**
 * Universal Image Path & Fallback Resolver
 * Automatically handles Vite development server, static production builds, and direct file:/// opening
 */

export const DEFAULT_FALLBACK_IMAGE = '/images/manufacture/Home_Dashboard/home.png';

export const resolveImagePath = (src, fallback = DEFAULT_FALLBACK_IMAGE) => {
  if (!src) return fallback;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  
  if (typeof window !== 'undefined' && (window.location.protocol === 'file:' || !window.location.protocol)) {
    if (src.startsWith('/images/')) return './public' + src;
    if (src.startsWith('images/')) return './public/' + src;
    if (src.startsWith('/public/')) return '.' + src;
    if (src.startsWith('public/')) return './' + src;
    return src;
  }
  
  if (src.startsWith('/public/')) return src.replace('/public', '');
  if (src.startsWith('public/')) return src.replace('public', '');
  if (!src.startsWith('/')) return '/' + src;
  return src;
};

