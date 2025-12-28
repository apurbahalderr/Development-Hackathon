'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report } from '@/types';

// Fix Leaflet default icon issue in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

// Define custom icons based on incident type/status if needed
const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Create simple colored circle icons for severity levels
const createCustomIcon = (color: string) =>
    L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #FFF; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

const severityIcons: Record<string, L.DivIcon> = {
    high: createCustomIcon('#EF4444'), // red
    medium: createCustomIcon('#F97316'), // orange
    low: createCustomIcon('#22C55E'), // green
};

// Component to handle map clicks
function MapEvents({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

// Component to update map view when center changes
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface LiveMapProps {
    incidents?: Report[];
    center?: [number, number];
    zoom?: number;
    interactive?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
    selectedLocation?: [number, number] | null;
    className?: string;
}

export default function LiveMap({
    incidents = [],
    center = [20.2961, 85.8245], // Default to Bhubaneswar (KIIT area) or generic
    zoom = 13,
    interactive = true,
    onLocationSelect,
    selectedLocation,
    className = "h-full w-full rounded-lg"
}: LiveMapProps) {
    // Fix for window is not defined during SSR
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={`bg-bg-card animate-pulse ${className} flex items-center justify-center text-text-muted`}>Loading Map...</div>;

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={interactive}
                dragging={interactive}
                className="h-full w-full rounded-lg z-0"
                style={{ height: '100%', width: '100%' }}
            >
                <MapUpdater center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles-dark" // We can try to filter this with CSS
                />

                {/* Render Incidents */}
                {incidents.map((incident) => {
                    const sevKey = (incident.severity || '').toString().toLowerCase();
                    const icon = severityIcons[sevKey] || defaultIcon;
                    return (
                    <Marker
                        key={incident._id}
                        position={[incident.location.lat, incident.location.lng]}
                        icon={icon}
                    >
                        <Popup className="leaflet-popup-dark">
                            <div className="text-gray-900">
                                <h3 className="font-bold">{incident.type}</h3>
                                <p className="text-sm">{incident.description}</p>
                                <div className="text-xs mt-1">Status: {incident.status}</div>
                            </div>
                        </Popup>
                    </Marker>
                    );
                })}

                {/* Render Selected Location (for Reporting) */}
                {selectedLocation && (
                    <Marker
                        position={selectedLocation}
                        icon={defaultIcon}
                    />
                )}

                <MapEvents onLocationSelect={onLocationSelect} />
            </MapContainer>
            <style jsx global>{`
        .leaflet-container {
          background: #151A21;
        }
        /* Dark mode filter for map tiles */
        .leaflet-tile {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
        </div>
    );
}
