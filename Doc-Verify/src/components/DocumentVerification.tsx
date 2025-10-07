import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Progress } from './UI/progress';
import { Badge } from './UI/badge';
import { 
  Upload, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download,
  Eye,
  Wifi,
  WifiOff
} from 'lucide-react';

interface VerificationResult {
  id: string;
  filename: string;
  status: 'original' | 'fake';
  confidence: number;
  timestamp: Date;
  fakeAreas?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    reason: string;
  }>;
}

interface DocumentVerificationProps {
  allowBulkUpload?: boolean;
  onVerificationComplete?: (results: VerificationResult[]) => void;
}

export function DocumentVerification({ allowBulkUpload = false, onVerificationComplete }: DocumentVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!allowBulkUpload && files.length > 1) {
      alert('Bulk upload not available for this portal');
      return;
    }
    setSelectedFiles(files);
  };

  const simulateVerification = async (files: File[]) => {
    setIsVerifying(true);
    setVerificationProgress(0);
    
    const verificationResults: VerificationResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate processing time
      for (let progress = 0; progress <= 100; progress += 10) {
        setVerificationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Mock verification result (70% chance of being original)
      const isOriginal = Math.random() > 0.3;
      
      const result: VerificationResult = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        status: isOriginal ? 'original' : 'fake',
        confidence: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date(),
        fakeAreas: isOriginal ? undefined : [
          {
            x: Math.floor(Math.random() * 200),
            y: Math.floor(Math.random() * 200),
            width: 100,
            height: 50,
            reason: 'Potential signature forgery detected'
          },
          {
            x: Math.floor(Math.random() * 200) + 200,
            y: Math.floor(Math.random() * 200) + 100,
            width: 150,
            height: 30,
            reason: 'Text manipulation detected'
          }
        ]
      };
      
      verificationResults.push(result);
    }
    
    setResults(verificationResults);
    setIsVerifying(false);
    setVerificationProgress(0);
    
    if (onVerificationComplete) {
      onVerificationComplete(verificationResults);
    }
  };

  const handleVerify = () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to verify');
      return;
    }
    simulateVerification(selectedFiles);
  };

  const downloadReport = (result: VerificationResult) => {
    const reportData = {
      filename: result.filename,
      status: result.status,
      confidence: result.confidence,
      timestamp: result.timestamp,
      fakeAreas: result.fakeAreas
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.filename}_verification_report.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Document Upload & Verification
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOfflineMode(!offlineMode)}
                className={offlineMode ? 'bg-orange-50 text-orange-600' : ''}
              >
                {offlineMode ? <WifiOff className="w-4 h-4 mr-1" /> : <Wifi className="w-4 h-4 mr-1" />}
                {offlineMode ? 'Offline' : 'Online'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg">Drop files here or click to browse</p>
                <p className="text-sm text-slate-500">
                  Supports PDF, JPG, PNG files
                  {allowBulkUpload && ' • Bulk upload enabled'}
                </p>
              </div>
              <input
                type="file"
                multiple={allowBulkUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4>Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                    <FileCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {isVerifying && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm">
                    {offlineMode ? 'Verifying Offline...' : 'Processing Documents...'}
                  </span>
                </div>
                <Progress value={verificationProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleVerify}
              disabled={selectedFiles.length === 0 || isVerifying}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              {isVerifying ? 'Verifying...' : 'Start Verification'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Verification Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className={`border rounded-lg p-4 transition-all duration-500 ${
                    result.status === 'original' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {result.status === 'original' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <h4 className="font-medium">{result.filename}</h4>
                        <p className="text-sm text-slate-600">
                          Verified on {result.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={result.status === 'original' ? 'default' : 'destructive'}
                        className="animate-pulse"
                      >
                        {result.status === 'original' ? '✅ Original' : '❌ Fake'}
                      </Badge>
                      <Badge variant="outline">
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>

                  {result.fakeAreas && result.fakeAreas.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Suspicious Areas Detected:</span>
                      </div>
                      {result.fakeAreas.map((area, index) => (
                        <div key={index} className="text-sm text-red-700 ml-6">
                          • {area.reason}
                        </div>
                      ))}
                      <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                        <p className="text-sm text-red-700">
                          🔍 Red highlighted areas in the document indicate potential forgery or tampering
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Document
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadReport(result)}>
                      <Download className="w-4 h-4 mr-1" />
                      Download Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}