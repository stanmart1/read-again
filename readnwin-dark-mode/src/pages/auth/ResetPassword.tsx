import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { actualTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600/80 to-yellow-600/80 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Login */}
        <div className="mb-6">
          <Link to="/login" className="text-background hover:text-background/80 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Reset Password Form */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-background" />
                </div>
                <h1 className="text-3xl font-bold">
                  Read<span className="text-gradient-gold">Again</span>
                </h1>
              </div>
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-muted-foreground">
                {isSubmitted 
                  ? "Check your email for reset instructions."
                  : "Enter your email to receive reset instructions."
                }
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="block font-semibold mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full h-12 font-semibold"
                >
                  Send Reset Instructions
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 ${actualTheme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto`}>
                  <span className="text-2xl">✓</span>
                </div>
                <p className="text-muted-foreground">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full h-12">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Remember your password?{' '}
                <Link to="/login" className="text-gold hover:text-gold/80 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
