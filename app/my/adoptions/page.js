'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import api from '@/lib/api';

export default function MyAdoptions() {
    const { user, token, loading } = useAuth();
    const [apps, setApps] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (user) loadApps();
    }, [user, loading, router, statusFilter]);

    const loadApps = async () => {
        try {
            const query = statusFilter ? `?status=${statusFilter}` : '';
            const res = await api.get(`/adoptions/my${query}`, token);
            setApps(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 space-y-2">
                    <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start">My Profile</Button>
                    </Link>
                    <Link href="/my/submissions">
                        <Button variant="ghost" className="w-full justify-start">My Submitted Pets</Button>
                    </Link>
                    <Link href="/my/adoptions">
                        <Button variant="ghost" className="w-full justify-start bg-accent/50">My Adoptions</Button>
                    </Link>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">My Adoption Applications</h1>
                        <select
                            className="flex h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    {fetchLoading ? (
                        <div>Loading...</div>
                    ) : apps.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                You haven't applied for any adoptions yet.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {apps.map(app => (
                                <Card key={app._id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">Application for {app.petId?.name || 'Unknown Pet'}</h3>
                                            <p className="text-sm text-muted-foreground">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                                            {app.adminNote && (
                                                <p className="mt-2 text-sm bg-muted p-2 rounded">
                                                    Admin Note: {app.adminNote}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {app.status}
                                        </div>
                                    </div>
                                    {app.status === 'APPROVED' && (
                                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                            <h4 className="font-semibold text-green-900 mb-2">Contact Details for Adoption</h4>
                                            <div className="text-sm text-green-800 space-y-1">
                                                <p><strong>Name:</strong> {app.petId?.submittedBy?.name || 'Animal Shelter'}</p>
                                                <p><strong>Email:</strong> {app.petId?.submittedBy?.email || 'support@animalshelter.com'}</p>
                                                <p><strong>Phone:</strong> {app.petId?.submittedBy?.phone || '+880 1700 000000'}</p>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
