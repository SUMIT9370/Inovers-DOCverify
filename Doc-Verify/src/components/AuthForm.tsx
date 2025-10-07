import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { Label } from './UI/label';
import { ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Alert, AlertDescription } from './UI/alert';
import { apiClient } from '../lib/api/client';
import type { ApiResponse, AuthResponse } from '../lib/api/client';
import type { Portal, User } from '../pages/_app';

interface AuthFormProps {
  portal: Portal;
  onLogin: (user: User) => void;
  onBack: () => void;
}

const portalTitles = {
  student: 'Student Portal',
  government: 'Government Portal',
  institute: 'Institute Portal',
  company: 'Company Portal',
  admin: 'Admin Portal'
};

const portalColors = {
  student: 'from-blue-500 to-blue-600',
  government: 'from-teal-500 to-teal-600',
  institute: 'from-indigo-500 to-indigo-600',
  company: 'from-purple-500 to-purple-600',
  admin: 'from-slate-600 to-slate-700'
};

const portalToUserType = {
  student: 'student',
  government: 'government',
  institute: 'university',
  company: 'company',
  admin: 'government'
};

export function AuthForm({ portal, onLogin, onBack }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    registrationNumber: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const userType = portalToUserType[portal];
      let authResponse: ApiResponse<AuthResponse>;
      
      authResponse = isLogin
        ? await apiClient.login(formData.email, formData.password)
        : await apiClient.register({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            userType,
            institution: formData.institution,
            registrationNumber: formData.registrationNumber
          });

      if (authResponse.error) {
        setError(authResponse.error);
        return;
      }

      if (authResponse.data) {
        apiClient.setToken(authResponse.data.token);
        const user: User = {
          id: authResponse.data.user.id,
          name: authResponse.data.user.name,
          email: authResponse.data.user.email,
          portal
        };
        onLogin(user);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const needsInstitution = portal === 'student' || portal === 'institute';
  const needsRegistration = portal === 'institute' || portal === 'company';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portals
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${portalColors[portal]} flex items-center justify-center mx-auto mb-4`}>
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </CardTitle>
            <p className="text-slate-600">
              {portalTitles[portal]}
            </p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && needsInstitution && (
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input
                    id="institution"
                    type="text"
                    placeholder="Enter institution name"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    required
                  />
                </div>
              )}

              {!isLogin && needsRegistration && (
                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input
                    id="registration"
                    type="text"
                    placeholder="Enter registration number"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>

              <p className="text-center text-sm text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      institution: '',
                      registrationNumber: ''
                    });
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
