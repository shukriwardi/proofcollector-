
-- Fix Auth OTP Long Expiry warning by setting email OTP to 30 minutes (1800 seconds)
UPDATE auth.config 
SET 
  mailer_otp_exp = 1800
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Also ensure SMS OTP is set to recommended 10 minutes
UPDATE auth.config 
SET 
  sms_otp_exp = 600
WHERE 
  instance_id = '00000000-0000-0000-0000-000000000000';

-- Verify the current values (this will show in logs)
SELECT mailer_otp_exp, sms_otp_exp FROM auth.config 
WHERE instance_id = '00000000-0000-0000-0000-000000000000';
