'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Report } from '@/types';
import { LayoutDashboard, ChevronUp, ChevronDown, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {IncidentCard} from '@/components/incidents/IncidentCard';
import {IncidentDetailsModal} from '@/components/incidents/IncidentDetailsModal';

// Dynamic import for Map
const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse flex items-center justify-center text-text-muted">Loading Map...</div>,
    ssr: false
});

export default function DashboardPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [myReports, setMyReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
    const [mapZoom, setMapZoom] = useState<number | undefined>(undefined);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number; width?: number } | undefined>(undefined);

    useEffect(() => {
        // Get session ID from local storage
        const storedSessionId = localStorage.getItem('sessionId');
        setSessionId(storedSessionId);

        fetchReports();

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchReports, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/report');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setReports(data.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId && reports.length > 0) {
            const userReports = reports.filter(r => r.sessionId === sessionId);
            setMyReports(userReports);
        }
    }, [reports, sessionId]);

    const handleReportClick = (e: React.MouseEvent, report: Report) => {
        // Calculate position based on clicked element
        // Position to the right side of the screen
        const modalWidth = 320;
        const screenWidth = window.innerWidth;
        const rect = e.currentTarget.getBoundingClientRect();

        setModalPosition({
            top: Math.max(80, rect.top - 50), // Shift up slightly to prevent bottom cutoff, keep header clear
            left: screenWidth - modalWidth - 20, // Right align with margin
            width: modalWidth
        });

        // Simulate employee location for demo purposes if not present
        // This creates a mock employee location near the incident
        const reportWithMockData = {
            ...report,
            employeeLocation: report.employeeLocation || {
                lat: report.location.lat + 0.002,
                lng: report.location.lng + 0.002
            }
        };

        setSelectedReport(reportWithMockData);
        setMapCenter([report.location.lat, report.location.lng]);
        setMapZoom(15);
    };

    const handleLocationClick = () => {
        if (selectedReport) {
            setMapCenter([selectedReport.location.lat, selectedReport.location.lng]);
            setMapZoom(16); // Zoom in a bit more when specifically clicking location
            // We usually close the modal or keep it? User said "pin pointing... only show if pathname is dashboard".
            // And "map should be clearly visible".
            // If they click pin, maybe we just center map and keep modal? Or close it?
            // "pin point the location on the map" implies showing it. The modal is already up.
            // Let's just center and zoom, and maybe close the modal to clear the view?
            // "modal should appear over the card... map should be clearly visible".
            // I'll keep the modal open but ensure map is centered.
            // Actually, if the modal covers the map, we might want to move it or transparency?
            // Current design: popover next to sidebar. Map is on the right.
            // If modal is 400px wide, sidebar is 384px. Total ~800px.
            // On desktop, map is visible on the rest of the screen.
            // So just centering the map is enough.
        }
    };

    const handleVote = async (e: React.MouseEvent, reportId: string, action: 'upvote' | 'downvote') => {
        e.stopPropagation();

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reportId, action }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    const updatedReport = data.data;

                    // Update reports list
                    setReports(prevReports =>
                        prevReports.map(r => r._id === updatedReport._id ? updatedReport : r)
                    );

                    // Update selected report if it's the one being voted on
                    if (selectedReport && selectedReport._id === updatedReport._id) {
                        setSelectedReport(updatedReport);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    return (
        <div className="h-screen pt-24 relative flex flex-col md:flex-row overflow-hidden bg-bg-main">
            {/* Left Panel - Incidents List */}
            <div className={`
                absolute md:relative z-20 w-full md:w-96 bg-bg-card border-r border-border-main transition-all duration-300 flex flex-col h-full shadow-xl
                ${isPanelOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-[calc(100%-60px)] md:translate-y-0 md:-translate-x-96'}
            `}>
                {/* Mobile Toggle Header */}
                <div className="md:hidden p-4 border-b border-border-main flex justify-between items-center bg-bg-card">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <LayoutDashboard className="mr-2 text-primary" /> Dashboard
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

                    {/* Top Section: All Reports (Live Feed) */}
                    <div className="flex-1 flex flex-col min-h-0 border-b border-border-main">
                        <div className="p-3 bg-bg-secondary/50 border-b border-border-main flex items-center sticky top-0 z-10 backdrop-blur-sm">
                            <Globe className="w-4 h-4 mr-2 text-primary" />
                            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Live Feed</h3>
                            <span className="ml-auto text-xs bg-bg-card px-2 py-0.5 rounded-full border border-border-main text-text-muted">
                                {reports.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="text-center py-8 text-text-muted text-sm">
                                    No active incidents reported.
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <IncidentCard
                                        key={report._id}
                                        incident={report}
                                        onClick={handleReportClick}
                                        onVote={handleVote}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: My Reports */}
                    <div className="flex-1 flex flex-col min-h-0 bg-bg-card/50">
                        <div className="p-3 bg-bg-secondary/50 border-b border-border-main flex items-center sticky top-0 z-10 backdrop-blur-sm">
                            <User className="w-4 h-4 mr-2 text-status-active" />
                            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">My Reports</h3>
                            <span className="ml-auto text-xs bg-bg-card px-2 py-0.5 rounded-full border border-border-main text-text-muted">
                                {myReports.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
                            {myReports.length === 0 ? (
                                <div className="text-center py-8 text-text-muted text-sm">
                                    You haven't reported any incidents yet.
                                </div>
                            ) : (
                                myReports.map((report) => (
                                    <IncidentCard
                                        key={`my-${report._id}`}
                                        incident={report}
                                        onClick={handleReportClick}
                                        onVote={handleVote}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Map */}
            <div className="flex-1 relative h-full w-full">
                <LiveMap
                    incidents={reports}
                    center={mapCenter}
                    zoom={mapZoom}
                    onLocationSelect={() => { }}
                    selectedIncident={selectedReport}
                />

                {/* Map Overlay Controls could go here */}
                <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                    {/* Example: Filter buttons or Legend */}
                </div>
            </div>

            {/* Incident Details Modal */}
            {selectedReport && (
                <IncidentDetailsModal
                    incident={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onVote={handleVote}
                    onLocationClick={handleLocationClick}
                    position={modalPosition}
                />
            )}
        </div>
    );
}
