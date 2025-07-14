
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "./LoadingSpinner";
import { Star, Calendar, User, Mail } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  testimonial: string;
  created_at: string;
  survey_id: string;
  surveys: {
    title: string;
    question: string;
  };
}

export const TestimonialView = () => {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTestimonial();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      console.log('Fetching testimonial with ID:', id);
      
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          surveys (
            title,
            question
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching testimonial:', error);
        if (error.code === 'PGRST116') {
          setNotFound(true);
        }
        return;
      }

      if (!data) {
        console.log('No testimonial found with ID:', id);
        setNotFound(true);
        return;
      }

      console.log('Testimonial data fetched:', data);
      setTestimonial(data);
    } catch (error) {
      console.error('Unexpected error fetching testimonial:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading testimonial..." />;
  }

  if (notFound || !testimonial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center max-w-md w-full">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-black mb-4">Testimonial Not Found</h1>
          <p className="text-gray-600">
            The testimonial you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            {testimonial.surveys?.title || 'Customer Testimonial'}
          </h1>
          {testimonial.surveys?.question && (
            <p className="text-lg text-gray-600">
              "{testimonial.surveys.question}"
            </p>
          )}
        </div>

        {/* Testimonial Card */}
        <Card className="p-8 bg-white border-0 shadow-sm rounded-xl">
          <div className="space-y-6">
            {/* Stars decoration */}
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Testimonial text */}
            <blockquote className="text-xl text-gray-800 leading-relaxed text-center italic">
              "{testimonial.testimonial}"
            </blockquote>

            {/* Author info */}
            <div className="flex flex-col items-center space-y-2 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-semibold text-lg">{testimonial.name}</span>
              </div>
              
              {testimonial.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{testimonial.email}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(testimonial.created_at)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for sharing your experience with us!
          </p>
        </div>
      </div>
    </div>
  );
};
