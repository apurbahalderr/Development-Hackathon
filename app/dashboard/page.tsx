'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Report } from '@/types';
import { LayoutDashboard, Clock, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// Dynamic import for Map
const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse" />,
    ssr: false
});

const MOCK_INCIDENTS: Report[] = [
    {
        _id: '1',
        sessionId: 's1',
        type: 'Crime',
        description: 'Suspicious activity reported near the park entrance.',
        location: { lat: 20.291, lng: 85.820 },
        severity: 'medium',
        status: 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 5,
        downvotes: 0,
        duplicates: 0,
    },
    {
        _id: '2',
        sessionId: 's2',
        type: 'Medical',
        description: 'Ambulance required for cardiac arrest patient.',
        location: { lat: 20.301, lng: 85.830 },
        severity: 'high',
        status: 'assigned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 2,
        downvotes: 0,
        duplicates: 0,
    },
    {
        _id: '3',
        sessionId: 's3',
        type: 'Infrastructure Collapse',
        description: 'Road cave-in detected.',
        location: { lat: 20.298, lng: 85.815 },
        severity: 'high',
        status: 'unverified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 8,
        downvotes: 0,
        duplicates: 0,
    }
];

export default function DashboardPage() {
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    return (
        <div className="h-[calc(100vh-64px)] relative flex flex-col md:flex-row overflow-hidden bg-bg-main">
            {/* Left Panel - Incidents List */}
            <div className={`
        absolute md:relative z-20 w-full md:w-96 bg-bg-card border-r border-border-main transition-all duration-300 flex flex-col h-full
        ${isPanelOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-[calc(100%-60px)] md:translate-y-0 md:-translate-x-96'}
      `}>
                <div className="p-4 border-b border-border-main flex justify-between items-center bg-bg-card">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <LayoutDashboard className="mr-2 text-primary" /> Live Feed
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                    >
                        {isPanelOpen ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-4 pb-20 md:pb-4">
                    {MOCK_INCIDENTS.map((incident) => (
                        <Card key={incident._id} className="cursor-pointer hover:border-primary transition-colors">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge priority={incident.severity}>{incident.type}</Badge>
                                    <span className="text-xs text-text-muted">
                                        {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-text-primary mb-2 line-clamp-2">{incident.description}</p>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center text-text-secondary">
                                        <MapPin size={12} className="mr-1" />
                                        {incident.location.lat.toFixed(3)}, {incident.location.lng.toFixed(3)}
                                    </div>
                                    <Badge variant="outline" status={incident.status}>{incident.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative h-full">
                {/* Toggle button for desktop sidebar */}
                <div className="absolute top-4 left-4 z-[400] hidden md:block">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="shadow-lg opacity-90 hover:opacity-100"
                    >
                        {isPanelOpen ? 'Hide Panel' : 'Show Incidents'}
                    </Button>
                </div>

                <LiveMap
                    incidents={MOCK_INCIDENTS}
                    interactive={true}
                    className="h-full w-full"
                />

                {/* Floating User Stat Card */}
                <div className="absolute bottom-6 right-6 z-[400] w-64 hidden md:block">
                    <Card className="bg-bg-card/90 backdrop-blur border-border-main shadow-2xl">
                        <CardContent className="p-4">
                            <h3 className="text-sm font-semibold text-text-secondary mb-2">Your Impact</h3>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-text-primary">Reports Filed</span>
                                <span className="font-bold text-primary">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-primary">Lives Helped</span>
                                <span className="font-bold text-status-resolved">3</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
