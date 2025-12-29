import { Header } from "@/components/public-layout/Header";
import { Footer } from "@/components/public-layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      id: "1",
      question: "How do I purchase books?",
      answer: "You can browse our catalog, add books to your cart, and checkout securely with various payment methods."
    },
    {
      id: "2", 
      question: "Can I read books offline?",
      answer: "Yes, once downloaded, you can read your books offline using our e-reader application."
    },
    {
      id: "3",
      question: "What formats do you support?",
      answer: "We support EPUB, PDF, and other popular e-book formats for the best reading experience."
    },
    {
      id: "4",
      question: "How do I get support?",
      answer: "You can contact our support team through the contact form or email us directly."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about ReadAgain
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
