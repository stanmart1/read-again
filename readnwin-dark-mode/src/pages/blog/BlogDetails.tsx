import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BlogDetails = () => {
  const { slug } = useParams();
  const { actualTheme } = useTheme();

  const blogPosts = {
    "future-of-digital-reading": {
      title: "The Future of Digital Reading",
      date: "Dec 10, 2024",
      category: "Technology",
      readTime: "5 min read",
      content: `
        <p>Digital reading has revolutionized how we consume literature and information. With the advent of e-readers, tablets, and smartphones, books are more accessible than ever before.</p>
        
        <h2>The Evolution of Reading Technology</h2>
        <p>From the first e-ink displays to today's high-resolution screens, reading technology has come a long way. Modern devices offer features like adjustable lighting, font customization, and seamless synchronization across devices.</p>
        
        <h2>Benefits of Digital Reading</h2>
        <ul>
          <li>Instant access to thousands of books</li>
          <li>Adjustable text size and lighting</li>
          <li>Built-in dictionaries and note-taking</li>
          <li>Environmental sustainability</li>
        </ul>
        
        <h2>Looking Ahead</h2>
        <p>The future promises even more exciting developments, including AI-powered reading recommendations, immersive audio integration, and enhanced interactive features that will make reading more engaging than ever.</p>
      `
    },
    "building-better-reading-habits": {
      title: "Building Better Reading Habits",
      date: "Dec 8, 2024",
      category: "Education",
      readTime: "3 min read",
      content: `
        <p>Developing consistent reading habits is one of the most valuable skills you can cultivate. Whether you're looking to expand your knowledge or simply enjoy more books, the right approach can make all the difference.</p>
        
        <h2>Start Small</h2>
        <p>Begin with just 10-15 minutes of reading per day. This small commitment is easier to maintain and helps build the habit without overwhelming your schedule.</p>
        
        <h2>Create a Reading Environment</h2>
        <p>Designate a specific space for reading. This could be a comfortable chair, a quiet corner, or even a spot in your local coffee shop. Having a dedicated space helps signal to your brain that it's time to read.</p>
        
        <h2>Track Your Progress</h2>
        <p>Keep a reading journal or use apps to track the books you've read. Seeing your progress can be incredibly motivating and help you stay committed to your reading goals.</p>
      `
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <Link to="/blog">
              <Button>Back to Blog</Button>
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
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-muted-foreground">{post.date}</p>
            </header>

            <div 
              className={`prose prose-lg max-w-none ${actualTheme === 'dark' ? 'prose-invert' : ''}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetails;
