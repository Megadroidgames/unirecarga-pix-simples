import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

const ProductCard = ({ product, onBuy }: ProductCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] touch-manipulation">
      {product.isCombo && (
        <Badge className="absolute right-3 top-3 z-10 bg-[hsl(var(--combo))] text-[hsl(var(--combo-foreground))] border-0 font-bold text-xs">
          🔥 Combo!
        </Badge>
      )}

      <div className="relative h-32 overflow-hidden sm:h-40">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-md bg-secondary/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>

      <CardContent className="space-y-3 p-3 sm:p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground sm:text-base">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.duration}</p>
        </div>

        <div className="flex items-end gap-2">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through sm:text-sm">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <span className="text-lg font-bold text-[hsl(var(--accent))] sm:text-xl">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <Button
          onClick={() => onBuy(product)}
          className="w-full gap-2 font-semibold touch-manipulation"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4" />
          Comprar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
