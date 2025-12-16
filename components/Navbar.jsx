'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    if (loading) return null; // Or a skeleton

    const NavLink = ({ href, children, onClick }) => (
        <Link
            href={href}
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={onClick}
        >
            {children}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold">🐾 Paws & Claws</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink href="/pets">Adopt</NavLink>
                    <NavLink href="/stories">Stories</NavLink>
                    <NavLink href="/events">Events</NavLink>
                    <NavLink href="/volunteer">Volunteer</NavLink>
                    <NavLink href="/donate">Donate</NavLink>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden lg:inline">
                                Hello, {user.name}
                            </span>
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/profile'}>
                                <Button variant="outline">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button>Register</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={toggleMenu}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <div className="flex flex-col gap-4">
                        <NavLink href="/pets" onClick={toggleMenu}>Adopt</NavLink>
                        <NavLink href="/stories" onClick={toggleMenu}>Stories</NavLink>
                        <NavLink href="/events" onClick={toggleMenu}>Events</NavLink>
                        <NavLink href="/volunteer" onClick={toggleMenu}>Volunteer</NavLink>
                        <NavLink href="/donate" onClick={toggleMenu}>Donate</NavLink>
                    </div>
                    <div className="pt-4 border-t flex flex-col gap-2">
                        {user ? (
                            <>
                                <div className="text-sm text-muted-foreground px-2">
                                    Signed in as {user.name}
                                </div>
                                <Link href={user.role === 'ADMIN' ? '/admin' : '/profile'} onClick={toggleMenu}>
                                    <Button className="w-full" variant="outline">Dashboard</Button>
                                </Link>
                                <Button className="w-full" variant="ghost" onClick={() => { logout(); toggleMenu(); }}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" onClick={toggleMenu}>
                                    <Button className="w-full" variant="ghost">Login</Button>
                                </Link>
                                <Link href="/auth/register" onClick={toggleMenu}>
                                    <Button className="w-full">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
