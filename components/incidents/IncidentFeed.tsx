'use client';

import { useState, useEffect } from 'react';
import { Report } from '@/types';
import IncidentCard from './IncidentCard';
import IncidentDetailsModal from './IncidentDetailsModal';
import { Loader2 } from 'lucide-react';



export function IncidentFeed() {
    const [incidents, setIncidents] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState<Report | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await fetch('/api/report');
                const data = await response.json();
                if (data.success) {
                    setIncidents(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch incidents:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncidents();
        
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchIncidents, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleVote = async (e: React.MouseEvent, reportId: string, action: 'upvote' | 'downvote') => {
        e.stopPropagation(); // Prevent card click
        if (isVoting) return;
        setIsVoting(true);
        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, action })
            });
            const data = await response.json();
            if (data.success) {
                // Update local state
                setIncidents(prev => prev.map(inc => 
                    inc._id === reportId ? data.data : inc
                ));
                if (selectedIncident && selectedIncident._id === reportId) {
                    setSelectedIncident(data.data);
                }
            }
        } catch (error) {
            console.error("Vote failed:", error);
        } finally {
            setIsVoting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
            {incidents.length === 0 ? (
                <div className="text-center p-4 text-text-muted bg-bg-card rounded-lg border border-border-main">
                    <p>No recent incidents reported.</p>
                </div>
            ) : (
                incidents.map((incident) => (
                    <IncidentCard 
                        key={incident._id} 
                        incident={incident} 
                        onClick={setSelectedIncident}
                        onVote={handleVote}
                    />
                ))
            )}
            <div className="text-center p-4">
                <p className="text-sm text-text-muted">Don't see your issue?</p>
                <p className="text-xs text-text-secondary">File a new report on the right.</p>
            </div>

            {/* Incident Details Modal */}
            {selectedIncident && (
                <IncidentDetailsModal 
                    incident={selectedIncident} 
                    onClose={() => setSelectedIncident(null)}
                    onVote={handleVote}
                />
            )}
        </div>
    );
}
