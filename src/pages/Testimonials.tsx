
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, Code, Download, Trash2, Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  testimonial: string;
  created_at: string;
  survey: {
    id: string;
    title: string;
    question: string;
  };
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTestimonials();
    }
  }, [user]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          survey:surveys (
            id,
            title,
            question
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to load testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
      toast({
        title: "Testimonial Deleted",
        description: "The testimonial has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateEmbedCode = (testimonial: Testimonial) => {
    return `<div style="max-width: 400px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: white;">
  <p style="margin: 0 0 16px 0; color: #374151; line-height: 1.5;">"${testimonial.testimonial}"</p>
  <div style="display: flex; align-items: center; gap: 8px;">
    <strong style="color: #111827;">${testimonial.name}</strong>
  </div>
</div>`;
  };

  // Calculate stats
  const totalTestimonials = testimonials.length;
  const uniqueSurveys = new Set(testimonials.map(t => t.survey.id)).size;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{totalTestimonials}</p>
              <p className="text-sm text-gray-600">Total Testimonials</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalTestimonials}</p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{uniqueSurveys}</p>
              <p className="text-sm text-gray-600">Survey Sources</p>
            </div>
          </Card>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {filteredTestimonials.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center">
              <p className="text-gray-500">
                {searchTerm ? "No testimonials found matching your search." : "No testimonials yet. Share your survey links to start collecting testimonials!"}
              </p>
            </Card>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold text-black">{testimonial.name}</h3>
                      <Badge variant="default" className="text-xs">
                        Published
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.survey.title}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      "{testimonial.testimonial}"
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{testimonial.email || "No email provided"}</span>
                      <span>•</span>
                      <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
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
                              <p className="text-sm text-gray-600 mb-2">Survey: {selectedTestimonial.survey.title}</p>
                              <p className="text-sm text-gray-600 mb-4">
                                {selectedTestimonial.email || "No email provided"} • {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                              </p>
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Question:</p>
                                <p className="text-sm text-gray-600 italic">{selectedTestimonial.survey.question}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
                                <p className="text-gray-800 leading-relaxed">"{selectedTestimonial.testimonial}"</p>
                              </div>
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
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                    >
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
