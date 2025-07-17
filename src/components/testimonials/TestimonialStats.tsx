
import { Card } from "@/components/ui/card";
import { MessageCircle, CheckCircle, BarChart3 } from "lucide-react";

interface TestimonialStatsProps {
  totalTestimonials: number;
  uniqueSurveys: number;
}

export const TestimonialStats = ({ totalTestimonials, uniqueSurveys }: TestimonialStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalTestimonials}</p>
            <p className="text-sm text-gray-400">Total Testimonials</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{totalTestimonials}</p>
            <p className="text-sm text-gray-400">Published</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{uniqueSurveys}</p>
            <p className="text-sm text-gray-400">Survey Sources</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
