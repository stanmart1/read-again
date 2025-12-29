import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(43_74%_53%/0.1)_0%,transparent_70%)] transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/60 animate-float hidden lg:block" />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-primary/40 animate-float-delayed hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-primary/50 animate-float hidden lg:block" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Start Your Journey Today</span>
          </div>
          
          <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6">
            Ready to Rediscover{" "}
            <span className="text-gradient-gold">Your Love for Reading?</span>
          </h2>
          <p className="text-muted-foreground text-lg lg:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of readers who are already winning prizes while enjoying their favorite books. Your next great read is waiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
