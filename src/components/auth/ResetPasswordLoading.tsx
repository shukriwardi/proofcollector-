
const ResetPasswordLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p>Verifying reset link...</p>
        <p className="text-sm text-gray-600 mt-2">Please wait while we verify your password reset request.</p>
      </div>
    </div>
  );
};

export default ResetPasswordLoading;
