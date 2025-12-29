import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/public-layout/Header";
import { Footer } from "@/components/public-layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, ShoppingCart, Heart, Share2, Download } from "lucide-react";
import book1 from "@/public-assets/images/book-1.png";
import book2 from "@/public-assets/images/book-2.png";
import book3 from "@/public-assets/images/book-3.png";
import book4 from "@/public-assets/images/book-4.png";

const allBooks = [
  { 
    id: 1, 
    slug: "the-golden-legacy", 
    img: book1, 
    title: "The Golden Legacy", 
    author: "Amara Okonkwo", 
    price: "₦4,500", 
    rating: 4.8, 
    badge: "Featured", 
    category: "Fiction",
    description: "A captivating tale of family secrets, ancient traditions, and the power of legacy that spans generations in colonial Nigeria.",
    pages: 324,
    language: "English",
    publisher: "ReadAgain Publishing",
    publishDate: "2025",
    isbn: "978-0-123456-78-9"
  },
  { 
    id: 2, 
    slug: "emerald-dreams", 
    img: book2, 
    title: "Emerald Dreams", 
    author: "Chidi Nwosu", 
    price: "₦3,500", 
    rating: 4.6, 
    badge: "Bestseller", 
    category: "Romance",
    description: "A heartwarming romance set against the backdrop of modern Lagos, exploring love, ambition, and cultural identity.",
    pages: 298,
    language: "English",
    publisher: "ReadAgain Publishing",
    publishDate: "2025",
    isbn: "978-0-123456-79-0"
  },
  { 
    id: 3, 
    slug: "silent-waters", 
    img: book3, 
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
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge className="absolute top-4 left-4">
              {book.badge}
            </Badge>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {book.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-medium">{book.rating}</span>
                  <span className="text-muted-foreground">(124 reviews)</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {book.price}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/50">
              <div>
                <span className="text-sm text-muted-foreground">Pages</span>
                <p className="font-medium">{book.pages}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Language</span>
                <p className="font-medium">{book.language}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Publisher</span>
                <p className="font-medium">{book.publisher}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Year</span>
                <p className="font-medium">{book.publishDate}</p>
              </div>
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

            <Button variant="outline" className="w-full">
              <Download className="w-5 h-5 mr-2" />
              Download Sample
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
