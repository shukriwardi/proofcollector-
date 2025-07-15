
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Star } from "lucide-react";
import { format } from "date-fns";
import { useSEO } from "@/hooks/useSEO";

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

export const TestimonialView = () => {
  const { id } = useParams<{ id: string }>();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic SEO based on testimonial data
  useSEO({
    title: testimonial 
      ? `${testimonial.name} | Testimonial — ProofCollector`
      : 'Testimonial — ProofCollector',
    description: testimonial 
      ? `"${testimonial.testimonial.slice(0, 150)}${testimonial.testimonial.length > 150 ? '...' : ''}" - ${testimonial.name}`
      : 'View this verified testimonial on ProofCollector - authentic social proof that builds trust.',
    image: 'https://proofcollector.shacnisaas.com/og-testimonial.png',
    url: testimonial 
      ? `https://proofcollector.shacnisaas.com/t/${testimonial.id}`
      : undefined,
    type: 'article'
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      if (!id) {
        setError("No testimonial ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching testimonial with ID:", id);
        
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
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          if (error.code === 'PGRST116') {
            setError("Social proof not found");
          } else {
            setError("Failed to load social proof");
          }
          return;
        }

        if (!data) {
          setError("Social proof not found");
          return;
        }

        console.log("Testimonial data:", data);
        setTestimonial(data);
      } catch (err) {
        console.error('Error fetching testimonial:', err);
        setError("Failed to load social proof");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading social proof...</p>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Social Proof Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || "The social proof you're looking for doesn't exist or has been removed."}
          </p>
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold">ProofCollector</span>
          </p>
        </div>
      </div>
    );
  }

  // Generate star rating (assume 5 stars for testimonials)
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-black mb-2">
                {testimonial.survey.title}
              </h1>
              <p className="text-gray-600">
                {testimonial.survey.question}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {renderStars()}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="mb-8">
              <blockquote className="text-lg text-gray-800 leading-relaxed italic text-center">
                "{testimonial.testimonial}"
              </blockquote>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {testimonial.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {format(new Date(testimonial.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="text-center">
              <Badge variant="secondary" className="bg-black text-white">
                Verified Social Proof
              </Badge>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Powered by <span className="font-semibold text-black">ProofCollector</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
