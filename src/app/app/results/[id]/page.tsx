'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Lock, 
  Crown, 
  Download, 
  Mail,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisResult {
  id: string;
  atsScore: number;
  missingKeywords: string[];
  improvements: string[];
  recommendations: string[];
  tailoredResume?: string;
  coverLetter?: string;
  interviewQA?: string[];
  userPlan: string;
}

interface PaywallFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredPlan: string;
}

const paywallFeatures: PaywallFeature[] = [
  {
    title: "Full Keyword Map",
    description: "Complete list of all missing keywords and skills with priority ranking",
    icon: <Target className="h-5 w-5" />,
    requiredPlan: "PRO"
  },
  {
    title: "Tailored Resume",
    description: "AI-generated resume customized for this specific job description",
    icon: <FileText className="h-5 w-5" />,
    requiredPlan: "PRO"
  },
  {
    title: "Cover Letter",
    description: "Professional cover letter tailored to the job requirements",
    icon: <Mail className="h-5 w-5" />,
    requiredPlan: "PRO"
  },
  {
    title: "Interview Q&A",
    description: "Predicted interview questions and suggested answers",
    icon: <Star className="h-5 w-5" />,
    requiredPlan: "PRO_PLUS"
  },
  {
    title: "Export Options",
    description: "Download results as PDF or DOCX for offline use",
    icon: <Download className="h-5 w-5" />,
    requiredPlan: "PRO"
  }
];

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/results/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setAnalysis(data);
        } else {
          setError(data.error || 'Failed to load analysis');
        }
      } catch (err) {
        setError('An error occurred while loading the analysis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleExport = () => {
    toast.error('Export feature requires Pro plan or higher');
  };

  const isFeatureAvailable = (requiredPlan: string) => {
    if (!analysis) return false;
    
    const planHierarchy = { FREE: 0, PRO: 1, PRO_PLUS: 2, LIFETIME: 3 };
    const userPlanLevel = planHierarchy[analysis.userPlan as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;
    
    return userPlanLevel >= requiredPlanLevel;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Analysis</h1>
          <p className="text-gray-600 mb-6">{error || 'Analysis not found'}</p>
          <Button onClick={() => router.push('/app/analyze')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/app/analyze')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analysis
            </Button>
            <h1 className="text-3xl font-bold">ATS Analysis Results</h1>
            <p className="text-gray-600 mt-2">
              Here's how your resume performs against the job description
            </p>
          </div>
          <Badge variant={analysis.userPlan === 'FREE' ? 'secondary' : 'default'}>
            {analysis.userPlan} Plan
          </Badge>
        </div>

        {/* ATS Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>ATS Score</span>
            </CardTitle>
            <CardDescription>
              How well your resume matches the job description and passes ATS filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                {analysis.atsScore}
              </div>
              <div className="space-y-2">
                <Badge variant={analysis.atsScore >= 70 ? 'default' : 'secondary'}>
                  {getScoreLabel(analysis.atsScore)}
                </Badge>
                <Progress value={analysis.atsScore} className="w-full max-w-md mx-auto" />
              </div>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {analysis.atsScore >= 70 
                  ? 'Your resume is well-optimized for this position!'
                  : 'Your resume needs improvements to better match the job requirements.'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs defaultValue="keywords" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="premium">Premium Features</TabsTrigger>
          </TabsList>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
                <CardDescription>
                  Keywords and skills found in the job description but missing from your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.missingKeywords.slice(0, 10).map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span>{keyword}</span>
                    </div>
                  ))}
                  {analysis.missingKeywords.length > 10 && (
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        {analysis.missingKeywords.length - 10} more keywords available in Pro plan. 
                        <Button variant="link" onClick={handleUpgrade} className="p-0 h-auto ml-1">
                          Upgrade to view all
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvements">
            <Card>
              <CardHeader>
                <CardTitle>Format Improvements</CardTitle>
                <CardDescription>
                  Suggestions to improve your resume format and structure for better ATS parsing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Content Recommendations</CardTitle>
                <CardDescription>
                  Specific content changes to better align with the job requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span>Premium Features</span>
                  </CardTitle>
                  <CardDescription>
                    Unlock advanced features to maximize your job application success
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paywallFeatures.map((feature, index) => {
                      const isAvailable = isFeatureAvailable(feature.requiredPlan);
                      return (
                        <Card key={index} className={`relative ${isAvailable ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>
                                {feature.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold flex items-center space-x-2">
                                  <span>{feature.title}</span>
                                  {isAvailable ? (
                                    <Badge variant="secondary" className="text-xs">
                                      Available
                                    </Badge>
                                  ) : (
                                    <Lock className="h-3 w-3 text-gray-400" />
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {feature.description}
                                </p>
                                {!isAvailable && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={handleUpgrade}
                                  >
                                    Upgrade to {feature.requiredPlan}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {analysis.userPlan === 'FREE' && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold">Upgrade to Pro for Full Access</h3>
                      <p className="text-gray-600">
                        Get unlimited analyses, full keyword maps, tailored resumes, cover letters, and more.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button size="lg" onClick={handleUpgrade}>
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => router.push('/pricing')}>
                          View Plans
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => router.push('/app/analyze')}>
            Analyze Another Resume
          </Button>
          <Button onClick={handleExport} disabled={!isFeatureAvailable('PRO')}>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>
    </div>
  );
}