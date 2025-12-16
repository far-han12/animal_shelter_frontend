'use client';

import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/login');
            } else if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/profile'); // or /my/adoptions if preferred
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Redirecting to your dashboard...</div>
        </div>
    );
}
