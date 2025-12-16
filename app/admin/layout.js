'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, Users, Cat, FileText, Calendar, Heart, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) router.push('/auth/login');
            else if (user.role !== 'ADMIN') router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'ADMIN') return <div className="p-8 text-center">Loading Admin...</div>;

    const NavItem = ({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
            <Link href={href}>
                <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                >
                    <Icon size={18} />
                    {label}
                </Button>
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/20 hidden md:block">
                <div className="p-6 border-b">
                    <h2 className="font-bold text-xl">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-1">
                    <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/admin/pets" icon={Cat} label="Pets" />
                    <NavItem href="/admin/adoptions" icon={Heart} label="Adoptions" />
                    <NavItem href="/admin/users" icon={Users} label="Users" />
                    <NavItem href="/admin/inquiries" icon={MessageSquare} label="Inquiries" />
                    <NavItem href="/admin/volunteers" icon={Users} label="Volunteers" />
                    <NavItem href="/admin/stories" icon={FileText} label="Stories" />
                    <NavItem href="/admin/events" icon={Calendar} label="Events" />
                    <NavItem href="/admin/donations" icon={Heart} label="Donations" />
                </nav>
            </aside>

            {/* Mobile Header (TODO: Toggle logic, keeping simple for now) */}

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
