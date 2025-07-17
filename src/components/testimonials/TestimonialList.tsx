
import { Card } from "@/components/ui/card";
import { TestimonialCard } from "./TestimonialCard";

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

interface TestimonialListProps {
  testimonials: Testimonial[];
  searchTerm: string;
  onView: (testimonial: Testimonial) => void;
  onEmbed: (testimonial: Testimonial) => void;
  onDownload: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
}

export const TestimonialList = ({ 
  testimonials, 
  searchTerm, 
  onView, 
  onEmbed, 
  onDownload, 
  onDelete 
}: TestimonialListProps) => {
  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredTestimonials.length === 0) {
    return (
      <Card className="p-12 bg-gray-900 border border-gray-800 shadow-lg rounded-xl text-center">
        <p className="text-gray-400">
          {searchTerm ? "No proof found matching your search." : "No social proof yet. Share your survey links to start collecting proof!"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTestimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          onView={onView}
          onEmbed={onEmbed}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
