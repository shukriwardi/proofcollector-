
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";

interface UsageLimitsProps {
  surveys?: { current: number; limit: number };
  responses?: { current: number; limit: number };
  downloads?: { current: number; limit: number };
}

export const UsageLimits = ({ surveys, responses, downloads }: UsageLimitsProps) => {
  const { subscription } = useSubscription();
  const isPro = subscription.subscription_tier === 'pro';

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLimitBadge = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 100) return <Badge variant="destructive">Limit Reached</Badge>;
    if (percentage >= 90) return <Badge className="bg-yellow-600">Near Limit</Badge>;
    return <Badge className="bg-green-600">Active</Badge>;
  };

  return (
    <Card className="p-6 bg-gray-900 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        Usage This Month
        <Badge className={`ml-2 ${isPro ? 'bg-purple-600' : 'bg-green-600'}`}>
          {isPro ? 'Pro' : 'Free'}
        </Badge>
      </h3>
      
      <div className="space-y-4">
        {surveys && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Surveys Created</span>
              {getLimitBadge(surveys.current, surveys.limit)}
            </div>
            <div className="flex items-center space-x-3">
              <Progress 
                value={(surveys.current / surveys.limit) * 100} 
                className="flex-1"
              />
              <span className="text-sm text-gray-400 min-w-[60px]">
                {surveys.current}/{surveys.limit}
              </span>
            </div>
          </div>
        )}
        
        {responses && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Responses Collected</span>
              {getLimitBadge(responses.current, responses.limit)}
            </div>
            <div className="flex items-center space-x-3">
              <Progress 
                value={(responses.current / responses.limit) * 100} 
                className="flex-1"
              />
              <span className="text-sm text-gray-400 min-w-[60px]">
                {responses.current}/{responses.limit}
              </span>
            </div>
          </div>
        )}
        
        {downloads && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Downloads/Embeds</span>
              {getLimitBadge(downloads.current, downloads.limit)}
            </div>
            <div className="flex items-center space-x-3">
              <Progress 
                value={(downloads.current / downloads.limit) * 100} 
                className="flex-1"
              />
              <span className="text-sm text-gray-400 min-w-[60px]">
                {downloads.current}/{downloads.limit}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {isPro && (
        <p className="text-sm text-gray-500 mt-4">
          Pro users get priority support and higher limits. Response limit resets monthly.
        </p>
      )}
    </Card>
  );
};
