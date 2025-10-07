import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Badge } from './UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './UI/tabs';
import { DocumentVerification } from './DocumentVerification';
import { 
  GraduationCap, 
  FileCheck, 
  History, 
  LogOut, 
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import type { User } from '../pages/_app';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Document {
  id: string;
  name: string;
  status: 'verified' | 'fake' | 'pending';
  uploadDate: Date;
  verificationDate?: Date;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Degree_Certificate.pdf',
      status: 'verified',
      uploadDate: new Date('2024-01-15'),
      verificationDate: new Date('2024-01-15')
    },
    {
      id: '2', 
      name: 'Transcript.pdf',
      status: 'fake',
      uploadDate: new Date('2024-01-10'),
      verificationDate: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'ID_Card.jpg',
      status: 'pending',
      uploadDate: new Date('2024-01-12')
    }
  ]);

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
        return <Badge className="bg-green-100 text-green-700">✅ Original</Badge>;
      case 'fake':
        return <Badge variant="destructive">❌ Fake</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">⏳ Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Student Portal</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Verified Documents</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {documents.filter(d => d.status === 'verified').length}
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
                  <p className="text-sm text-red-600">Fake Documents</p>
                  <p className="text-2xl font-semibold text-red-700">
                    {documents.filter(d => d.status === 'fake').length}
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
                  <p className="text-sm text-orange-600">Pending Verification</p>
                  <p className="text-2xl font-semibold text-orange-700">
                    {documents.filter(d => d.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload & Verify
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              My Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="space-y-6">
              {/* Special Features Banner */}
              <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg text-blue-800">Student Portal Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Single document upload only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Offline verification mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Fake document highlighting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Instant verification results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DocumentVerification allowBulkUpload={false} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Document History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-slate-600">
                            Uploaded on {doc.uploadDate.toLocaleDateString()}
                            {doc.verificationDate && (
                              <> • Verified on {doc.verificationDate.toLocaleDateString()}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(doc.status)}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}

                  {documents.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No documents uploaded yet</p>
                      <p className="text-sm">Upload your first document to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}