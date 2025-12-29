import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/PublicBookCard";
import { BookOpen } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const BooksSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/books`, {
        params: {
          limit: 4,
          is_featured: true,
          status: 'published'
        }
      });
      setBooks(response.data.books || response.data);
    } catch (error) {
      console.error('Error fetching featured books:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-3">No Books Available Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're currently building our collection. Check back soon for amazing books!
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};
