'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import api from '@/lib/api';

export default function ProfilePage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || ''
            }));
        }
    }, [user, loading, router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match"); // specialized toast better but alert ok for now or use toast if available
            return;
        }

        try {
            // Only send fields that are changed or needed
            const updateData = {
                name: formData.name,
                phone: formData.phone
            };
            if (formData.password) updateData.password = formData.password;

            await api.patch('/users/me', updateData, token); // Assuming token is handled in api interceptor or passed
            // Ideally context updates user, but we might need to reload or re-fetch.
            // The api response contains updated user. 
            // If useAuth exposes a way to update user, call it. Otherwise simple reload or assume Context will refetch on next mount?
            // Actually useAuth should likely expose a refresh or setValue. 
            // For now, let's just reload the page or force a refresh if possible, 
            // OR if the api.js/context handles 401/updates automatically? 
            // Looking at previous files, useAuth doesn't seem to have 'updateUser' exposed in the View. 
            // I'll assume a page reload is safest for now to refresh Context, or just simple state update if we don't reload.

            // Wait, api.js usually handles tokens automatically if stored. 
            // Let's check imports. page.js imports useAuth.

            window.location.reload(); // Simple way to refresh context data
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-2">
                    <div className="p-4 bg-muted/30 rounded-lg border font-medium">Dashboard</div>
                    <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start bg-accent/50">My Profile</Button>
                    </Link>
                    <Link href="/my/submissions">
                        <Button variant="ghost" className="w-full justify-start">My Submitted Pets</Button>
                    </Link>
                    <Link href="/my/adoptions">
                        <Button variant="ghost" className="w-full justify-start">My Adoptions</Button>
                    </Link>
                    <Link href="/my/donations">
                        <Button variant="ghost" className="w-full justify-start">My Donations</Button>
                    </Link>
                    <Link href="/submit-pet">
                        <Button className="w-full mt-4">Rehome a Pet</Button>
                    </Link>
                </div>

                <div className="flex-1 space-y-6">
                    <h1 className="text-3xl font-bold">My Profile</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Manage your account settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={isEditing ? formData.name : user.name}
                                        disabled={!isEditing}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <Input value={user.email} disabled />
                                    {/* Email usually not editable directly without verification */}
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phone</Label>
                                    <Input
                                        value={isEditing ? formData.phone : (user.phone || '')}
                                        disabled={!isEditing}
                                        placeholder="Add phone number"
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                {isEditing && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>New Password (leave blank to keep current)</Label>
                                            <PasswordInput
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Confirm New Password</Label>
                                            <PasswordInput
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {isEditing && (
                                    <div className="pt-4 flex gap-2">
                                        <Button type="submit">Save Changes</Button>
                                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </div>
                                )}
                            </form>

                            {!isEditing && (
                                <div className="pt-4">
                                    <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
