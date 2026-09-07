import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { siteConfig } from '../config/siteConfig';
import { faqs } from '../data/faqs';

import { saveStoredEnquiry } from '../utils/enquiryStorage';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    schoolName: '',
    city: '',
    requirement: 'Full School Uniform Supply',
    productCategory: 'School Uniforms',
    quantity: '300',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomRef = 'AG-REQ-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomRef);

    // Save lead to Admin Enquiries Storage
    saveStoredEnquiry({
      ...formData,
      refId: randomRef,
      source: 'Contact Page Form'
    });

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
    .catch(() => {})
    .finally(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {}
    });
  };

  const whatsappMessage = `Hello Akshay Garments! I would like to schedule an institutional uniform discussion for ${formData.schoolName || 'our School'}. Contact: ${formData.name || 'Admin'}.`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Institutional Sales Desk</span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Get in Touch with Our Garment Consultants
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you represent a school management board, an established academy, or an apparel distributor, our team is ready to provide customized tenders, sample swatch boxes, and sizing consultations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Contact Cards & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <h2 className="font-display font-bold text-2xl text-navy-950">
                Contact Information
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Reach out via phone, WhatsApp, email, or visit our manufacturing showroom.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-4">
              
              {/* Phone Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Phone Inquiries
                  </div>
                  <a href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`} className="font-display font-bold text-base text-navy-950 hover:text-brand-600 block mt-0.5">
                    {siteConfig.contact.phone}
                  </a>
                  <a href={`tel:${siteConfig.contact.phoneSecondary.replace(/[^0-9+]/g, '')}`} className="text-xs text-slate-500 hover:text-brand-600 block">
                    {siteConfig.contact.phoneSecondary} (Secondary Desk)
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Instant WhatsApp Concierge
                  </div>
                  <a 
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappTemplates.general)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-bold text-base text-emerald-950 hover:underline block mt-0.5"
                  >
                    Chat Directly on WhatsApp
                  </a>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    Fastest for sample photos and immediate quotation requests.
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Official Email
                  </div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-display font-bold text-base text-navy-950 hover:text-brand-600 block mt-0.5">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-5 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 text-xl font-bold shadow-md">
                  📸
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-pink-700">
                    Instagram Showcase
                  </div>
                  <a 
                    href={siteConfig.socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-display font-bold text-base text-navy-950 hover:text-pink-600 block mt-0.5"
                  >
                    @akshaygarments_uniforms
                  </a>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Follow us for recent uniform dispatches, stitch closeups & stories.
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Manufacturing Facility & Sales Office
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                    {siteConfig.contact.address.line1},<br />
                    {siteConfig.contact.address.line2},<br />
                    {siteConfig.contact.address.city}, {siteConfig.contact.address.state} - {siteConfig.contact.address.postalCode}
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Business Working Hours</span>
                </div>
                <div>{siteConfig.contact.businessHours}</div>
                <div className="text-slate-500">{siteConfig.contact.sundayHours}</div>
              </div>

            </div>
          </div>

          {/* Right Column: Netlify Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            
            <div className="pb-6 border-b border-slate-100 mb-6">
              <h3 className="font-display font-bold text-2xl text-navy-950">
                Submit an Institutional Enquiry
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Fill out the form below to receive a formal quotation, fabric swatch box, or trial kit.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-display font-bold text-2xl text-navy-950">
                  Thank You for Your Enquiry!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We have received your school uniform requirements. An institutional coordinator will reach out to you today.
                </p>
                
                <div className="pt-4 flex justify-center">
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
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
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Principal Dr. Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@school.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      School / Institution Name *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      required
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="e.g. DPS International"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City & State
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Surat, Gujarat"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Requirement Type
                    </label>
                    <select
                      name="requirement"
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                    >
                      <option value="Full School Uniform Supply">Full School Uniform Supply (Bulk)</option>
                      <option value="Fabric Swatch Box Request">Complimentary Fabric Swatch Box</option>
                      <option value="Campus Sizing Fit Camp Trial">Campus Sizing Fit Camp Trial</option>
                      <option value="Blazers & Winterwear Only">Blazers & Winterwear Only</option>
                      <option value="Sports & House Uniforms">Sports & House Uniforms</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Student Strength / Order Volume: <span className="text-brand-600">{formData.quantity} Pieces</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full accent-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specific Requirements or Questions
                  </label>
                  <textarea
                    rows="3"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention any custom tartan plaids, crest embroidery details, or target delivery deadlines..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Sending Institutional Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Official Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-navy-950">
            Institutional Procurement FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-navy-950 hover:text-brand-600 transition-colors"
              >
                <span>{faq.question}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
