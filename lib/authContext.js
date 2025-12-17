'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from './api';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check for token in cookies on load
        const storedToken = Cookies.get('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (authToken) => {
        try {
            const res = await api.get('/auth/me', authToken);
            if (res.success) {
                // Since /auth/me returns success:true, data: {...}, we store all data including role
                // Backend returns: { _id, name, email, phone, role }
                setUser(res.data);
            }
        } catch (err) {
            console.error(err);
            logout(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.success) {
                const { token, ...userData } = res.data;
                Cookies.set('token', token, { expires: 30 });
                setToken(token);
                setUser(userData);

                // Redirect based on role
                if (userData.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/profile');
                }
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, phone });
            if (res.success) {
                const { token, ...userData } = res.data;
                Cookies.set('token', token, { expires: 30 });
                setToken(token);
                setUser(userData);
                router.push('/profile');
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const logout = (shouldRedirect = true) => {
        Cookies.remove('token');
        setUser(null);
        setToken(null);
        if (shouldRedirect) {
            router.push('/auth/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
