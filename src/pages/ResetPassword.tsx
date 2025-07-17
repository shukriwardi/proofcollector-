
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold text-white">ProofCollector</span>
          </Link>
        </div>

        <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
          <div className="text-purple-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Password Reset Not Available</h2>
          <p className="text-gray-400 mb-4">
            ProofCollector now uses Google authentication for secure sign-in.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting you to the login page...
          </p>

          <Link 
            to="/login" 
            className="flex items-center justify-center w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue with Google Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
