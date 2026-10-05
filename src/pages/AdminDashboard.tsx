import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  Eye,
  RefreshCw,
  Loader2,
} from 'lucide-react';

const API_BASE = 'http://localhost:3000';

interface DashboardStats {
  totalApplications: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: number;
  averageCIBILScore: number;
  totalLoanAmount: number;
  recentApplications: LoanApplication[];
}

interface LoanApplication {
  id: number;
  applicantName?: string;
  name?: string;
  loanType?: string;
  loan_type?: string;
  amount?: number;
  loan_amount?: number;
  cibilScore?: number;
  cibil_score?: number;
  status: string;
  createdAt?: string;
  created_at?: string;
  date?: string;
}

interface AuditLogEntry {
  id: number;
  timestamp: string;
  applicationId: number;
  action: string;
  oldStatus: string;
  newStatus: string;
  reason: string;
  adminUser: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'approved') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
  }
  if (s === 'rejected') {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
};

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideLoading, setOverrideLoading] = useState(false);

  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, appsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders }),
        fetch(`${API_BASE}/loan-applications`, { headers: authHeaders }),
      ]);

      if (!dashRes.ok) throw new Error('Failed to fetch dashboard data');
      if (!appsRes.ok) throw new Error('Failed to fetch loan applications');

      const dashData = await dashRes.json();
      const appsData = await appsRes.json();

      setStats(dashData);
      setApplications(Array.isArray(appsData) ? appsData : appsData.applications || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLog = async () => {
    try {
      const res = await fetch(`${API_BASE}/decision-audit-log`, { headers: authHeaders });
      if (!res.ok) throw new Error('Failed to fetch audit log');
      const data = await res.json();
      setAuditLog(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Audit log fetch error:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
      fetchAuditLog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleOverride = async () => {
    if (!selectedApp || !overrideStatus || !overrideReason.trim()) return;
    setOverrideLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/loan-applications/${selectedApp.id}/override`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ status: overrideStatus, reason: overrideReason }),
      });
      if (!res.ok) throw new Error('Failed to override decision');
      setOverrideDialogOpen(false);
      setOverrideStatus('');
      setOverrideReason('');
      setSelectedApp(null);
      await fetchDashboardData();
      await fetchAuditLog();
    } catch (err: any) {
      setError(err.message || 'Override failed');
    } finally {
      setOverrideLoading(false);
    }
  };

  const openOverrideDialog = (app: LoanApplication) => {
    setSelectedApp(app);
    setOverrideStatus('');
    setOverrideReason('');
    setOverrideDialogOpen(true);
  };

  // Access denied view
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
              <CardDescription>
                You do not have administrator privileges to view this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Helpers for flexible field names
  const getAppName = (app: LoanApplication) => app.applicantName || app.name || 'N/A';
  const getAppLoanType = (app: LoanApplication) => app.loanType || app.loan_type || 'N/A';
  const getAppAmount = (app: LoanApplication) => app.amount || app.loan_amount || 0;
  const getAppCibil = (app: LoanApplication) => app.cibilScore || app.cibil_score || 0;
  const getAppDate = (app: LoanApplication) => {
    const raw = app.createdAt || app.created_at || app.date;
    if (!raw) return 'N/A';
    return new Date(raw).toLocaleDateString('en-IN');
  };

  // Analytics helpers
  const loanTypeDistribution = applications.reduce<Record<string, number>>((acc, app) => {
    const type = getAppLoanType(app);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = {
    approved: stats?.approved ?? applications.filter((a) => a.status?.toLowerCase() === 'approved').length,
    rejected: stats?.rejected ?? applications.filter((a) => a.status?.toLowerCase() === 'rejected').length,
    pending: stats?.pending ?? applications.filter((a) => a.status?.toLowerCase() === 'pending').length,
  };

  const maxStatusCount = Math.max(statusCounts.approved, statusCounts.rejected, statusCounts.pending, 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-blue-700 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Manage loan applications and view analytics
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => {
              fetchDashboardData();
              fetchAuditLog();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
            <Button variant="ghost" size="sm" className="ml-auto text-red-700" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Applications
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-700" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalApplications ?? applications.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Approved</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.approved}</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
                    {statusCounts.approved} approved
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Rejected</CardTitle>
                  <XCircle className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.rejected}</p>
                  <Badge className="mt-1 bg-red-100 text-red-800 hover:bg-red-100">
                    {statusCounts.rejected} rejected
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Approval Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 text-blue-700" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.approvalRate != null
                      ? `${stats.approvalRate.toFixed(1)}%`
                      : applications.length > 0
                        ? `${((statusCounts.approved / applications.length) * 100).toFixed(1)}%`
                        : '0%'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="applications" className="space-y-4">
              <TabsList className="bg-white border">
                <TabsTrigger value="applications" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-1" />
                  Applications
                </TabsTrigger>
                <TabsTrigger value="audit" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                  <Clock className="h-4 w-4 mr-1" />
                  Audit Log
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Applications Tab */}
              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Applications</CardTitle>
                    <CardDescription>
                      View and manage all loan applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applications.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No applications found.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Applicant Name</TableHead>
                              <TableHead>Loan Type</TableHead>
                              <TableHead>Amount (₹)</TableHead>
                              <TableHead>CIBIL Score</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applications.map((app) => (
                              <TableRow key={app.id}>
                                <TableCell className="font-medium">#{app.id}</TableCell>
                                <TableCell>{getAppName(app)}</TableCell>
                                <TableCell className="capitalize">{getAppLoanType(app)}</TableCell>
                                <TableCell>{formatCurrency(getAppAmount(app))}</TableCell>
                                <TableCell>
                                  <span
                                    className={
                                      getAppCibil(app) >= 750
                                        ? 'text-green-700 font-semibold'
                                        : getAppCibil(app) >= 650
                                          ? 'text-yellow-700 font-semibold'
                                          : 'text-red-700 font-semibold'
                                    }
                                  >
                                    {getAppCibil(app)}
                                  </span>
                                </TableCell>
                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                <TableCell>{getAppDate(app)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/loan-application/${app.id}`)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-700 text-blue-700 hover:bg-blue-50"
                                    onClick={() => openOverrideDialog(app)}
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Override
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Audit Log Tab */}
              <TabsContent value="audit">
                <Card>
                  <CardHeader>
                    <CardTitle>Decision Audit Log</CardTitle>
                    <CardDescription>
                      History of all decision overrides and actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {auditLog.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No audit log entries found.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Application ID</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Old Status</TableHead>
                              <TableHead>New Status</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead>Admin User</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {auditLog.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell className="whitespace-nowrap">
                                  {new Date(entry.timestamp).toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell className="font-medium">#{entry.applicationId}</TableCell>
                                <TableCell className="capitalize">{entry.action}</TableCell>
                                <TableCell>{getStatusBadge(entry.oldStatus)}</TableCell>
                                <TableCell>{getStatusBadge(entry.newStatus)}</TableCell>
                                <TableCell className="max-w-xs truncate">{entry.reason}</TableCell>
                                <TableCell>{entry.adminUser}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="space-y-6">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Average CIBIL Score
                        </CardTitle>
                        <BarChart3 className="h-5 w-5 text-blue-700" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats?.averageCIBILScore
                            ? Math.round(stats.averageCIBILScore)
                            : applications.length > 0
                              ? Math.round(
                                  applications.reduce((sum, a) => sum + getAppCibil(a), 0) /
                                    applications.length,
                                )
                              : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Across all applications</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Total Loan Amount
                        </CardTitle>
                        <IndianRupee className="h-5 w-5 text-blue-700" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats?.totalLoanAmount
                            ? formatCurrency(stats.totalLoanAmount)
                            : formatCurrency(
                                applications
                                  .filter((a) => a.status?.toLowerCase() === 'approved')
                                  .reduce((sum, a) => sum + getAppAmount(a), 0),
                              )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total disbursed amount</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Loan Type Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Loan Type Distribution</CardTitle>
                      <CardDescription>Number of applications by loan type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(loanTypeDistribution).length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No data available.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(loanTypeDistribution).map(([type, count]) => (
                            <div
                              key={type}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                            >
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {type}
                              </span>
                              <Badge className="bg-blue-700 text-white hover:bg-blue-800">
                                {count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Applications by Status - SVG Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Applications by Status</CardTitle>
                      <CardDescription>Visual breakdown of application statuses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <svg width="400" height="260" viewBox="0 0 400 260" className="max-w-full">
                          {/* Y-axis */}
                          <line x1="60" y1="20" x2="60" y2="200" stroke="#d1d5db" strokeWidth="1" />
                          {/* X-axis */}
                          <line x1="60" y1="200" x2="380" y2="200" stroke="#d1d5db" strokeWidth="1" />

                          {/* Grid lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
                            const y = 200 - frac * 170;
                            return (
                              <g key={i}>
                                <line x1="58" y1={y} x2="380" y2={y} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
                                <text x="50" y={y + 4} textAnchor="end" fontSize="11" fill="#6b7280">
                                  {Math.round(frac * maxStatusCount)}
                                </text>
                              </g>
                            );
                          })}

                          {/* Approved Bar */}
                          <rect
                            x="100"
                            y={200 - (statusCounts.approved / maxStatusCount) * 170}
                            width="60"
                            height={(statusCounts.approved / maxStatusCount) * 170}
                            rx="4"
                            fill="#16a34a"
                          />
                          <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="500">
                            Approved
                          </text>
                          <text
                            x="130"
                            y={195 - (statusCounts.approved / maxStatusCount) * 170}
                            textAnchor="middle"
                            fontSize="13"
                            fill="#16a34a"
                            fontWeight="600"
                          >
                            {statusCounts.approved}
                          </text>

                          {/* Rejected Bar */}
                          <rect
                            x="210"
                            y={200 - (statusCounts.rejected / maxStatusCount) * 170}
                            width="60"
                            height={(statusCounts.rejected / maxStatusCount) * 170}
                            rx="4"
                            fill="#dc2626"
                          />
                          <text x="240" y="220" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="500">
                            Rejected
                          </text>
                          <text
                            x="240"
                            y={195 - (statusCounts.rejected / maxStatusCount) * 170}
                            textAnchor="middle"
                            fontSize="13"
                            fill="#dc2626"
                            fontWeight="600"
                          >
                            {statusCounts.rejected}
                          </text>

                          {/* Pending Bar */}
                          <rect
                            x="320"
                            y={200 - (statusCounts.pending / maxStatusCount) * 170}
                            width="60"
                            height={(statusCounts.pending / maxStatusCount) * 170}
                            rx="4"
                            fill="#ca8a04"
                          />
                          <text x="350" y="220" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="500">
                            Pending
                          </text>
                          <text
                            x="350"
                            y={195 - (statusCounts.pending / maxStatusCount) * 170}
                            textAnchor="middle"
                            fontSize="13"
                            fill="#ca8a04"
                            fontWeight="600"
                          >
                            {statusCounts.pending}
                          </text>

                          {/* Y-axis label */}
                          <text
                            x="15"
                            y="110"
                            textAnchor="middle"
                            fontSize="11"
                            fill="#6b7280"
                            transform="rotate(-90, 15, 110)"
                          >
                            Applications
                          </text>
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
      <Footer />

      {/* Override Dialog */}
      <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Decision</DialogTitle>
            <DialogDescription>
              Override the decision for application #{selectedApp?.id}
              {selectedApp ? ` (${getAppName(selectedApp)})` : ''}.
              Current status: {selectedApp?.status || 'N/A'}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">New Status</label>
              <Select value={overrideStatus} onValueChange={setOverrideStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Reason</label>
              <Textarea
                placeholder="Provide a reason for the override..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={handleOverride}
              disabled={!overrideStatus || !overrideReason.trim() || overrideLoading}
            >
              {overrideLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Override'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
