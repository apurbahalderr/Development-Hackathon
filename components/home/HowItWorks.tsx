import { Zap, CheckCircle, Smartphone, MapPin } from 'lucide-react';

export function HowItWorks() {
    const steps = [
        {
            icon: <Smartphone size={40} className="text-primary" />,
            title: "Report",
            description: "Witness an incident? Open PulstriX and send a report instantly. You can add photos, descriptions, and categories."
        },
        {
            icon: <MapPin size={40} className="text-alert-medium" />,
            title: "Locate",
            description: "Our system automatically pinpoints your precise location, ensuring responders know exactly where to go."
        },
        {
            icon: <CheckCircle size={40} className="text-status-resolved" />,
            title: "Verify",
            description: "Community upvotes and ML algorithms verify the incident to filter out false alarms and prioritize real emergencies."
        },
        {
            icon: <Zap size={40} className="text-alert-critical" />,
            title: "Resolve",
            description: "Responders are dispatched immediately. You receive real-time updates until the situation is resolved."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-bg-card border-t border-border-main">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How PulstriX Works</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        From reporting to resolution, every second counts. Here is how we ensure rapid response.
                    </p>
                </div>

                <div className="relative grid md:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border-main z-0 transform -translate-y-1/2"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-bg-main border-4 border-bg-card flex items-center justify-center mb-6 shadow-xl">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
