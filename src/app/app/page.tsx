'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Crown, 
  Settings, 
  BarChart3,
  Calendar,
  User,
  LogOut,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  plan: string;
  createdAt: string;
}

interface UsageStats {
  todayUsage: number;
  monthlyUsage: number;
  lastAnalysis?: {
    id: string;
    atsScore: number;
    createdAt: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/me');
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
          setUser(userData);
        }

        // Fetch usage stats
        const statsResponse = await fetch('/api/usage/stats');
        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
          setUsageStats(statsData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's your ATS analysis overview
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={getPlanColor(user.plan) as any}>
              {user.plan} Plan
            </Badge>
            <Link href="/app/account">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats?.monthlyUsage || 0}
                {planLimits.monthly && ` / ${planLimits.monthly}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {planLimits.label}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats?.todayUsage || 0}
                {planLimits.daily && ` / ${planLimits.daily}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {planLimits.daily ? 'Daily limit' : 'No daily limit'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats?.lastAnalysis?.atsScore || '--'}
              </div>
              <p className="text-xs text-muted-foreground">
                {usageStats?.lastAnalysis ? 'Latest analysis' : 'No analysis yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with a new ATS analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/app/analyze">
                  <Button className="w-full" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    New Analysis
                  </Button>
                </Link>
                
                {usageStats?.lastAnalysis && (
                  <Link href={`/app/results/${usageStats.lastAnalysis.id}`}>
                    <Button variant="outline" className="w-full">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View Last Analysis
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest ATS analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usageStats?.lastAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">ATS Analysis</p>
                          <p className="text-sm text-gray-500">
                            {new Date(usageStats.lastAnalysis.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={usageStats.lastAnalysis.atsScore >= 70 ? 'default' : 'secondary'}>
                          Score: {usageStats.lastAnalysis.atsScore}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/app/results/${usageStats.lastAnalysis.id}`}>
                      <Button variant="outline" className="w-full">
                        View Full Results
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No analyses yet</p>
                    <Link href="/app/analyze">
                      <Button>Start Your First Analysis</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>Your Plan</span>
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
                  <Link href="/pricing">
                    <Button className="w-full" variant="outline">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Pro Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p>• Use complete job descriptions for better analysis</p>
                  <p>• Update your resume regularly with new skills</p>
                  <p>• Focus on keywords mentioned in the job description</p>
                  <p>• Keep formatting simple for better ATS parsing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}