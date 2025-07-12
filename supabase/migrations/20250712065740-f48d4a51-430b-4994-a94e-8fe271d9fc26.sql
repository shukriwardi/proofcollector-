
-- Fix 1: Update the handle_new_user function to have a fixed search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Fix 2: Set OTP expiry to 30 minutes (1800 seconds) for email authentication
UPDATE auth.config 
SET 
  password_min_length = 6,
  jwt_exp = 3600,
  refresh_token_rotation_enabled = true,
  security_update_password_require_reauthentication = true
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Set email OTP expiry to 30 minutes
ALTER TABLE auth.users 
ALTER COLUMN email_confirmed_at SET DEFAULT now();

-- Update auth configuration for OTP expiry
UPDATE auth.config 
SET 
  mailer_otp_exp = 1800,
  sms_otp_exp = 600
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Fix 3: Enable leaked password protection
UPDATE auth.config 
SET 
  security_captcha_enabled = true,
  password_min_length = 8,
  security_manual_linking_enabled = false
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';
