
interface UsageEnforcementProps {
  type: 'surveys' | 'responses' | 'downloads';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const UsageEnforcement = ({ children }: UsageEnforcementProps) => {
  // No usage enforcement - always render children
  return <>{children}</>;
};
