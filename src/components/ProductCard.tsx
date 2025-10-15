import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  similarity?: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 border-primary rounded-2xl" style={{background: "hsl(var(--accent) / 0.15)"}}>
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
          {product.similarity !== undefined && (
            <Badge
              className="absolute top-2 right-2"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
                color: "hsl(var(--primary-foreground))"
              }}
            >
              {product.similarity}% Match
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
            <span className="text-sm font-bold whitespace-nowrap text-primary">
              ${product.price}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
