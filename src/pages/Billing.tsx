import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Zap, RefreshCw, Mail, Phone } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Billing = () => {
  const { user } = useAuth();
  const { subscription, loading, createCheckout, openCustomerPortal, checkSubscription } = useSubscription();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Handle success/cancel from Stripe redirect
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated. Refreshing subscription status...",
      });
      // Refresh subscription status after payment
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Payment canceled",
        description: "Your subscription was not activated.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to our Pro plan",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await createCheckout();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to manage your subscription",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await openCustomerPortal();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await checkSubscription();
      toast({
        title: "Subscription status refreshed",
        description: "Your subscription information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh subscription status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const isPro = subscription.subscription_tier === 'pro';

  return (
    <div className="min-h-screen bg-black">
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Plans</h1>
          <p className="text-gray-400">Choose the perfect plan for your testimonial collection needs</p>
        </div>

        {/* Current Plan */}
        {user && (
          <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
                <div className="flex items-center space-x-2">
                  <Badge className={isPro ? "bg-purple-600 text-white" : "bg-green-600 text-white"}>
                    {isPro ? "Pro Plan" : "Free Plan"}
                  </Badge>
                  {isPro ? (
                    <span className="text-gray-400">Unlimited surveys, 250 responses/month</span>
                  ) : (
                    <span className="text-gray-400">2 surveys/month, 10 responses total</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">${isPro ? "4" : "0"}</p>
                <p className="text-gray-400">per month</p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading || isRefreshing}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <div className="text-3xl font-bold text-white mb-2">$0</div>
              <p className="text-gray-400">per month</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">2 surveys per month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">10 responses total</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Download/embed 3 testimonials</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">ProofCollector branding</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800" 
              disabled={!isPro}
            >
              {!isPro ? "Current Plan" : "Downgrade Available"}
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 bg-gray-900 border border-purple-500 shadow-lg rounded-xl relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
              Recommended
            </Badge>
            
            <div className="text-center mb-6 mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="text-3xl font-bold text-white mb-2">$4</div>
              <p className="text-gray-400">per month</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Unlimited surveys</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">250 responses per month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Unlimited downloads/embeds</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">No ProofCollector branding</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Priority email support</span>
              </li>
            </ul>
            
            {isPro ? (
              <Button 
                onClick={handleManageSubscription}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Zap className="mr-2 h-4 w-4" />
                {isProcessing ? "Loading..." : "Manage Subscription"}
              </Button>
            ) : (
              <Button 
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessing ? "Loading..." : "Subscribe to Pro"}
              </Button>
            )}
          </Card>
        </div>

        {/* Subscription Management for Pro Users */}
        {isPro && (
          <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Subscription Management</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleManageSubscription}
                disabled={isProcessing}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessing ? "Loading..." : "Update Payment Method"}
              </Button>
              <Button
                onClick={handleManageSubscription}
                disabled={isProcessing}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                <Zap className="mr-2 h-4 w-4" />
                {isProcessing ? "Loading..." : "Cancel Subscription"}
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Cancellation takes effect at the end of your current billing period. No refunds for partial months.
            </p>
          </Card>
        )}

        {/* Support Section */}
        <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Support & Contact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                {isPro ? "Priority Support" : "Standard Support"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-gray-300">Email Support</p>
                    <a 
                      href="mailto:shukriwardi01@gmail.com" 
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      shukriwardi01@gmail.com
                    </a>
                  </div>
                </div>
                {isPro && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-gray-300">Priority Response</p>
                      <p className="text-gray-500 text-sm">24-hour response time</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Response Times</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pro users:</span>
                  <span className="text-green-400">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Free users:</span>
                  <span className="text-gray-500">72 hours</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Billing History</h2>
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            {isPro ? (
              <div>
                <p className="text-gray-400 mb-2">Your subscription is active</p>
                {subscription.subscription_end && (
                  <p className="text-gray-500 text-sm">
                    Next billing date: {new Date(subscription.subscription_end).toLocaleDateString()}
                  </p>
                )}
                <Button
                  onClick={handleManageSubscription}
                  disabled={isProcessing}
                  variant="outline"
                  className="mt-4 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {isProcessing ? "Loading..." : "View Billing Details"}
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400">No billing history available</p>
                <p className="text-gray-500 text-sm">Your billing history will appear here once you upgrade to Pro</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
