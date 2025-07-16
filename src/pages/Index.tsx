
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle, Link, BarChart3, Mail, ArrowRight, Check, Settings, Send, Database, Share2, Image } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <RouterLink to="/" className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-black" />
          <span className="text-xl font-semibold text-black">ProofCollector</span>
        </RouterLink>
        <div className="flex items-center space-x-3">
          <RouterLink to="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg px-4 py-2">
              Sign in
            </Button>
          </RouterLink>
          <RouterLink to="/signup">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-6 py-2 shadow-sm">
              Get started
            </Button>
          </RouterLink>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 py-24 pt-32 text-center max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight tracking-tight">
            Collect testimonials that actually
            <span className="block text-gray-600">convert customers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The easiest way to collect, manage, and showcase customer testimonials. 
            Build trust and grow your business with authentic social proof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <RouterLink to="/signup">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                Start collecting testimonials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </RouterLink>
            <p className="text-sm text-gray-500">Free plan available • No credit card required</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">How it works</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
              Start collecting & sharing testimonials
              <span className="block text-black">in a few easy steps</span>
            </h3>
            
            {/* Featured Testimonial Card */}
            <div className="mt-12 flex justify-center">
              <Card className="p-8 bg-gradient-to-br from-black to-gray-800 text-white rounded-3xl shadow-2xl max-w-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 leading-relaxed">
                  "ProofCollector made it easy to collect and share testimonials for a reasonable price. 
                  The simple process helped me showcase authentic customer feedback without any hassle."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">PC</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">ProofCollector Team</div>
                    <div className="text-gray-300 text-sm">Founder</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 4-Step Process */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Step 1: Create Customizable Survey */}
            <div className="text-center">
              <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <div className="text-left">
                    <div className="text-sm text-gray-500 mb-2">Survey Title</div>
                    <div className="h-3 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-500 mb-2">Question</div>
                    <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-500 mb-2">Settings</div>
                    <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-black mb-3">Create Customizable Survey</h3>
              <p className="text-gray-600 leading-relaxed">
                Set up your testimonial collection survey with custom questions and design to match your brand perfectly.
              </p>
            </div>

            {/* Step 2: Send as Link */}
            <div className="text-center">
              <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <Card className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Email</span>
                    </div>
                    <div className="text-xs text-blue-600">https://app.com/survey/abc123</div>
                  </Card>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-green-100 rounded-lg p-2 text-xs text-green-800">DM</div>
                    <div className="flex-1 bg-purple-100 rounded-lg p-2 text-xs text-purple-800">Slack</div>
                  </div>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-black mb-3">Send as Link</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your survey link via email, DMs, or any communication app. Customers can submit testimonials with no signup required.
              </p>
            </div>

            {/* Step 3: Collect in Dashboard */}
            <div className="text-center">
              <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-left">
                    <span className="text-sm text-gray-600">Testimonials</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">24 new</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-black rounded-full"></div>
                    <div className="h-2 bg-gray-300 rounded-full"></div>
                    <div className="h-2 bg-black rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
                  </div>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-black mb-3">Collect in Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                All testimonials are automatically organized in your dashboard. Filter, sort, and manage your social proof from one place.
              </p>
            </div>

            {/* Step 4: Copy as Image or Embed */}
            <div className="text-center">
              <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  4
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-2 bg-black text-white rounded-lg flex items-center justify-center">
                    <Image className="h-4 w-4" />
                  </Card>
                  <Card className="p-2 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-mono text-gray-600">&lt;/&gt;</span>
                  </Card>
                  <Card className="p-2 bg-blue-50 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </Card>
                  <Card className="p-2 bg-green-50 rounded-lg flex items-center justify-center">
                    <div className="text-xs text-green-600 font-bold">IG</div>
                  </Card>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-black mb-3">Copy as Image or Embed</h3>
              <p className="text-gray-600 leading-relaxed">
                Export testimonials as images for marketing or embed them directly on your website with our simple embed code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Trusted by growing businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of companies using ProofCollector to build trust
            </p>
          </div>
          
          <Card className="p-12 lg:p-16 bg-gray-50 border border-gray-100 rounded-2xl text-center">
            <div className="mb-8">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-semibold text-black mb-4">
              Real testimonials coming soon
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Once we collect feedback from our amazing early users, you'll see authentic testimonials featured here. 
              Be among the first to experience the power of social proof.
            </p>
          </Card>
        </div>
      </section>

      {/* Features List */}
      <section className="px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
                Why choose ProofCollector?
              </h2>
              <div className="space-y-6">
                {[
                  "Setup in under 2 minutes",
                  "Beautiful, mobile-responsive forms", 
                  "Automatic testimonial management",
                  "Easy website integration",
                  "Export options (image, embed code)",
                  "No technical skills required"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <div className="mb-6">
                <Mail className="h-12 w-12 text-black mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4 text-center">
                Questions or feedback?
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                I'd love to hear from you. Email me directly at
              </p>
              <div className="text-center">
                <a 
                  href="mailto:shukriwardi01@gmail.com" 
                  className="text-black font-medium hover:text-gray-700 transition-colors text-lg"
                >
                  shukriwardi01@gmail.com
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-24 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Start collecting testimonials today
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of businesses already using ProofCollector to build trust and grow faster.
          </p>
          <RouterLink to="/signup">
            <Button className="bg-white text-black hover:bg-gray-100 rounded-lg px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </RouterLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <MessageCircle className="h-6 w-6 text-black" />
            <span className="text-lg font-semibold text-black">ProofCollector</span>
          </div>
          <div className="flex space-x-8 text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
