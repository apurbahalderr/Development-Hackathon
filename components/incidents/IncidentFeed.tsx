'use client';

import { Report } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThumbsUp, MapPin, Clock } from 'lucide-react';

// Mock data for display
const MOCK_EXISTING: Report[] = [
    {
        _id: '1',
        sessionId: 'session_1',
        type: 'Infrastructure Collapse',
        description: 'Bridge near Station Square has a large crack appearing on the west pillar.',
        location: { lat: 20.2961, lng: 85.8245 },
        severity: 'high',
        status: 'verified',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        updatedAt: new Date().toISOString(),
        upvotes: 12,
        downvotes: 0,
        duplicates: 0,
    },
    {
        _id: '2',
        sessionId: 'session_2',
        type: 'Accident',
        description: 'Two bike collision at the main intersection. Traffic blocked.',
        location: { lat: 20.30, lng: 85.83 },
        severity: 'medium',
        status: 'unverified',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        updatedAt: new Date().toISOString(),
        upvotes: 3,
        downvotes: 0,
        duplicates: 0,
    }
];

export function IncidentFeed() {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Reports Recently Reported</h3>
            {MOCK_EXISTING.map((incident) => (
                <Card key={incident._id} className="p-4 bg-bg-card hover:bg-bg-secondary transition-colors border-border-main">
                    <div className="flex justify-between items-start mb-2">
                        <Badge priority={incident.severity}>{incident.type}</Badge>
                        <span className="text-xs text-text-muted flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <p className="text-sm text-text-primary mb-3 line-clamp-2">
                        {incident.description}
                    </p>

                    <div className="flex items-center justify-between mt-4 border-t border-border-main pt-3">
                        <div className="flex items-center text-xs text-text-secondary">
                            <MapPin size={12} className="mr-1" />
                            Near Location
                        </div>

                        <button className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-primary transition-colors">
                            <ThumbsUp size={14} />
                            <span>{incident.upvotes} Verify</span>
                        </button>
                    </div>
                </Card>
            ))}
            <div className="text-center p-4">
                <p className="text-sm text-text-muted">Don't see your issue?</p>
                <p className="text-xs text-text-secondary">File a new report on the right.</p>
            </div>
        </div>
    );
}
