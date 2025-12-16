'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

import { toast } from 'sonner';

export default function AdminVolunteers() {
    const { token } = useAuth();
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        if (token) api.get('/admin/volunteers', token).then(res => setVolunteers(res.data));
    }, [token]);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/volunteers/${id}`, { status }, token);
            setVolunteers(volunteers.map(v => v._id === id ? { ...v, status } : v));
            toast.success('Volunteer status updated');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Volunteer Applications</h1>
            <div className="grid gap-4">
                {volunteers.map(vol => (
                    <Card key={vol._id}>
                        <CardContent className="p-6 flex flex-col md:flex-row gap-4 justify-between">
                            <div className="space-y-1 flex-1">
                                <h3 className="font-bold text-lg">{vol.name}</h3>
                                <div className="text-sm">Email: {vol.email} • Phone: {vol.phone}</div>
                                <div className="text-sm mt-2"><strong>Availability:</strong> {vol.availability}</div>
                                <div className="text-sm"><strong>Address:</strong> {vol.address}</div>
                                <div className="text-sm mt-2 p-2 bg-muted rounded"><strong>Notes:</strong> {vol.notes}</div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[120px]">
                                <div className={`text-center px-2 py-1 rounded text-xs font-bold ${vol.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    vol.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {vol.status}
                                </div>
                                {vol.status === 'PENDING' && (
                                    <>
                                        <Button size="sm" onClick={() => updateStatus(vol._id, 'APPROVED')} className="bg-green-600">Approve</Button>
                                        <Button size="sm" variant="destructive" onClick={() => updateStatus(vol._id, 'REJECTED')}>Reject</Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
