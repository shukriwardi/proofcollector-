
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const theme = searchParams.get('theme') as 'light' | 'dark' || 'light';
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme-specific styles
  const isLight = theme === 'light';
  const themeStyles = {
    background: isLight ? 'bg-white' : 'bg-black',
    cardBg: isLight ? 'bg-gray-50' : 'bg-gray-900',
    cardBorder: isLight ? 'border-gray-200' : 'border-gray-800',
    textPrimary: isLight ? 'text-gray-900' : 'text-white',
    textSecondary: isLight ? 'text-gray-600' : 'text-gray-400',
    textMuted: isLight ? 'text-gray-500' : 'text-gray-500',
    accent: isLight ? 'text-indigo-600' : 'text-purple-400',
    success: isLight ? 'bg-green-100 text-green-800 border-green-200' : 'bg-green-600 text-white border-green-500',
    borderColor: isLight ? 'border-gray-200' : 'border-gray-800'
  };

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
      ? `https://proofcollector.shacnisaas.com/t/${testimonial.id}?theme=${theme}`
      : undefined,
    type: 'article'
  });

  useEffect(() => {
    const fetchTestimonialWithTimeout = async () => {
      if (!id) {
        console.log('❌ No testimonial ID provided');
        setError("No testimonial ID provided");
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching testimonial with ID:', id);
      
      // Set timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('⏰ Testimonial fetch timeout after 10 seconds');
        setError("Request timeout - please try again");
        setLoading(false);
      }, 10000);

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
          .eq('id', id)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (error) {
          console.error('❌ Supabase error:', error);
          if (error.code === 'PGRST116') {
            setError("Social proof not found");
          } else {
            setError("Failed to load social proof");
          }
          return;
        }

        if (!data) {
          console.log('📭 No testimonial found with ID:', id);
          setError("Social proof not found");
          return;
        }

        console.log('✅ Testimonial data loaded:', data);
        setTestimonial(data);
        setError(null);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('💥 Error fetching testimonial:', err);
        setError("Failed to load social proof");
      } finally {
        setLoading(false);
      }
    };

    // Reset state when id changes
    setLoading(true);
    setError(null);
    setTestimonial(null);
    
    fetchTestimonialWithTimeout();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${themeStyles.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isLight ? 'border-indigo-500' : 'border-purple-500'} mx-auto mb-4`}></div>
          <p className={themeStyles.textSecondary}>Loading social proof...</p>
          <p className="text-gray-500 text-sm mt-4">
            Taking too long? <button 
              onClick={() => window.location.reload()} 
              className={`${themeStyles.accent} hover:opacity-75 underline`}
            >
              Refresh page
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className={`min-h-screen ${themeStyles.background} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className={`text-2xl font-bold mb-2 ${themeStyles.textPrimary}`}>Social Proof Not Found</h1>
          <p className={`${themeStyles.textSecondary} mb-4`}>
            {error || "The social proof you're looking for doesn't exist or has been removed."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${themeStyles.accent} hover:opacity-75 underline text-sm`}
          >
            Try Again
          </button>
          <p className={`text-sm ${themeStyles.textMuted} mt-4`}>
            Powered by <span className={`font-semibold ${themeStyles.accent}`}>ProofCollector</span>
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
    <div className={`min-h-screen ${themeStyles.background} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        <Card className={`shadow-2xl ${themeStyles.cardBg} ${themeStyles.cardBorder} rounded-xl`}>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold ${themeStyles.textPrimary} mb-2`}>
                {testimonial.survey.title}
              </h1>
              <p className={themeStyles.textSecondary}>
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
              <blockquote className={`text-lg ${themeStyles.textPrimary} leading-relaxed italic text-center`}>
                "{testimonial.testimonial}"
              </blockquote>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <User className={`h-4 w-4 ${themeStyles.textMuted}`} />
                <span className={`font-medium ${themeStyles.textPrimary}`}>
                  {testimonial.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className={`h-4 w-4 ${themeStyles.textMuted}`} />
                <span className={themeStyles.textSecondary}>
                  {format(new Date(testimonial.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="text-center">
              <Badge variant="secondary" className={themeStyles.success}>
                ✓ Verified Social Proof
              </Badge>
            </div>

            {/* Footer */}
            <div className={`text-center mt-8 pt-6 border-t ${themeStyles.borderColor}`}>
              <p className={`text-sm ${themeStyles.textMuted}`}>
                Powered by <span className={`font-semibold ${themeStyles.accent}`}>ProofCollector</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
