import { Search, Tv } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ search, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
              <Tv className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
              Uni<span className="text-primary">Recarga</span>
            </h1>
          </div>
        </div>

        <div className="relative w-full sm:max-w-sm sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9 bg-secondary border-border text-base"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
