
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const isLinkRoute = location.pathname.startsWith('/link/');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="p-12 bg-gray-900 border-gray-800 shadow-sm rounded-xl text-center max-w-md w-full">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-white mb-4">
          {isLinkRoute ? 'Survey Not Found' : '404 - Page Not Found'}
        </h1>
        
        <p className="text-gray-400 mb-6">
          {isLinkRoute 
            ? 'The survey link you\'re looking for doesn\'t exist or has been removed.'
            : 'The page you\'re looking for doesn\'t exist.'
          }
        </p>
        
        <Button 
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center space-x-2 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
        >
          <Home className="h-4 w-4" />
          <span>Go Home</span>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
