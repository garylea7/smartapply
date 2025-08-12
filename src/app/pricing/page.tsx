'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, ArrowRight } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  popular?: boolean;
  priceId?: string;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out ATS analysis',
    features: [
      '1 analysis per day',
      'ATS score (0-100)',
      'Top 10 missing keywords',
      'Basic improvements',
      'Email support'
    ],
    buttonText: 'Current Plan'
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      '20 analyses per month',
      'Everything in Free',
      'Full keyword map',
      'Tailored resume suggestions',
      'Professional cover letter',
      'PDF/DOCX export',
      'Priority email support'
    ],
    popular: true,
    highlighted: true,
    priceId: 'price_pro_monthly',
    buttonText: 'Upgrade to Pro'
  },
  {
    name: 'Pro+',
    price: '$39',
    period: '/month',
    description: 'For power users and multiple applications',
    features: [
      'Unlimited analyses',
      'Everything in Pro',
      'Multiple resume profiles',
      'Job link auto-scrape',
      'Interview Q&A generator',
      'Advanced analytics',
      'Priority queue processing'
    ],
    priceId: 'price_pro_plus_monthly',
    buttonText: 'Upgrade to Pro+'
  },
  {
    name: 'All-In Lifetime',
    price: '$299',
    period: 'one-time',
    description: 'Best value for long-term users',
    features: [
      'Everything in Pro+',
      'Lifetime access',
      'No recurring bills',
      'Priority support',
      'Future features included',
      'Early access to new tools'
    ],
    highlighted: true,
    priceId: 'price_lifetime',
    buttonText: 'Get Lifetime Access'
  }
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: PricingTier) => {
    if (!tier.priceId || tier.name === 'Free') return;
    
    setIsLoading(tier.name);
    
    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tier.priceId,
          planName: tier.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to initiate checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upgrade to unlock powerful features that will help you land more interviews and get hired faster.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={tier.name} 
              className={`relative ${
                tier.highlighted 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200'
              } ${tier.popular ? 'border-blue-500' : ''}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-2">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="space-y-2">
                  <CardTitle className={`text-2xl ${tier.highlighted ? 'text-blue-600' : ''}`}>
                    {tier.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-500 ml-1">{tier.period}</span>
                    </div>
                    <p className="text-sm text-gray-600">{tier.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    tier.highlighted 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : tier.name === 'Free' 
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : ''
                  }`}
                  size="lg"
                  onClick={() => handleUpgrade(tier)}
                  disabled={isLoading === tier.name || tier.name === 'Free'}
                >
                  {isLoading === tier.name ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {tier.name === 'Free' ? (
                        <>
                          <Crown className="mr-2 h-4 w-4" />
                          {tier.buttonText}
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          {tier.buttonText}
                        </>
                      )}
                    </>
                  )}
                </Button>

                {/* Additional Info */}
                {tier.name !== 'Free' && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      {tier.period.includes('one-time') 
                        ? 'One-time payment, lifetime access'
                        : 'Cancel anytime'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Feature Comparison</h2>
            <p className="text-gray-600">
              See exactly what you get with each plan
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Pro</th>
                      <th className="text-center py-3 px-4">Pro+</th>
                      <th className="text-center py-3 px-4">Lifetime</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4">Analyses per month</td>
                      <td className="text-center py-3 px-4">1/day</td>
                      <td className="text-center py-3 px-4">20</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">ATS Score</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Missing Keywords</td>
                      <td className="text-center py-3 px-4">Top 10</td>
                      <td className="text-center py-3 px-4">All</td>
                      <td className="text-center py-3 px-4">All</td>
                      <td className="text-center py-3 px-4">All</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Tailored Resume</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Cover Letter</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Interview Q&A</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Export Options</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Multiple Profiles</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Priority Support</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change or cancel my plan anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade, downgrade, or cancel your subscription at any time. 
                  Changes take effect at the next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards including Visa, MasterCard, American Express, 
                  and Discover. All payments are processed securely through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">
                  Our Free plan gives you 1 analysis per day forever, so you can try out the core 
                  features without any commitment. No credit card required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What's included in the Lifetime plan?</h3>
                <p className="text-gray-600">
                  The Lifetime plan includes all Pro+ features plus lifetime access with no 
                  recurring payments. You'll also get priority support and early access to new features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Land More Interviews?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of job seekers who've improved their ATS scores and gotten hired faster.
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}