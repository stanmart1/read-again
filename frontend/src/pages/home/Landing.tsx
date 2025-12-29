import Header from "@/components/Header";
import { HeroSection } from "@/components/public-sections/HeroSection";
import { AboutSection } from "@/components/public-sections/AboutSection";
import { BooksSection } from "@/components/public-sections/BooksSection";
import { CTASection } from "@/components/public-sections/CTASection";
import { Footer } from "@/components/public-layout/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <BooksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
