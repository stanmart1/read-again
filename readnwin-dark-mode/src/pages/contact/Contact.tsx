import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      contact: "support@readagain.com",
      color: "text-blue-400"
    },
    {
      icon: Phone,
      title: "Phone",
      contact: "+1 (555) 123-4567",
      color: "text-purple-400"
    },
    {
      icon: MapPin,
      title: "Address",
      contact: "123 Reading St, Book City, BC 12345",
      color: "text-indigo-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              We'd love to hear from you. Send us a message!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label className="block font-semibold mb-2">
                      Name
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label className="block font-semibold mb-2">
                      Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label className="block font-semibold mb-2">
                      Subject
                    </Label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="h-12"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <Label className="block font-semibold mb-2">
                      Message
                    </Label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-8">
                  Have questions? We're here to help. Reach out to us through any of these channels.
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, idx) => (
                  <Card key={idx} className="shadow-md border-0">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className={`w-12 h-12 ${idx % 3 === 0 ? 'bg-blue-100 dark:bg-blue-900/30' : idx % 3 === 1 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <method.icon className={`w-6 h-6 ${method.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{method.title}</h3>
                        <p className="text-muted-foreground">{method.contact}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-md border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Office Information</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong className="text-foreground">Address:</strong> 123 Reading Street, Book City, BC 12345</p>
                    <p><strong className="text-foreground">Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
                    <p><strong className="text-foreground">Parking:</strong> Free parking available</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                  <p className="mb-6 text-blue-100">
                    Stay connected on social media
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <span className="text-2xl">📘</span>
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <span className="text-2xl">🐦</span>
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <span className="text-2xl">📷</span>
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <span className="text-2xl">💼</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
