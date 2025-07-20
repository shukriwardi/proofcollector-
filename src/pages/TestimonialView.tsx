
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialView as TestimonialViewComponent } from "@/components/testimonials/TestimonialView";

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

const TestimonialView = () => {
  const { id } = useParams<{ id: string }>();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      if (!id) {
        setError("No testimonial ID provided");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*, survey:survey_id(id, title, question)')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching testimonial:", error);
          setError("Failed to load testimonial");
        } else {
          setTestimonial(data);
        }
      } catch (err) {
        console.error("Error fetching testimonial:", err);
        setError("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading testimonial...</div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">{error || "Testimonial not found"}</div>
      </div>
    );
  }

  return (
    <TestimonialViewComponent
      testimonial={testimonial}
      onClose={() => window.history.back()}
    />
  );
};

export default TestimonialView;
