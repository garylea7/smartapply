'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, 
  Target, 
  FileText, 
  TrendingUp, 
  Star, 
  Users, 
  Zap,
  Award,
  BarChart3,
  Shield,
  Lightbulb,
  ArrowRight,
  Play,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function ATSResumeCheckerPage() {
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
        alert('Welcome! Check your email for your magic link.');
        setTimeout(() => {
          window.location.href = '/app';
        }, 2000);
      } else {
        alert(data.error || 'Failed to sign up');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "ATS Score Analysis",
      description: "Get a comprehensive 0-100 score on how well your resume matches job descriptions and passes ATS filters."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Keyword Optimization",
      description: "Discover missing keywords and skills that recruiters are looking for in your industry."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Actionable Insights",
      description: "Receive specific, data-driven recommendations to improve your resume and increase interview chances."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Results",
      description: "Get comprehensive analysis in seconds, not hours. No waiting, no delays."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your resume data is processed securely and never stored permanently. Your privacy is guaranteed."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Performance Tracking",
      description: "Track your improvement over time with detailed analytics and progress reports."
    }
  ];

  const comparisons = [
    {
      feature: "ATS Scoring",
      smartapply: "Advanced AI-powered scoring with detailed breakdown",
      jobscan: "Basic scoring system",
      zety: "Limited scoring features",
      resumeworded: "Standard scoring"
    },
    {
      feature: "Keyword Analysis",
      smartapply: "Comprehensive keyword mapping with priority ranking",
      jobscan: "Basic keyword matching",
      zety: "Limited keyword suggestions",
      resumeworded: "Standard keyword analysis"
    },
    {
      feature: "Free Tier",
      smartapply: "1 analysis per day, no credit card required",
      jobscan: "Limited free scans",
      zety: "Paid only",
      resumeworded: "Limited free features"
    },
    {
      feature: "AI-Powered",
      smartapply: "Advanced GPT-4 analysis with contextual understanding",
      jobscan: "Basic algorithm",
      zety: "Template-based",
      resumeworded: "Standard AI"
    },
    {
      feature: "Export Options",
      smartapply: "PDF/DOCX export with tailored content",
      jobscan: "Limited export",
      zety: "PDF export only",
      resumeworded: "Basic export"
    },
    {
      feature: "Price",
      smartapply: "Starting at $15/month with lifetime option",
      jobscan: "$49.95/month",
      zety: "$19.99/month",
      resumeworded: "$24.95/month"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Corp",
      content: "SmartApply helped me increase my ATS score from 65 to 92. I landed 3 interviews within a week of optimizing my resume!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The keyword analysis was eye-opening. I was missing critical skills that were right in the job description. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Marketing Director",
      company: "Digital Agency",
      content: "As a career changer, SmartApply showed me exactly how to position my experience. Got hired at my dream company!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "What is an ATS resume checker?",
      answer: "An ATS (Applicant Tracking System) resume checker analyzes your resume against job descriptions to ensure it passes through automated screening systems used by recruiters. It checks for keyword matching, formatting, and relevance to increase your chances of getting noticed."
    },
    {
      question: "How does SmartApply work?",
      answer: "Simply upload your resume (PDF) and paste the job description. Our AI analyzes both documents, compares them, and provides a comprehensive ATS score along with missing keywords, improvement suggestions, and actionable recommendations."
    },
    {
      question: "Is SmartApply really free?",
      answer: "Yes! We offer a generous free tier that includes 1 ATS analysis per day. No credit card required. For power users, we offer paid plans with additional features like unlimited analyses, tailored resumes, cover letters, and more."
    },
    {
      question: "What file formats do you support?",
      answer: "Currently, we support PDF files for resume uploads. We're working on adding support for Word documents and other formats soon."
    },
    {
      question: "How accurate is the ATS scoring?",
      answer: "Our scoring system is powered by advanced AI that simulates how real ATS systems work. We analyze keyword matching, skills relevance, experience alignment, and formatting best practices to provide a comprehensive 0-100 score."
    },
    {
      question: "Can I use SmartApply for multiple job applications?",
      answer: "Absolutely! Free users can analyze one resume per day. Pro users get 20 analyses per month, and Pro+ users get unlimited analyses to optimize for multiple job applications."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. Your resume is processed securely and never stored permanently. We use industry-standard encryption and follow best practices for data protection."
    },
    {
      question: "What makes SmartApply different from other tools?",
      answer: "SmartApply combines advanced AI analysis with a user-friendly interface, affordable pricing, and actionable insights. Unlike competitors, we offer a generous free tier, lifetime access options, and focus on providing practical recommendations you can implement immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #1 ATS Resume Checker
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Free ATS Resume Checker
              <br />
              <span className="text-blue-200">Beat the Bots, Land Interviews</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Upload your resume and job description to get instant ATS optimization analysis. 
              See your score, missing keywords, and actionable improvements that actually work.
            </p>
            
            {/* CTA Form */}
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing up...' : 'Start Free Analysis'}
                  </Button>
                  <p className="text-xs text-blue-200 text-center">
                    Free forever. No credit card required.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>85% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Why Choose SmartApply?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get the most comprehensive ATS analysis with AI-powered insights that actually help you land interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-gray-600">Get ATS-optimized in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold">Upload Resume</h3>
              <p className="text-gray-600">Upload your resume as a PDF file. Our system accepts all standard resume formats.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold">Paste Job Description</h3>
              <p className="text-gray-600">Copy and paste the full job description for comprehensive analysis.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold">Get Results</h3>
              <p className="text-gray-600">Receive instant ATS score, missing keywords, and actionable improvements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">How We Compare</h2>
            <p className="text-xl text-gray-600">See why SmartApply is the best choice for ATS optimization</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-blue-600">SmartApply</th>
                    <th className="text-center py-4 px-6 font-semibold">Jobscan</th>
                    <th className="text-center py-4 px-6 font-semibold">Zety</th>
                    <th className="text-center py-4 px-6 font-semibold">ResumeWorded</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {comparisons.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        <Badge className="bg-green-100 text-green-800">✓ {row.smartapply}</Badge>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.jobscan}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.zety}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.resumeworded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Success Stories</h2>
            <p className="text-xl text-gray-600">Join thousands who've landed their dream jobs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about ATS resume optimization</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-xl text-blue-100">
              Join 50,000+ job seekers who've improved their ATS scores and landed more interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Play className="mr-2 h-4 w-4" />
                  Start Free Analysis
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "SmartApply - ATS Resume Checker",
          "description": "Free ATS resume checker that helps job seekers optimize their resumes and land more interviews. Get instant ATS scoring, keyword analysis, and actionable improvements.",
          "url": "https://smartapply.ai",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "1000"
          },
          "featureList": [
            "ATS resume scoring",
            "Keyword optimization",
            "Job description matching",
            "Resume improvement suggestions",
            "PDF upload support",
            "Instant analysis"
          ]
        })}
      </script>
    </div>
  );
}