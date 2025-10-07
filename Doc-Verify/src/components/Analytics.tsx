import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Badge } from './UI/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, FileCheck, AlertTriangle, Users, Building } from 'lucide-react';

interface AnalyticsProps {
  showUserManagement?: boolean;
}

const verificationData = [
  { month: 'Jan', original: 450, fake: 89 },
  { month: 'Feb', original: 520, fake: 65 },
  { month: 'Mar', original: 680, fake: 120 },
  { month: 'Apr', original: 590, fake: 95 },
  { month: 'May', original: 750, fake: 78 },
  { month: 'Jun', original: 820, fake: 145 }
];

const portalUsageData = [
  { name: 'Student', value: 45, color: '#3B82F6' },
  { name: 'Government', value: 25, color: '#14B8A6' },
  { name: 'Institute', value: 20, color: '#6366F1' },
  { name: 'Company', value: 10, color: '#8B5CF6' }
];

const trendData = [
  { day: 'Mon', verifications: 120 },
  { day: 'Tue', verifications: 150 },
  { day: 'Wed', verifications: 98 },
  { day: 'Thu', verifications: 180 },
  { day: 'Fri', verifications: 220 },
  { day: 'Sat', verifications: 85 },
  { day: 'Sun', verifications: 75 }
];

export function Analytics({ showUserManagement = false }: AnalyticsProps) {
  const totalVerifications = verificationData.reduce((sum, item) => sum + item.original + item.fake, 0);
  const totalFake = verificationData.reduce((sum, item) => sum + item.fake, 0);
  const fakePercentage = ((totalFake / totalVerifications) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Verifications</p>
                <p className="text-2xl font-semibold text-blue-700">{totalVerifications.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
              <FileCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Fake Documents</p>
                <p className="text-2xl font-semibold text-red-700">{totalFake}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">-3.2%</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Success Rate</p>
                <p className="text-2xl font-semibold text-green-700">{(100 - parseFloat(fakePercentage)).toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.1%</span>
                </div>
              </div>
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Active Users</p>
                <p className="text-2xl font-semibold text-purple-700">2,847</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.7%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Verification Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={verificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="original" fill="#22C55E" name="Original" />
                <Bar dataKey="fake" fill="#EF4444" name="Fake" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portal Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Portal Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portalUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portalUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {portalUsageData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Verification Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="verifications" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fake Detection Insights */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Fake Detection Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-700 mb-2">{fakePercentage}%</div>
              <p className="text-sm text-orange-600">Fake Detection Rate</p>
              <Badge className="mt-2 bg-orange-100 text-orange-700">
                Within Normal Range
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-700 mb-2">95.2%</div>
              <p className="text-sm text-red-600">Detection Accuracy</p>
              <Badge className="mt-2 bg-green-100 text-green-700">
                Excellent
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-700 mb-2">0.3s</div>
              <p className="text-sm text-purple-600">Average Processing Time</p>
              <Badge className="mt-2 bg-blue-100 text-blue-700">
                Fast Response
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management (Admin only) */}
      {showUserManagement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Portal User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-semibold text-blue-700">1,245</div>
                <p className="text-sm text-blue-600">Students</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-xl font-semibold text-teal-700">89</div>
                <p className="text-sm text-teal-600">Government</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-xl font-semibold text-indigo-700">156</div>
                <p className="text-sm text-indigo-600">Institutes</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-xl font-semibold text-purple-700">234</div>
                <p className="text-sm text-purple-600">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}