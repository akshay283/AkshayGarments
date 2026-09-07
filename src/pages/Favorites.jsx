import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  FileText,
  ShoppingBag
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Favorites = ({ onQuickView }) => {
  const { favorites, removeFavorite, clearFavorites, count } = useFavorites();
  const { openQuoteModal } = useQuoteModal();

  const handleBatchQuote = () => {
    const itemsSummary = favorites.map(f => f.name).join(', ');
    openQuoteModal({
      productName: `Wishlist Set (${count} Items)`,
      category: 'Saved Wishlist',
      type: 'school-uniform',
      notes: `Batch quotation requested for: ${itemsSummary}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-red-500" />
            <span>Saved Uniforms & Products ({count})</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-navy-950">
            Your Shortlisted Uniforms
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Review your saved uniform models and garments or request a combined institutional quote.
          </p>
        </div>

        {count > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Wishlist</span>
            </button>
            <button
              onClick={handleBatchQuote}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request Quote for All ({count})</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {count === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-20 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="font-display font-bold text-2xl text-navy-950">
            Your Wishlist is Empty
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Click the heart icon on any school shirt, blazer, skirt, or fabric while browsing to shortlist them here.
          </p>
          <div className="pt-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Digital Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={item.images?.[0] || item.image || item.textureImage}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFavorite(item.id)}
                  aria-label="Remove item"
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full shadow-md transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand-700 mb-1">
                    {item.category || item.material || 'Uniform'}
                  </div>
                  <h4 className="font-display font-bold text-base text-navy-950">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.shortDesc || item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-brand-700">
                    Custom Quote On Request
                  </span>
                  <button
                    onClick={() => {
                      if (onQuickView && item.images) {
                        onQuickView(item);
                      } else {
                        openQuoteModal({ productName: item.name, category: item.category, type: 'school-uniform' });
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View / Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
