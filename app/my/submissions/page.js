'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const STATUS_LABELS = {
    'PENDING_REVIEW': 'Pending Review',
    'AVAILABLE': 'Available',
    'PENDING_ADOPTION': 'Adoption in Progress',
    'ADOPTED': 'Adopted',
    'REJECTED': 'Rejected'
};

export default function MySubmissions() {
    const { user, token, loading } = useAuth();
    const [pets, setPets] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (user) loadPets();
    }, [user, loading, router, token]);

    const loadPets = async () => {
        try {
            const res = await api.get('/pets/my-submissions', token);
            setPets(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load submissions');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!selectedId) return;
        try {
            await api.delete(`/pets/my-submissions/${selectedId}`, token);
            setPets(pets.filter(p => p._id !== selectedId));
            toast.success('Submission withdrawn');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const confirmWithdraw = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-2">
                    <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start">My Profile</Button>
                    </Link>
                    <Link href="/my/submissions">
                        <Button variant="ghost" className="w-full justify-start bg-accent/50">My Submitted Pets</Button>
                    </Link>
                    <Link href="/my/adoptions">
                        <Button variant="ghost" className="w-full justify-start">My Adoptions</Button>
                    </Link>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">My Submissions</h1>
                        <Link href="/submit-pet">
                            <Button>Submit New Pet</Button>
                        </Link>
                    </div>

                    {fetchLoading ? (
                        <div>Loading...</div>
                    ) : pets.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                You haven't submitted any pets yet.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pets.map(pet => (
                                <Card key={pet._id} className="flex flex-row items-center p-4 gap-4">
                                    <div className="h-20 w-20 rounded bg-muted overflow-hidden flex-shrink-0">
                                        <img src={pet.photos[0]} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{pet.name}</h3>
                                        <div className="text-sm">
                                            Status:
                                            <span className={`ml-2 font-semibold ${pet.status === 'AVAILABLE' ? 'text-green-600' :
                                                pet.status === 'REJECTED' ? 'text-red-600' :
                                                    'text-yellow-600'
                                                }`}>
                                                {STATUS_LABELS[pet.status] || pet.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {pet.status === 'PENDING_REVIEW' && (
                                            <Button variant="destructive" size="sm" onClick={() => confirmWithdraw(pet._id)}>
                                                Withdraw
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleWithdraw}
                title="Withdraw Submission"
                description="Are you sure you want to withdraw this pet submission? This action cannot be undone."
                destructive
                confirmText="Withdraw"
            />
        </div>
    );
}
