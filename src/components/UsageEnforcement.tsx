
interface UsageEnforcementProps {
  type: 'surveys' | 'responses' | 'downloads';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const UsageEnforcement = ({ children }: UsageEnforcementProps) => {
  // Always render children - no enforcement during testing
  console.log('🔒 UsageEnforcement: Disabled (Stripe removed)');
  return <>{children}</>;
};
