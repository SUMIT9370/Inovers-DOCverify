import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Badge } from './UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './UI/tabs';
import { DocumentVerification } from './DocumentVerification';
import { Analytics } from './Analytics';
import { 
  Building2, 
  FileCheck, 
  Database, 
  LogOut, 
  Upload,
  CheckCircle,
  XCircle,
  Users,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import { Input } from './UI/input';
import type { User } from '../pages/_app';

interface GovernmentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface StudentRecord {
  id: string;
  studentName: string;
  studentId: string;
  institution: string;
  documentType: string;
  status: 'verified' | 'fake' | 'pending';
  verificationDate: Date;
  confidence: number;
}

export function GovernmentDashboard({ user, onLogout }: GovernmentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentRecords] = useState<StudentRecord[]>([
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentId: 'STU-2024-001',
      institution: 'MIT',
      documentType: 'Degree Certificate',
      status: 'verified',
      verificationDate: new Date('2024-01-15'),
      confidence: 96
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      studentId: 'STU-2024-002',
      institution: 'Stanford University',
      documentType: 'Transcript',
      status: 'fake',
      verificationDate: new Date('2024-01-14'),
      confidence: 89
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      studentId: 'STU-2024-003',
      institution: 'Harvard University',
      documentType: 'ID Card',
      status: 'pending',
      verificationDate: new Date('2024-01-16'),
      confidence: 0
    },
    {
      id: '4',
      studentName: 'David Wilson',
      studentId: 'STU-2024-004',
      institution: 'Caltech',
      documentType: 'Certificate',
      status: 'verified',
      verificationDate: new Date('2024-01-13'),
      confidence: 94
    }
  ]);

  const filteredRecords = studentRecords.filter(record => 
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fake':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-orange-400 animate-pulse" />;
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
        return <Badge className="bg-orange-100 text-orange-700">⏳ Pending Review</Badge>;
      default:
        return null;
    }
  };

  const handleApprove = (recordId: string) => {
    console.log(`Approving record ${recordId}`);
    // In real app, would call API to update status
  };

  const handleReject = (recordId: string) => {
    console.log(`Rejecting record ${recordId}`);
    // In real app, would call API to update status
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Government Portal</h1>
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
          <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-600">Total Records</p>
                  <p className="text-2xl font-semibold text-teal-700">{studentRecords.length}</p>
                </div>
                <Database className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Verified</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {studentRecords.filter(r => r.status === 'verified').length}
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
                    {studentRecords.filter(r => r.status === 'fake').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Pending Review</p>
                  <p className="text-2xl font-semibold text-orange-700">
                    {studentRecords.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-400 animate-pulse" />
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
            <TabsTrigger value="student-records" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Student Records
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-verify">
            <div className="space-y-6">
              {/* Government Features */}
              <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-6 h-6 text-teal-600" />
                    <h3 className="text-lg text-teal-800">Government Portal Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>Bulk document verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Cross-verification with institutions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Advanced fake detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Approval/rejection workflow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DocumentVerification allowBulkUpload={true} />
            </div>
          </TabsContent>

          <TabsContent value="student-records">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Student Document Records
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search students, IDs, or institutions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(record.status)}
                          <div>
                            <h4 className="font-medium">{record.studentName}</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p>Student ID: {record.studentId}</p>
                              <p>Institution: {record.institution}</p>
                              <p>Document: {record.documentType}</p>
                              <p>Verified: {record.verificationDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            {getStatusBadge(record.status)}
                            {record.confidence > 0 && (
                              <div className="text-sm text-slate-600 mt-1">
                                Confidence: {record.confidence}%
                              </div>
                            )}
                          </div>
                          
                          {record.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(record.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleReject(record.id)}
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
                    </div>
                  ))}

                  {filteredRecords.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No records found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
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