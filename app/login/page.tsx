"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode === "admin123" || accessCode === "help") {
            // Simulate login
            alert("Access Granted: Redirecting to Responder Dashboard...");
            router.push("/");
        } else {
            setError("Invalid Access Code");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-main p-4">
            <div className="w-full max-w-md bg-bg-card border border-border-main rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4 border border-border-main">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Responder Access</h1>
                    <p className="text-text-secondary text-center mt-2">
                        Enter your secure access code to view the emergency dashboard.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Access Code</label>
                        <input
                            type="password"
                            value={accessCode}
                            onChange={(e) => {
                                setAccessCode(e.target.value);
                                setError("");
                            }}
                            className="w-full bg-bg-secondary border border-border-main rounded-lg p-3 text-text-primary focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                        />
                        {error && <p className="text-alert-critical text-sm mt-2">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Authenticate
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border-main text-center">
                    <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Official Channel</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
