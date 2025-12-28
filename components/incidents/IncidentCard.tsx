'use client';

import { Report } from '@/types';
import { MapPin, Clock, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface IncidentCardProps {
  incident: Report;
  onClick: (report: Report) => void;
  onVote: (e: React.MouseEvent, reportId: string, action: 'upvote' | 'downvote') => void;
}

export default function IncidentCard({ incident, onClick, onVote }: IncidentCardProps) {
  const formattedDate = new Date(incident.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div
      onClick={() => onClick(incident)}
      className="group relative bg-bg-card hover:bg-bg-secondary p-4 rounded-xl border border-border-main hover:border-border-hover transition-all cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide
                        ${incident.severity === 'high' ? 'bg-alert-critical/20 text-alert-critical' :
              incident.severity === 'medium' ? 'bg-alert-medium/20 text-alert-medium' :
                'bg-alert-low/20 text-alert-low'}`}>
            {incident.severity}
          </span>
          <span className="text-xs text-text-muted flex items-center">
            <Clock size={12} className="mr-1" />
            {formattedDate}
          </span>
        </div>
        <div className={`w-2 h-2 rounded-full ${incident.status === 'resolved' ? 'bg-status-resolved' : 'bg-status-active animate-pulse'}`}></div>
      </div>

      <h4 className="font-bold text-white mb-1 line-clamp-1">{incident.type}</h4>
      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
        {incident.description}
      </p>

      <div className="flex items-center justify-between text-xs text-text-muted mt-auto">
        <div className="flex items-center">
          <MapPin size={12} className="mr-1" />
          <span className="truncate max-w-[150px]">{incident.location ? `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}` : 'Unknown Location'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => onVote(e, incident._id, 'upvote')}
            className="flex items-center space-x-1 hover:text-primary transition-colors p-1"
          >
            <ThumbsUp size={14} />
            <span>{incident.upvotes}</span>
          </button>
          <button
            onClick={(e) => onVote(e, incident._id, 'downvote')}
            className="flex items-center space-x-1 hover:text-alert-critical transition-colors p-1"
          >
            <ThumbsDown size={14} />
            <span>{incident.downvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
