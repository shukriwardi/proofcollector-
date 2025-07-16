
import { Card } from "@/components/ui/card";
import { MessageCircle, CheckCircle, BarChart3 } from "lucide-react";

interface TestimonialStatsProps {
  totalTestimonials: number;
  uniqueSurveys: number;
}

export const TestimonialStats = ({ totalTestimonials, uniqueSurveys }: TestimonialStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-black">{totalTestimonials}</p>
            <p className="text-sm text-gray-600">Total Testimonials</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{totalTestimonials}</p>
            <p className="text-sm text-gray-600">Published</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-black">{uniqueSurveys}</p>
            <p className="text-sm text-gray-600">Survey Sources</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
