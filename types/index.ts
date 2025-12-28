export type UserRole = 'user' | 'responder' | 'employee';

export type ReportType =
  | 'Crime'
  | 'Medical'
  | 'Disaster'
  | 'Infrastructure Collapse'
  | 'Accident'
  | 'Other'
  | 'Fire'
  | 'Emergency';

// "high" | "medium" | "low"
export type ReportSeverity = 'high' | 'medium' | 'low';

// "resolved" | "verified" | "unverified" | "assigning" | "assigned"
export type ReportStatus = 'resolved' | 'verified' | 'unverified' | 'assigning' | 'assigned';

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: number;
  sessionId: string;
  role: UserRole;
  department?: string;
  // Responder specific
  location?: { lat: number, lng: number };
  address?: string;
  employees?: string[];
  // Employee specific
  responder?: string;
  reportIdAssigned?: string;
  status?: 'idle' | 'busy';
}

export interface Report {
  _id: string;
  sessionId: string;
  userId?: string; // reporterId
  type: ReportType | string;
  location: {
    lat: number;
    lng: number;
  };
  employeeLocation?: {
    lat: number;
    lng: number;
  };
  employeeId?: string[];
  responderId?: string[];
  responderNotes?: string;
  description: string;
  phone?: number;
  image?: string;
  upvotes: number;
  downvotes: number;
  duplicates: number;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string; // ISO date string from JSON
  updatedAt: string;
}

// Map Component specific (optional, if needed to keep separate)
export interface MapPin {
  id: string; // report id
  lat: number;
  lng: number;
  type: ReportSeverity | 'verified'; // illustrative custom type
}
