import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Building2, 
  ArrowRight, 
  ChevronRight,
  Award,
  Clock,
  Package,
  ExternalLink
} from 'lucide-react';
import { manufacturingItems } from '../data/manufacturing';
import { resolveImagePath, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils';

// Common synonyms and alternate terms for garment manufacturing
const SYNONYMS = {
  pant: ['pants', 'trouser', 'trousers', 'bottom', 'bottoms', 'formal pant', 'school pant', 'half-pant'],
  pants: ['pant', 'trouser', 'trousers', 'bottom', 'bottoms', 'formal pants', 'school pants'],
  trouser: ['pant', 'pants', 'trousers', 'bottom', 'bottoms'],
  trousers: ['pant', 'pants', 'trouser', 'bottom', 'bottoms'],
  shirt: ['shirts', 'top', 'buttondown', 'formal shirt', 'school shirt', 'half-sleeve', 'full-sleeve'],
  shirts: ['shirt', 'top', 'buttondown', 'formal shirts', 'school shirts'],
  blazer: ['blazers', 'coat', 'suit', 'jacket', 'winter blazer', 'school blazer', 'college blazer'],
  blazers: ['blazer', 'coat', 'suit', 'jacket', 'school blazers'],
  tshirt: ['t-shirt', 't-shirts', 'tshirts', 'tee', 'tees', 'polo', 'sports tshirt'],
  't-shirt': ['tshirt', 't-shirts', 'tshirts', 'polo', 'sports tee'],
  polo: ['polos', 'tshirt', 't-shirt', 'corporate polo', 'collar t-shirt'],
  polos: ['polo', 'tshirt', 't-shirt', 'corporate polo'],
  apron: ['aprons', 'lab coat', 'doctor coat', 'medical apron', 'white apron', 'coat'],
  aprons: ['apron', 'lab coat', 'doctor coat', 'medical aprons'],
  driver: ['drivers', 'conductor', 'transport', 'safari', 'safari suit', 'khaki'],
  vascoat: ['waistcoat', 'waistcoats', 'vest', 'nehru jacket', 'sleeveless', 'modi vest'],
  waistcoat: ['vascoat', 'vest', 'nehru jacket', 'sleeveless'],
  punjabi: ['punjabi dress', 'salwar', 'kameez', 'suit', 'kurti', 'girls uniform'],
  pizama: ['pyjama', 'pajama', 'pyjamas', 'track pant', 'track pants', 'track', 'yoga pant'],
  pyjama: ['pizama', 'pajama', 'pyjamas', 'track pant'],
  short: ['shorts', 'half pant', 'half pants', 'bermuda', 'primary shorts'],
  shorts: ['short', 'half pant', 'half pants', 'bermuda'],
  uniform: ['uniforms', 'set', 'dress', 'school uniform', 'college uniform']
};

export const GlobalSearchModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Generate expanded search tokens with plural/singular and synonym expansions
  const getSearchTokens = (q) => {
    if (!q) return [];
    const tokens = [q];
    
    // Singular / Plural variations
    if (q.endsWith('s') && q.length > 2) {
      tokens.push(q.slice(0, -1));
    } else {
      tokens.push(q + 's');
    }

    // Split words if multiple
    const words = q.split(/\s+/).filter(Boolean);
    tokens.push(...words);

    // Synonym expansions
    words.forEach(w => {
      if (SYNONYMS[w]) {
        tokens.push(...SYNONYMS[w]);
      }
    });
    if (SYNONYMS[q]) {
      tokens.push(...SYNONYMS[q]);
    }

    return Array.from(new Set(tokens.map(t => t.toLowerCase())));
  };

  const searchTokens = getSearchTokens(normalizedQuery);

  // Filter Exclusively from Our Manufacturing Capabilities
  const matchedCapabilities = manufacturingItems.filter((item) => {
    // 1. Category Filter matching
    const itemCat = (item.category || '').toLowerCase();
    const itemId = (item.id || '').toLowerCase();
    const filterLower = selectedFilter.toLowerCase();

    let matchesFilter = filterLower === 'all';
    if (!matchesFilter) {
      matchesFilter = 
        itemCat.includes(filterLower) || 
        itemId.includes(filterLower) ||
        (filterLower === 'pant' && (itemId === 'pant' || itemCat.includes('pant') || itemCat.includes('trouser'))) ||
        (filterLower === 'pants' && (itemId === 'pant' || itemCat.includes('pant') || itemCat.includes('trouser'))) ||
        (filterLower === 'shirt' && (itemId === 'school-shirts' || itemCat.includes('shirt'))) ||
        (filterLower === 'tshirt' && (itemId.includes('tshirt') || itemCat.includes('t-shirt')));
    }

    // 2. Query Search matching
    if (!normalizedQuery) return matchesFilter;

    // Search fields
    const haystacks = [
      item.name || '',
      item.category || '',
      item.tagline || '',
      item.badge || '',
      item.description || '',
      item.id || '',
      ...(item.features || [])
    ].map(h => h.toLowerCase());

    const matchesQuery = searchTokens.some(token => 
      haystacks.some(text => text.includes(token))
    );

    return matchesFilter && matchesQuery;
  });

  const handleItemClick = (item) => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(item);
    } else {
      navigate(`/catalog?item=${item.id}`);
    }
  };

  const handleDirectCatalogNavigate = (e, item) => {
    e.stopPropagation();
    onClose();
    navigate(`/catalog?item=${item.id}`);
  };

  const quickFilterChips = [
    { label: 'All Capabilities', value: 'All' },
    { label: 'School Shirts', value: 'school-shirts' },
    { label: 'Pants & Trousers', value: 'pant' },
    { label: 'Blazers', value: 'blazer' },
    { label: 'Custom T-Shirts', value: 'custom-event-tshirt' },
    { label: 'Corporate Polos', value: 'corporate-event-tshirt' },
    { label: 'Uniform Sets', value: 'uniforms' },
    { label: 'Doctor Aprons', value: 'doctor-aprons' },
    { label: 'Driver Uniforms', value: 'driver-conductor-dresses' },
    { label: 'Vascoat', value: 'vascoat' },
    { label: 'Punjabi Sets', value: 'punjabi' }
  ];

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    // Auto-reset chip filter to 'All' when typing to ensure global search results
    if (selectedFilter !== 'All') {
      setSelectedFilter('All');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-3 sm:px-4 bg-navy-950/80 backdrop-blur-md transition-all">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/80">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search our manufacturing line (pants, shirts, blazers, polos, aprons)..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none"
          />

          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors shrink-0 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors text-xs font-bold px-2.5 shrink-0 bg-slate-200/60 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Manufacturing Quick Filters Bar */}
        <div className="flex items-center px-4 sm:px-6 py-2.5 bg-slate-100/70 border-b border-slate-100 text-xs font-semibold gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Manufacturing:</span>
          </span>
          {quickFilterChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setSelectedFilter(chip.value)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer text-xs font-medium ${
                selectedFilter === chip.value
                  ? 'bg-navy-950 text-white shadow-sm font-bold' 
                  : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200/80'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Header Count */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-brand-700">
              <Award className="w-3.5 h-3.5" />
              <span>Our Manufacturing Capabilities ({matchedCapabilities.length})</span>
            </span>
            {query && (
              <span className="text-[11px] text-slate-500 lowercase">
                matching "{query}"
              </span>
            )}
          </div>

          {/* Empty State when no matches */}
          {matchedCapabilities.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                No manufacturing items found for "{query}"
              </h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Try searching for items we manufacture like <strong>"Pants"</strong>, <strong>"School Shirts"</strong>, <strong>"Blazers"</strong>, <strong>"T-Shirts"</strong>, <strong>"Doctor Aprons"</strong>, or <strong>"Uniform Sets"</strong>.
              </p>
            </div>
          ) : (
            /* Manufacturing Capabilities Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedCapabilities.map((item) => {
                const displayImage = resolveImagePath(item.images?.[0]);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-brand-500 hover:bg-brand-50/40 flex items-start gap-3.5 cursor-pointer transition-all group shadow-sm hover:shadow-md bg-white"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                      <img 
                        src={displayImage} 
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = DEFAULT_FALLBACK_IMAGE; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-sm font-bold text-navy-950 group-hover:text-brand-700 truncate">
                          {item.name}
                        </h5>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-transform group-hover:translate-x-1 shrink-0" />
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 text-[10px]">
                          {item.badge || item.category}
                        </span>
                        {item.tagline && (
                          <span className="text-slate-500 text-[11px] truncate">
                            • {item.tagline}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                          {item.description}
                        </p>
                      )}

                      {/* Lead Time & Min Order badges */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <div className="flex items-center gap-2">
                          {item.minOrder && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3 text-slate-400" />
                              <span>MOQ: {item.minOrder}</span>
                            </span>
                          )}
                          {item.leadTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{item.leadTime}</span>
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleDirectCatalogNavigate(e, item)}
                          className="text-[10px] font-semibold text-slate-400 hover:text-brand-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Open in Catalog Page"
                        >
                          <span>Catalog</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Search Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">Esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              navigate('/catalog');
            }}
            className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Capabilities in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
