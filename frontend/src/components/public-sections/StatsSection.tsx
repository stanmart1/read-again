import { BookOpen, Trophy, Users, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: BookOpen, value: 10000, suffix: "+", label: "Books Available" },
  { icon: Users, value: 25000, suffix: "+", label: "Active Readers" },
  { icon: Trophy, value: 5, prefix: "₦", suffix: "M+", label: "Prizes Won" },
  { icon: TrendingUp, value: 50, suffix: "+", label: "Partner Schools" },
];

const AnimatedCounter = ({ value, prefix = "", suffix = "", isVisible }: { value: number; prefix?: string; suffix?: string; isVisible: boolean }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, isVisible]);
  
  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export const StatsSection = () => {
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
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Gold accent line - animated */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className={`h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
      </div>

      {/* Floating background elements */}
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:glow-gold-sm group-hover:scale-110 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="font-display text-3xl lg:text-4xl font-bold text-gradient-gold mb-2">
                <AnimatedCounter 
                  value={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  isVisible={isVisible} 
                />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gold accent line - animated */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className={`h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
      </div>
    </section>
  );
};
