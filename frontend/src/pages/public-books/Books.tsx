import { useState, useEffect } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/public-layout/Header";
import { Footer } from "@/components/public-layout/Footer";
import { BookCard } from "@/components/PublicBookCard";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/books`, {
        params: {
          page: pageNum,
          limit: 20,
          status: 'published'
        }
      });
      
      if (pageNum === 1) {
        setBooks(response.data.books || response.data);
      } else {
        setBooks(prev => [...prev, ...(response.data.books || response.data)]);
      }
      
      setHasMore(response.data.books?.length === 20);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      const categoryNames = response.data.map(cat => cat.name);
      setCategories(["All", ...categoryNames]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(nextPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Explore Our Collection</span>
            </div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6">
              Discover Your Next <span className="text-gradient-gold">Great Read</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Browse through our curated collection of bestsellers, new releases, and timeless classics
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card border-border/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-gold text-background"
                    : "bg-card border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredBooks.length}</span> books
            </p>
          </div>

          {loading && page === 1 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {filteredBooks.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No books found</p>
                </div>
              )}

              {/* Load More */}
              {hasMore && filteredBooks.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="goldOutline" size="lg" onClick={loadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More Books'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Books;
