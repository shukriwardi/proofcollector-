
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
      <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Surveys</p>
            <p className="text-2xl font-bold text-black">{totalSurveys}</p>
          </div>
          <Link2 className="h-8 w-8 text-gray-400" />
        </div>
      </Card>

      <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Testimonials</p>
            <p className="text-2xl font-bold text-black">{totalTestimonials}</p>
          </div>
          <MessageCircle className="h-8 w-8 text-gray-400" />
        </div>
      </Card>

      <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Surveys</p>
            <p className="text-2xl font-bold text-black">{activeSurveys}</p>
          </div>
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
      </Card>
    </div>
  );
};
