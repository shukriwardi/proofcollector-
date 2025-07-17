
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export const SurveyNotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="p-12 bg-gray-900 border border-gray-800 shadow-lg rounded-xl text-center max-w-md w-full">
        <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-4">Survey Not Found</h1>
        <p className="text-gray-300">
          The survey you're looking for doesn't exist or has been removed.
        </p>
      </Card>
    </div>
  );
};
