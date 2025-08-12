'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Target, TrendingUp, Users, Zap, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/optin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Welcome! Check your email for your magic link.');
        // Redirect to app after successful opt-in
        setTimeout(() => {
          window.location.href = '/app';
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to sign up');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Free ATS Resume Checker
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Get Past ATS Filters
                <br />
                <span className="text-gray-900">Land More Interviews</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Upload your resume and job description to get instant ATS optimization analysis. 
                See your score, missing keywords, and actionable improvements.
              </p>
            </div>

            {/* Opt-in Form */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Start Free Analysis</CardTitle>
                <CardDescription>
                  Enter your email to get instant access to our ATS checker
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Get Free Analysis
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Free forever. No credit card required. 1 analysis per day.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No Download</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="p-2 bg-blue-100 rounded-lg w-fit">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">ATS Score Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Get a 0-100 score on how well your resume matches the job description and passes ATS filters.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="p-2 bg-green-100 rounded-lg w-fit">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Missing Keywords</h3>
                <p className="text-gray-600 text-sm">
                  Discover the exact keywords and skills missing from your resume that recruiters are looking for.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="p-2 bg-purple-100 rounded-lg w-fit">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Actionable Insights</h3>
                <p className="text-gray-600 text-sm">
                  Receive specific recommendations to improve your resume and increase your chances.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="p-2 bg-orange-100 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">Fast & Secure</h3>
                <p className="text-gray-600 text-sm">
                  Get instant results. Your resume is processed securely and never stored permanently.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Trusted by Job Seekers Worldwide</h2>
            <p className="text-gray-600 text-lg">
              Join thousands who've improved their resumes and landed more interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Resumes Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Average Score Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of job seekers who've improved their ATS scores and landed more interviews.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}