import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

const floatingShapes = [
  { size: "w-32 h-32", position: "top-20 left-[10%]", color: "bg-primary/20", delay: "0s", duration: "20s" },
  { size: "w-20 h-20", position: "top-40 right-[15%]", color: "bg-primary/15", delay: "2s", duration: "25s" },
  { size: "w-24 h-24", position: "bottom-32 left-[20%]", color: "bg-primary/10", delay: "4s", duration: "22s" },
  { size: "w-16 h-16", position: "bottom-40 right-[25%]", color: "bg-primary/25", delay: "1s", duration: "18s" },
];

const glowOrbs = [
  { position: "top-1/4 left-1/4", size: "w-64 h-64" },
  { position: "bottom-1/3 right-1/4", size: "w-48 h-48" },
  { position: "top-1/2 right-1/3", size: "w-32 h-32" },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20">
      {/* Animated glow orbs */}
      {glowOrbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute ${orb.position} ${orb.size} rounded-full bg-[radial-gradient(ellipse_at_center,hsl(43_74%_53%/0.15)_0%,transparent_70%)] animate-glow-pulse pointer-events-none`}
          style={{ animationDelay: `${index * 1.5}s` }}
        />
      ))}

      {/* Floating morphing shapes */}
      {floatingShapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute ${shape.position} ${shape.size} ${shape.color} animate-morph backdrop-blur-sm hidden md:block`}
          style={{ 
            animationDelay: shape.delay,
            animationDuration: shape.duration 
          }}
        />
      ))}

      {/* Orbiting particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] hidden lg:block">
        <div className="absolute inset-0 animate-orbit">
          <div className="w-4 h-4 rounded-full bg-primary/60 glow-gold-sm" />
        </div>
        <div className="absolute inset-0 animate-orbit-reverse">
          <div className="w-3 h-3 rounded-full bg-primary/40" />
        </div>
        <div className="absolute inset-0 animate-orbit" style={{ animationDuration: "30s" }}>
          <div className="w-2 h-2 rounded-full bg-primary/80" />
        </div>
      </div>

      {/* Floating sparkle icons */}
      <div className="absolute top-32 right-[20%] animate-float hidden lg:flex items-center justify-center w-16 h-16 rounded-full bg-card/50 border border-primary/20 backdrop-blur-sm">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <div className="absolute bottom-40 left-[15%] animate-float-delayed hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-card/50 border border-primary/20 backdrop-blur-sm">
        <BookOpen className="w-5 h-5 text-primary" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 opacity-0 animate-fade-up backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join 10,000+ Readers</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-up delay-100">
            Rediscover the
            <br />
            <span className="text-gradient-gold">magic of reading</span>
            <br />
            <span className="text-gradient-gold">all over again</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up delay-200">
            Join our community of students and book lovers around the world. We thrive to promote the reading culture via incentive programs in African schools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up delay-300">
            <Button variant="hero" size="xl" className="group">
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              <BookOpen className="w-5 h-5" />
              Browse Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
