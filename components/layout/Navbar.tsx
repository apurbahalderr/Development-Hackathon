"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { color } from 'framer-motion';

export function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/', label: 'Home', public: true },
        { href: '/dashboard', label: 'Dashboard', public: true }, // Dashboard public for all according to rules
        { href: '/report', label: 'Report', public: true },
        { href: '/emergency', label: 'Emergency', public: true },
        { href: '/analytics', label: 'Analytics', public: false }, // Logged in only
    ];

    const visibleLinks = navLinks.filter(link => link.public || user);

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 max-w-[95%] mx-auto px-2 sm:px-4 lg:px-6">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between h-16 px-6 md:px-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.jpeg" alt="Pulstrix Logo" width={32} height={32} className="object-contain rounded" />
                        <span className="text-xl font-bold tracking-tight text-white">Pulstri<span style={{ color: '#007BFF' }}>X</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-4">
                        {visibleLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-text-secondary">
                                    Good day, <span className="text-text-primary font-semibold">{user.name}</span>
                                </span>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/report">
                                    <Button variant="primary" size="sm" className="animate-pulse">
                                        Report Incident
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-text-secondary hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/10">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {visibleLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 pb-2 border-t border-border-main mt-2">
                                {user ? (
                                    <div className="flex flex-col space-y-2 px-3">
                                        <span className="text-sm text-text-secondary mb-2">Signed in as {user.name}</span>
                                        <Button variant="outline" onClick={logout} className="w-full">
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-2 px-3'>
                                        <Link href="/login" className="w-full">
                                            <Button variant="secondary" className="w-full">Login</Button>
                                        </Link>
                                        <Link href="/report" className="w-full">
                                            <Button variant="primary" className="w-full">Report Incident</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
}
