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
const MOCK_USERS: Record<UserRole, User> = {
    CITIZEN: {
        id: 'u1',
        name: 'John Demo',
        email: 'john@example.com',
        role: 'CITIZEN',
        phone: '+1234567890'
    },
    RESPONDER: {
        id: 'r1',
        name: 'Officer Sarah',
        email: 'sarah@police.dept',
        role: 'RESPONDER',
        department: 'Police',
        accessCode: 'POL-123'
    },
    EMPLOYEE: {
        id: 'e1',
        name: 'Dave Tech',
        email: 'dave@maintenance.city',
        role: 'EMPLOYEE',
        department: 'Infrastructure'
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
