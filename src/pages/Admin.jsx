import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  User, 
  KeyRound, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  MessageCircle, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  Eye, 
  EyeOff, 
  Star, 
  Copy, 
  Check, 
  TrendingUp, 
  Inbox, 
  ArrowLeft,
  Plus,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getStoredEnquiries, 
  updateEnquiryStatus, 
  deleteStoredEnquiry, 
  clearAllStoredEnquiries, 
  exportEnquiriesToCSV,
  ENQUIRY_UPDATE_EVENT 
} from '../utils/enquiryStorage';
import { 
  getStoredReviews, 
  deleteStoredReview, 
  clearAllStoredReviews,
  saveStoredReview,
  copyReviewLinkToClipboard, 
  REVIEW_UPDATE_EVENT 
} from '../utils/reviewStorage';
import { 
  verifyAdminCredentials, 
  isAdminSessionValid, 
  clearAdminSession, 
  generateWhatsAppResetOTP,
  getWhatsAppResetLink,
  verifyOTPAndResetPassword
} from '../utils/auth';
import { siteConfig } from '../config/siteConfig';

export const Admin = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return isAdminSessionValid();
  });

  // Mode: 'login' | 'reset'
  const [authMode, setAuthMode] = useState('login');

  // Login Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // WhatsApp Reset States
  const [activeResetOtp, setActiveResetOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Dashboard Data State
  const [enquiries, setEnquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'reviews'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'New' | 'Contacted' | 'In Progress' | 'Completed'
  
  // Review Filter & Add States
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('All');
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    role: 'Principal',
    school: '',
    location: '',
    rating: 5,
    title: '',
    content: '',
    tags: 'School Shirts, Pants, Blazers',
    studentsCount: ''
  });

  // Dialog States
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'enquiry' | 'review', item: obj }
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Data & Subscribe to Live Updates
  const refreshData = () => {
    setEnquiries(getStoredEnquiries());
    setReviews(getStoredReviews());
  };

  useEffect(() => {
    if (isAdminSessionValid()) {
      setIsAuthenticated(true);
      refreshData();
    } else {
      setIsAuthenticated(false);
    }

    const handleEnquiryUpdate = () => refreshData();
    const handleReviewUpdate = () => refreshData();

    window.addEventListener(ENQUIRY_UPDATE_EVENT, handleEnquiryUpdate);
    window.addEventListener(REVIEW_UPDATE_EVENT, handleReviewUpdate);
    window.addEventListener('storage', handleEnquiryUpdate);

    return () => {
      window.removeEventListener(ENQUIRY_UPDATE_EVENT, handleEnquiryUpdate);
      window.removeEventListener(REVIEW_UPDATE_EVENT, handleReviewUpdate);
      window.removeEventListener('storage', handleEnquiryUpdate);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const result = await verifyAdminCredentials(usernameInput, passwordInput);
      if (result.success) {
        setIsAuthenticated(true);
        refreshData();
      } else {
        setLoginError(result.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setLoginError('Security check failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStartForgotPassword = () => {
    const otp = generateWhatsAppResetOTP();
    setActiveResetOtp(otp);
    setEnteredOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setResetSuccess(false);
    setAuthMode('reset');
  };

  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    setResetError('');

    if (newPassword !== confirmPassword) {
      setResetError('New passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsResetting(true);

    try {
      const result = await verifyOTPAndResetPassword(enteredOtp, newPassword, 'admin');
      if (result.success) {
        setResetSuccess(true);
        
        // Fire confetti celebration
        try {
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        } catch (cErr) {}

        setTimeout(() => {
          setIsAuthenticated(true);
          setAuthMode('login');
          refreshData();
        }, 1200);
      } else {
        setResetError(result.error || 'Failed to verify code.');
      }
    } catch (err) {
      setResetError('Password reset error. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleStatusChange = (id, newStatus) => {
    updateEnquiryStatus(id, newStatus);
    refreshData();
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'enquiry') {
      deleteStoredEnquiry(itemToDelete.item.id);
    } else if (itemToDelete.type === 'review') {
      deleteStoredReview(itemToDelete.item.id);
    }
    setItemToDelete(null);
    refreshData();
  };

  const handleCopyReviewLink = async () => {
    const success = await copyReviewLinkToClipboard();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyOtpCode = () => {
    if (activeResetOtp) {
      navigator.clipboard.writeText(activeResetOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2500);
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      (enq.schoolName && enq.schoolName.toLowerCase().includes(query)) ||
      (enq.name && enq.name.toLowerCase().includes(query)) ||
      (enq.city && enq.city.toLowerCase().includes(query)) ||
      (enq.phone && enq.phone.includes(query)) ||
      (enq.refId && enq.refId.toLowerCase().includes(query)) ||
      (enq.requirement && enq.requirement.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  // Filtered Reviews
  const filteredReviews = reviews.filter((rev) => {
    const ratingMatches = reviewRatingFilter === 'All' || Math.round(Number(rev.rating) || 5) === Number(reviewRatingFilter);
    const query = reviewSearchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      (rev.name && rev.name.toLowerCase().includes(query)) ||
      (rev.school && rev.school.toLowerCase().includes(query)) ||
      (rev.title && rev.title.toLowerCase().includes(query)) ||
      (rev.content && rev.content.toLowerCase().includes(query)) ||
      (rev.location && rev.location.toLowerCase().includes(query));
    return ratingMatches && matchesQuery;
  });

  const handleAdminAddReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.content) return;
    saveStoredReview({
      ...newReviewForm,
      tags: newReviewForm.tags ? newReviewForm.tags.split(',').map(t => t.trim()).filter(Boolean) : ['Uniform Manufacturing']
    });
    setIsAddReviewModalOpen(false);
    setNewReviewForm({
      name: '',
      role: 'Principal',
      school: '',
      location: '',
      rating: 5,
      title: '',
      content: '',
      tags: 'School Shirts, Pants, Blazers',
      studentsCount: ''
    });
    refreshData();
  };

  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;

  // --- LOGIN & WHATSAPP RESET VIEWS (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-navy-950 text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-navy-900 border border-navy-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 animate-slide-up">
          
          {authMode === 'login' ? (
            /* ============================================================ */
            /* 1. STANDARD ADMIN LOGIN FORM                                 */
            /* ============================================================ */
            <>
              {/* Logo & Shield */}
              <div className="text-center space-y-3 mb-8">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-navy-950 border-2 border-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                  <Lock className="w-8 h-8 text-gold-400" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Executive Access</span>
                  </div>
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    Admin Control Portal
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Akshay Garments Institutional Management
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Username Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Admin Username / Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="akshaydonthula283@gmail.com"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={handleStartForgotPassword}
                      className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span>Forgot Password?</span>
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter admin password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className="p-3 bg-rose-950/70 border border-rose-600/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
                </button>

              </form>
            </>
          ) : (
            /* ============================================================ */
            /* 2. WHATSAPP OTP PASSWORD RESET WORKFLOW                      */
            /* ============================================================ */
            <div className="space-y-6">
              
              {/* Back to Login Header */}
              <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Verified</span>
                </div>
              </div>

              {/* Title & WhatsApp Dispatch Box */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="font-display font-black text-xl text-white">
                  Reset Password via WhatsApp
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  A secure 6-digit verification code has been generated for owner WhatsApp: <strong>{siteConfig.contact.whatsapp}</strong>.
                </p>
              </div>

              {/* Step 1: WhatsApp Action Button */}
              <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-2xl space-y-2.5 text-center">
                <div className="text-[11px] text-emerald-300 font-semibold">
                  Step 1: Open WhatsApp to receive your 6-digit code
                </div>

                <a
                  href={getWhatsAppResetLink(activeResetOtp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Code to My WhatsApp</span>
                </a>

                {/* Quick copy code fallback for testing */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span>Generated Code:</span>
                  <code className="font-mono font-bold text-emerald-400 bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                    {activeResetOtp}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyOtpCode}
                    className="text-brand-400 hover:underline flex items-center gap-0.5 ml-1"
                  >
                    {copiedOtp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOtp ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Verification Form */}
              <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                
                {/* OTP Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Enter 6-Digit WhatsApp Code <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 749201"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center py-3 bg-navy-950 border border-navy-700 rounded-xl text-white font-mono text-xl tracking-[0.3em] font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    New Admin Password <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter at least 5 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Confirm New Password <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Error Box */}
                {resetError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-600/60 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                {/* Success Box */}
                {resetSuccess && (
                  <div className="p-3 bg-emerald-950/90 border border-emerald-500/70 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Password updated! Redirecting to Dashboard...</span>
                  </div>
                )}

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={isResetting || resetSuccess}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isResetting ? 'Verifying...' : 'Verify Code & Set New Password'}</span>
                </button>

              </form>

            </div>
          )}

        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white border border-brand-400/50 shadow-md">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg text-white">
                  Akshay Garments
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[10px] font-mono font-bold uppercase">
                  Admin Dashboard
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional Enquiries & Customer Feedback Desk
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Copy Review Link */}
            <button
              onClick={handleCopyReviewLink}
              className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold border border-navy-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy link to invite clients to review"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gold-400" />
                  <span>Copy Review Link</span>
                </>
              )}
            </button>

            {/* Export CSV */}
            <button
              onClick={exportEnquiriesToCSV}
              disabled={enquiries.length === 0}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 1. KPI Metric Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Enquiries */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Enquiries</span>
              <FileText className="w-4 h-4 text-brand-600" />
            </div>
            <div className="font-display font-black text-3xl text-navy-950">
              {enquiries.length}
            </div>
            <div className="text-[11px] text-slate-500">
              Institutional leads received
            </div>
          </div>

          {/* Pending New Leads */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>New Leads</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="font-display font-black text-3xl text-emerald-600">
              {newEnquiriesCount}
            </div>
            <div className="text-[11px] text-slate-500">
              Awaiting direct follow-up
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Live Reviews</span>
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            </div>
            <div className="font-display font-black text-3xl text-navy-950">
              {reviews.length}
            </div>
            <div className="text-[11px] text-slate-500">
              Published on website slider
            </div>
          </div>

          {/* Estimated Quantity Demand */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Inquiry Volume</span>
              <TrendingUp className="w-4 h-4 text-brand-600" />
            </div>
            <div className="font-display font-black text-3xl text-brand-700">
              {enquiries.reduce((acc, e) => acc + (parseInt(e.quantity) || 0), 0).toLocaleString('en-IN')}+
            </div>
            <div className="text-[11px] text-slate-500">
              Total garment sets inquired
            </div>
          </div>

        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3.5 px-2 font-display font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'enquiries'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-navy-950'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Institutional Enquiries</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {enquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 px-2 font-display font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-navy-950'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Customer Reviews</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}
        {activeTab === 'enquiries' ? (
          /* ============================================================ */
          /* ENQUIRIES TAB                                                */
          /* ============================================================ */
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by school, name, city, ref ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">Status:</span>
                {['All', 'New', 'Contacted', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-navy-950 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {st} {st === 'New' && newEnquiriesCount > 0 ? `(${newEnquiriesCount})` : ''}
                  </button>
                ))}
              </div>

            </div>

            {/* Enquiries List / Cards */}
            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-navy-950">
                  {enquiries.length === 0 ? 'No Enquiries Received Yet' : 'No Enquiries Match Your Search'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {enquiries.length === 0 
                    ? 'When a school principal or client submits a quote request or contact form on your website, it will immediately appear here.'
                    : 'Try changing your search terms or status filter above.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enq) => {
                  const statusColors = {
                    'New': 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    'Contacted': 'bg-blue-100 text-blue-800 border-blue-300',
                    'In Progress': 'bg-amber-100 text-amber-800 border-amber-300',
                    'Completed': 'bg-slate-100 text-slate-700 border-slate-300'
                  };

                  const cleanPhone = (enq.phone || '').replace(/[^0-9]/g, '');

                  return (
                    <div 
                      key={enq.id}
                      className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                        enq.status === 'New' ? 'border-brand-500/60 ring-1 ring-brand-500/20' : 'border-slate-200'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                            {enq.refId || 'REF-N/A'}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{enq.dateFormatted}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {enq.source || 'Website'}
                          </span>
                        </div>

                        {/* Status Selector Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">Status:</span>
                          <select
                            value={enq.status || 'New'}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                              statusColors[enq.status || 'New']
                            }`}
                          >
                            <option value="New">🟢 New Lead</option>
                            <option value="Contacted">🔵 Contacted</option>
                            <option value="In Progress">🟡 In Progress</option>
                            <option value="Completed">⚪ Completed</option>
                          </select>
                        </div>

                      </div>

                      {/* Main Lead Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 items-start">
                        
                        {/* School & Contact Person (5 cols) */}
                        <div className="md:col-span-5 space-y-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
                              <h4 className="font-display font-bold text-base sm:text-lg text-navy-950">
                                {enq.schoolName || 'School Name Not Provided'}
                              </h4>
                            </div>
                            {enq.city && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 ml-6">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{enq.city}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <span>{enq.name || 'Contact Person'}</span>
                            </div>
                            {enq.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${enq.phone}`} className="text-brand-600 hover:underline font-mono">
                                  {enq.phone}
                                </a>
                              </div>
                            )}
                            {enq.email && (
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`mailto:${enq.email}`} className="text-slate-600 hover:underline">
                                  {enq.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order & Requirements (4 cols) */}
                        <div className="md:col-span-4 space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Requirement Details
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-xs font-bold text-navy-950 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                              {enq.requirement || 'Full Uniform Supply'}
                            </div>
                            <div className="text-xs text-slate-600">
                              Estimated Quantity: <strong className="text-brand-700 font-bold">{enq.quantity} Sets/Pieces</strong>
                            </div>
                            {enq.message && (
                              <p className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-lg italic">
                                "{enq.message}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Direct Contact Action Buttons (3 cols) */}
                        <div className="md:col-span-3 flex flex-col gap-2 shrink-0">
                          
                          {/* Call Button */}
                          {enq.phone && (
                            <a
                              href={`tel:${enq.phone}`}
                              className="w-full py-2 px-3 bg-navy-950 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Client</span>
                            </a>
                          )}

                          {/* WhatsApp Button */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(
                                `Namaste ${enq.name || ''}! Thank you for contacting Akshay Garments regarding uniform requirements for ${enq.schoolName || 'your School'} (Ref: ${enq.refId}). How may we assist you with sample swatches and quotes?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Reply</span>
                            </a>
                          )}

                          {/* Delete Lead Button */}
                          <button
                            onClick={() => setItemToDelete({ type: 'enquiry', item: enq })}
                            className="w-full py-2 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Lead</span>
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Clear All Enquiries Option */}
            {enquiries.length > 0 && (
              <div className="pt-4 text-right">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all enquiries? This cannot be undone.')) {
                      clearAllStoredEnquiries();
                      refreshData();
                    }
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline cursor-pointer"
                >
                  Clear All {enquiries.length} Enquiries
                </button>
              </div>
            )}

          </div>
        ) : (
          /* ============================================================ */
          /* REVIEWS TAB (Admin Exclusive Review Control)                 */
          /* ============================================================ */
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-navy-950">
                  Customer Reviews Management ({reviews.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage, moderate, delete, or manually add reviews displayed on the website slider.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsAddReviewModalOpen(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Review</span>
                </button>

                <button
                  onClick={handleCopyReviewLink}
                  className="px-4 py-2 bg-navy-950 hover:bg-navy-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gold-400" />}
                  <span>Copy Client Review Link</span>
                </button>
              </div>
            </div>

            {/* Review Search & Rating Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews by name, school, keywords..."
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Rating Filter */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">Rating:</span>
                {['All', '5', '4', '3'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setReviewRatingFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reviewRatingFilter === r
                        ? 'bg-navy-950 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {r === 'All' ? 'All Ratings' : `${r} ★`}
                  </button>
                ))}
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
                  <Star className="w-6 h-6 fill-gold-400" />
                </div>
                <h4 className="font-display font-bold text-lg text-navy-950">
                  {reviews.length === 0 ? 'No Reviews Submitted Yet' : 'No Reviews Match Your Search'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {reviews.length === 0
                    ? 'Send your review link to school principals and clients or click "Add New Review" above to insert feedback manually.'
                    : 'Try changing your search terms or rating filter above.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex text-gold-500">
                          {[...Array(Math.min(5, Math.max(1, Math.round(Number(rev.rating) || 5))))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-navy-950">{rev.name}</span>
                        {rev.role && <span className="text-xs text-brand-600 font-medium">({rev.role})</span>}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rev.school}</span>
                        {rev.location && <span>• {rev.location}</span>}
                        {rev.dateFormatted && <span>• {rev.dateFormatted}</span>}
                      </div>

                      {rev.title && (
                        <div className="text-xs font-bold text-slate-800 italic">
                          "{rev.title}"
                        </div>
                      )}

                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        "{rev.content}"
                      </p>

                      {rev.tags && rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rev.tags.map((t, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => setItemToDelete({ type: 'review', item: rev })}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Permanently delete this review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clear All Reviews Option */}
            {reviews.length > 0 && (
              <div className="pt-4 text-right">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all stored customer reviews? This action cannot be undone.')) {
                      clearAllStoredReviews();
                      refreshData();
                    }
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline cursor-pointer"
                >
                  Clear All {reviews.length} Reviews
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Confirmation Modal for Deleting Enquiry / Review */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 animate-slide-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-navy-950">
                  Delete {itemToDelete.type === 'enquiry' ? 'Enquiry Lead' : 'Customer Review'}?
                </h4>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              Are you sure you want to permanently remove {itemToDelete.type === 'enquiry' ? `enquiry from "${itemToDelete.item.schoolName || itemToDelete.item.name}"` : `review from "${itemToDelete.item.name}"`}?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Review Modal Dialog */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 animate-slide-up my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-brand-700">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <h4 className="font-display font-bold text-lg text-navy-950">
                  Add Verified Client Review
                </h4>
              </div>
              <button
                onClick={() => setIsAddReviewModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminAddReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Client / Principal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={newReviewForm.name}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Principal, Admin Lead"
                    value={newReviewForm.role}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">School / Institution Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi Public School"
                    value={newReviewForm.school}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, school: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad, Telangana"
                    value={newReviewForm.location}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Rating (1 to 5 Stars)</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy-950 focus:outline-none focus:border-brand-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3.0 - Good)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Student Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,200+ Students"
                    value={newReviewForm.studentsCount}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, studentsCount: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Review Headline / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Exceptional Stitching Quality and Timely Delivery"
                  value={newReviewForm.title}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Review Testimonial Text *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write the review feedback..."
                  value={newReviewForm.content}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, content: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Manufactured Items / Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="School Shirts, Pants, Blazers, Sports Kit"
                  value={newReviewForm.tags}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddReviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
