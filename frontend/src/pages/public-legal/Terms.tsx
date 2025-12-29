import { Header } from "@/components/public-layout/Header";
import { Footer } from "@/components/public-layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-gold text-background py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-background/80">
              Last updated: December 29, 2025
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using ReadAgain, you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access and use the materials on ReadAgain for personal, 
                non-commercial use only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="text-muted-foreground mb-4">
                Under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide accurate, complete, and current 
                information. Failure to do so constitutes a breach of the Terms.
              </p>
              <p className="text-muted-foreground mb-4">
                You are responsible for safeguarding the password and for all activities that occur 
                under your account.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">4. Purchases and Payments</h2>
              <p className="text-muted-foreground mb-4">
                All purchases are subject to product availability. We reserve the right to refuse any 
                order you place with us. Prices are subject to change without notice.
              </p>
              <p className="text-muted-foreground mb-4">
                Payment must be received by us before your order is processed. We accept various payment 
                methods as indicated on our platform.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The content, organization, graphics, design, and other matters related to ReadAgain are 
                protected under applicable copyrights and other proprietary laws. Copying, redistribution, 
                or publication of any such matters is strictly prohibited.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">6. Refund Policy</h2>
              <p className="text-muted-foreground mb-4">
                Digital products are generally non-refundable once accessed. However, we may provide 
                refunds on a case-by-case basis for technical issues or errors in the product.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                ReadAgain shall not be liable for any damages arising out of or in connection with your 
                use of the service. This includes, without limitation, direct, indirect, incidental, 
                punitive, and consequential damages.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your account immediately, without prior notice, for any 
                reason, including breach of these Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new Terms on this page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: legal@readagain.com<br />
                Phone: +234 800 123 4567
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
