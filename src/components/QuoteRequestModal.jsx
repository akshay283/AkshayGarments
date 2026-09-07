import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuoteModal } from '../context/QuoteModalContext';
import { siteConfig } from '../config/siteConfig';

import { saveStoredEnquiry } from '../utils/enquiryStorage';

export const QuoteRequestModal = () => {
  const { isOpen, initialData, closeQuoteModal } = useQuoteModal();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    schoolName: '',
    city: '',
    requirement: 'Full School Uniform Set',
    productCategory: '',
    quantity: '250',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        productCategory: initialData.category || '',
        message: initialData.notes 
          ? `Regarding: ${initialData.productName}. Notes: ${initialData.notes}` 
          : (initialData.productName ? `Inquiring about ${initialData.productName}` : '')
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomRef = 'AG-REQ-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomRef);

    // Save lead to Admin Enquiries Storage
    saveStoredEnquiry({
      ...formData,
      refId: randomRef,
      source: 'Modal Quote Request'
    });

    // Simulate Netlify form / AJAX submission
    const formBody = new URLSearchParams({
      'form-name': 'school-enquiry',
      refId: randomRef,
      ...formData
    }).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody
    })
    .catch(() => {
      // In local dev preview this will 404/200, which is totally expected for static frontend
    })
    .finally(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger Confetti Celebration safely
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        // Confetti fallback
      }
    });
  };

  const whatsappMessage = `Hello Akshay Garments! I just submitted an inquiry (${refId || 'School Quote'}). School: ${formData.schoolName || 'Our School'}, Contact: ${formData.name}. Looking forward to your quote.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuoteModal}
          aria-label="Close Modal"
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-950 to-brand-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Institutional Procurement Desk</span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl">
            Request an Institutional Quote & Sample Box
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg">
            Direct manufacturer wholesale pricing, customized school monogramming, and free fabric swatch kits.
          </p>
        </div>

        {/* Form Body or Success State */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-display font-bold text-2xl text-navy-950">
                Enquiry Received Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{formData.name || 'Valued Partner'}</strong>. Our institutional uniform consultant will review your school requirements and reach out within 2–4 business hours.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-sm mx-auto text-xs text-slate-700">
                <span className="text-slate-500">Enquiry Reference ID:</span>{' '}
                <strong className="font-mono text-brand-700 font-bold">{refId}</strong>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify on WhatsApp Directly</span>
                </a>
                <button
                  onClick={closeQuoteModal}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form 
              name="school-enquiry" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              <input type="hidden" name="form-name" value="school-enquiry" />
              <p className="hidden">
                <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Patel"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="principal@school.edu.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* School / Institution Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    School / Organization Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="schoolName"
                      required
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="e.g. St. Peter's World School"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* City / State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City & State
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Ahmedabad, Gujarat"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Requirement Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Requirement Type
                  </label>
                  <select
                    name="requirement"
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white font-medium"
                  >
                    <option value="Full School Uniform Set">Full School Uniform Set (Shirt + Bottom + Tie)</option>
                    <option value="School Shirts / Blouses">School Shirts / Blouses</option>
                    <option value="School Trousers / Skirts">School Trousers / Skirts</option>
                    <option value="School Blazers & Sweaters">School Blazers & Sweaters</option>
                    <option value="Sports & House Uniforms">Sports & House Uniforms</option>
                    <option value="Fabric Swatch Box Request">Complimentary Fabric Swatch Box</option>
                    <option value="Sizing Fit Kit Trial">On-Campus Sizing Fit Kit Trial</option>
                    <option value="Dealer / Distributor Inquiry">Dealer / Distributor Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Quantity Slider / Estimated Pieces */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Quantity (Students / Pieces): <span className="text-brand-600 font-black">{formData.quantity} pieces</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex gap-1.5 shrink-0">
                    {['100', '250', '500', '1000', '2500+'].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setFormData({ ...formData, quantity: preset.replace('+', '') })}
                        className={`text-[10px] px-2 py-1 rounded border font-semibold ${
                          formData.quantity === preset.replace('+', '')
                            ? 'bg-navy-950 text-white border-navy-950'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message / Custom Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Customization Notes (Plaid Colors, Logo Embroidery, Delivery Timelines)
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention your requirements, preferred colors, or target delivery date..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                ></textarea>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero obligation quotation. Complimentary fabric swatch box dispatched upon request.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-navy-950 hover:from-brand-700 hover:to-navy-900 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Submitting Institutional Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request for Bulk Quote</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
