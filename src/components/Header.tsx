import { Search, Tv } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ search, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Tv className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Uni<span className="text-primary">Recarga</span>
          </h1>
        </div>

        <div className="relative max-w-xs flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
