
import { Card } from "@/components/ui/card";
import { MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SurveyNotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="p-12 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl text-center max-w-md w-full">
        <div className="w-20 h-20 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-800">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-6">Survey Not Found</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          The survey you're looking for doesn't exist, has been removed, or may have expired.
        </p>
        
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <p className="text-sm text-gray-400 leading-relaxed">
            If you believe this is an error, please contact the person who sent you this link.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="rounded-lg border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-purple-500 transition-all duration-200"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Card>
    </div>
  );
};
