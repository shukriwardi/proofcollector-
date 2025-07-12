
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle, Link, BarChart3 } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <RouterLink to="/" className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-black" />
          <span className="text-xl font-semibold text-black">ProofCollector</span>
        </RouterLink>
        <div className="flex items-center space-x-4">
          <RouterLink to="/login">
            <Button variant="ghost" className="text-black hover:bg-gray-50 rounded-full px-6">
              Log in
            </Button>
          </RouterLink>
          <RouterLink to="/signup">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
              Sign up
            </Button>
          </RouterLink>
        </div>
      </nav>

      {/* Hero Section with top padding for fixed nav */}
      <section className="px-6 py-20 pt-32 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-black mb-6 leading-tight">
          Collect powerful testimonials
          <span className="block text-gray-600">effortlessly</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Help your business grow with authentic client testimonials. Create request links, 
          collect feedback, and showcase social proof that converts.
        </p>
        <div className="flex justify-center">
          <RouterLink to="/signup">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started
            </Button>
          </RouterLink>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Everything you need to collect testimonials
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                <Link className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Custom Request Links</h3>
              <p className="text-gray-600">
                Create personalized testimonial request links and share them with your clients. 
                Track submissions and manage everything in one place.
              </p>
            </Card>

            <Card className="p-8 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Easy Submission</h3>
              <p className="text-gray-600">
                Your clients can submit testimonials through a simple, beautiful form. 
                No account creation required - just click and share.
              </p>
            </Card>

            <Card className="p-8 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Manage & Display</h3>
              <p className="text-gray-600">
                View all testimonials in your dashboard, get embed codes, and showcase 
                them on your website to build trust and credibility.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-12">
            Trusted by growing businesses
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "This tool has transformed how we collect client feedback. The process is so simple, 
                and our clients love how easy it is to submit testimonials."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-black">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Marketing Consultant</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Finally, a clean and professional way to gather testimonials. 
                The dashboard makes it easy to manage everything in one place."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-black">Michael Chen</p>
                  <p className="text-sm text-gray-500">Life Coach</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-black text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Start collecting testimonials today
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of businesses already using our platform to build trust and grow faster.
        </p>
        <RouterLink to="/signup">
          <Button className="bg-white text-black hover:bg-gray-100 rounded-xl px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
            Get Started
          </Button>
        </RouterLink>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MessageCircle className="h-6 w-6 text-black" />
            <span className="text-lg font-semibold text-black">ProofCollector</span>
          </div>
          <div className="flex space-x-6 text-gray-600">
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
