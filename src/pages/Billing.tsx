
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Billing = () => {
  console.log('🔒 Billing page: Stripe disabled for testing');

  return (
    <div className="min-h-screen bg-black">
      <div className="space-y-8 p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Billing Temporarily Disabled</h1>
          <p className="text-gray-400">Stripe integration has been removed for testing purposes</p>
        </div>

        <Card className="p-6 bg-gray-900 border border-orange-500/50">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-600/20 rounded-full">
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              Testing Mode Active
            </h3>
            
            <p className="text-gray-300 mb-4">
              All Stripe-related functionality has been temporarily disabled to isolate loading issues.
              All features are currently available without restrictions.
            </p>
            
            <p className="text-sm text-gray-400">
              This page will be restored once testing is complete.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
