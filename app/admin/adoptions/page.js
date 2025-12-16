'use client';

import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

// 


export default function AdminAdoptions() {
    const { token } = useAuth();
    const [apps, setApps] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (token) loadAdoptions();
    }, [token, statusFilter]);

    const loadAdoptions = () => {
        const query = statusFilter ? `?status=${statusFilter}` : '';
        api.get(`/admin/adoptions${query}`, token).then(res => setApps(res.data));
    };

    const updateStatus = async (id, status) => {
        const note = prompt('Admin Note (Optional):');
        try {
            await api.patch(`/admin/adoptions/${id}`, { status, adminNote: note }, token);
            setApps(apps.map(a => a._id === id ? { ...a, status, adminNote: note } : a));
            toast.success('Application status updated');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Adoptions</h1>
                <div className="flex gap-2">
                    <select
                        className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr className="text-left">
                                <th className="p-4">Applicant</th>
                                <th className="p-4">Pet</th>
                                <th className="p-4">Details</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps?.map(app => (
                                <tr key={app._id} className="border-b hover:bg-muted/10">
                                    <td className="p-4">
                                        <div className="font-medium">{app.userId?.name}</div>
                                        <div className="text-xs text-muted-foreground">{app.userId?.email}</div>
                                    </td>
                                    <td className="p-4">{app.petId?.name}</td>
                                    <td className="p-4 max-w-xs truncate text-xs">
                                        {app.applicantInfo.householdInfo} / {app.applicantInfo.experience}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {app.status === 'PENDING' && (
                                            <>
                                                <Button size="sm" onClick={() => updateStatus(app._id, 'APPROVED')} className="bg-green-600">Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => updateStatus(app._id, 'REJECTED')}>Reject</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
