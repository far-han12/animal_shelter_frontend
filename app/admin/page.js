'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { CircleDollarSign, Cat, FileQuestion, Users, Calendar } from 'lucide-react';

export default function AdminDashboard() {
    const { token, loading } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/analytics', token);
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) return <div>Loading Analytics...</div>;

    const StatCard = ({ title, value, subtext, icon: Icon }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtext}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Donations"
                    value={`${data.donations.allTime} BDT`}
                    subtext={`+${data.donations.thisMonth} this month`}
                    icon={CircleDollarSign}
                />
                <StatCard
                    title="Total Pets"
                    value={data.pets.total}
                    subtext={`${data.pets.breakdown.find(s => s._id === 'AVAILABLE')?.count || 0} Available`}
                    icon={Cat}
                />
                <StatCard
                    title="Pending Adoptions"
                    value={data.adoptions.pending}
                    subtext={`${data.adoptions.approved} Approved`}
                    icon={FileQuestion}
                />
                <StatCard
                    title="New Inquiries"
                    value={data.inquiries.new}
                    subtext="Unread messages"
                    icon={FileQuestion}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {data.recentActivity?.adoptions?.map((a, i) => (
                                <li key={i} className="flex items-center">
                                    <span className="font-medium">{a.userId?.name || 'User'}</span>
                                    <span className="ml-2 text-muted-foreground">applied for adoption</span>
                                    <div className="ml-auto text-xs">{new Date(a.createdAt).toLocaleDateString()}</div>
                                </li>
                            ))}
                            {data.recentActivity?.donations?.map((d, i) => (
                                <li key={'d' + i} className="flex items-center">
                                    <span className="font-medium">{d.donorName}</span>
                                    <span className="ml-2 text-muted-foreground">donated {d.amount} BDT</span>
                                    <div className="ml-auto text-xs">{new Date(d.createdAt).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Pending Volunteers</CardTitle>
                        <CardDescription>{data.volunteers.pending} applications to review</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
