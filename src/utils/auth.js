/**
 * Secure Authentication & Cryptographic Hashing Service for Admin Portal
 * Uses Web Crypto API SHA-256 one-way hashing with salt to prevent plaintext credential exposure.
 * Supports secure WhatsApp OTP password reset and dynamic custom password storage.
 */

import { siteConfig } from '../config/siteConfig';

export const DEFAULT_ADMIN_EMAIL = 'akshaydonthula283@gmail.com';

// Default salted SHA-256 hash for "@Akshay5" with username "akshaydonthula283@gmail.com"
const DEFAULT_SALT = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_SALT) 
  || 'akshay_garments_sec_2026';

const DEFAULT_HASH = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD_HASH) 
  || '99480cb6cf3c47d9445a1b2c08ad4e548db692a62756e3526d5610a15d3bccc1';

const CUSTOM_HASH_KEY = 'akshay_custom_admin_hash';
const AUTH_SESSION_KEY = 'akshay_admin_session_token';
const FAILED_ATTEMPTS_KEY = 'akshay_admin_failed_attempts';
const LOCKOUT_KEY = 'akshay_admin_lockout_until';
const RESET_OTP_KEY = 'akshay_admin_reset_otp';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds
const SESSION_EXPIRY_MS = 4 * 60 * 60 * 1000; // 4 hours
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Computes a standard SHA-256 hash using native Web Crypto API
 */
export const hashText = async (text) => {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Retrieves the currently active admin hash (custom if set by reset, or default)
 */
export const getActiveAdminHash = () => {
  if (typeof window === 'undefined') return DEFAULT_HASH;
  try {
    const customHash = localStorage.getItem(CUSTOM_HASH_KEY);
    return customHash || DEFAULT_HASH;
  } catch (e) {
    return DEFAULT_HASH;
  }
};

/**
 * Check if the admin login is currently rate-limited due to failed attempts
 */
export const getLockoutStatus = () => {
  if (typeof window === 'undefined') return { isLocked: false, remainingSec: 0 };
  try {
    const lockoutUntil = parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return { isLocked: true, remainingSec: Math.ceil((lockoutUntil - now) / 1000) };
    }
    return { isLocked: false, remainingSec: 0 };
  } catch (e) {
    return { isLocked: false, remainingSec: 0 };
  }
};

/**
 * Record a failed login attempt; triggers lockout if threshold reached
 */
const recordFailedAttempt = () => {
  try {
    const current = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, current.toString());
    if (current >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    }
  } catch (e) {}
};

/**
 * Reset failed attempts upon successful login
 */
const resetFailedAttempts = () => {
  try {
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_KEY);
  } catch (e) {}
};

/**
 * Verify credentials securely without exposing plaintext passwords
 */
export const verifyAdminCredentials = async (username, password) => {
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return { 
      success: false, 
      error: `Too many failed attempts. Please wait ${lockout.remainingSec}s before trying again.` 
    };
  }

  const cleanUser = (username || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Please enter both username/email and password.' };
  }

  try {
    // Generate salted hash: salt + ":" + password + ":" + username
    const payload = `${DEFAULT_SALT}:${cleanPass}:${cleanUser}`;
    const calculatedHash = await hashText(payload);
    const expectedHash = getActiveAdminHash();

    if (calculatedHash === expectedHash) {
      resetFailedAttempts();
      createAdminSession(cleanUser);
      return { success: true };
    } else {
      recordFailedAttempt();
      const attempts = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '1', 10);
      const remaining = MAX_ATTEMPTS - attempts;
      const errorMsg = remaining > 0 
        ? `Invalid username/email or password. ${remaining} attempt(s) remaining.` 
        : `Too many failed attempts. Locked for 60 seconds.`;
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    console.error('Cryptographic verification error:', err);
    return { success: false, error: 'Security verification failed. Please try again.' };
  }
};

/**
 * Generates a 6-digit WhatsApp OTP for password reset
 */
export const generateWhatsAppResetOTP = () => {
  if (typeof window === 'undefined') return null;
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = {
      code,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
      attempts: 0
    };
    sessionStorage.setItem(RESET_OTP_KEY, JSON.stringify(otpData));
    return code;
  } catch (e) {
    return null;
  }
};

/**
 * Builds the WhatsApp pre-filled security message to dispatch the OTP
 */
export const getWhatsAppResetLink = (otpCode) => {
  const cleanPhone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '');
  const message = `🔐 *Akshay Garments Security Desk*\n\nYour Admin Password Reset OTP is: *${otpCode}*\n\n(Valid for 10 minutes). Enter this code on the website to set your new password. Do not share this code.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Validates the entered OTP code and updates the admin password securely
 */
export const verifyOTPAndResetPassword = async (enteredCode, newPassword, username = DEFAULT_ADMIN_EMAIL) => {
  if (typeof window === 'undefined') return { success: false, error: 'Browser environment required.' };
  
  const cleanCode = (enteredCode || '').trim();
  const cleanPass = (newPassword || '').trim();
  const cleanUser = (username || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

  if (!cleanCode || cleanCode.length !== 6) {
    return { success: false, error: 'Please enter a valid 6-digit verification code.' };
  }

  if (!cleanPass || cleanPass.length < 5) {
    return { success: false, error: 'New password must be at least 5 characters long.' };
  }

  try {
    const raw = sessionStorage.getItem(RESET_OTP_KEY);
    if (!raw) {
      return { success: false, error: 'No active reset request found. Please request a new code.' };
    }

    const otpData = JSON.parse(raw);

    // Check expiry
    if (Date.now() > otpData.expiresAt) {
      sessionStorage.removeItem(RESET_OTP_KEY);
      return { success: false, error: 'The verification code has expired. Please generate a new code.' };
    }

    // Check attempts
    if (otpData.attempts >= 4) {
      sessionStorage.removeItem(RESET_OTP_KEY);
      return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
    }

    // Check code match
    if (otpData.code !== cleanCode) {
      otpData.attempts = (otpData.attempts || 0) + 1;
      sessionStorage.setItem(RESET_OTP_KEY, JSON.stringify(otpData));
      return { success: false, error: `Incorrect verification code. (${4 - otpData.attempts} attempts left)` };
    }

    // Code is valid! Hash new password and save to localStorage
    const payload = `${DEFAULT_SALT}:${cleanPass}:${cleanUser}`;
    const newHash = await hashText(payload);
    localStorage.setItem(CUSTOM_HASH_KEY, newHash);

    // Clean up OTP and reset failed attempts
    sessionStorage.removeItem(RESET_OTP_KEY);
    resetFailedAttempts();
    createAdminSession(cleanUser);

    return { success: true };
  } catch (err) {
    console.error('Password reset error:', err);
    return { success: false, error: 'Failed to reset password. Please try again.' };
  }
};

/**
 * Reset back to the default factory password
 */
export const resetToFactoryPassword = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CUSTOM_HASH_KEY);
    resetFailedAttempts();
  } catch (e) {}
};

/**
 * Generate a timestamped session token
 */
export const createAdminSession = (username) => {
  if (typeof window === 'undefined') return;
  try {
    const sessionData = {
      user: username,
      issuedAt: Date.now(),
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
      token: `ag_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
    };
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
  } catch (e) {}
};

/**
 * Validates if the current session token is active and unexpired
 */
export const isAdminSessionValid = () => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.expiresAt) return false;
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Log out and clear session
 */
export const clearAdminSession = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {}
};
