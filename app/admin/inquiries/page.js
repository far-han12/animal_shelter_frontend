'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

import { toast } from 'sonner';

export default function AdminInquiries() {
    const { token } = useAuth();
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        if (token) api.get('/admin/inquiries', token).then(res => setInquiries(res.data));
    }, [token]);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/inquiries/${id}`, { status }, token);
            setInquiries(inquiries.map(i => i._id === id ? { ...i, status } : i));
            toast.success('Inquiry status updated');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Inquiries</h1>
            <div className="grid gap-4">
                {inquiries.map(inq => (
                    <Card key={inq._id}>
                        <CardContent className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{inq.petId?.name ? `Inquiry for ${inq.petId.name}` : 'General Inquiry'}</h3>
                                <div className="text-sm text-muted-foreground">
                                    From: <span className="font-medium text-foreground">{inq.name}</span> ({inq.email}, {inq.phone})
                                </div>
                                <p className="mt-2 p-3 bg-muted rounded text-sm">{inq.message}</p>
                                <div className="text-xs text-muted-foreground pt-2">Received: {new Date(inq.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[120px]">
                                <div className="text-sm font-bold text-center mb-2">Status: {inq.status}</div>
                                {inq.status === 'NEW' && (
                                    <Button size="sm" onClick={() => updateStatus(inq._id, 'CONTACTED')}>Mark Contacted</Button>
                                )}
                                {inq.status !== 'CLOSED' && (
                                    <Button size="sm" variant="outline" onClick={() => updateStatus(inq._id, 'CLOSED')}>Close</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
