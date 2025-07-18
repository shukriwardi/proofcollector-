
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Crown, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

interface UpgradePromptProps {
  type: 'survey' | 'response' | 'download';
  currentCount: number;
  limit: number;
  onUpgrade?: () => void;
  isPro?: boolean;
}

export const UpgradePrompt = ({ type, currentCount, limit, onUpgrade, isPro = false }: UpgradePromptProps) => {
  const { createCheckout } = useSubscription();
  const { user } = useAuth();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else if (user) {
      createCheckout();
    }
  };

  // For Pro users who hit response limit
  if (isPro && type === 'response') {
    return (
      <Card className="p-6 bg-gradient-to-br from-yellow-900/50 to-orange-800/30 border border-orange-500/50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-600/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Response Limit Reached
          </h3>
          
          <p className="text-gray-300 mb-4">
            ⚠️ You've reached the 250 response limit for your Pro plan this month. Please wait for your next billing cycle for responses to reset.
          </p>
          
          <p className="text-sm text-gray-400">
            You can still create surveys and download testimonials. Response collection will resume next month.
          </p>
        </div>
      </Card>
    );
  }

  // For Free users who hit any limit
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-600/20 rounded-full">
            <Lock className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          Monthly Free Limit Reached
        </h3>
        
        <p className="text-gray-300 mb-4">
          🔒 You've reached your monthly free limit. Upgrade for just $4/month to unlock unlimited surveys, 250 responses, and more — or wait until next month to reset.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro - Just $4/month
          </Button>
          
          <p className="text-sm text-gray-400">
            Or wait until next month for your limits to reset
          </p>
        </div>
      </div>
    </Card>
  );
};
