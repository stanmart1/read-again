import { Sparkles, Lightbulb, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making reading accessible and affordable to everyone across Africa.",
    gradient: "from-blue-500/20 to-primary/20",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Enhancing reading experience with AI-powered technology.",
    gradient: "from-amber-500/20 to-primary/20",
  },
  {
    icon: Award,
    title: "Rewards",
    description: "Win amazing prizes just by reading your favorite books.",
    gradient: "from-emerald-500/20 to-primary/20",
  },
  {
    icon: Sparkles,
    title: "Community",
    description: "Join thousands of passionate readers and learners.",
    gradient: "from-purple-500/20 to-primary/20",
  },
];

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,hsl(43_74%_53%/0.05)_0%,transparent_70%)] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,hsl(43_74%_53%/0.08)_0%,transparent_70%)] pointer-events-none animate-glow-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              About ReadAgain
            </span>
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6">
              Revolutionizing reading through{" "}
              <span className="text-gradient-gold">technology</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              <strong className="text-foreground">Mission:</strong> To inspire a strong reading culture across Africa by rewarding readers and empowering lifelong learners.
            </p>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              <strong className="text-foreground">Vision:</strong> To become Africa's leading literacy empowerment platform, shaping millions of minds through books, creativity, and opportunity.
            </p>
            <Button variant="gold" size="lg" className="group">
              Learn More
              <Sparkles className="w-4 h-4 ml-2 transition-transform group-hover:rotate-12" />
            </Button>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
