'use client';

import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

// 


import ActionModal from '@/components/ui/ActionModal';

export default function AdminAdoptions() {
    const { token } = useAuth();
    const [apps, setApps] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', id: '' });

    useEffect(() => {
        if (token) loadAdoptions();
    }, [token, statusFilter]);

    const loadAdoptions = () => {
        const query = statusFilter ? `?status=${statusFilter}` : '';
        api.get(`/admin/adoptions${query}`, token).then(res => setApps(res.data));
    };

    const handleAction = (id, type) => {
        setModalConfig({ isOpen: true, type, id });
    };

    const confirmAction = async (note) => {
        const { id, type } = modalConfig;
        const status = type === 'approve' ? 'APPROVED' : 'REJECTED';
        try {
            await api.patch(`/admin/adoptions/${id}`, { status, adminNote: note }, token);
            setApps(apps.map(a => a._id === id ? { ...a, status, adminNote: note } : a));
            toast.success(`Application ${status.toLowerCase()}`);
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
                                        <div className="text-xs text-muted-foreground">{app.userId?.phone}</div>
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
                                                <Button size="sm" onClick={() => handleAction(app._id, 'approve')} className="bg-green-600">Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleAction(app._id, 'reject')}>Reject</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <ActionModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={confirmAction}
                title={modalConfig.type === 'approve' ? 'Approve Application' : 'Reject Application'}
                description={`Are you sure you want to ${modalConfig.type} this application?`}
                confirmText={modalConfig.type === 'approve' ? 'Approve' : 'Reject'}
                destructive={modalConfig.type === 'reject'}
                withInput={true}
                inputLabel="Add an Admin Note (Optional)"
            />
        </div>
    );
}
