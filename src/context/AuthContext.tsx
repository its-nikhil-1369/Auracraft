"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Axios Interceptor to handle global 401/403 errors
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        // Check if user is logged in on mount
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();

        // Cleanup interceptor
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (credentials: any) => {
        const res = await axios.post('/api/auth/login', credentials);
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (userData: any) => {
        const res = await axios.post('/api/auth/register', userData);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
