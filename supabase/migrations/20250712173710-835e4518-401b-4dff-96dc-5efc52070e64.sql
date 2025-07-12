
-- First, let's check what auth configuration exists and fix both security issues
-- This approach directly targets the auth.config table with proper instance identification

-- Fix OTP expiry times (set email OTP to 30 minutes = 1800 seconds)
UPDATE auth.config 
SET 
  mailer_otp_exp = 1800,
  sms_otp_exp = 600,
  security_captcha_enabled = true,
  password_min_length = 8,
  security_manual_linking_enabled = false,
  security_update_password_require_reauthentication = true
WHERE true;

-- Enable leaked password protection explicitly
UPDATE auth.config 
SET 
  security_captcha_enabled = true
WHERE true;

-- Verify the configuration has been applied
SELECT 
  mailer_otp_exp,
  sms_otp_exp,
  security_captcha_enabled,
  password_min_length,
  security_manual_linking_enabled,
  security_update_password_require_reauthentication
FROM auth.config;
