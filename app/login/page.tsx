'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { User, Shield, Briefcase, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { setSessionId } from '@/utils/setSessionId';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<'user' | 'responder' | 'employee' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        accessCode: '',
        address: '',
    });

    const handleRoleSelect = (role: 'user' | 'responder' | 'employee') => {
        setSelectedRole(role);
        setError('');
        setFormData({
            name: '',
            email: '',
            phone: '',
            department: '',
            accessCode: '',
            address: '',
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let response;
            let userData;

            if (selectedRole === 'user') {
                // Set session ID for citizen
                setSessionId();
                const sessionId = localStorage.getItem('sessionId') || '';

                response = await fetch('/api/signin/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: parseInt(formData.phone),
                        sessionId: sessionId,
                    }),
                });

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Sign in failed');
                }

                userData = {
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone?.toString(),
                    sessionId: localStorage.getItem('sessionId') || '',
                    role: 'user' as const,
                };
            } else if (selectedRole === 'employee') {
                response = await fetch('/api/signin/employee', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: parseInt(formData.phone),
                        department: formData.department,
                    }),
                });

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Sign in failed');
                }

                userData = {
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone?.toString(),
                    role: 'employee' as const,
                    sessionId: localStorage.getItem('sessionId') || '',
                    department: data.data.department,
                };
            } else if (selectedRole === 'responder') {
                // Get user location for responder
                let location = { lat: 0, lng: 0 };
                let address = formData.address;

                if (navigator.geolocation) {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });
                        location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                    } catch (err) {
                        console.error('Error getting location:', err);
                    }
                }

                response = await fetch('/api/signin/responder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: parseInt(formData.phone),
                        accessCode: formData.accessCode,
                        department: formData.department,
                        location: location,
                        address: address || 'Not provided',
                    }),
                });

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Sign in failed');
                }

                userData = {
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone?.toString(),
                    role: 'responder' as const,
                    department: data.data.department,
                    sessionId: localStorage.getItem('sessionId') || '',
                };
            }

            if (userData) {
                login(userData);
                if (selectedRole === 'user') {
                    router.push('/dashboard');
                } else {
                    router.push('/responder');
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedRole) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
                <Card className="w-full max-w-md bg-bg-card border-border-main">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRole(null)}
                                leftIcon={<ArrowLeft size={16} />}
                            >
                                Back
                            </Button>
                            <CardTitle className="text-2xl">
                                {selectedRole === 'user' && 'Citizen Sign In'}
                                {selectedRole === 'responder' && 'Responder Sign In'}
                                {selectedRole === 'employee' && 'Employee Sign In'}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                            />

                            <Input
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                            />

                            <Input
                                label="Phone Number"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="10 digit phone number"
                                maxLength={10}
                            />

                            {(selectedRole === 'employee' || selectedRole === 'responder') && (
                                <Input
                                    label="Department"
                                    type="text"
                                    required
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    placeholder="Enter your department"
                                />
                            )}

                            {selectedRole === 'responder' && (
                                <>
                                    <Input
                                        label="Access Code"
                                        type="text"
                                        required
                                        value={formData.accessCode}
                                        onChange={(e) => handleInputChange('accessCode', e.target.value)}
                                        placeholder="Enter access code"
                                    />
                                    <Input
                                        label="Address (Optional)"
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Enter your address"
                                    />
                                </>
                            )}

                            {error && (
                                <div className="p-3 bg-alert-critical/10 border border-alert-critical rounded-lg text-alert-critical text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Welcome Back to <span className="text-primary">Pulstrix</span></h1>
                    <p className="text-text-secondary text-lg mb-8">
                        Choose your role to sign in. Please provide your details to continue.
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
                            onClick={() => handleRoleSelect('user')}

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
                            onClick={() => handleRoleSelect('responder')}

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
                            onClick={() => handleRoleSelect('employee')}

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
