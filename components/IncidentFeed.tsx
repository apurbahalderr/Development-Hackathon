"use client";

import { ThumbsUp, MapPin, Clock } from "lucide-react";
import { Report } from "@/types";

interface IncidentFeedProps {
    incidents: Report[];
}

export default function IncidentFeed({ incidents }: IncidentFeedProps) {
    return (
        <div className="w-full h-full flex flex-col bg-bg-secondary rounded-xl border border-border-main overflow-hidden">
            <div className="p-4 border-b border-border-main bg-bg-card">
                <h2 className="text-xl font-bold text-text-primary">Recent Incidents</h2>
                <p className="text-text-secondary text-sm">Live updates from your area</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {incidents.length === 0 ? (
                    <div className="text-center text-text-muted py-10">
                        No incidents reported nearby.
                    </div>
                ) : (
                    incidents.map((incident) => (
                        <div
                            key={incident._id}
                            className="bg-bg-card p-4 rounded-lg border border-border-main hover:border-bg-main transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-text-primary">{incident.type}</h3>
                                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(incident.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                  ${incident.severity === 'high' ? 'bg-alert-high/10 text-alert-high border border-alert-high/20' : ''}
                  ${incident.severity === 'medium' ? 'bg-alert-medium/10 text-alert-medium border border-alert-medium/20' : ''}
                  ${incident.severity === 'low' ? 'bg-alert-low/10 text-alert-low border border-alert-low/20' : ''}
                `}>
                                    {incident.severity}
                                </span>
                            </div>

                            <p className="text-text-secondary text-sm mb-3">
                                {incident.description}
                            </p>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-main">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 text-text-muted hover:text-color-info transition-colors text-sm">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{incident.upvotes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>Map</span>
                                    </button>
                                </div>
                                <button className="text-xs text-text-muted hover:text-text-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
