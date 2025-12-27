"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface SOSButtonProps {
    onSOS: () => void;
    loading?: boolean;
}

export default function SOSButton({ onSOS, loading = false }: SOSButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative group">
            {/* Ripple/Glow Effect */}
            <div
                className={`absolute inset-0 bg-alert-critical rounded-full blur-xl opacity-20 transition-all duration-500 ${isHovered ? 'scale-125 opacity-40' : 'animate-pulse'}`}
            />

            <button
                onClick={onSOS}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={loading}
                className="relative z-10 flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-alert-critical hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-2xl border-4 border-bg-main"
                aria-label="Emergency SOS"
            >
                {loading ? (
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                    <>
                        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-white mb-1" />
                        <span className="text-white font-bold text-lg md:text-xl tracking-wider">SOS</span>
                    </>
                )}
            </button>

            <p className="mt-4 text-center text-alert-critical font-medium text-sm md:text-base animate-pulse">
                Press for Emergency
            </p>
        </div>
    );
}
