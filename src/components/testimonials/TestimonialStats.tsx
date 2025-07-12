
import { Card } from "@/components/ui/card";

interface TestimonialStatsProps {
  totalTestimonials: number;
  uniqueSurveys: number;
}

export const TestimonialStats = ({ totalTestimonials, uniqueSurveys }: TestimonialStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-black">{totalTestimonials}</p>
          <p className="text-sm text-gray-600">Total Testimonials</p>
        </div>
      </Card>
      <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{totalTestimonials}</p>
          <p className="text-sm text-gray-600">Published</p>
        </div>
      </Card>
      <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-black">{uniqueSurveys}</p>
          <p className="text-sm text-gray-600">Survey Sources</p>
        </div>
      </Card>
    </div>
  );
};
