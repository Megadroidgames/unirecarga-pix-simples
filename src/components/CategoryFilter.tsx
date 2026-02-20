import { cn } from "@/lib/utils";
import { categories } from "@/data/products";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 pb-1 sm:flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all active:scale-95 touch-manipulation",
              selected === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
