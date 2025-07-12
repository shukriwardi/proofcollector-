
-- First, let's check what the current configuration looks like
SELECT instance_id, mailer_otp_exp, sms_otp_exp 
FROM auth.config;

-- Update the auth configuration with explicit instance targeting
UPDATE auth.config 
SET 
  mailer_otp_exp = 1800,
  sms_otp_exp = 600
WHERE instance_id IS NOT NULL;

-- If the above doesn't work, try without the WHERE clause
UPDATE auth.config 
SET 
  mailer_otp_exp = 1800,
  sms_otp_exp = 600;

-- Verify the update worked
SELECT instance_id, mailer_otp_exp, sms_otp_exp 
FROM auth.config;
