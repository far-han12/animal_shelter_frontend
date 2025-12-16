'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function MyDonations() {
    const { token, user, loading } = useAuth();
    const [donations, setDonations] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (token) {
            api.get('/donations/my', token)
                .then(res => setDonations(res.data))
                .catch(err => console.error(err))
                .finally(() => setFetching(false));
        } else if (!loading) {
            setFetching(false);
        }
    }, [token, loading]);

    if (loading || fetching) return <div className="p-8 text-center">Loading your history...</div>;

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your donation history.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Donations</h1>
                    <p className="text-muted-foreground">Thank you for your generous support!</p>
                </div>
                <Link href="/donate">
                    <Button>Make New Donation</Button>
                </Link>
            </div>

            {donations.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        You haven't made any donations yet.
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr className="text-left">
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Purpose</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map(d => (
                                        <tr key={d._id} className="border-b hover:bg-muted/10">
                                            <td className="p-4">{new Date(d.createdAt).toLocaleDateString()}</td>
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
                                            <td className="p-4 font-mono text-xs">{d.ssl?.tranId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
