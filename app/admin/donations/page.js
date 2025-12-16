'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';

export default function AdminDonations() {
    const { token } = useAuth();
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        if (token) api.get('/admin/donations', token).then(res => setDonations(res.data));
    }, [token]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Donations History</h1>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr className="text-left">
                                <th className="p-4">Date</th>
                                <th className="p-4">Donor</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Purpose</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Trx ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(d => (
                                <tr key={d._id} className="border-b hover:bg-muted/10">
                                    <td className="p-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{d.donorName}</div>
                                        <div className="text-xs text-muted-foreground">{d.donorEmail}</div>
                                    </td>
                                    <td className="p-4 font-bold">{d.amount} BDT</td>
                                    <td className="p-4">{d.purpose}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.ssl?.status === 'VALID' ? 'bg-green-100 text-green-800' :
                                                d.ssl?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    d.ssl?.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {d.ssl?.status}
                                        </span>
                                    </td>
                                    <td className="p-4">SSLCommerz</td>
                                    <td className="p-4 font-mono text-xs">{d.ssl?.tranId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
