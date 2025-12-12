import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import book1 from "@/assets/book-1.png";
import book2 from "@/assets/book-2.png";
import book3 from "@/assets/book-3.png";
import book4 from "@/assets/book-4.png";

const books = [
  { img: book1, title: "The Golden Legacy", author: "Amara Okonkwo", price: "₦4,500", rating: 4.8, badge: "Featured" },
  { img: book2, title: "Emerald Dreams", author: "Chidi Nwosu", price: "₦3,500", rating: 4.6, badge: "Bestseller" },
  { img: book3, title: "Silent Waters", author: "Ngozi Adeyemi", price: "₦2,800", rating: 4.9, badge: "New" },
  { img: book4, title: "African Whispers", author: "Kofi Mensah", price: "₦5,000", rating: 4.7, badge: "Editor's Pick" },
];

export const BooksSection = () => {
  return (
    <section id="books" className="relative py-24 lg:py-32 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Collection
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">
            Discover <span className="text-gradient-gold">Amazing Books</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of bestsellers, new releases, and featured titles
          </p>
        </div>

        {/* Book Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {books.map((book, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
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
              </div>

              {/* Book Info */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
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
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="goldOutline" size="lg">
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
};
