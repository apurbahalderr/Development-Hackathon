'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
// Mock user data
const MOCK_USERS: Record<UserRole, User> = {
    user: {
        _id: 'u1',
        sessionId: 'session_u1',
        name: 'John Demo',
        email: 'john@example.com',
        role: 'user',
        phone: 1234567890
    },
    responder: {
        _id: 'r1',
        sessionId: 'session_r1',
        name: 'Officer Sarah',
        email: 'sarah@police.dept',
        role: 'responder',
        department: 'Police',
        location: { lat: 20.296, lng: 85.824 },
        address: 'Police Station 1',
        employees: [],
        phone: 9876543210
    },
    employee: {
        _id: 'e1',
        sessionId: 'session_e1',
        name: 'Dave Tech',
        email: 'dave@maintenance.city',
        role: 'employee',
        department: 'Infrastructure',
        status: 'idle',
        phone: 1122334455
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('pulstrix_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (role: UserRole) => {
        // Determine which mock user to use based on role
        // In a real app, this would take credentials
        const mockUser = MOCK_USERS[role];
        setUser(mockUser);
        localStorage.setItem('pulstrix_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pulstrix_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
