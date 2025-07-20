import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { TestimonialStats } from "@/components/testimonials/TestimonialStats";
import { TestimonialFilters } from "@/components/testimonials/TestimonialFilters";
import { TestimonialView } from "@/components/testimonials/TestimonialView";
import { TestimonialEmbed } from "@/components/testimonials/TestimonialEmbed";
import { TestimonialDownload } from "@/components/testimonials/TestimonialDownload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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

interface Survey {
  id: string;
  title: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState("all");
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);
  const [embeddingTestimonial, setEmbeddingTestimonial] = useState<Testimonial | null>(null);
  const [downloadingTestimonial, setDownloadingTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
    fetchSurveys();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*, survey:survey_id(id, title, question)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching testimonials:", error);
        toast({
          title: "Error",
          description: "Failed to load testimonials.",
          variant: "destructive",
        });
      } else {
        setTestimonials(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title');

      if (error) {
        console.error("Error fetching surveys:", error);
        toast({
          title: "Error",
          description: "Failed to load surveys.",
          variant: "destructive",
        });
      } else {
        setSurveys(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching surveys:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to load surveys due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) {
        console.error("Error deleting testimonial:", error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial.",
          variant: "destructive",
        });
      } else {
        setTestimonials(testimonials.filter(t => t.id !== testimonialId));
        toast({
          title: "Success",
          description: "Testimonial deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Unexpected error deleting testimonial:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to delete testimonial due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const handleSurveyChange = (surveyId: string) => {
    setSelectedSurvey(surveyId);
  };

  const filteredTestimonials = selectedSurvey === "all"
    ? testimonials
    : testimonials.filter(t => t.survey.id === selectedSurvey);

  const totalTestimonials = testimonials.length;
  const totalSurveys = surveys.length;
  const averageRating = 5;

  return (
    <div className="container mx-auto py-10">
      {/* Stats Section */}
      <TestimonialStats
        totalTestimonials={totalTestimonials}
        totalSurveys={totalSurveys}
        averageRating={averageRating}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {/* Filters Section */}
        <div className="md:col-span-1">
          <TestimonialFilters
            surveys={surveys}
            selectedSurvey={selectedSurvey}
            onSurveyChange={handleSurveyChange}
          />
        </div>

        {/* List and Search Section */}
        <div className="md:col-span-3">
          <div className="mb-4 flex items-center">
            <Input
              type="search"
              placeholder="Search testimonials..."
              className="bg-gray-800 border-gray-700 text-white shadow-none focus-visible:ring-purple-500 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" className="ml-2">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading testimonials...</p>
          ) : (
            <TestimonialList
              testimonials={filteredTestimonials}
              searchTerm={searchTerm}
              onView={(testimonial) => setViewingTestimonial(testimonial)}
              onEmbed={(testimonial) => setEmbeddingTestimonial(testimonial)}
              onDownload={(testimonial) => setDownloadingTestimonial(testimonial)}
              onDelete={handleDeleteTestimonial}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {viewingTestimonial && (
        <TestimonialView
          testimonial={viewingTestimonial}
          onClose={() => setViewingTestimonial(null)}
        />
      )}
      {embeddingTestimonial && (
        <TestimonialEmbed
          testimonial={embeddingTestimonial}
          onClose={() => setEmbeddingTestimonial(null)}
        />
      )}
      {downloadingTestimonial && (
        <TestimonialDownload
          testimonial={downloadingTestimonial}
          onClose={() => setDownloadingTestimonial(null)}
        />
      )}
    </div>
  );
};

export default Testimonials;
