import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Button } from './UI/button';
import { Badge } from './UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './UI/tabs';
import { Analytics } from './Analytics';
import { 
  Shield, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3,
  UserCheck,
  Building,
  Search,
  MoreHorizontal,
  Activity
} from 'lucide-react';
import { Input } from './UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './UI/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './UI/dropdown-menu';
import type { User } from '../pages/_app';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  portal: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: Date;
  documentsProcessed: number;
}

interface SystemSetting {
  id: string;
  category: string;
  setting: string;
  value: string;
  description: string;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [portalFilter, setPortalFilter] = useState<string>('all');
  
  const [systemUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@university.edu',
      portal: 'Student',
      status: 'active',
      lastActive: new Date('2024-01-15'),
      documentsProcessed: 24
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@government.gov',
      portal: 'Government',
      status: 'active',
      lastActive: new Date('2024-01-16'),
      documentsProcessed: 156
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@mit.edu',
      portal: 'Institute',
      status: 'inactive',
      lastActive: new Date('2024-01-10'),
      documentsProcessed: 89
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@techcorp.com',
      portal: 'Company',
      status: 'active',
      lastActive: new Date('2024-01-16'),
      documentsProcessed: 67
    },
    {
      id: '5',
      name: 'Emma Brown',
      email: 'emma@suspended.com',
      portal: 'Student',
      status: 'suspended',
      lastActive: new Date('2024-01-05'),
      documentsProcessed: 12
    }
  ]);

  const [systemSettings] = useState<SystemSetting[]>([
    {
      id: '1',
      category: 'Security',
      setting: 'Session Timeout',
      value: '30 minutes',
      description: 'Automatic logout after inactivity'
    },
    {
      id: '2',
      category: 'Verification',
      setting: 'Fake Detection Threshold',
      value: '85%',
      description: 'Minimum confidence for fake detection'
    },
    {
      id: '3',
      category: 'Storage',
      setting: 'Document Retention',
      value: '7 years',
      description: 'How long to keep verified documents'
    },
    {
      id: '4',
      category: 'API',
      setting: 'Rate Limiting',
      value: '1000/hour',
      description: 'Maximum API calls per user per hour'
    }
  ]);

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPortal = portalFilter === 'all' || user.portal.toLowerCase() === portalFilter.toLowerCase();
    
    return matchesSearch && matchesPortal;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return null;
    }
  };

  const getPortalColor = (portal: string) => {
    switch (portal.toLowerCase()) {
      case 'student':
        return 'text-blue-600';
      case 'government':
        return 'text-teal-600';
      case 'institute':
        return 'text-indigo-600';
      case 'company':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`);
    // In real app, would call API to perform action
  };

  const handleSettingChange = (settingId: string) => {
    console.log(`Updating setting ${settingId}`);
    // In real app, would open modal to edit setting
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Admin Portal</h1>
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
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Users</p>
                  <p className="text-2xl font-semibold text-blue-700">{systemUsers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Active Users</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {systemUsers.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Total Portals</p>
                  <p className="text-2xl font-semibold text-purple-700">4</p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">System Health</p>
                  <p className="text-2xl font-semibold text-orange-700">98.9%</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="user-management" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="system-settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Admin Analytics Banner */}
              <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg text-slate-800">Admin Portal Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <span>Comprehensive system analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>User management across all portals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>System settings & permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time monitoring & alerts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Analytics showUserManagement={true} />
            </div>
          </TabsContent>

          <TabsContent value="user-management">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={portalFilter} onValueChange={setPortalFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by portal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Portals</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="institute">Institute</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p>Email: {user.email}</p>
                              <p>Portal: <span className={getPortalColor(user.portal)}>{user.portal}</span></p>
                              <p>Last Active: {user.lastActive.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-2">
                            {getStatusBadge(user.status)}
                            <div className="text-sm text-slate-600">
                              {user.documentsProcessed} docs processed
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>
                                Edit User
                              </DropdownMenuItem>
                              {user.status === 'active' ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleUserAction(user.id, 'delete')}
                              >
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No users found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {systemSettings.map((setting) => (
                    <div key={setting.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{setting.category}</Badge>
                            <h4 className="font-medium">{setting.setting}</h4>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{setting.description}</p>
                          <div className="text-sm">
                            Current Value: <span className="font-medium text-blue-600">{setting.value}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSettingChange(setting.id)}
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}