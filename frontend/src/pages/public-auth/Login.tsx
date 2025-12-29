import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(email, password);
    if (result) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="mb-6">
          <Link to="/" className="text-white hover:text-white/80 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Login Form */}
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
              <p className="text-muted-foreground">Welcome back! Please login to your account.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

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

              <div>
                <Label className="block font-semibold mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-12 h-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Link to="/reset-password" className="text-sm text-gold hover:text-gold/80">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="gold"
                className="w-full h-12 font-semibold"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-gold hover:text-gold/80 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
