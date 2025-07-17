
import { Card } from "@/components/ui/card";
import { Link2, MessageCircle, Eye } from "lucide-react";

interface DashboardStatsProps {
  totalSurveys: number;
  totalTestimonials: number;
  activeSurveys: number;
}

export const DashboardStats = ({ totalSurveys, totalTestimonials, activeSurveys }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Surveys</p>
            <p className="text-2xl font-bold text-white">{totalSurveys}</p>
          </div>
          <Link2 className="h-8 w-8 text-purple-500" />
        </div>
      </Card>

      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Testimonials</p>
            <p className="text-2xl font-bold text-white">{totalTestimonials}</p>
          </div>
          <MessageCircle className="h-8 w-8 text-purple-500" />
        </div>
      </Card>

      <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Active Surveys</p>
            <p className="text-2xl font-bold text-white">{activeSurveys}</p>
          </div>
          <Eye className="h-8 w-8 text-purple-500" />
        </div>
      </Card>
    </div>
  );
};
