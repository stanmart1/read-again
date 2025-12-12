import { useState } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/BookCard";
import book1 from "@/assets/images/book-1.png";
import book2 from "@/assets/images/book-2.png";
import book3 from "@/assets/images/book-3.png";
import book4 from "@/assets/images/book-4.png";

const allBooks = [
  { id: 1, slug: "the-golden-legacy", img: book1, title: "The Golden Legacy", author: "Amara Okonkwo", price: "₦4,500", rating: 4.8, badge: "Featured", category: "Fiction" },
  { id: 2, slug: "emerald-dreams", img: book2, title: "Emerald Dreams", author: "Chidi Nwosu", price: "₦3,500", rating: 4.6, badge: "Bestseller", category: "Romance" },
  { id: 3, slug: "silent-waters", img: book3, title: "Silent Waters", author: "Ngozi Adeyemi", price: "₦2,800", rating: 4.9, badge: "New", category: "Mystery" },
  { id: 4, slug: "african-whispers", img: book4, title: "African Whispers", author: "Kofi Mensah", price: "₦5,000", rating: 4.7, badge: "Editor's Pick", category: "Non-Fiction" },
  { id: 5, slug: "midnight-sun", img: book1, title: "Midnight Sun", author: "Zara Ibrahim", price: "₦3,200", rating: 4.5, badge: "Popular", category: "Fiction" },
  { id: 6, slug: "the-last-chapter", img: book2, title: "The Last Chapter", author: "Tunde Bakare", price: "₦4,000", rating: 4.4, badge: "Classic", category: "Drama" },
  { id: 7, slug: "oceans-edge", img: book3, title: "Ocean's Edge", author: "Amina Yusuf", price: "₦2,500", rating: 4.8, badge: "New", category: "Adventure" },
  { id: 8, slug: "city-of-dreams", img: book4, title: "City of Dreams", author: "Emeka Obi", price: "₦3,800", rating: 4.6, badge: "Trending", category: "Fiction" },
];

const categories = ["All", "Fiction", "Romance", "Mystery", "Non-Fiction", "Drama", "Adventure"];

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <Button variant="gold" size="lg" className="h-12">
                <Filter className="w-4 h-4 mr-2" />
                Search
              </Button>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="goldOutline" size="lg">
              Load More Books
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Books;
