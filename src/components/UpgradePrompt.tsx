
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

interface UpgradePromptProps {
  type: 'survey' | 'response' | 'download';
  currentCount: number;
  limit: number;
  onUpgrade?: () => void;
}

export const UpgradePrompt = ({ type, currentCount, limit, onUpgrade }: UpgradePromptProps) => {
  const { createCheckout } = useSubscription();
  const { user } = useAuth();

  const getTypeText = () => {
    switch (type) {
      case 'survey':
        return 'surveys';
      case 'response':
        return 'responses';
      case 'download':
        return 'downloads/embeds';
      default:
        return 'actions';
    }
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else if (user) {
      createCheckout();
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-600/20 rounded-full">
            <Lock className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          Monthly Limit Reached
        </h3>
        
        <p className="text-gray-300 mb-4">
          You've reached your monthly limit of {limit} {getTypeText()}. 
          ({currentCount}/{limit} used this month)
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro - Unlimited {getTypeText()}
          </Button>
          
          <p className="text-sm text-gray-400">
            Or wait until next month for your limits to reset
          </p>
        </div>
      </div>
    </Card>
  );
};
