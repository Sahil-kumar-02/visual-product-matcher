import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minSimilarity: number;
  onMinSimilarityChange: (value: number) => void;
  sortBy: "similarity" | "price-asc" | "price-desc";
  onSortChange: (sort: "similarity" | "price-asc" | "price-desc") => void;
  showSimilarity?: boolean;
}

export const FilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minSimilarity,
  onMinSimilarityChange,
  sortBy,
  onSortChange,
  showSimilarity = false,
}: FilterBarProps) => {
  return (
    <div className="space-y-4 p-4 rounded-lg border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {showSimilarity && <SelectItem value="similarity">Similarity</SelectItem>}
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showSimilarity && (
          <div className="space-y-2">
            <Label>Min Similarity: {minSimilarity}%</Label>
            <Slider
              value={[minSimilarity]}
              onValueChange={(values) => onMinSimilarityChange(values[0])}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};
