import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/public-layout/Header";
import { Footer } from "@/components/public-layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, ShoppingCart, Heart, Share2, Download } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BookDetails = () => {
  const { slug } = useParams();
  const { books, loading } = useBooks();
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (books.length > 0) {
      const foundBook = books.find(b => b.slug === slug || b.id === parseInt(slug));
      setBook(foundBook);
    }
  }, [books, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-8">The book you're looking for doesn't exist.</p>
          <Link to="/books">
            <Button variant="goldOutline">Browse All Books</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const coverImage = book.cover_image ? `${API_URL}${book.cover_image}` : null;
  const price = typeof book.price === 'number' ? `₦${book.price.toLocaleString()}` : book.price; 
    title: "Silent Waters", 
    author: "Ngozi Adeyemi", 
    price: "₦2,800", 
    rating: 4.9, 
    badge: "New", 
    category: "Mystery",
    description: "A gripping mystery thriller that takes readers through the dark underbelly of a seemingly peaceful coastal town.",
    pages: 356,
    language: "English",
    publisher: "ReadAgain Publishing",
    publishDate: "2025",
    isbn: "978-0-123456-80-6"
  },
  { 
    id: 4, 
    slug: "african-whispers", 
    img: book4, 
    title: "African Whispers", 
    author: "Kofi Mensah", 
    price: "₦5,000", 
    rating: 4.7, 
    badge: "Editor's Pick", 
    category: "Non-Fiction",
    description: "An insightful exploration of African philosophy, wisdom traditions, and their relevance in contemporary society.",
    pages: 412,
    language: "English",
    publisher: "ReadAgain Publishing",
    publishDate: "2025",
    isbn: "978-0-123456-81-3"
  }
];

export default function BookDetails() {
  const { slug } = useParams();
  const book = allBooks.find(b => b.slug === slug);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
            <Link to="/books">
              <Button>Back to Books</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <Link to="/books" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Book Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/50">
              {coverImage && (
                <img
                  src={coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {(book.is_featured || book.is_bestseller || book.is_new_release) && (
              <Badge className="absolute top-4 left-4">
                {book.is_featured ? 'Featured' : book.is_bestseller ? 'Bestseller' : 'New'}
              </Badge>
            )}
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              {book.category && (
                <Badge variant="secondary" className="mb-3">
                  {typeof book.category === 'object' ? book.category.name : book.category}
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-medium">{book.rating || 4.5}</span>
                  <span className="text-muted-foreground">(124 reviews)</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {price}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description || book.short_description || 'No description available.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/50">
              {book.pages && (
                <div>
                  <span className="text-sm text-muted-foreground">Pages</span>
                  <p className="font-medium">{book.pages}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <span className="text-sm text-muted-foreground">Language</span>
                  <p className="font-medium">{book.language}</p>
                </div>
              )}
              {book.publisher && (
                <div>
                  <span className="text-sm text-muted-foreground">Publisher</span>
                  <p className="font-medium">{book.publisher}</p>
                </div>
              )}
              {book.publication_date && (
                <div>
                  <span className="text-sm text-muted-foreground">Year</span>
                  <p className="font-medium">{new Date(book.publication_date).getFullYear()}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" className="flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {book.sample_path && (
              <Button variant="outline" className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Download Sample
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookDetails;
