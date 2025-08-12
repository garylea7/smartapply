'use client';

import { useState } from 'react';
import AnalysisForm from '@/components/AnalysisForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AnalyzePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: { resumeFile: File; jobDescription: string }) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', data.resumeFile);
      formData.append('jobDescription', data.jobDescription);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Analysis completed successfully!');
        router.push(`/app/results/${result.analysisId}`);
      } else {
        toast.error(result.error || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}