
import { usePasswordReset } from "@/hooks/usePasswordReset";
import ResetPasswordLoading from "@/components/auth/ResetPasswordLoading";
import ResetPasswordError from "@/components/auth/ResetPasswordError";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    isValidResetSession,
    checkingSession,
    handleResetPassword
  } = usePasswordReset();

  // Show loading while checking session validity
  if (checkingSession) {
    return <ResetPasswordLoading />;
  }

  // If not a valid reset session, show error message
  if (!isValidResetSession) {
    return <ResetPasswordError />;
  }

  return (
    <ResetPasswordForm
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      loading={loading}
      onSubmit={handleResetPassword}
    />
  );
};

export default ResetPassword;
