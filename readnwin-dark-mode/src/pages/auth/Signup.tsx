import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, BookOpen, User, Phone } from 'lucide-react';
import authService from '@/services/authService';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    is_student: '',
    school_name: '',
    school_category: '',
    class_level: '',
    department: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await authService.register({
          email: formData.email,
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
        });

        if (response.success) {
          navigate('/login', { 
            state: { message: 'Account created successfully! Please login.' }
          });
        } else {
          setError(response.message || 'Registration failed');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="block font-semibold mb-2">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="pl-10 h-12"
              placeholder="John"
            />
          </div>
        </div>
        <div>
          <Label className="block font-semibold mb-2">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="pl-10 h-12"
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="block font-semibold mb-2">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="pl-10 h-12"
            placeholder="johndoe"
          />
        </div>
      </div>

      <div>
        <Label className="block font-semibold mb-2">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="pl-10 h-12"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <Label className="block font-semibold mb-2">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="pl-10 h-12"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="block font-semibold mb-2">Are you a student?</Label>
        <Select onValueChange={(value) => handleSelectChange('is_student', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.is_student === 'yes' && (
        <>
          <div>
            <Label className="block font-semibold mb-2">School Name</Label>
            <Input
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              className="h-12"
              placeholder="University of Example"
            />
          </div>

          <div>
            <Label className="block font-semibold mb-2">School Category</Label>
            <Select onValueChange={(value) => handleSelectChange('school_category', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="high_school">High School</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block font-semibold mb-2">Class Level</Label>
            <Input
              name="class_level"
              value={formData.class_level}
              onChange={handleChange}
              className="h-12"
              placeholder="Sophomore, Junior, etc."
            />
          </div>

          <div>
            <Label className="block font-semibold mb-2">Department</Label>
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="h-12"
              placeholder="Computer Science, English, etc."
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label className="block font-semibold mb-2">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
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

      <div>
        <Label className="block font-semibold mb-2">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            className="pl-10 h-12"
            placeholder="••••••••"
          />
        </div>
      </div>
    </div>
  );

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

        {/* Signup Form */}
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
              <p className="text-muted-foreground">Create your account to get started.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step ? 'bg-gradient-gold text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 ${currentStep > step ? 'bg-gradient-gold' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="gold"
                  className="flex-1 h-12 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : currentStep === 3 ? 'Create Account' : 'Next'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
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
