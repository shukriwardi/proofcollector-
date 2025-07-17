
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Zap } from "lucide-react";

const Billing = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Plans</h1>
          <p className="text-gray-400">Choose the perfect plan for your testimonial collection needs</p>
        </div>

        {/* Current Plan */}
        <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600 text-white">Free Plan</Badge>
                <span className="text-gray-400">Up to 15 testimonials</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">$0</p>
              <p className="text-gray-400">per month</p>
            </div>
          </div>
        </Card>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <span className="text-gray-300">Up to 15 testimonials</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Custom survey forms</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Basic analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Email support</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800" disabled>
              Current Plan
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 bg-gray-900 border border-purple-500 shadow-lg rounded-xl relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
              Most Popular
            </Badge>
            
            <div className="text-center mb-6 mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="text-3xl font-bold text-white mb-2">$19</div>
              <p className="text-gray-400">per month</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Unlimited testimonials</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Advanced customization</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Detailed analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Priority support</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Custom branding</span>
              </li>
            </ul>
            
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <CreditCard className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-white mb-2">$99</div>
              <p className="text-gray-400">per month</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Everything in Pro</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">White-label solution</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">API access</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Dedicated support</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Custom integrations</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
              <Zap className="mr-2 h-4 w-4" />
              Contact Sales
            </Button>
          </Card>
        </div>

        {/* Billing History */}
        <Card className="p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Billing History</h2>
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No billing history available</p>
            <p className="text-gray-500 text-sm">Your billing history will appear here once you upgrade to a paid plan</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
