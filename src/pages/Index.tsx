import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle, Link, BarChart3, Mail, ArrowRight, Check, Settings, Send, Database, Share2, Image, Clock, UserPlus, ExternalLink, Zap } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black font-inter text-white">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-8 py-4 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <RouterLink to="/" className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-purple-500" />
          <span className="text-xl font-semibold text-white">ProofCollector</span>
        </RouterLink>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Pricing</a>
          <RouterLink to="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-2">
              Sign in
            </Button>
          </RouterLink>
          <RouterLink to="/signup">
            <Button className="bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-6 py-2 shadow-sm">
              Get started
            </Button>
          </RouterLink>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 py-24 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                "The easiest and most effective testimonial tool"
              </h1>
              
              {/* Founder testimonial */}
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">PC</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">ProofCollector Founder</h3>
                  <p className="text-gray-400 text-sm">Creator</p>
                </div>
              </div>

              <blockquote className="text-xl text-gray-300 mb-8 leading-relaxed">
                "Here at ProofCollector, we created the simplest way to collect and share powerful testimonials. With just 4 easy steps, you can have a steady flow of authentic customer feedback without any technical hassle - all at a fair price that won't break your budget."
              </blockquote>

              {/* Key benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300">Get testimonials in just 4 simple steps</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300">Share via any communication app or email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300">Download images or embed on your website</span>
                </div>
              </div>

              <RouterLink to="/signup">
                <Button className="bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  Start for free today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </RouterLink>

              {/* Social proof */}
              <div className="flex items-center space-x-4 mt-6">
                <span className="text-sm text-gray-400">Start collecting powerful testimonials today - just in 5 minutes you can already get started</span>
              </div>
            </div>

            {/* Right side - Video Demo */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">See ProofCollector in Action</h3>
                <p className="text-gray-300 mb-6">Watch how easy it is to collect and manage testimonials</p>
                <div className="bg-gray-800 rounded-xl p-12 border border-gray-700">
                  <div className="flex items-center justify-center space-x-2 text-purple-400">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <p className="text-gray-400 mt-4">Interactive demo coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started in Under 5 Minutes Section */}
      <section className="px-6 lg:px-8 py-16 bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-gray-400" />
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Quick Setup</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Collect testimonials in under 5 minutes
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Get your testimonial collection system up and running in minutes, not hours.
          </p>
          
          {/* 4-Step Quick Timeline */}
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            {/* Step 1: Sign up */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Sign up</h3>
              <p className="text-gray-400 text-sm">
                Create your free account in seconds
              </p>
            </div>

            {/* Step 2: Create your unique link */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Create your unique link</h3>
              <p className="text-gray-400 text-sm">
                Generate a custom survey link instantly
              </p>
            </div>

            {/* Step 3: Share it with customers */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Share it with customers</h3>
              <p className="text-gray-400 text-sm">
                Send via email, DM, or any platform
              </p>
            </div>

            {/* Step 4: Get testimonials instantly */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Get testimonials instantly</h3>
              <p className="text-gray-400 text-sm">
                Watch authentic reviews come in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">How it works</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start collecting & sharing testimonials
              <span className="block text-white">in a few easy steps</span>
            </h3>
          </div>

          {/* 3-Step Process with Screenshots */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1: Send as Link */}
            <div className="text-center">
              <Card className="p-8 bg-gray-900 border border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <Card className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl text-left">
                    <div className="flex items-center space-x-2 mb-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">Email</span>
                    </div>
                    <div className="text-xs text-blue-300 font-mono break-all bg-gray-800 p-2 rounded border border-gray-700">
                      https://proofcollector.com/submit/abc123
                    </div>
                  </Card>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs text-green-300 text-center font-medium">WhatsApp</div>
                    <div className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs text-purple-300 text-center font-medium">Slack</div>
                  </div>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-white mb-3">Send as Link</h3>
              <p className="text-gray-400 leading-relaxed">
                Share your survey link via email, DMs, or any communication app. Customers can submit testimonials with no signup required.
              </p>
            </div>

            {/* Step 2: Collect in Dashboard */}
            <div className="text-center">
              <Card className="p-4 bg-gray-900 border border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  2
                </div>
                <img 
                  src="/lovable-uploads/8bcd2d2e-5eb7-4c5e-948e-b19e0f91d9dd.png" 
                  alt="Testimonials Dashboard" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </Card>
              <h3 className="text-xl font-semibold text-white mb-3">Collect in Dashboard</h3>
              <p className="text-gray-400 leading-relaxed">
                All testimonials are automatically organized in your dashboard. Filter, sort, and manage your social proof from one place.
              </p>
            </div>

            {/* Step 3: Copy as Image or Embed */}
            <div className="text-center">
              <Card className="p-8 bg-gray-900 border border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl mb-6 min-h-[280px] flex flex-col justify-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-2 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                    <Image className="h-4 w-4" />
                  </Card>
                  <Card className="p-2 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-mono text-gray-300">&lt;/&gt;</span>
                  </Card>
                  <Card className="p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </Card>
                  <Card className="p-2 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                    <div className="text-xs text-green-400 font-bold">IG</div>
                  </Card>
                </div>
              </Card>
              <h3 className="text-xl font-semibold text-white mb-3">Copy as Image or Embed</h3>
              <p className="text-gray-400 leading-relaxed">
                Export testimonials as images for marketing or embed them directly on your website with our simple embed code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Collection Section */}
      <section className="px-6 lg:px-8 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Features */}
            <div>
              <p className="text-purple-400 font-medium mb-4 italic">Testimonial Collection</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                Effortlessly collect the social proof you need
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Settings className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Customizable Forms</h3>
                    <p className="text-gray-400">
                      Set it and forget it — let ProofCollector automatically collect testimonials via forms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Incentivize Collection</h3>
                    <p className="text-gray-400">
                      Sweeten the deal by offering rewards for testimonials and send out automated thank-yous.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Powerful Dashboard</h3>
                    <p className="text-gray-400">
                      Go all out — collect as many testimonials as you want with paid plans, or up to 15 on the free tier.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Founder Testimonial */}
            <div className="relative">
              <Card className="p-8 lg:p-12 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30 text-white rounded-3xl shadow-2xl">
                <div className="text-6xl text-purple-400 mb-6">"</div>
                <blockquote className="text-xl lg:text-2xl leading-relaxed mb-8">
                  "Word of mouth is your strongest marketing — ProofCollector helps you capture it with ease. I built this tool to solve the exact problem I faced: collecting authentic testimonials without the technical hassle."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">PC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">ProofCollector Founder</div>
                    <div className="text-purple-300">Founder, ProofCollector</div>
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
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
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
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 bg-gray-900 border border-gray-800 shadow-lg rounded-2xl">
              <div className="mb-6">
                <Mail className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Questions or feedback?
              </h3>
              <p className="text-gray-400 mb-6 text-center">
                I'd love to hear from you. Email me directly at
              </p>
              <div className="text-center">
                <a 
                  href="mailto:shukriwardi01@gmail.com" 
                  className="text-purple-400 font-medium hover:text-purple-300 transition-colors text-lg"
                >
                  shukriwardi01@gmail.com
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-24 bg-purple-900/20 border-t border-purple-500/30 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Start collecting testimonials today
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Grow your reach through word of mouth without breaking the bank.
          </p>
          <RouterLink to="/signup">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </RouterLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            <span className="text-lg font-semibold text-white">ProofCollector</span>
          </div>
          <div className="flex space-x-8 text-gray-400">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
