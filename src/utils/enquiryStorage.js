/**
 * Persistent Institutional Enquiry & Quote Leads Storage
 * Automatically stores all incoming enquiries from Quote modals and Contact forms.
 */

const ENQUIRIES_STORAGE_KEY = 'akshay_garments_enquiries_v1';
export const ENQUIRY_UPDATE_EVENT = 'akshay_enquiries_updated';

/**
 * Retrieve all saved enquiries from localStorage
 */
export const getStoredEnquiries = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading stored enquiries:', error);
    return [];
  }
};

/**
 * Save a new incoming institutional enquiry lead
 */
export const saveStoredEnquiry = (enquiryData) => {
  if (typeof window === 'undefined') return null;
  try {
    const currentEnquiries = getStoredEnquiries();
    
    const randomRef = enquiryData.refId || ('AG-REQ-' + Math.floor(100000 + Math.random() * 900000));
    const now = new Date();
    
    const newEnquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      refId: randomRef,
      name: (enquiryData.name || 'Anonymous Client').trim(),
      phone: (enquiryData.phone || '').trim(),
      email: (enquiryData.email || '').trim(),
      schoolName: (enquiryData.schoolName || 'Not Specified').trim(),
      city: (enquiryData.city || '').trim(),
      requirement: (enquiryData.requirement || 'Bulk School Uniforms').trim(),
      productCategory: (enquiryData.productCategory || 'School Uniforms').trim(),
      quantity: (enquiryData.quantity || '100+').toString().trim(),
      message: (enquiryData.message || '').trim(),
      status: 'New', // 'New' | 'Contacted' | 'In Progress' | 'Completed'
      source: enquiryData.source || 'Website Quote Request',
      createdAt: now.toISOString(),
      dateFormatted: new Intl.DateTimeFormat('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(now)
    };

    const updated = [newEnquiry, ...currentEnquiries];
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch update event
    window.dispatchEvent(new CustomEvent(ENQUIRY_UPDATE_EVENT, { detail: newEnquiry }));

    return newEnquiry;
  } catch (error) {
    console.error('Error saving enquiry to localStorage:', error);
    return null;
  }
};

/**
 * Update the status of an enquiry (New -> Contacted -> In Progress -> Completed)
 */
export const updateEnquiryStatus = (id, newStatus) => {
  if (typeof window === 'undefined') return;
  try {
    const currentEnquiries = getStoredEnquiries();
    const updated = currentEnquiries.map(enq => 
      enq.id === id ? { ...enq, status: newStatus } : enq
    );
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(ENQUIRY_UPDATE_EVENT, { detail: { id, status: newStatus } }));
  } catch (error) {
    console.error('Error updating enquiry status:', error);
  }
};

/**
 * Delete a specific enquiry
 */
export const deleteStoredEnquiry = (id) => {
  if (typeof window === 'undefined') return;
  try {
    const currentEnquiries = getStoredEnquiries();
    const filtered = currentEnquiries.filter(e => e.id !== id);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(ENQUIRY_UPDATE_EVENT, { detail: { id, deleted: true } }));
  } catch (error) {
    console.error('Error deleting enquiry:', error);
  }
};

/**
 * Clear all enquiries
 */
export const clearAllStoredEnquiries = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ENQUIRIES_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(ENQUIRY_UPDATE_EVENT, { detail: { cleared: true } }));
  } catch (error) {
    console.error('Error clearing enquiries:', error);
  }
};

/**
 * Export enquiries as a downloadable CSV spreadsheet
 */
export const exportEnquiriesToCSV = () => {
  const enquiries = getStoredEnquiries();
  if (enquiries.length === 0) return false;

  const headers = ['Ref ID', 'Date', 'Status', 'School / Institute', 'Contact Person', 'Phone', 'Email', 'City', 'Requirement', 'Quantity', 'Message'];
  
  const rows = enquiries.map(e => [
    `"${e.refId || ''}"`,
    `"${e.dateFormatted || ''}"`,
    `"${e.status || 'New'}"`,
    `"${(e.schoolName || '').replace(/"/g, '""')}"`,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.phone || '').replace(/"/g, '""')}"`,
    `"${(e.email || '').replace(/"/g, '""')}"`,
    `"${(e.city || '').replace(/"/g, '""')}"`,
    `"${(e.requirement || '').replace(/"/g, '""')}"`,
    `"${(e.quantity || '').replace(/"/g, '""')}"`,
    `"${(e.message || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Akshay_Garments_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
