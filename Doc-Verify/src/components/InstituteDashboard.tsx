import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Badge } from './UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './UI/tabs';
import { DocumentVerification } from './DocumentVerification';
import { Analytics } from './Analytics';
import { 
  School, 
  FileCheck, 
  Users, 
  LogOut, 
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  UserCheck,
  Search,
  GraduationCap
} from 'lucide-react';
import { Input } from './UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './UI/select';
import type { User } from '../pages/_app';

interface InstituteDashboardProps {
  user: User;
  onLogout: () => void;
}

interface StudentApproval {
  id: string;
  studentName: string;
  studentId: string;
  applicationType: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: Date;
  verificationStatus: 'verified' | 'fake' | 'pending';
}

export function InstituteDashboard({ user, onLogout }: InstituteDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [studentApprovals] = useState<StudentApproval[]>([
    {
      id: '1',
      studentName: 'Emma Wilson',
      studentId: 'ST-2024-101',
      applicationType: 'Admission',
      documentType: 'High School Transcript',
      status: 'pending',
      submissionDate: new Date('2024-01-15'),
      verificationStatus: 'verified'
    },
    {
      id: '2',
      studentName: 'James Brown',
      studentId: 'ST-2024-102',
      applicationType: 'Transfer',
      documentType: 'College Transcript',
      status: 'approved',
      submissionDate: new Date('2024-01-14'),
      verificationStatus: 'verified'
    },
    {
      id: '3',
      studentName: 'Sofia Rodriguez',
      studentId: 'ST-2024-103',
      applicationType: 'Admission',
      documentType: 'Certificate',
      status: 'pending',
      submissionDate: new Date('2024-01-16'),
      verificationStatus: 'fake'
    },
    {
      id: '4',
      studentName: 'Michael Chen',
      studentId: 'ST-2024-104',
      applicationType: 'Scholarship',
      documentType: 'Academic Records',
      status: 'rejected',
      submissionDate: new Date('2024-01-13'),
      verificationStatus: 'fake'
    }
  ]);

  const filteredApprovals = studentApprovals.filter(approval => {
    const matchesSearch = approval.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.applicationType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">✅ Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">❌ Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">⏳ Pending</Badge>;
      default:
        return null;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="outline" className="text-green-600 border-green-600">Document Verified</Badge>;
      case 'fake':
        return <Badge variant="outline" className="text-red-600 border-red-600">Document Fake</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Verification Pending</Badge>;
      default:
        return null;
    }
  };

  const handleApprove = (approvalId: string) => {
    console.log(`Approving application ${approvalId}`);
    // In real app, would call API to update status
  };

  const handleReject = (approvalId: string) => {
    console.log(`Rejecting application ${approvalId}`);
    // In real app, would call API to update status
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Institute Portal</h1>
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
          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600">Total Applications</p>
                  <p className="text-2xl font-semibold text-indigo-700">{studentApprovals.length}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Approved</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {studentApprovals.filter(a => a.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Pending Review</p>
                  <p className="text-2xl font-semibold text-orange-700">
                    {studentApprovals.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Rejected</p>
                  <p className="text-2xl font-semibold text-red-700">
                    {studentApprovals.filter(a => a.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
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
            <TabsTrigger value="student-approvals" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Student Approvals
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-verify">
            <div className="space-y-6">
              {/* Institute Features */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <School className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg text-indigo-800">Institute Portal Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Bulk document verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Student document access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Cross-verification capabilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Student approval workflows</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DocumentVerification allowBulkUpload={true} />
            </div>
          </TabsContent>

          <TabsContent value="student-approvals">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Student Approval Workflows
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search students or applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(approval.status)}
                          <div>
                            <h4 className="font-medium">{approval.studentName}</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p>Student ID: {approval.studentId}</p>
                              <p>Application: {approval.applicationType}</p>
                              <p>Document: {approval.documentType}</p>
                              <p>Submitted: {approval.submissionDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-2">
                            {getStatusBadge(approval.status)}
                            {getVerificationBadge(approval.verificationStatus)}
                          </div>
                          
                          {approval.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(approval.id)}
                                disabled={approval.verificationStatus === 'fake'}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleReject(approval.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      {approval.verificationStatus === 'fake' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">
                            ⚠️ Warning: This document has been flagged as potentially fake. Manual review required.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredApprovals.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No applications found</p>
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