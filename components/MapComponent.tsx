"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Report } from "@/types";

// Fix for default marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons based on severity
const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: "custom-pin",
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #FFF; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const icons: Record<string, L.DivIcon> = {
    high: createCustomIcon("#EF4444"),     // Red
    medium: createCustomIcon("#F97316"),   // Orange
    low: createCustomIcon("#22C55E"),      // Green
    default: createCustomIcon("#3B82F6"),  // Blue
};

interface Location {
    lat: number;
    lng: number;
}

// Responder Icon
const responderIcon = L.divIcon({
    className: "", // Empty class to avoid default styles interfering
    html: `<div style="background-color: #14B8A6; width: 40px; height: 40px; border-radius: 50%; border: 3px solid #FFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px #14B8A6; font-size: 20px; position: relative; z-index: 1000;">🚑</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface MapProps {
    userLocation: Location | null;
    incidents: Report[];
    responderLocation?: Location | null;
}


function MapUpdater({ center, responder }: { center: Location | null, responder?: Location | null }) {
    const map = useMap();
    useEffect(() => {
        if (responder && center) {
            const bounds = L.latLngBounds([
                [center.lat, center.lng],
                [responder.lat, responder.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (center) {
            map.flyTo([center.lat, center.lng], 13);
        }
    }, [center, responder, map]);
    return null;
}

export default function MapComponent({ userLocation, incidents, responderLocation }: MapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-full w-full bg-bg-secondary animate-pulse" />;

    const defaultCenter = { lat: 51.505, lng: -0.09 };
    const center = userLocation || defaultCenter;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-border-main z-0 relative">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapUpdater center={userLocation} responder={responderLocation} />

                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.default}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {responderLocation && (
                    <Marker position={[responderLocation.lat, responderLocation.lng]} icon={responderIcon}>
                        <Popup>Help is on the way!</Popup>
                    </Marker>
                )}

                {incidents.map((incident) => (
                    <Marker
                        key={incident._id}
                        position={[incident.location.lat, incident.location.lng]}
                        icon={icons[incident.severity] || icons.default}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h3 className="font-bold text-sm">{incident.type}</h3>
                                <p className="text-xs text-gray-500">{incident.description}</p>
                                <span className={`text-xs font-semibold uppercase text-${incident.severity === 'high' ? 'alert-high' : 'text-primary'}`}>
                                    {incident.severity}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
