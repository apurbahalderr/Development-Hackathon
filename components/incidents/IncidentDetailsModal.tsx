'use client';

import { Report } from '@/types';
import { X, MapPin, Clock, ThumbsUp, ThumbsDown, User, ShieldAlert, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface IncidentDetailsModalProps {
  incident: Report;
  onClose: () => void;
  onVote: (e: React.MouseEvent, reportId: string, action: 'upvote' | 'downvote') => void;
}

export default function IncidentDetailsModal({ incident, onClose, onVote }: IncidentDetailsModalProps) {
  if (!incident) return null;

  const formattedDate = new Date(incident.createdAt).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bg-card rounded-2xl shadow-2xl border border-border-main flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-border-main flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${incident.severity === 'high' ? 'bg-alert-critical/20 text-alert-critical border border-alert-critical/20' :
                  incident.severity === 'medium' ? 'bg-alert-medium/20 text-alert-medium border border-alert-medium/20' :
                    'bg-alert-low/20 text-alert-low border border-alert-low/20'}`}>
                {incident.severity} Priority
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${incident.status === 'resolved' ? 'bg-status-resolved/20 text-status-resolved border border-status-resolved/20' :
                  incident.status === 'verified' ? 'bg-primary/20 text-primary border border-primary/20' :
                    'bg-text-muted/20 text-text-muted border border-text-muted/20'}`}>
                {incident.status}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{incident.type}</h2>
            <div className="flex items-center text-text-secondary text-sm">
              <Clock size={14} className="mr-1.5" />
              {formattedDate}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-bg-secondary text-text-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Description</h3>
            <p className="text-white leading-relaxed text-lg">
              {incident.description}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-3 p-4 bg-bg-secondary/50 rounded-xl border border-border-main">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold">Location Details</h3>
              <p className="text-text-secondary text-sm">
                Coordinates: {incident.location.lat.toFixed(6)}, {incident.location.lng.toFixed(6)}
              </p>
              {/* In a real app, a mini-map would go here */}
              <div className="mt-2 text-xs text-text-muted italic">Map view available on main dashboard</div>
            </div>
          </div>

          {/* Reporter Info (Anonymized usually, but showing structured data) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-bg-secondary/30 rounded-xl border border-border-main">
              <div className="flex items-center space-x-2 mb-2 text-text-muted">
                <ShieldAlert size={16} />
                <span className="text-xs font-bold uppercase">Votes</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-primary">
                  <ThumbsUp size={20} className="mr-1.5" />
                  <span className="text-xl font-bold">{incident.upvotes}</span>
                </div>
                <div className="flex items-center text-alert-critical">
                  <ThumbsDown size={20} className="mr-1.5" />
                  <span className="text-xl font-bold">{incident.downvotes}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-bg-secondary/30 rounded-xl border border-border-main">
              <div className="flex items-center space-x-2 mb-2 text-text-muted">
                <User size={16} />
                <span className="text-xs font-bold uppercase">Responder Notes</span>
              </div>
              <p className="text-sm text-white">
                {incident.responderNotes || "No notes added by responders yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-main bg-bg-secondary/20 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              leftIcon={<ThumbsUp size={16} />}
              onClick={(e) => onVote(e as any, incident._id, 'upvote')}
            >
              Verify
            </Button>
            <Button
              variant="ghost"
              className="text-alert-critical hover:bg-alert-critical/10 hover:text-alert-critical"
              leftIcon={<ThumbsDown size={16} />}
              onClick={(e) => onVote(e as any, incident._id, 'downvote')}
            >
              False Report
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
