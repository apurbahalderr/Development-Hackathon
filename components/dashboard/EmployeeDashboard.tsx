'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Report } from '@/types';
import { LayoutDashboard, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse" />,
    ssr: false
});

export default function EmployeeDashboard() {
    const [tasks, setTasks] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
        // Poll for new tasks every 5 seconds
        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/employee/tasks');
            const data = await response.json();
            if (data.success) {
                setTasks(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskAction = async (taskId: string, action: 'accepted' | 'rejected' | 'passed') => {
        setProcessing(taskId);
        try {
            const userStr = localStorage.getItem('pulstrix_user');
            const user = userStr ? JSON.parse(userStr) : null;

            const employeeId = user?._id || user?.id;
            if (!employeeId) {
                alert('User not found. Please login again.');
                return;
            }

            // Use 'rejected' for the API (it handles both rejected and passed)
            const apiAction = action === 'passed' ? 'rejected' : action;

            const response = await fetch('/api/assignAccepted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: apiAction,
                    employeeId: employeeId,
                    reportId: taskId
                })
            });

            const data = await response.json();
            if (data.success) {
                if (action === 'accepted') {
                    alert('Task accepted successfully!');
                } else {
                    alert('Task passed. Responder will assign it to another employee.');
                }
                // Refresh tasks after a short delay to allow backend to process
                setTimeout(() => {
                    fetchTasks();
                }, 1000);
            } else {
                alert(data.message || `Failed to ${action === 'accepted' ? 'accept' : 'pass'} task`);
            }
        } catch (error) {
            console.error(`Error ${action === 'accepted' ? 'accepting' : 'passing'} task:`, error);
            alert(`Failed to ${action === 'accepted' ? 'accept' : 'pass'} task`);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] relative flex flex-col overflow-hidden bg-bg-main">
            {/* Header */}
            <div className="p-4 border-b border-border-main bg-bg-card">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <LayoutDashboard className="mr-2 text-primary" /> Employee Dashboard
                </h2>
                <p className="text-sm text-text-secondary mt-1">View and manage your assigned tasks</p>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel - Tasks List */}
                <div className="w-full md:w-96 border-r border-border-main bg-bg-card overflow-y-auto">
                    <div className="p-4 border-b border-border-main">
                        <h3 className="text-lg font-semibold text-text-primary">Assigned Tasks</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {loading ? (
                            <div className="text-text-secondary text-center py-8">Loading tasks...</div>
                        ) : tasks.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="p-8 text-center">
                                    <Clock className="mx-auto mb-4 text-text-muted" size={48} />
                                    <p className="text-text-secondary mb-2">No tasks assigned</p>
                                    <p className="text-sm text-text-muted">You will see tasks here when a responder assigns them to you.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            tasks.map((task) => (
                                <Card key={task._id} className="border-primary">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base">{task.type}</CardTitle>
                                            <Badge priority={task.severity}>{task.severity}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-text-primary mb-3">{task.description}</p>
                                        <div className="flex items-center text-xs text-text-secondary mb-3">
                                            <MapPin size={12} className="mr-1" />
                                            {task.location.lat.toFixed(3)}, {task.location.lng.toFixed(3)}
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <Badge variant="outline" status={task.status}>
                                                {task.status}
                                            </Badge>
                                            <span className="text-xs text-text-muted">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {task.status === 'assigning' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleTaskAction(task._id, 'accepted')}
                                                    disabled={processing === task._id}
                                                    variant="primary"
                                                    className="flex-1"
                                                >
                                                    <CheckCircle className="mr-2" size={16} />
                                                    {processing === task._id ? 'Processing...' : 'Accept'}
                                                </Button>
                                                <Button
                                                    onClick={() => handleTaskAction(task._id, 'passed')}
                                                    disabled={processing === task._id}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <XCircle className="mr-2" size={16} />
                                                    {processing === task._id ? 'Processing...' : 'Pass'}
                                                </Button>
                                            </div>
                                        )}
                                        {task.status === 'assigned' && (
                                            <div className="bg-status-assigned/20 text-status-assigned p-2 rounded text-sm text-center">
                                                Task Accepted - In Progress
                                            </div>
                                        )}
                                        {task.status === 'assigning' && (
                                            <div className="bg-yellow-500/20 text-yellow-500 p-2 rounded text-sm text-center">
                                                Awaiting Your Response
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Right - Map */}
                <div className="flex-1 relative h-full min-h-[400px]">
                    {tasks.length > 0 ? (
                        <LiveMap
                            incidents={tasks}
                            interactive={true}
                            className="h-full w-full"
                        />
                    ) : (
                        <div className="h-full w-full bg-bg-secondary flex items-center justify-center">
                            <div className="text-center text-text-muted">
                                <MapPin className="mx-auto mb-4" size={48} />
                                <p>No tasks to display on map</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

