import '../styles/globals.css';
import React, { useState } from 'react';
import '../styles/globals.css';
import { PortalSelector } from '../components/PortalSelector';
import { AuthForm } from '../components/AuthForm';
import { StudentDashboard } from '../components/StudentDashboard';
import { GovernmentDashboard } from '../components/GovernmentDashboard';
import { InstituteDashboard } from '../components/InstituteDashboard';
import { CompanyDashboard } from '../components/CompanyDashboard';
import { AdminDashboard } from '../components/AdminDashboard';

export type Portal = 'student' | 'government' | 'institute' | 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  portal: Portal;
}

export default function App() {
  const [currentPortal, setCurrentPortal] = useState<Portal | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handlePortalSelect = (portal: Portal) => {
    setCurrentPortal(portal);
  };

  const handleLogin = (userData: User) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPortal(null);
  };

  // Show Portal Selector first
  if (!currentPortal) {
    return <PortalSelector onPortalSelect={handlePortalSelect} />;
  }

  // Show Login Form if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthForm 
        portal={currentPortal} 
        onLogin={handleLogin}
        onBack={() => setCurrentPortal(null)}
      />
    );
  }

  // Show Dashboard after login
  const renderDashboard = () => {
    switch (currentPortal) {
      case 'student':
        return <StudentDashboard user={currentUser!} onLogout={handleLogout} />;
      case 'government':
        return <GovernmentDashboard user={currentUser!} onLogout={handleLogout} />;
      case 'institute':
        return <InstituteDashboard user={currentUser!} onLogout={handleLogout} />;
      case 'company':
        return <CompanyDashboard user={currentUser!} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard user={currentUser!} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderDashboard()}
    </div>
  );
}
