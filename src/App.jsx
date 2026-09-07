import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { SizeGuideModal } from './components/SizeGuideModal';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Favorites } from './pages/Favorites';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

import { FavoritesProvider } from './context/FavoritesContext';
import { QuoteModalProvider } from './context/QuoteModalContext';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // Global modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenLightbox = (images, index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <ScrollToTop />

      {/* Global Navigation Header (Hidden on Admin Portal) */}
      {!isAdminRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onQuickView={(p) => setQuickViewProduct(p)}
                onOpenLightbox={handleOpenLightbox}
              />
            } 
          />
          <Route 
            path="/uniform-models" 
            element={<Navigate to="/catalog" replace />} 
          />
          <Route 
            path="/products" 
            element={<Navigate to="/catalog" replace />} 
          />
          <Route 
            path="/review" 
            element={<Navigate to="/" replace />} 
          />
          <Route 
            path="/reviews" 
            element={<Navigate to="/" replace />} 
          />
          <Route 
            path="/admin" 
            element={<Admin />} 
          />
          <Route 
            path="/catalog" 
            element={<Catalog onQuickView={(p) => setQuickViewProduct(p)} />} 
          />
          <Route 
            path="/about" 
            element={<About />} 
          />
          <Route 
            path="/contact" 
            element={<Contact />} 
          />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                onQuickView={(p) => setQuickViewProduct(p)} 
              />
            } 
          />
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </main>

      {/* Global Institutional Footer & Widgets (Hidden on Admin Portal) */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppFloatingWidget />}

      {/* Global Interactive Elements */}
      <GlobalSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenLightbox={handleOpenLightbox}
      />

      <QuoteRequestModal />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <ImageLightboxModal
        images={lightboxImages}
        activeIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <QuoteModalProvider>
        <MainLayout />
      </QuoteModalProvider>
    </FavoritesProvider>
  );
}
