'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Flashlight,
  Volume2,
  BookOpen,
  Phone,
  Shield,
  AlertCircle,
  MapPin,
  Clock,
  Users,
  FileText,
  Heart,
  Home,
  Car,
  Flame,
  Droplet,
  Hammer,
  Stethoscope,
  Radio,
  Wrench,
  Scissors
} from "lucide-react";

interface EmergencyTool {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  color: string;
}

export default function EmergencyToolsPage() {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [sirenOn, setSirenOn] = useState(false);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => setSirenOn(false), 500);
    } catch (e) {
      setSirenOn(false);
    }
  };

  const toggleSiren = () => {
    if (sirenOn) {
      setSirenOn(false);
    } else {
      setSirenOn(true);
      playBeep();
    }
  };

  const emergencyTools: EmergencyTool[] = [
    { title: "Fire Extinguisher Guide", description: "Learn how to use fire extinguishers safely and effectively in emergencies", icon: Flame, color: "text-alert-critical" },
    { title: "Water Hammer Tool", description: "Instructions for using water hammers and emergency water shut-off procedures", icon: Hammer, color: "text-info" },
    { title: "Medical Kit Guide", description: "Essential medical supplies and how to use them in emergency situations", icon: Stethoscope, color: "text-alert-high" },
    { title: "Emergency Contacts", description: "Quick access to police, ambulance, fire, and helpline numbers", icon: Phone, link: "#contacts", color: "text-alert-critical" },
    { title: "First Aid Guide", description: "Step-by-step first aid instructions for common emergencies", icon: Heart, color: "text-alert-high" },
    { title: "Emergency Kit Checklist", description: "Essential items to keep in your emergency preparedness kit", icon: Shield, color: "text-primary" },
    { title: "Location Sharing", description: "Share your location with emergency contacts instantly", icon: MapPin, color: "text-info" },
    { title: "Emergency Evacuation Plan", description: "Create and share your family evacuation plan", icon: Home, color: "text-status-assigned" },
    { title: "Road Safety Tools", description: "Important safety guidelines and tools for road emergencies", icon: Car, color: "text-alert-medium" },
    { title: "Emergency Radio", description: "How to use emergency radios and communication devices", icon: Radio, color: "text-primary" },
    { title: "Emergency Flashlight", description: "Using flashlights and emergency lighting during power outages", icon: Flashlight, color: "text-alert-medium" },
    { title: "Emergency Wrench", description: "Using wrenches and tools for emergency repairs and shut-offs", icon: Wrench, color: "text-status-resolved" },
    { title: "Emergency Scissors", description: "Medical scissors and cutting tools for emergency situations", icon: Scissors, color: "text-alert-high" },
    { title: "Water Emergency Tools", description: "Tools and procedures for water-related emergencies", icon: Droplet, color: "text-info" },
    { title: "Emergency Procedures", description: "What to do during earthquakes, floods, fires, and more", icon: FileText, color: "text-status-resolved" },
    { title: "Community Safety", description: "Connect with neighbors and local safety groups", icon: Users, color: "text-primary" }
  ];

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      {flashlightOn && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
          <button onClick={() => setFlashlightOn(false)} className="px-8 py-4 bg-black text-white rounded-full font-bold text-xl shadow-lg">
            TAP TO TURN OFF
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Emergency Toolkit</h1>
        <p className="text-text-secondary mb-8">Offline-ready tools for critical situations.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:border-primary transition-colors group cursor-pointer" onClick={() => setFlashlightOn(true)}>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform">
                <Flashlight size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Screen Flashlight</h3>
              <p className="text-text-secondary mb-6">Max brightness white screen for visibility in dark areas.</p>
              <Button variant="outline">Activate</Button>
            </CardContent>
          </Card>

          <Card className={`hover:border-alert-critical transition-colors group cursor-pointer ${sirenOn ? "animate-pulse border-alert-critical" : ""}`} onClick={toggleSiren}>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-alert-critical/10 flex items-center justify-center text-alert-critical mb-6 group-hover:scale-110 transition-transform">
                <Volume2 size={40} className={sirenOn ? "animate-ping" : ""} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Panic Siren</h3>
              <p className="text-text-secondary mb-6">Loud alarm sound to attract attention or repel attackers.</p>
              <Button variant={sirenOn ? "danger" : "outline"}>{sirenOn ? "Stop Siren" : "Activate"}</Button>
            </CardContent>
          </Card>

          <Card className="hover:border-info transition-colors group">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-info/10 flex items-center justify-center text-info mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">First Aid Guide</h3>
              <p className="text-text-secondary mb-6">Quick steps for CPR, bleeding, and burns.</p>
              <Button variant="outline">Open Guide</Button>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Available Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyTools.map((tool, idx) => (
              <div key={idx} className="bg-bg-card border border-border-main rounded-xl p-6 hover:border-primary transition-all cursor-pointer group">
                <div className={`mb-4 ${tool.color}`}>
                  <tool.icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                <p className="text-text-secondary text-sm">{tool.description}</p>
                {tool.link && <div className="mt-4 text-primary text-sm font-semibold group-hover:underline">Learn more →</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="bg-bg-card border border-border-main rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/report" className="bg-primary hover:bg-primary-hover text-white rounded-lg p-6 text-center transition-all hover:scale-105">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">Report Incident</div>
                <div className="text-sm opacity-90 mt-1">Report an emergency now</div>
              </Link>
              <Link href="/dashboard" className="bg-bg-secondary hover:bg-bg-card border border-border-main text-text-primary rounded-lg p-6 text-center transition-all hover:scale-105">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-bold">View Dashboard</div>
                <div className="text-sm text-text-secondary mt-1">See live incidents</div>
              </Link>
              <Link href="/analytics" className="bg-bg-secondary hover:bg-bg-card border border-border-main text-text-primary rounded-lg p-6 text-center transition-all hover:scale-105">
                <Clock className="w-8 h-8 mx-auto mb-2 text-info" />
                <div className="font-bold">View Analytics</div>
                <div className="text-sm text-text-secondary mt-1">Check safety metrics</div>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="bg-bg-card border border-border-main rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Emergency Safety Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Stay Calm", tip: "Take deep breaths and assess the situation before taking action." },
                { title: "Call for Help", tip: "Immediately call emergency services (100/108/101) and provide clear location details." },
                { title: "Follow Instructions", tip: "Listen carefully to emergency responders and follow their guidance." },
                { title: "Stay Informed", tip: "Keep updated with local news and emergency alerts in your area." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="bg-primary/20 p-2 rounded-lg h-fit">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-text-secondary text-sm">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>CPR Basics</CardTitle>
            </CardHeader>
            <CardContent className="text-text-secondary space-y-2">
              <p>1. Check responsiveness.</p>
              <p>2. Call emergency numbers.</p>
              <p>3. Push hard and fast in the center of the chest.</p>
              <p>4. 30 compressions, 2 rescue breaths (if trained).</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Severe Bleeding</CardTitle>
            </CardHeader>
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
