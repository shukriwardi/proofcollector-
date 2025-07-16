
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle, Link, BarChart3, Mail, ArrowRight, Check } from "lucide-react";
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

      {/* Features Section */}
      <section className="px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Everything you need to collect testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple tools that make collecting and showcasing testimonials effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Link className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Smart Collection Links</h3>
              <p className="text-gray-600 leading-relaxed">
                Create personalized testimonial request links and share them with your clients. 
                Track submissions and manage everything in one dashboard.
              </p>
            </Card>

            <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Beautiful Forms</h3>
              <p className="text-gray-600 leading-relaxed">
                Your clients submit testimonials through elegant, mobile-friendly forms. 
                No account creation required — just click and share.
              </p>
            </Card>

            <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Showcase & Embed</h3>
              <p className="text-gray-600 leading-relaxed">
                Display testimonials on your website with beautiful widgets. 
                Export as images or get embed codes for seamless integration.
              </p>
            </Card>
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
