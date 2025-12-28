import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { EmergencySection } from '@/components/home/EmergencySection';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { ShieldCheck, Zap, Activity, Users } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="text-alert-medium" size={32} />,
      title: "Real-time Reporting",
      description: "Instantly report incidents with live geolocation. No delays, just immediate action."
    },
    {
      icon: <ShieldCheck className="text-status-resolved" size={32} />,
      title: "Verified Response",
      description: "Our ML-powered verification system ensures resources are allocated to genuine emergencies."
    },
    {
      icon: <Activity className="text-primary" size={32} />,
      title: "Live Tracking",
      description: "Track the status of incidents and responder locations on a live, interactive map."
    },
    {
      icon: <Users className="text-info" size={32} />,
      title: "Community Driven",
      description: "Empowering citizens to look out for one another. Upvote reports to Validate severity."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Stats />

      {/* Features Section */}
      <div id="how-it-works" className="py-24 bg-bg-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Pulstrix Matters</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Built for speed, accuracy, and impact. We are changing how communities handle emergencies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-bg-secondary/50 hover:bg-bg-secondary transition-colors border-border-main/50">
                <CardContent className="pt-8">
                  <div className="mb-4 bg-bg-main w-16 h-16 rounded-lg flex items-center justify-center shadow-lg border border-border-main">
                    {feature.icon}
                  </div>
                  <CardTitle className="mb-3 text-xl">{feature.title}</CardTitle>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <EmergencySection />

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border-main py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            {/* <Activity className="h-6 w-6 text-primary" /> */}
            <img src="/logonew.png" alt="Pulstrix" className="h-20 w-20 object-contain" />
            <span className="text-lg font-bold text-white">Pulstrix</span>
          </div>
          <div className="text-text-muted text-sm">
            &copy; 2025 Pulstrix Inc. Hackathon Build.
          </div>
        </div>
      </footer>
    </div>
  );
}
