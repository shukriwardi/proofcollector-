
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export const SurveyNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center max-w-md w-full">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-black mb-4">Survey Not Found</h1>
        <p className="text-gray-600">
          The survey you're looking for doesn't exist or has been removed.
        </p>
      </Card>
    </div>
  );
};
