import React, { createContext, useContext, useState } from 'react';

const QuoteModalContext = createContext();

export const QuoteModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState({
    productName: '',
    category: '',
    type: 'school-uniform', // 'school-uniform' | 'fabric' | 'bulk-school' | 'catalog'
    quantity: '100',
    notes: ''
  });

  const openQuoteModal = (data = {}) => {
    setInitialData({
      productName: data.productName || data.name || '',
      category: data.category || '',
      type: data.type || 'school-uniform',
      quantity: data.quantity || '100',
      notes: data.notes || ''
    });
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
  };

  return (
    <QuoteModalContext.Provider
      value={{
        isOpen,
        initialData,
        openQuoteModal,
        closeQuoteModal
      }}
    >
      {children}
    </QuoteModalContext.Provider>
  );
};

export const useQuoteModal = () => {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  }
  return context;
};
