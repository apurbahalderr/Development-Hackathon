"use client";

import { useState } from "react";
import { Camera, Send, X, Loader2 } from "lucide-react";

interface ReportFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    userLocation: { lat: number, lng: number } | null;
}

export default function ReportForm({ onSubmit, onCancel, userLocation }: ReportFormProps) {
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Accident");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate AI classification
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple keyword based "AI" for hackathon demo
        let severity = "low";
        const curDesc = description.toLowerCase();
        if (curDesc.includes("fire") || curDesc.includes("blood") || curDesc.includes("gun") || curDesc.includes("explosion")) {
            severity = "high";
        } else if (curDesc.includes("hurt") || curDesc.includes("injured") || curDesc.includes("crash")) {
            severity = "medium";
        }

        const reportData = {
            description,
            type,
            severity,
            location: userLocation,
            timestamp: new Date(),
        };

        onSubmit(reportData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-bg-card rounded-2xl border border-border-main shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-border-main flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-lg font-bold text-text-primary">Report Incident</h2>
                    <button onClick={onCancel} className="text-text-muted hover:text-text-primary">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Incident Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-bg-main border border-border-main rounded-lg p-3 text-text-primary focus:border-primary outline-none"
                        >
                            <option>Accident</option>
                            <option>Fire</option>
                            <option>Medical</option>
                            <option>Crime</option>
                            <option>Disaster</option>
                            <option>Infrastructure Collapse</option>
                            <option>Other</option>
                            <option>Emergency</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what happened..."
                            className="w-full h-32 bg-bg-main border border-border-main rounded-lg p-3 text-text-primary focus:border-primary outline-none resize-none"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-muted">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "Fetching..."}
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            className="flex items-center justify-center w-full gap-2 p-3 rounded-lg border border-dashed border-border-main text-text-secondary hover:bg-bg-secondary transition-colors"
                        >
                            <Camera className="w-5 h-5" />
                            Upload Image (Optional)
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !userLocation}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {loading ? "Analyzing..." : "Submit Report"}
                    </button>
                </form>
            </div>
        </div>
    );
}
