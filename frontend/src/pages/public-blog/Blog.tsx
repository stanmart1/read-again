import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/public-layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blog`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-gold text-background py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Blog
            </h1>
            <p className="text-xl md:text-2xl text-background/80">
              Insights, tips, and stories from the world of reading
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category || 'General'}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.read_time || '5 min read'}
                    </span>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <CardTitle className="hover:text-primary cursor-pointer">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline">Read More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts found</p>
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
