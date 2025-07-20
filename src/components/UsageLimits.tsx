
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UsageLimitsProps {
  surveys?: { current: number; limit: number };
  responses?: { current: number; limit: number };
  downloads?: { current: number; limit: number };
}

export const UsageLimits = ({ surveys, responses, downloads }: UsageLimitsProps) => {
  console.log('🔒 UsageLimits: Stripe disabled - showing test data');

  return (
    <Card className="p-6 bg-gray-900 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        Usage This Month
        <Badge className="ml-2 bg-orange-600">
          Testing Mode
        </Badge>
      </h3>
      
      <div className="space-y-4">
        {surveys && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Surveys Created</span>
              <Badge className="bg-green-600">No Limits</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-green-500 h-2 rounded"></div>
              <span className="text-sm text-gray-400 min-w-[60px]">
                {surveys.current}/∞
              </span>
            </div>
          </div>
        )}
        
        {responses && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Responses Collected</span>
              <Badge className="bg-green-600">No Limits</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-green-500 h-2 rounded"></div>
              <span className="text-sm text-gray-400 min-w-[60px]">
                {responses.current}/∞
              </span>
            </div>
          </div>
        )}
        
        {downloads && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Downloads/Embeds</span>
              <Badge className="bg-green-600">No Limits</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-green-500 h-2 rounded"></div>
              <span className="text-sm text-gray-400 min-w-[60px]">
                {downloads.current}/∞
              </span>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-orange-400 mt-4">
        🧪 Testing Mode: All limits disabled, Stripe integration removed
      </p>
    </Card>
  );
};
