"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Plus, Menu, Siren } from "lucide-react";
import SOSButton from "@/components/SOSButton";
import IncidentFeed from "@/components/IncidentFeed";
import ReportForm from "@/components/ReportForm";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-bg-secondary animate-pulse flex items-center justify-center text-text-muted">Loading Map...</div>,
});

export default function Home() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingSOS, setLoadingSOS] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "feed">("map"); // Mobile toggle

  // Simulation State
  const [responderLocation, setResponderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  // Mock initial incidents
  useEffect(() => {
    setIncidents([
      {
        id: "1",
        type: "Fire",
        description: "Large fire visible near the central station.",
        severity: "critical",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        upvotes: 12,
        location: { lat: 51.505, lng: -0.09 },
      },
      {
        id: "2",
        type: "Car Accident",
        description: "Traffic stopped due to collision.",
        severity: "high",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        upvotes: 5,
        location: { lat: 51.51, lng: -0.1 },
      },
      {
        id: "3",
        type: "Minor Flooding",
        description: "Road blocked by water.",
        severity: "medium",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        upvotes: 2,
        location: { lat: 51.49, lng: -0.08 },
      },
    ]);

    // Set mock responder location
    setResponderLocation({ lat: 51.512, lng: -0.095 });
    setEta(12);

    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default if geolocation fails
          setUserLocation({ lat: 51.505, lng: -0.09 });
        }
      );
    }
  }, []);

  const handleSOS = () => {
    if (!userLocation) return;
    setLoadingSOS(true);

    // 1. Create SOS Incident
    setTimeout(() => {
      const newIncident = {
        id: Math.random().toString(36).substr(2, 9),
        type: "SOS Alert",
        description: "Emergency SOS triggered!",
        severity: "critical",
        timestamp: new Date(),
        upvotes: 0,
        location: userLocation,
      };
      setIncidents([newIncident, ...incidents]);
      setLoadingSOS(false);

      // 2. Start Responder Simulation
      startResponderSimulation(userLocation);
    }, 1500);
  };

  const startResponderSimulation = (destination: { lat: number, lng: number }) => {
    // Start responder closer (approx 500m)
    let startLat = destination.lat + 0.005;
    let startLng = destination.lng + 0.005;

    setResponderLocation({ lat: startLat, lng: startLng });
    setEta(5); // 5 minutes

    const totalSteps = 100;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;

      // Linear Interpolation
      const currentLat = startLat + (destination.lat - startLat) * progress;
      const currentLng = startLng + (destination.lng - startLng) * progress;

      setResponderLocation({ lat: currentLat, lng: currentLng });

      // Update ETA
      if (step % 20 === 0) {
        setEta((prev) => (prev ? Math.max(1, prev - 1) : 1));
      }

      if (step >= totalSteps) {
        clearInterval(interval);
        setEta(0);
        alert("Responders have arrived at your location!");
      }
    }, 100); // Fast updates for smooth animation
  };

  const handleReportSubmit = (data: any) => {
    const newIncident = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      upvotes: 0,
    };
    setIncidents([newIncident, ...incidents]);
    setShowReportForm(false);
  };

  return (
    <div className="flex flex-col h-screen bg-bg-main text-text-primary overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border-main flex items-center justify-between px-4 bg-bg-secondary z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-alert-critical p-2 rounded-lg">
            <Siren className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">RESQ<span className="text-primary">NOW</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-green-500">SYSTEM ONLINE</span>
          </div>
          <button className="p-2 hover:bg-bg-card rounded-md md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* Left Side: Map (Full width on mobile if viewMode is map) */}
        <div className={`flex-1 relative transition-all duration-300 ${viewMode === 'feed' ? 'hidden md:block' : 'block'}`}>
          <MapComponent userLocation={userLocation} incidents={incidents} responderLocation={responderLocation} />

          {/* Floating SOS Button on Map */}
          <div className="absolute bottom-8 right-6 z-400 md:bottom-10 md:right-10 md:left-auto md:transform-none left-1/2 transform -translate-x-1/2">
            <SOSButton onSOS={handleSOS} loading={loadingSOS} />
          </div>

          {/* Responder ETA Overlay */}
          {responderLocation && eta !== null && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-500 bg-clip-padding backdrop-filter backdrop-blur-xl bg-bg-card/80 border border-border-main p-4 rounded-xl shadow-2xl w-[90%] max-w-sm flex items-center gap-4 animate-in slide-in-from-top-4">
              <div className="bg-green-500/20 p-3 rounded-full animate-pulse">
                <span className="text-2xl">🚑</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white">Help is on the way!</h3>
                <p className="text-sm text-gray-300">
                  {eta === 0 ? "Responders have arrived." : `Estimated arrival in ${eta} minutes`}
                </p>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Toggle: View Feed */}
          <button
            onClick={() => setViewMode('feed')}
            className="md:hidden absolute top-4 right-4 z-[400] bg-bg-card border border-border-main p-3 rounded-full shadow-lg"
          >
            <span className="font-bold text-xs">FEED</span>
          </button>
        </div>

        {/* Right Side: Sidebar / Feed (Hidden on mobile unless viewMode is feed) */}
        <div className={`
          md:w-[400px] border-l border-border-main bg-bg-secondary flex flex-col z-20 
          ${viewMode === 'feed' ? 'w-full absolute inset-0 md:static' : 'hidden md:flex'}
        `}>
          <div className="p-4 border-b border-border-main flex justify-between items-center md:hidden">
            <h2 className="font-bold">Incidents</h2>
            <button onClick={() => setViewMode('map')} className="text-sm text-primary">Back to Map</button>
          </div>

          <div className="flex-1 overflow-hidden">
            <IncidentFeed incidents={incidents} />
          </div>

          <div className="p-4 border-t border-border-main bg-bg-card">
            <button
              onClick={() => setShowReportForm(true)}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Report Incident
            </button>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportForm && (
        <ReportForm
          onSubmit={handleReportSubmit}
          onCancel={() => setShowReportForm(false)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
}
