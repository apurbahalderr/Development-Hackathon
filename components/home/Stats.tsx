import { Users, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

export function Stats() {
    const stats = [
        { key: 'responders', label: 'Active Responders', value: '120+', icon: <Users className="h-6 w-6 text-info" /> },
        { key: 'response', label: 'Avg. Response Time', value: '< 5m', icon: <Clock className="h-6 w-6 text-alert-medium" /> },
        { key: 'resolved', label: 'Incidents Resolved', value: '15k+', icon: <CheckCircle className="h-6 w-6 text-status-resolved" /> },
        { key: 'communities', label: 'Communities Safe', value: '100%', icon: <ShieldCheck className="h-6 w-6 text-primary" /> },
    ];

    return (
        <div className="bg-bg-secondary border-y border-border-main">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.key}
                            className={`p-6 rounded-xl border border-border-main bg-bg-card/60 backdrop-blur-sm flex items-center justify-between ${stat.key === 'responders' ? 'md:col-span-2 lg:col-span-1 shadow-lg ring-1 ring-primary/20' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-bg-main border border-border-main flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>

                            {stat.key === 'responders' && (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                        <span className="text-xs text-text-muted">Online now</span>
                                    </div>
                                    <a href="/responder" className="mt-3 inline-flex items-center px-3 py-2 text-xs font-semibold rounded-md bg-primary text-black hover:opacity-95">View Responders</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
