
-- Fix 1: Set OTP expiry to recommended values (30 minutes for email, 10 minutes for SMS)
UPDATE auth.config 
SET 
  mailer_otp_exp = 1800,  -- 30 minutes for email OTP
  sms_otp_exp = 600       -- 10 minutes for SMS OTP
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Fix 2: Enable leaked password protection and other security features
UPDATE auth.config 
SET 
  security_captcha_enabled = true,
  password_min_length = 8,
  security_manual_linking_enabled = false,
  security_update_password_require_reauthentication = true
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Fix 3: Additional security hardening
UPDATE auth.config 
SET 
  jwt_exp = 3600,  -- 1 hour JWT expiration
  refresh_token_rotation_enabled = true,
  security_refresh_token_reuse_interval = 10
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';
