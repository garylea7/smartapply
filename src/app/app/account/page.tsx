'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Crown, 
  CreditCard, 
  Settings, 
  LogOut, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  plan: string;
  createdAt: string;
  emailVerified: boolean;
}

interface SubscriptionData {
  id: string;
  status: string;
  currentPeriodEnd?: string;
  plan: string;
  provider: string;
}

interface UsageStats {
  todayUsage: number;
  monthlyUsage: number;
  totalAnalyses: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/me');
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
          setUser(userData);
        }

        // Fetch subscription data
        const subscriptionResponse = await fetch('/api/subscription');
        const subscriptionData = await subscriptionResponse.json();
        
        if (subscriptionResponse.ok) {
          setSubscription(subscriptionData);
        }

        // Fetch usage stats
        const statsResponse = await fetch('/api/usage/stats');
        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
          setUsageStats(statsData);
        }
      } catch (error) {
        console.error('Failed to fetch account data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/manage', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Stripe customer portal
        window.location.href = data.portalUrl;
      } else {
        toast.error(data.error || 'Failed to open customer portal');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setIsCanceling(true);
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        // Refresh subscription data
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      // Clear cookie and redirect
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return { daily: 1, monthly: 30, label: '1 per day' };
      case 'PRO':
        return { daily: null, monthly: 20, label: '20 per month' };
      case 'PRO_PLUS':
      case 'LIFETIME':
        return { daily: null, monthly: null, label: 'Unlimited' };
      default:
        return { daily: 1, monthly: 30, label: '1 per day' };
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return 'secondary';
      case 'PRO':
        return 'default';
      case 'PRO_PLUS':
        return 'default';
      case 'LIFETIME':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your account</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const planLimits = getPlanLimits(user.plan);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your subscription, usage, and account preferences
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Verified</p>
                    <div className="flex items-center space-x-2">
                      {user.emailVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-orange-600">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Current Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Badge variant={getPlanColor(user.plan) as any} className="text-lg px-4 py-2">
                      {user.plan}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Limit:</span>
                      <span className="font-medium">{planLimits.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Limit:</span>
                      <span className="font-medium">{planLimits.daily ? `${planLimits.daily} per day` : 'Unlimited'}</span>
                    </div>
                  </div>

                  {user.plan === 'FREE' && (
                    <Button className="w-full" onClick={() => window.location.href = '/pricing'}>
                      Upgrade Plan
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Usage Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Usage Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {usageStats && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">This Month</p>
                        <p className="text-2xl font-bold">
                          {usageStats.monthlyUsage}
                          {planLimits.monthly && ` / ${planLimits.monthly}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Today</p>
                        <p className="text-2xl font-bold">
                          {usageStats.todayUsage}
                          {planLimits.daily && ` / ${planLimits.daily}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Analyses</p>
                        <p className="text-2xl font-bold">{usageStats.totalAnalyses}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="space-y-6">
              {subscription ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Subscription Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Plan</p>
                          <p className="font-medium">{subscription.plan}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Provider</p>
                          <p className="font-medium capitalize">{subscription.provider}</p>
                        </div>
                        {subscription.currentPeriodEnd && (
                          <div>
                            <p className="text-sm text-gray-500">Next Billing Date</p>
                            <p className="font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-4">
                        <Button onClick={handleManageSubscription}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Manage Subscription
                        </Button>
                        
                        {subscription.status === 'active' && subscription.plan !== 'LIFETIME' && (
                          <Button 
                            variant="outline" 
                            onClick={handleCancelSubscription}
                            disabled={isCanceling}
                          >
                            {isCanceling ? 'Cancelling...' : 'Cancel Subscription'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {subscription.status === 'cancelled' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your subscription has been cancelled and will end at the end of your current billing period. 
                        You will retain access to premium features until {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'the end of your billing period'}.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 mb-6">
                      You're currently on the Free plan. Upgrade to unlock premium features.
                    </p>
                    <Button onClick={() => window.location.href = '/pricing'}>
                      View Plans
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Usage History</span>
                </CardTitle>
                <CardDescription>
                  Your analysis usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usageStats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {usageStats.todayUsage}
                          {planLimits.daily && ` / ${planLimits.daily}`}
                        </div>
                        <p className="text-sm text-gray-500">Today's Usage</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {usageStats.monthlyUsage}
                          {planLimits.monthly && ` / ${planLimits.monthly}`}
                        </div>
                        <p className="text-sm text-gray-500">Monthly Usage</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {usageStats.totalAnalyses}
                        </div>
                        <p className="text-sm text-gray-500">Total Analyses</p>
                      </div>
                    </div>

                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        {user.plan === 'FREE' 
                          ? 'Free plan users can perform 1 analysis per day. Usage resets at midnight UTC.'
                          : user.plan === 'PRO'
                          ? 'Pro plan users can perform 20 analyses per month. Usage resets on the 1st of each month.'
                          : 'Your plan includes unlimited analyses. Enjoy!'
                        }
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Email Preferences</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Analysis completion notifications</p>
                      <p>• Weekly usage summaries</p>
                      <p>• Product updates and new features</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Data & Privacy</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Your resume data is processed securely</p>
                      <p>• Analyses are stored for your reference</p>
                      <p>• You can delete your data at any time</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" disabled>
                      Delete Account
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Account deletion is permanent and cannot be undone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}