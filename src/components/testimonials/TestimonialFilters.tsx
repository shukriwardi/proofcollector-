
import { TestimonialSearch } from "./TestimonialSearch";

interface TestimonialFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TestimonialFilters = ({ searchTerm, onSearchChange }: TestimonialFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-black">ProofCollector</h1>
        <p className="text-gray-600 mt-2">Manage and display your collected social proof</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <TestimonialSearch 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
      </div>
    </div>
  );
};
