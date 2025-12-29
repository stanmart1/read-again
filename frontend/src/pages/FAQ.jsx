import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFAQ } from '../hooks/useFAQ';

export default function FAQ() {
  const { faqs, loading } = useFAQ();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Purple-Blue Gradient */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Find answers to common questions about ReadAgain
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-lg text-foreground">
                      {faq.question}
                    </span>
                    <i className={`ri-arrow-${openIndex === index ? 'up' : 'down'}-s-line text-2xl text-blue-600`}></i>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-muted-foreground">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="ri-question-line text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No FAQs available</h3>
              <p className="text-muted-foreground">Check back soon for answers to common questions</p>
            </div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-lg mb-6 text-blue-100">
              Can't find the answer you're looking for? Contact our support team.
            </p>
            <a
              href="/contact"
              className="inline-block bg-card text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
