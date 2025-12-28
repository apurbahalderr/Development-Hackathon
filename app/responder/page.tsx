'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Report, User, ReportStatus, ReportSeverity } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Siren, CheckCircle, ArrowRight, UserPlus, Send, MapPin, Search, ChevronUp, ChevronDown, LayoutDashboard, Globe, Users } from 'lucide-react';
import {IncidentCard} from '@/components/incidents/IncidentCard';
import {IncidentDetailsModal} from '@/components/incidents/IncidentDetailsModal';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse flex items-center justify-center text-text-muted">Loading Map...</div>,
    ssr: false
});

export default function ResponderPage() {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Report[]>([]);
    const [idleEmployees, setIdleEmployees] = useState<User[]>([]);
    const [selectedIncident, setSelectedIncident] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
    const [mapZoom, setMapZoom] = useState<number>(13);

    // Mock ID for demo if no real auth
    const responderId = user?._id || user?.id || 'r1';

    const fetchData = async () => {
        try {
            // Fetch reports
            const repRes = await fetch('/api/report');
            const repData = await repRes.json();
            if (repData.success) {
                setIncidents(repData.data);
            }

            // Fetch idle employees
            if (user?.role === 'responder' || user?.role === 'employee') {
                const empRes = await fetch(`/api/getIdleEmployees?responderId=${responderId}`);
                const empData = await empRes.json();
                if (empData.success) {
                    setIdleEmployees(empData.data);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s for live updates
        return () => clearInterval(interval);
    }, [user, responderId]);

    const handleVote = async (e: React.MouseEvent, id: string, action: 'upvote' | 'downvote') => {
        e.stopPropagation();
        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                body: JSON.stringify({ reportId: id, action })
            });
            if (res.ok) {
                fetchData(); // refresh
            }
        } catch (e) { console.error(e); }
    };

    const handleAssign = async (employeeId: string) => {
        if (!selectedIncident) return;
        if (!confirm("Assign this report to selected unit?")) return;

        try {
            const res = await fetch('/api/assign', {
                method: 'POST',
                body: JSON.stringify({
                    responderId: responderId,
                    employeeId,
                    reportId: selectedIncident._id
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Unit Assigned!");
                fetchData();
                setSelectedIncident(null);
            } else {
                alert("Failed: " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Error assigning unit");
        }
    };

    const handleForward = async () => {
        if (!selectedIncident) return;
        if (!confirm("Forward to nearest responder?")) return;

        try {
            const res = await fetch('/api/forwardReportToAnotherResponder', {
                method: 'POST',
                body: JSON.stringify({
                    reportId: selectedIncident._id,
                    currentResponderId: responderId
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Report Forwarded!");
                fetchData();
                setSelectedIncident(null);
            } else {
                alert("Forward Failed: " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Error forwarding report");
        }
    };

    const handleStatusChange = async (newStatus: ReportStatus) => {
        if (!selectedIncident) return;
        try {
            const res = await fetch('/api/changeReportStatus', {
                method: 'POST',
                body: JSON.stringify({
                    reportId: selectedIncident._id,
                    status: newStatus
                })
            });
            if (res.ok) {
                fetchData();
                setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (e) { console.error(e); }
    };

    const handleSeverityChange = async (newSeverity: ReportSeverity) => {
        if (!selectedIncident) return;
        try {
            const res = await fetch('/api/changeReportStatus', {
                method: 'POST',
                body: JSON.stringify({
                    reportId: selectedIncident._id,
                    severity: newSeverity
                })
            });
            if (res.ok) {
                fetchData();
                setSelectedIncident(prev => prev ? { ...prev, severity: newSeverity } : null);
            }
        } catch (e) { console.error(e); }
    };

    const handleIncidentClick = (e: React.MouseEvent, incident: Report) => {
        if (e) e.stopPropagation();
        setSelectedIncident(incident);
        setMapCenter([incident.location.lat, incident.location.lng]);
        setMapZoom(16);
    };

    return (
        <div className="h-screen pt-24 relative flex flex-col md:flex-row overflow-hidden bg-bg-main">

            {/* Sidebar Panel */}
            <div className={`
                absolute md:relative z-20 w-full md:w-96 bg-bg-card border-r border-border-main transition-all duration-300 flex flex-col h-full shadow-xl
                ${isPanelOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-[calc(100%-60px)] md:translate-y-0 md:-translate-x-96'}
            `}>
                {/* Header (Mobile Only Toggle) */}
                <div className="md:hidden p-4 border-b border-border-main flex justify-between items-center bg-bg-card">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Siren className="mr-2 text-alert-critical" /> Dispatch
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                    >
                        {isPanelOpen ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                </div>

                {/* Split View Container */}
                <div className="flex flex-col h-full overflow-hidden">

                    {/* Top Section: Live Reports */}
                    <div className="flex-1 flex flex-col min-h-0 border-b border-border-main">
                        <div className="p-3 bg-bg-secondary/50 border-b border-border-main flex items-center sticky top-0 z-10 backdrop-blur-sm">
                            <Globe className="w-4 h-4 mr-2 text-primary" />
                            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Live Reports</h3>
                            <span className="ml-auto text-xs bg-bg-card px-2 py-0.5 rounded-full border border-border-main text-text-muted">
                                {incidents.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : incidents.length === 0 ? (
                                <div className="text-center py-8 text-text-muted text-sm">No reports active.</div>
                            ) : (
                                incidents.map(inc => (
                                    <IncidentCard
                                        key={inc._id}
                                        incident={inc}
                                        onClick={handleIncidentClick}
                                        onVote={handleVote}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: Idle Units */}
                    <div className="flex-1 flex flex-col min-h-0 bg-bg-card/50">
                        <div className="p-3 bg-bg-secondary/50 border-b border-border-main flex items-center sticky top-0 z-10 backdrop-blur-sm">
                            <Users className="w-4 h-4 mr-2 text-status-active" />
                            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Idle Units</h3>
                            <span className="ml-auto text-xs bg-bg-card px-2 py-0.5 rounded-full border border-border-main text-text-muted">
                                {idleEmployees.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
                            {idleEmployees.length === 0 ? (
                                <div className="text-center py-8 text-text-muted text-sm">No active idle units.</div>
                            ) : (
                                idleEmployees.map(emp => (
                                    <div key={emp._id || emp.id} className="p-3 bg-bg-card hover:bg-bg-secondary rounded-lg border border-border-main flex justify-between items-center group cursor-pointer transition-colors"
                                        onClick={() => {
                                            if (emp.location) {
                                                setMapCenter([emp.location.lat, emp.location.lng]);
                                                setMapZoom(16);
                                            }
                                        }}
                                    >
                                        <div>
                                            <div className="font-semibold text-text-primary text-sm">{emp.name}</div>
                                            <div className="text-xs text-text-muted">{emp.department}</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="h-2 w-2 rounded-full bg-status-active shadow-[0_0_8px_rgba(34,197,94,0.6)] mb-1"></div>
                                            <span className="text-[10px] text-text-muted">Idle</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Map Area */}
            <div className="flex-1 relative h-full w-full">
                <LiveMap
                    incidents={incidents}
                    employees={[...idleEmployees]}
                    center={mapCenter}
                    zoom={mapZoom}
                    selectedIncident={selectedIncident}
                />

                {/* Selected Incident Action Panel (Floating Overlay) */}
                {selectedIncident && (
                    <div className="absolute top-4 right-4 z-[400] w-80 bg-bg-card/95 backdrop-blur border border-border-main shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[calc(100%-32px)]">
                        <div className="p-4 border-b border-border-main flex justify-between items-start bg-bg-secondary/50">
                            <div>
                                <h3 className="font-bold text-white text-lg">{selectedIncident.type}</h3>
                                <div className="text-xs text-text-muted">ID: {selectedIncident._id}</div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedIncident(null)}>✕</Button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-text-secondary uppercase font-semibold">Status & Severity</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        className="bg-bg-main border border-border-main rounded px-2 py-1 text-sm text-white focus:border-primary outline-none"
                                        value={selectedIncident.status}
                                        onChange={(e) => handleStatusChange(e.target.value as ReportStatus)}
                                    >
                                        <option value="unverified">Unverified</option>
                                        <option value="verified">Verified</option>
                                        <option value="assigning">Assigning</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <select
                                        className="bg-bg-main border border-border-main rounded px-2 py-1 text-sm text-white focus:border-primary outline-none"
                                        value={selectedIncident.severity}
                                        onChange={(e) => handleSeverityChange(e.target.value as ReportSeverity)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary uppercase font-semibold">Dispatch Actions</label>
                                <div className="mt-2 space-y-2">
                                    {selectedIncident.status === 'assigned' || selectedIncident.status === 'resolved' ? (
                                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary flex items-center">
                                            <CheckCircle size={16} className="mr-2" />
                                            Currently Assigned / Resolved
                                        </div>
                                    ) : (
                                        <>
                                            {idleEmployees.length > 0 ? (
                                                <div className="border border-border-main rounded-lg divide-y divide-border-main bg-bg-main/50">
                                                    <div className="p-2 bg-bg-secondary text-xs font-semibold text-text-secondary">Available Units</div>
                                                    <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-border-main">
                                                        {idleEmployees.map(emp => (
                                                            <div key={emp._id} className="p-2 flex justify-between items-center hover:bg-bg-secondary transition-colors text-sm">
                                                                <div>
                                                                    <div className="text-text-primary">{emp.name}</div>
                                                                    <div className="text-xs text-text-muted">~2.5km</div>
                                                                </div>
                                                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAssign(emp._id!)}>
                                                                    Assign
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-alert-high/10 border border-alert-high/20 rounded-lg text-center">
                                                    <p className="text-sm text-alert-high mb-2">No units available!</p>
                                                    <Button variant="danger" size="sm" className="w-full" onClick={handleForward}>
                                                        <Send size={14} className="mr-2" /> Forward
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
