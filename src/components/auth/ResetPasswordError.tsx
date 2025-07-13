
const ResetPasswordError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p>Invalid or expired reset link.</p>
        <p className="text-sm text-gray-600 mt-2">Redirecting to request a new reset link...</p>
      </div>
    </div>
  );
};

export default ResetPasswordError;
