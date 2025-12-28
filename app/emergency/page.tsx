'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Flashlight, Volume2, BookOpen, ExternalLink } from 'lucide-react';

export default function EmergencyToolsPage() {
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [sirenOn, setSirenOn] = useState(false);

    // Note: Audio and Flashlight APIs are limited in browser. 
    // Flashlight usually requires a specific stream API or just screen brightness.
    // Siren uses AudioContext.

    const toggleSiren = () => {
        if (sirenOn) {
            // Logic to stop siren would go here
            setSirenOn(false);
        } else {
            // Logic to play siren
            const audio = new Audio('/siren.mp3'); // Mock path, effectively won't play without file
            // For hackathon, we can use a beeping noise via AudioContext or simple oscillator
            playBeep();
            setSirenOn(true);
        }
    };

    const playBeep = () => {
        // Simple browser beep simulation
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5); // Beep for 0.5s
        // To loop, we'd need more logic, but this demonstrates intent
        setTimeout(() => setSirenOn(false), 500); // Auto turn off for simple demo
    };

    return (
        <div className="min-h-screen bg-bg-main p-4 md:p-8">
            {/* Flashlight Overlay */}
            {flashlightOn && (
                <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
                    <button
                        onClick={() => setFlashlightOn(false)}
                        className="px-8 py-4 bg-black text-white rounded-full font-bold text-xl shadow-lg"
                    >
                        TAP TO TURN OFF
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Emergency Toolkit</h1>
                <p className="text-text-secondary mb-8">Offline-ready tools for critical situations.</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Flashlight Tool */}
                    <Card className="hover:border-primary transition-colors group cursor-pointer" onClick={() => setFlashlightOn(true)}>
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform">
                                <Flashlight size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Screen Flashlight</h3>
                            <p className="text-text-secondary mb-6">
                                Max brightness white screen for visibility in dark areas.
                            </p>
                            <Button variant="outline">Activate</Button>
                        </CardContent>
                    </Card>

                    {/* Siren Tool */}
                    <Card className={`hover:border-alert-critical transition-colors group cursor-pointer ${sirenOn ? 'animate-pulse border-alert-critical' : ''}`} onClick={toggleSiren}>
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-alert-critical/10 flex items-center justify-center text-alert-critical mb-6 group-hover:scale-110 transition-transform">
                                <Volume2 size={40} className={sirenOn ? 'animate-ping' : ''} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Panic Siren</h3>
                            <p className="text-text-secondary mb-6">
                                Loud alarm sound to attract attention or repel attackers.
                            </p>
                            <Button variant={sirenOn ? 'danger' : 'outline'}>
                                {sirenOn ? 'Stop Siren' : 'Activate'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* First Aid Guide */}
                    <Card className="hover:border-info transition-colors group">
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-info/10 flex items-center justify-center text-info mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">First Aid Guide</h3>
                            <p className="text-text-secondary mb-6">
                                Quick steps for CPR, bleeding, and burns.
                            </p>
                            <Button variant="outline">Open Guide</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Guide Content */}
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>CPR Basics</CardTitle></CardHeader>
                        <CardContent className="text-text-secondary space-y-2">
                            <p>1. Check responsiveness.</p>
                            <p>2. Call emergency numbers.</p>
                            <p>3. Push hard and fast in the center of the chest.</p>
                            <p>4. 30 compressions, 2 rescue breaths (if trained).</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Severe Bleeding</CardTitle></CardHeader>
                        <CardContent className="text-text-secondary space-y-2">
                            <p>1. Apply direct pressure on wound.</p>
                            <p>2. Use a clean cloth or bandage.</p>
                            <p>3. Keep pressure until help arrives.</p>
                            <p>4. Do NOT remove the cloth if it soaks through, add more on top.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
