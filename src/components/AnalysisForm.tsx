'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisFormProps {
  onSubmit: (data: { resumeFile: File; jobDescription: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function AnalysisForm({ onSubmit, isLoading = false }: AnalysisFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setResumeFile(file);
    setUploadProgress(100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter the job description');
      return;
    }

    if (jobDescription.length < 50) {
      toast.error('Job description must be at least 50 characters long');
      return;
    }

    try {
      await onSubmit({ resumeFile, jobDescription });
    } catch (error) {
      toast.error('Failed to analyze resume');
    }
  };

  const isFormValid = resumeFile && jobDescription.trim().length >= 50;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">ATS Resume Analysis</h1>
        <p className="text-gray-600">
          Upload your resume and paste the job description to get instant ATS optimization insights
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Upload Your Resume</span>
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF format (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : resumeFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {!resumeFile ? (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your PDF here or click to browse</p>
                  <p className="text-sm text-gray-500">Supports PDF files up to 10MB</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <span className="text-lg font-medium text-green-700">File uploaded successfully</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{resumeFile.name}</span>
                  <Badge variant="secondary">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setResumeFile(null);
                    setUploadProgress(0);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Remove file
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Paste the full job description for accurate analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {jobDescription.length} characters
                </span>
                {jobDescription.length < 50 && jobDescription.length > 0 && (
                  <span className="text-sm text-red-500">
                    Minimum 50 characters required
                  </span>
                )}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For best results, include the complete job description with all requirements, 
                responsibilities, and qualifications.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>
    </div>
  );
}