import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/BookCard";
import book1 from "@/assets/images/book-1.png";
import book2 from "@/assets/images/book-2.png";
import book3 from "@/assets/images/book-3.png";
import book4 from "@/assets/images/book-4.png";

const books = [
  { id: 1, slug: "the-golden-legacy", img: book1, title: "The Golden Legacy", author: "Amara Okonkwo", price: "₦4,500", rating: 4.8, badge: "Featured", category: "Fiction" },
  { id: 2, slug: "emerald-dreams", img: book2, title: "Emerald Dreams", author: "Chidi Nwosu", price: "₦3,500", rating: 4.6, badge: "Bestseller", category: "Romance" },
  { id: 3, slug: "silent-waters", img: book3, title: "Silent Waters", author: "Ngozi Adeyemi", price: "₦2,800", rating: 4.9, badge: "New", category: "Mystery" },
  { id: 4, slug: "african-whispers", img: book4, title: "African Whispers", author: "Kofi Mensah", price: "₦5,000", rating: 4.7, badge: "Editor's Pick", category: "Non-Fiction" },
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
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/books">
            <Button variant="goldOutline" size="lg">
              View All Books
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
