'use client';

import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, AreaChart, Area
} from 'recharts';

// --- Types ---
type PieData = { name: string; value: number; color: string };
type LineData = { time: string; incidents: number; resolved: number };
type BarData = { name: string; count: number };

// --- Props ---
interface ChartsProps {
    pieData: PieData[];
    lineData: LineData[];
    barData: BarData[];
}

export function AnalyticsCharts({ pieData, lineData, barData }: ChartsProps) {

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-bg-card border border-border-main p-3 rounded-lg shadow-xl backdrop-blur-md bg-opacity-90">
                    <p className="text-white font-bold mb-1">{label ? label : payload[0].name}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">

            {/* Line Chart: Incidents Over Time (Significantly customized) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-blue-950/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] group">
                {/* Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-6 bg-blue-500 rounded-full mr-3 shadow-[0_0_10px_#3b82f6]"></span>
                    Live Activity Stream
                </h3>
                <div className="h-[300px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lineData}>
                            <defs>
                                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" vertical={false} opacity={0.3} />
                            <XAxis dataKey="time" stroke="#93c5fd" tick={{ fill: '#93c5fd', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis stroke="#93c5fd" tick={{ fill: '#93c5fd', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#60a5fa', strokeDasharray: '5 5' }} />
                            <Legend verticalAlign="top" height={36} iconType="circle" />

                            <Area
                                type="monotone"
                                dataKey="incidents"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncidents)"
                                name="New Incidents"
                                animationDuration={1500}
                            />
                            <Area
                                type="monotone"
                                dataKey="resolved"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorResolved)"
                                name="Resolved"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Incident Distribution */}
            <div className="bg-bg-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-main">
                <h3 className="text-lg font-bold text-white mb-6">Incident Distribution</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9aaaba' }} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart: Dangerous Areas */}
            <div className="bg-bg-secondary/50 backdrop-blur-sm p-6 rounded-xl border border-border-main lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-6">High Risk Zones & Top Responders</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#718096" hide />
                            <YAxis dataKey="name" type="category" stroke="#718096" tick={{ fill: '#e2e8f0', fontSize: 14 }} width={120} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2d3748' }} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Active Reports">
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
