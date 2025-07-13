
import { Link } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";

const ResetPasswordError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">ProofCollector</span>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting you to request a new reset link...
          </p>

          <Link 
            to="/forgot-password" 
            className="flex items-center justify-center w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Request New Reset Link
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordError;
