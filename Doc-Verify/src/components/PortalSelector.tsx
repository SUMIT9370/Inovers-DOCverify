import React from 'react';
import { Card, CardContent } from './UI/card';
import { Button } from './UI/button';
import { 
  GraduationCap, 
  Building2, 
  School, 
  Briefcase, 
  Shield,
  FileCheck,
  Sparkles
} from 'lucide-react';
import type { Portal } from '../pages/_app';

interface PortalSelectorProps {
  onPortalSelect: (portal: Portal) => void;
}

const portals = [
  {
    id: 'student' as Portal,
    title: 'Student Portal',
    description: 'Upload and verify your documents with secure offline verification',
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700'
  },
  {
    id: 'government' as Portal,
    title: 'Government Portal',
    description: 'Bulk verification and cross-check student records',
    icon: Building2,
    color: 'from-teal-500 to-teal-600',
    hoverColor: 'hover:from-teal-600 hover:to-teal-700'
  },
  {
    id: 'institute' as Portal,
    title: 'Institute Portal',
    description: 'Verify student documents and manage approvals',
    icon: School,
    color: 'from-indigo-500 to-indigo-600',
    hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
  },
  {
    id: 'company' as Portal,
    title: 'Company Portal',
    description: 'Verify resumes and certificates with authenticity reports',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700'
  },
  {
    id: 'admin' as Portal,
    title: 'Admin Portal',
    description: 'Manage all portals, users, and system analytics',
    icon: Shield,
    color: 'from-slate-600 to-slate-700',
    hoverColor: 'hover:from-slate-700 hover:to-slate-800'
  }
];

export function PortalSelector({ onPortalSelect }: PortalSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-lg">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
          </div>
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DocuVerify Pro
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Secure multi-portal document verification system with AI-powered fake detection and cross-verification capabilities
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            return (
              <Card 
                key={portal.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${portal.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {portal.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {portal.description}
                  </p>
                  
                  <Button 
                    onClick={() => onPortalSelect(portal.id)}
                    className={`w-full bg-gradient-to-r ${portal.color} ${portal.hoverColor} border-0 shadow-md transition-all duration-300`}
                  >
                    Enter Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Banner */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Offline Verification
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Fake Detection
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Cross-Verification
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Bulk Processing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}