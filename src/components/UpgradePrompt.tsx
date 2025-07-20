
import { Card } from "@/components/ui/card";

interface UpgradePromptProps {
  type: 'survey' | 'response' | 'download';
  currentCount: number;
  limit: number;
  onUpgrade?: () => void;
  isPro?: boolean;
}

export const UpgradePrompt = ({ type }: UpgradePromptProps) => {
  console.log('🔒 UpgradePrompt: Disabled (Stripe removed)');
  
  return (
    <Card className="p-6 bg-gray-900 border border-gray-800">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Billing Temporarily Disabled
        </h3>
        <p className="text-gray-300">
          Stripe integration is disabled for testing. All features are currently available.
        </p>
      </div>
    </Card>
  );
};
