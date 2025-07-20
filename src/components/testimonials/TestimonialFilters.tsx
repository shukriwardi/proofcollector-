
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Survey {
  id: string;
  title: string;
}

interface TestimonialFiltersProps {
  surveys: Survey[];
  selectedSurvey: string;
  onSurveyChange: Dispatch<SetStateAction<string>>;
}

export const TestimonialFilters = ({ surveys, selectedSurvey, onSurveyChange }: TestimonialFiltersProps) => {
  return (
    <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Survey Source</label>
          <Select value={selectedSurvey} onValueChange={onSurveyChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select a survey" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white hover:bg-gray-700">
                All Surveys ({surveys.length})
              </SelectItem>
              {surveys.map((survey) => (
                <SelectItem key={survey.id} value={survey.id} className="text-white hover:bg-gray-700">
                  {survey.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
