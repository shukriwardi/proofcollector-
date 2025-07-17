
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle, Link, BarChart3, Mail, ArrowRight, Check, Settings, Send, Database, Share2, Image, Clock, UserPlus, ExternalLink, Zap } from "lucide-react";
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
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
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

      {/* Hero Section - Inspired by Senja */}
      <section className="px-6 lg:px-8 py-24 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight tracking-tight">
                "The easiest and most effective testimonial tool"
              </h1>
              
              {/* Founder testimonial */}
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">PC</span>
                </div>
                <div>
                  <h3 className="font-semibold text-black">ProofCollector Founder</h3>
                  <p className="text-gray-600 text-sm">Creator</p>
                </div>
              </div>

              <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed">
                "Here at ProofCollector, we made it easy to collect and share testimonials for a reasonable price. The simple process helps you showcase authentic customer feedback without any hassle."
              </blockquote>

              {/* Key benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700">Get testimonials in just 4 simple steps</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700">Share via any communication app or email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700">Download images or embed on your website</span>
                </div>
              </div>

              <RouterLink to="/signup">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  Start for free today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </RouterLink>

              {/* Social proof */}
              <div className="flex items-center space-x-4 mt-6">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">★</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Start collecting powerful testimonials today</span>
              </div>
            </div>

            {/* Right side - Actual ProofCollector Dashboard */}
            <div className="relative">
              <img 
                src="/lovable-uploads/321b8841-bdff-4a39-9b01-66cbff4fa279.png" 
                alt="ProofCollector Dashboard" 
                className="w-full rounded-2xl shadow-xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Get Started in Under 5 Minutes Section */}
      <section className="px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Quick Setup</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
            Collect testimonials in under 5 minutes
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get your testimonial collection system up and running in minutes, not hours.
          </p>
          
          {/* 4-Step Quick Timeline */}
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            {/* Step 1: Sign up */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">1. Sign up</h3>
              <p className="text-gray-600 text-sm">
                Create your free account in seconds
              </p>
            </div>

            {/* Step 2: Create your unique link */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">2. Create your unique link</h3>
              <p className="text-gray-600 text-sm">
                Generate a custom survey link instantly
              </p>
            </div>

            {/* Step 3: Share it with customers */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">3. Share it with customers</h3>
              <p className="text-gray-600 text-sm">
                Send via email, DM, or any platform
              </p>
            </div>

            {/* Step 4: Get testimonials instantly */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">4. Get testimonials instantly</h3>
              <p className="text-gray-600 text-sm">
                Watch authentic reviews come in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section with Actual Website Screenshots */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">How it works</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
              Start collecting & sharing testimonials
              <span className="block text-black">in a few easy steps</span>
            </h3>
          </div>

          {/* 4-Step Process with Actual Screenshots */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Step 1: Create Customizable Survey - using dashboard screenshot */}
            <div className="text-center">
              <Card className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  1
                </div>
                <img 
                  src="/lovable-uploads/321b8841-bdff-4a39-9b01-66cbff4fa279.png" 
                  alt="Create Survey Dashboard" 
                  className="w-full h-full object-cover rounded-2xl"
                />
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
                    <div className="text-xs text-blue-600 break-all">https://proofcollector.com/survey/abc123</div>
                  </Card>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-green-100 rounded-lg p-2 text-xs text-green-800 text-center">DM</div>
                    <div className="flex-1 bg-purple-100 rounded-lg p-2 text-xs text-purple-800 text-center">Slack</div>
                  </div>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-black mb-3">Send as Link</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your survey link via email, DMs, or any communication app. Customers can submit testimonials with no signup required.
              </p>
            </div>

            {/* Step 3: Collect in Dashboard - using testimonials screenshot */}
            <div className="text-center">
              <Card className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  3
                </div>
                <img 
                  src="/lovable-uploads/8bcd2d2e-5eb7-4c5e-948e-b19e0f91d9dd.png" 
                  alt="Testimonials Dashboard" 
                  className="w-full h-full object-cover rounded-2xl"
                />
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

      {/* Testimonial Collection Section - Inspired by Senja with founder quote */}
      <section className="px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Features */}
            <div>
              <p className="text-purple-600 font-medium mb-4 italic">Testimonial Collection</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-8 leading-tight">
                Effortlessly collect the social proof you need
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Customizable Forms</h3>
                    <p className="text-gray-600">
                      Set it and forget it — let ProofCollector automatically collect testimonials via forms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Incentivize Collection</h3>
                    <p className="text-gray-600">
                      Sweeten the deal by offering rewards for testimonials and send out automated thank-yous.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Powerful Dashboard</h3>
                    <p className="text-gray-600">
                      Go all out — collect as many testimonials as you want with paid plans, or up to 15 on the free tier.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Founder Testimonial */}
            <div className="relative">
              <Card className="p-8 lg:p-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-3xl shadow-2xl">
                <div className="text-6xl text-purple-300 mb-6">"</div>
                <blockquote className="text-xl lg:text-2xl leading-relaxed mb-8">
                  "Word of mouth is your strongest marketing — ProofCollector helps you capture it with ease. I built this tool to solve the exact problem I faced: collecting authentic testimonials without the technical hassle."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">PC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">ProofCollector Founder</div>
                    <div className="text-purple-200">Founder, ProofCollector</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="px-6 lg:px-8 py-20">
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
