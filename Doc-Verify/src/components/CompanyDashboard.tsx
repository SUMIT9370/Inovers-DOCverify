import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Badge } from './UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './UI/tabs';
import { DocumentVerification } from './DocumentVerification';
import { Analytics } from './Analytics';
import { 
  Briefcase, 
  FileCheck, 
  Download, 
  LogOut, 
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileText,
  Search,
  Building
} from 'lucide-react';
import { Input } from './UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './UI/select';
import type { User } from '../pages/_app';

interface CompanyDashboardProps {
  user: User;
  onLogout: () => void;
}

interface CandidateVerification {
  id: string;
  candidateName: string;
  position: string;
  documentType: string;
  institution: string;
  status: 'verified' | 'fake' | 'pending';
  verificationDate: Date;
  confidence: number;
  crossVerified: boolean;
}

export function CompanyDashboard({ user, onLogout }: CompanyDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  
  const [candidateVerifications] = useState<CandidateVerification[]>([
    {
      id: '1',
      candidateName: 'Alex Johnson',
      position: 'Software Engineer',
      documentType: 'Computer Science Degree',
      institution: 'MIT',
      status: 'verified',
      verificationDate: new Date('2024-01-15'),
      confidence: 96,
      crossVerified: true
    },
    {
      id: '2',
      candidateName: 'Sarah Williams',
      position: 'Data Scientist',
      documentType: 'MS in Data Science',
      institution: 'Stanford University',
      status: 'fake',
      verificationDate: new Date('2024-01-14'),
      confidence: 89,
      crossVerified: true
    },
    {
      id: '3',
      candidateName: 'Robert Chen',
      position: 'Product Manager',
      documentType: 'MBA Certificate',
      institution: 'Harvard Business School',
      status: 'pending',
      verificationDate: new Date('2024-01-16'),
      confidence: 0,
      crossVerified: false
    },
    {
      id: '4',
      candidateName: 'Maria Garcia',
      position: 'UX Designer',
      documentType: 'Design Portfolio Certificate',
      institution: 'RISD',
      status: 'verified',
      verificationDate: new Date('2024-01-13'),
      confidence: 94,
      crossVerified: true
    }
  ]);

  const filteredVerifications = candidateVerifications.filter(verification => {
    const matchesSearch = verification.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = positionFilter === 'all' || verification.position.toLowerCase().includes(positionFilter.toLowerCase());
    
    return matchesSearch && matchesPosition;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fake':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700">✅ Verified</Badge>;
      case 'fake':
        return <Badge variant="destructive">❌ Fake</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">⏳ Pending</Badge>;
      default:
        return null;
    }
  };

  const downloadAuthenticityReport = (verification: CandidateVerification) => {
    const reportData = {
      candidateInfo: {
        name: verification.candidateName,
        position: verification.position,
        institution: verification.institution
      },
      verificationResult: {
        status: verification.status,
        confidence: verification.confidence,
        verificationDate: verification.verificationDate,
        crossVerified: verification.crossVerified
      },
      companyInfo: {
        verifiedBy: user.name,
        companyPortal: 'DocuVerify Pro - Company Portal'
      },
      authenticity: verification.status === 'verified' ? 
        'This document has been verified as authentic through cross-verification with institutional and government records.' :
        'This document has been flagged as potentially fraudulent. Additional verification recommended.'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${verification.candidateName}_authenticity_report.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Company Portal</h1>
                <p className="text-sm text-slate-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Total Candidates</p>
                  <p className="text-2xl font-semibold text-purple-700">{candidateVerifications.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Verified</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {candidateVerifications.filter(v => v.status === 'verified').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Fake Detected</p>
                  <p className="text-2xl font-semibold text-red-700">
                    {candidateVerifications.filter(v => v.status === 'fake').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Cross-Verified</p>
                  <p className="text-2xl font-semibold text-blue-700">
                    {candidateVerifications.filter(v => v.crossVerified).length}
                  </p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bulk-verify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="bulk-verify" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Bulk Verify
            </TabsTrigger>
            <TabsTrigger value="candidate-records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Candidate Records
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-verify">
            <div className="space-y-6">
              {/* Company Features */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg text-purple-800">Company Portal Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Bulk resume & certificate verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Cross-check with institutions & government</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Downloadable authenticity reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Advanced fake document detection</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DocumentVerification allowBulkUpload={true} />
            </div>
          </TabsContent>

          <TabsContent value="candidate-records">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Candidate Verification Records
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search candidates or positions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="scientist">Scientist</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(verification.status)}
                          <div>
                            <h4 className="font-medium">{verification.candidateName}</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p>Position: {verification.position}</p>
                              <p>Document: {verification.documentType}</p>
                              <p>Institution: {verification.institution}</p>
                              <p>Verified: {verification.verificationDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-2">
                            {getStatusBadge(verification.status)}
                            {verification.confidence > 0 && (
                              <div className="text-sm text-slate-600">
                                Confidence: {verification.confidence}%
                              </div>
                            )}
                            {verification.crossVerified && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                Cross-Verified
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadAuthenticityReport(verification)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download Report
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {verification.status === 'fake' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">
                            ⚠️ Warning: This candidate's document has been flagged as potentially fraudulent. 
                            Cross-verification with institutional records confirms discrepancies.
                          </p>
                        </div>
                      )}
                      
                      {verification.status === 'verified' && verification.crossVerified && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">
                            ✅ Document authenticity confirmed through cross-verification with institution and government records.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredVerifications.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No candidate records found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}