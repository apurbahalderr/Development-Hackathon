'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Incident, IncidentStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Filter, Siren, CheckCircle, ArrowRight } from 'lucide-react';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse" />,
    ssr: false
});

const MOCK_ASSIGNED_INCIDENTS: Incident[] = [
    {
        id: '101',
        type: 'Crime',
        description: 'Break-in reported at Jewelry Store.',
        location: { lat: 20.296, lng: 85.824 },
        priority: 'Critical',
        status: 'Assigned',
        timestamp: new Date().toISOString(),
        isVerified: true,
        upvotes: 15
    },
    {
        id: '102',
        type: 'Accident',
        description: 'Minor collision, no injuries.',
        location: { lat: 20.292, lng: 85.828 },
        priority: 'Low',
        status: 'Verified',
        timestamp: new Date().toISOString(),
        isVerified: true,
        upvotes: 2
    }
];

export default function ResponderPage() {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState(MOCK_ASSIGNED_INCIDENTS);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    const handleStatusUpdate = (id: string, newStatus: IncidentStatus) => {
        setIncidents(prev => prev.map(inc =>
            inc.id === id ? { ...inc, status: newStatus } : inc
        ));
        // In real implementation:
        // await fetch(`/api/incidents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
    };

    const canVerify = user?.role === 'RESPONDER';
    const canAssign = user?.role === 'RESPONDER';
    const canResolve = user?.role === 'RESPONDER' || user?.role === 'EMPLOYEE';

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-bg-main overflow-hidden">

            {/* Sidebar: Incident List */}
            <div className="w-full md:w-96 border-r border-border-main bg-bg-card flex flex-col h-full">
                <div className="p-4 border-b border-border-main bg-bg-secondary">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Siren className="mr-2 text-alert-critical" />
                        {user?.role === 'EMPLOYEE' ? 'My Tasks' : 'Dispatch Center'}
                    </h2>
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                        <Button size="sm" variant="primary" className="text-xs">All</Button>
                        <Button size="sm" variant="outline" className="text-xs">Critical</Button>
                        <Button size="sm" variant="outline" className="text-xs">Assigned</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {incidents.map(incident => (
                        <div
                            key={incident.id}
                            onClick={() => setSelectedIncident(incident)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedIncident?.id === incident.id
                                ? 'bg-primary/10 border-primary'
                                : 'bg-bg-secondary border-border-main hover:border-primary/50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge priority={incident.priority}>{incident.type}</Badge>
                                <Badge variant="outline" status={incident.status}>{incident.status}</Badge>
                            </div>
                            <p className="text-sm text-text-primary mb-2 line-clamp-2">{incident.description}</p>
                            <div className="text-xs text-text-secondary flex justify-between">
                                <span>ID: #{incident.id}</span>
                                <span>{new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main View: Map & Detail Panel */}
            <div className="flex-1 relative flex flex-col">
                <div className="flex-1 relative">
                    <LiveMap
                        incidents={incidents}
                        center={selectedIncident ? [selectedIncident.location.lat, selectedIncident.location.lng] : undefined}
                        zoom={selectedIncident ? 16 : 13}
                    />
                </div>

                {/* Selected Incident Action Panel (Bottom Overlay) */}
                {selectedIncident && (
                    <div className="bg-bg-card border-t border-border-main p-6 shadow-xl z-10">
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center">
                                    Incident #{selectedIncident.id}
                                    <span className="ml-3 text-sm font-normal text-text-secondary">
                                        {selectedIncident.type}
                                    </span>
                                </h3>
                                <p className="text-text-secondary mt-1 max-w-xl">{selectedIncident.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {canVerify && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={selectedIncident.status === 'Verified'}
                                        onClick={() => handleStatusUpdate(selectedIncident.id, 'Verified')}
                                    >
                                        Verify
                                    </Button>
                                )}
                                {canAssign && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-status-assigned text-status-assigned hover:bg-status-assigned/10"
                                        disabled={selectedIncident.status === 'Assigned'}
                                        onClick={() => handleStatusUpdate(selectedIncident.id, 'Assigned')}
                                    >
                                        Assign Unit
                                    </Button>
                                )}
                                {canResolve && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        disabled={selectedIncident.status === 'Resolved'}
                                        onClick={() => handleStatusUpdate(selectedIncident.id, 'Resolved')}
                                        leftIcon={<CheckCircle size={16} />}
                                    >
                                        Mark Resolved
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
