export type UserRole = 'CITIZEN' | 'RESPONDER' | 'EMPLOYEE';

export type IncidentType = 
  | 'Crime' 
  | 'Medical' 
  | 'Disaster' 
  | 'Infrastructure Collapse' 
  | 'Accident' 
  | 'Other'
  | 'Emergency'; // For Silent SOS

export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'Reported' | 'Verified' | 'Assigned' | 'Resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string; // For responders
  accessCode?: string; // For responders
}

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  image?: string; // URL or base64
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  priority: IncidentPriority;
  status: IncidentStatus;
  timestamp: string; // ISO date
  reporterId?: string; // Optional if anonymous/logged out
  upvotes: number;
  isVerified: boolean;
  assignedResponderId?: string;
  assignedEmployeeId?: string;
}

// For map pins
export type PinType = 'critical' | 'verified' | 'unverified' | 'resolved';
