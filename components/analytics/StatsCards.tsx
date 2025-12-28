import { ArrowDownRight, ArrowUpRight, Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-bg-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-main">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-text-muted">Total Incidents</div>
                    <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold text-white">2,350</div>
                <p className="text-xs text-text-muted mt-1 flex items-center">
                    <span className="text-status-resolved flex items-center mr-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +10.1%
                    </span>
                    from last month
                </p>
            </div>

            <div className="bg-bg-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-main">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-text-muted">Avg. Response Time</div>
                    <Clock className="h-4 w-4 text-alert-medium" />
                </div>
                <div className="text-2xl font-bold text-white">4m 12s</div>
                <p className="text-xs text-text-muted mt-1 flex items-center">
                    <span className="text-status-resolved flex items-center mr-1">
                        <ArrowDownRight className="h-3 w-3 mr-1" /> -12s
                    </span>
                    from last week
                </p>
            </div>

            <div className="bg-bg-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-main">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-text-muted">Active Responders</div>
                    <AlertTriangle className="h-4 w-4 text-alert-critical" />
                </div>
                <div className="text-2xl font-bold text-white">142</div>
                <p className="text-xs text-text-muted mt-1 flex items-center">
                    <span className="text-status-resolved flex items-center mr-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +5
                    </span>
                    currently on duty
                </p>
            </div>

            <div className="bg-bg-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-main">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-text-muted">Resolution Rate</div>
                    <CheckCircle className="h-4 w-4 text-status-resolved" />
                </div>
                <div className="text-2xl font-bold text-white">94.2%</div>
                <p className="text-xs text-text-muted mt-1 flex items-center">
                    <span className="text-status-resolved flex items-center mr-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +2.1%
                    </span>
                    from last month
                </p>
            </div>
        </div>
    );
}
