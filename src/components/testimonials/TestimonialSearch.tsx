
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TestimonialSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TestimonialSearch = ({ searchTerm, onSearchChange }: TestimonialSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search testimonials..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-64"
      />
    </div>
  );
};
