'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from './StatsCards';
import { AnalyticsCharts } from './Charts';
import { RefreshCw } from 'lucide-react';

export function AnalyticsDashboard() {
    // --- Mock Data States ---
    const [pieData, setPieData] = useState([
        { name: 'Medical', value: 400, color: '#ef4444' }, // Red
        { name: 'Fire', value: 300, color: '#f97316' },    // Orange
        { name: 'Traffic', value: 300, color: '#eab308' }, // Yellow
        { name: 'Crime', value: 200, color: '#3b82f6' },   // Blue
        { name: 'Disaster', value: 100, color: '#a855f7' }, // Purple
    ]);

    const [lineData, setLineData] = useState([
        { time: '00:00', incidents: 10, resolved: 8 },
        { time: '04:00', incidents: 5, resolved: 12 },
        { time: '08:00', incidents: 35, resolved: 20 },
        { time: '12:00', incidents: 50, resolved: 45 },
        { time: '16:00', incidents: 42, resolved: 38 },
        { time: '20:00', incidents: 28, resolved: 30 },
        { time: '23:59', incidents: 15, resolved: 10 },
    ]);

    const [barData, setBarData] = useState([
        { name: 'Downtown', count: 45 },
        { name: 'West End', count: 32 },
        { name: 'North Hills', count: 28 },
        { name: 'Harbor', count: 19 },
        { name: 'Industrial', count: 12 },
    ]);

    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- Data Polling Simulation ---
    const refreshData = () => {
        setIsRefreshing(true);
        // Simulate fetching
        setTimeout(() => {
            // Randomize data slightly to show "live" updates
            const newPie = pieData.map(item => ({ ...item, value: Math.max(0, item.value + Math.floor(Math.random() * 50 - 25)) }));
            const newLine = lineData.map(item => ({
                ...item,
                incidents: Math.max(0, item.incidents + Math.floor(Math.random() * 10 - 5)),
                resolved: Math.max(0, item.resolved + Math.floor(Math.random() * 10 - 5))
            }));

            setPieData(newPie);
            setLineData(newLine);
            setLastUpdated(new Date());
            setIsRefreshing(false);
        }, 800);
    };

    useEffect(() => {
        // Poll every 30 seconds
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, [pieData, lineData]); // Deps ensure we update based on previous state if we were using it, but here we just mocked it simpler

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl p-8 mb-8 border border-blue-500/30 shadow-[0_0_50px_rgba(30,58,138,0.3)] group">
                {/* Glass Background */}
                <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-xl"></div>

                {/* Ambient Light/Shine */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
                            <span className="bg-gradient-to-b from-white via-blue-100 to-blue-300 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                Analytics Overview
                            </span>
                        </h1>
                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-50 mb-4"></div>
                        <p className="text-lg text-blue-200 font-medium max-w-2xl mx-auto tracking-wide">
                            Real-time insights into emergency response performance
                        </p>
                    </div>

                    <div className="inline-flex items-center space-x-3 bg-blue-900/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-blue-400/30 shadow-lg hover:bg-blue-800/40 transition-colors">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm text-blue-100 font-mono tracking-wider">
                            LIVE DATA: {lastUpdated.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className={`ml-2 p-1.5 rounded-full hover:bg-blue-700/50 text-blue-200 hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Charts Section */}
            <AnalyticsCharts pieData={pieData} lineData={lineData} barData={barData} />

        </div>
    );
}
