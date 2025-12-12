import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: {
    id?: number;
    slug?: string;
    img: string;
    title: string;
    author: string;
    price: string;
    rating: number;
    badge: string;
    category: string;
  };
  index: number;
}

export const BookCard = ({ book, index }: BookCardProps) => {
  const bookSlug = book.slug || book.title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {book.badge}
        </span>
      </div>

      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/50">
        <img
          src={book.img}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link to={`/books/${bookSlug}`}>
            <Button variant="gold" className="w-full" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-5">
        <span className="text-primary/70 text-xs font-medium uppercase tracking-wider">
          {book.category}
        </span>
        <Link to={`/books/${bookSlug}`}>
          <h3 className="font-display text-lg font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors mt-1 cursor-pointer">
            {book.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3">{book.author}</p>

        {/* Rating & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">{book.rating}</span>
          </div>
          <span className="text-primary font-bold">{book.price}</span>
        </div>
      </div>
    </div>
  );
};
