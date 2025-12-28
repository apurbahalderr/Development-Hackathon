'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { User, Shield, Briefcase } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = (role: 'CITIZEN' | 'RESPONDER' | 'EMPLOYEE') => {
        login(role);
        if (role === 'CITIZEN') {
            router.push('/dashboard');
        } else {
            router.push('/responder'); // Employees and Responders go to responder view
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">

                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Welcome Back to <span className="text-primary">Pulstrix</span></h1>
                    <p className="text-text-secondary text-lg mb-8">
                        Choose your role to sign in. In a production environment, this would be secured with OTP or Official Credentials.
                    </p>
                    <div className="grid gap-4">
                        <div className="flex items-start p-4 bg-bg-secondary/50 rounded-lg border border-border-main">
                            <div className="bg-primary/10 p-2 rounded text-primary mr-4">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Citizen Access</h3>
                                <p className="text-sm text-text-muted">Report incidents, view live map, and track status.</p>
                            </div>
                        </div>
                        <div className="flex items-start p-4 bg-bg-secondary/50 rounded-lg border border-border-main">
                            <div className="bg-alert-high/10 p-2 rounded text-alert-high mr-4">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Responder Portal</h3>
                                <p className="text-sm text-text-muted">Manage incidents, verify reports, and dispatch units.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="w-full bg-bg-card border-border-main">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Select Login Role</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full justify-start h-16 text-left relative overflow-hidden group"
                            onClick={() => handleLogin('CITIZEN')}
                            leftIcon={<User className="mr-3" />}
                        >
                            <div className="flex flex-col items-start z-10 w-full">
                                <span className="font-bold text-lg">Citizen</span>
                                <span className="text-xs text-text-muted font-normal">Report & Track</span>
                            </div>
                            <div className="absolute inset-0 bg-primary/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full justify-start h-16 text-left relative overflow-hidden group hover:border-alert-high hover:text-alert-high"
                            onClick={() => handleLogin('RESPONDER')}
                            leftIcon={<Shield className="mr-3" />}
                        >
                            <div className="flex flex-col items-start z-10 w-full">
                                <span className="font-bold text-lg">Responder</span>
                                <span className="text-xs text-text-muted font-normal">Police / Fire / Ambulance</span>
                            </div>
                            <div className="absolute inset-0 bg-alert-high/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full justify-start h-16 text-left relative overflow-hidden group hover:border-status-assigned hover:text-status-assigned"
                            onClick={() => handleLogin('EMPLOYEE')}
                            leftIcon={<Briefcase className="mr-3" />}
                        >
                            <div className="flex flex-col items-start z-10 w-full">
                                <span className="font-bold text-lg">Employee / Worker</span>
                                <span className="text-xs text-text-muted font-normal">Task Execution</span>
                            </div>
                            <div className="absolute inset-0 bg-status-assigned/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
