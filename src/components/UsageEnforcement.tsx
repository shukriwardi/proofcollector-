
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { UpgradePrompt } from "./UpgradePrompt";

interface UsageEnforcementProps {
  type: 'surveys' | 'responses' | 'downloads';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const UsageEnforcement = ({ type, children, fallback }: UsageEnforcementProps) => {
  const { canPerformAction, usage, isPro } = useUsageTracking();

  const canUse = canPerformAction(type);

  if (!canUse) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <UpgradePrompt
        type={type}
        currentCount={usage[type].current}
        limit={usage[type].limit}
        isPro={isPro}
      />
    );
  }

  return <>{children}</>;
};
