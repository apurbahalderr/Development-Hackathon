'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Report, User } from '@/types';
import { LayoutDashboard, MapPin, Users, Filter, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse" />,
    ssr: false
});

interface Employee {
    _id: string;
    name: string;
    email: string;
    status: 'idle' | 'busy';
    department: string;
}

export default function ResponderDashboard() {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);

    const reportTypes = ['all', 'Crime', 'Medical', 'Fire', 'Accident', 'Disaster', 'Infrastructure Collapse', 'Other'];

    useEffect(() => {
        fetchReports();
    }, [selectedType, selectedDepartment]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedType !== 'all') params.append('type', selectedType);
            if (selectedDepartment !== 'all') params.append('department', selectedDepartment);

            const response = await fetch(`/api/reports/responder?${params.toString()}`);
            const data = await response.json();
            if (data.success) {
                setReports(data.data || []);
            } else {
                console.error('Failed to fetch reports:', data.message);
                setReports([]);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/getIdleEmployees');
            const data = await response.json();
            if (data.success) {
                setEmployees(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleAssign = async () => {
        if (!selectedReport || !selectedEmployee || !user?._id) {
            if (!user?._id) {
                // Try to get from localStorage if _id is not available
                const userStr = localStorage.getItem('pulstrix_user');
                const storedUser = userStr ? JSON.parse(userStr) : null;
                if (!storedUser?._id && !storedUser?.id) {
                    alert('User information not found. Please login again.');
                    return;
                }
            }
            return;
        }

        setAssigning(true);
        try {
            const responderId = user._id || user.id;
            const response = await fetch('/api/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    responderId: responderId,
                    employeeId: selectedEmployee,
                    reportId: selectedReport._id
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Employee assigned successfully!');
                setSelectedReport(null);
                setSelectedEmployee(null);
                fetchReports();
                fetchEmployees();
            } else {
                alert(data.message || 'Failed to assign employee');
            }
        } catch (error) {
            console.error('Error assigning employee:', error);
            alert('Failed to assign employee');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] relative flex flex-col overflow-hidden bg-bg-main">
            {/* Header with Filters */}
            <div className="p-4 border-b border-border-main bg-bg-card">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <LayoutDashboard className="mr-2 text-primary" /> Responder Dashboard
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Filter className="text-text-secondary" size={16} />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-bg-secondary border border-border-main rounded-lg px-3 py-1.5 text-sm text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                {reportTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="bg-bg-secondary border border-border-main rounded-lg px-3 py-1.5 text-sm text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="all">All Departments</option>
                                {user?.department && (
                                    <option value={user.department}>{user.department}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel - Reports List */}
                <div className="w-full md:w-96 border-r border-border-main bg-bg-card overflow-y-auto">
                    <div className="p-4 border-b border-border-main">
                        <h3 className="text-lg font-semibold text-text-primary">Recent Reports</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {loading ? (
                            <div className="text-text-secondary text-center py-8">Loading reports...</div>
                        ) : reports.length === 0 ? (
                            <div className="text-text-secondary text-center py-8">
                                <p>No reports found</p>
                                <p className="text-xs text-text-muted mt-2">
                                    {selectedType !== 'all' || selectedDepartment !== 'all' 
                                        ? 'Try adjusting your filters' 
                                        : 'No reports available for your department'}
                                </p>
                            </div>
                        ) : (
                            reports.map((report) => (
                                <Card
                                    key={report._id}
                                    className={`cursor-pointer hover:border-primary transition-colors ${
                                        selectedReport?._id === report._id ? 'border-primary' : ''
                                    }`}
                                    onClick={() => setSelectedReport(report)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge priority={report.severity}>{report.type}</Badge>
                                            <span className="text-xs text-text-muted">
                                                {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-primary mb-2 line-clamp-2">{report.description}</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center text-text-secondary">
                                                <MapPin size={12} className="mr-1" />
                                                {report.location.lat.toFixed(3)}, {report.location.lng.toFixed(3)}
                                            </div>
                                            <Badge variant="outline" status={report.status}>{report.status}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Center - Map */}
                <div className="flex-1 relative h-full min-h-[400px]">
                    <LiveMap
                        incidents={reports}
                        interactive={true}
                        className="h-full w-full"
                    />
                </div>

                {/* Right Panel - Available Employees */}
                <div className="w-full md:w-80 border-l border-border-main bg-bg-card overflow-y-auto">
                    <div className="p-4 border-b border-border-main">
                        <h3 className="text-lg font-semibold text-text-primary flex items-center">
                            <Users className="mr-2 text-primary" size={18} /> Available Employees
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {employees.length === 0 ? (
                            <div className="text-text-secondary text-center py-8">
                                <p>No available employees</p>
                                <p className="text-xs text-text-muted mt-2">All employees are currently busy</p>
                            </div>
                        ) : (
                            employees.map((employee) => (
                                <Card
                                    key={employee._id}
                                    className={`cursor-pointer hover:border-primary transition-colors ${
                                        selectedEmployee === employee._id ? 'border-primary' : ''
                                    }`}
                                    onClick={() => setSelectedEmployee(employee._id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-text-primary">{employee.name}</h4>
                                            <Badge variant="outline" status={employee.status === 'idle' ? 'verified' : 'assigned'}>
                                                {employee.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-text-secondary mb-1">{employee.email}</p>
                                        <p className="text-xs text-text-muted">{employee.department}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Assign Button */}
                    {selectedReport && selectedEmployee && (
                        <div className="p-4 border-t border-border-main bg-bg-secondary">
                            <div className="mb-2">
                                <p className="text-sm text-text-secondary mb-1">Assigning:</p>
                                <p className="text-sm font-semibold text-text-primary">{selectedReport.type}</p>
                            </div>
                            <Button
                                onClick={handleAssign}
                                disabled={assigning}
                                className="w-full"
                                variant="primary"
                            >
                                {assigning ? 'Assigning...' : 'Assign Task'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedReport(null);
                                    setSelectedEmployee(null);
                                }}
                                variant="ghost"
                                className="w-full mt-2"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

