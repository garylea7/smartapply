'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfirmPage() {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get email from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email') || localStorage.getItem('magicLinkEmail');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleResend = async () => {
    if (!email) return;
    
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Magic link resent! Check your email.');
      } else {
        toast.error('Failed to resend magic link');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const checkVerification = async () => {
    setIsVerifying(true);
    // Simulate checking if user has clicked the link
    setTimeout(() => {
      setIsVerifying(false);
      // In a real app, you might poll an endpoint or use WebSockets
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a magic link to {email || 'your email address'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click the link in your email to sign in. The link will expire in 15 minutes.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Email sent successfully</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={checkVerification}
              variant="outline"
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "I've clicked the link"
              )}
            </Button>

            <Button
              onClick={handleResend}
              variant="ghost"
              className="w-full"
              disabled={!email}
            >
              Resend Magic Link
            </Button>

            <Button
              onClick={() => router.push('/auth/signin')}
              variant="ghost"
              className="w-full"
            >
              Use Different Email
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}