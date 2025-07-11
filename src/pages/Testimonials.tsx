
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, Code, Download, Trash2, Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const Testimonials = () => {
  const [testimonials] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      testimonial: "This service has completely transformed how I manage my business. The customer support is exceptional and the features are exactly what I needed. I would definitely recommend this to anyone looking for a reliable solution.",
      date: "2024-01-20",
      linkName: "General Feedback",
      approved: true
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      testimonial: "Outstanding product! The interface is intuitive and the results speak for themselves. I've seen a 40% increase in efficiency since implementing this solution.",
      date: "2024-01-18",
      linkName: "Product Review",
      approved: true
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@example.com",
      testimonial: "Great experience working with the team. They were professional, responsive, and delivered exactly what was promised. The onboarding process was smooth and well-structured.",
      date: "2024-01-15",
      linkName: "General Feedback",
      approved: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.linkName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateEmbedCode = (testimonial: any) => {
    return `<div style="max-width: 400px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: white;">
  <p style="margin: 0 0 16px 0; color: #374151; line-height: 1.5;">"${testimonial.testimonial}"</p>
  <div style="display: flex; align-items: center; gap: 8px;">
    <strong style="color: #111827;">${testimonial.name}</strong>
  </div>
</div>`;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Testimonials</h1>
            <p className="text-gray-600 mt-2">Manage and display your collected testimonials</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{testimonials.length}</p>
              <p className="text-sm text-gray-600">Total Testimonials</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {testimonials.filter(t => t.approved).length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {testimonials.filter(t => !t.approved).length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">
                {new Set(testimonials.map(t => t.linkName)).size}
              </p>
              <p className="text-sm text-gray-600">Sources</p>
            </div>
          </Card>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {filteredTestimonials.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center">
              <p className="text-gray-500">No testimonials found matching your search.</p>
            </Card>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold text-black">{testimonial.name}</h3>
                      <Badge variant={testimonial.approved ? "default" : "secondary"} className="text-xs">
                        {testimonial.approved ? "Approved" : "Pending"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.linkName}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      "{testimonial.testimonial}"
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{testimonial.email}</span>
                      <span>•</span>
                      <span>{testimonial.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTestimonial(testimonial)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Testimonial Details</DialogTitle>
                        </DialogHeader>
                        {selectedTestimonial && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-black mb-2">From: {selectedTestimonial.name}</h3>
                              <p className="text-sm text-gray-600 mb-4">{selectedTestimonial.email} • {selectedTestimonial.date}</p>
                              <p className="text-gray-800 leading-relaxed">"{selectedTestimonial.testimonial}"</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Code className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Embed Code</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Copy this code to embed the testimonial on your website:
                          </p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <code className="text-sm text-gray-800 whitespace-pre-wrap">
                              {generateEmbedCode(testimonial)}
                            </code>
                          </div>
                          <Button
                            onClick={() => navigator.clipboard.writeText(generateEmbedCode(testimonial))}
                            className="w-full"
                          >
                            Copy Embed Code
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Testimonials;
