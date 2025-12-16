'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

import { Input } from '@/components/ui/Input';

const STATUS_LABELS = {
    'PENDING_REVIEW': 'Pending Review',
    'AVAILABLE': 'Available',
    'PENDING_ADOPTION': 'Adoption in Progress',
    'ADOPTED': 'Adopted',
    'REJECTED': 'Rejected'
};

export default function AdminPets() {
    const { token } = useAuth();
    const [pets, setPets] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (token) loadPets();
    }, [token]);

    const loadPets = (query = '') => {
        const url = query ? `/admin/pets?search=${query}` : '/admin/pets';
        api.get(url, token).then(res => setPets(res.data));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPets(search);
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/pets/${id}`, { status }, token);
            setPets(pets.map(p => p._id === id ? { ...p, status } : p));
            toast.success('Pet status updated to ' + status);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const deletePet = async () => {
        if (!selectedId) return;
        try {
            await api.delete(`/admin/pets/${selectedId}`, token);
            setPets(pets.filter(p => p._id !== selectedId));
            toast.success('Pet deleted successfully');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-3xl font-bold">Manage Pets</h1>
                <div className="flex gap-4 items-center">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            placeholder="Search pets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[200px]"
                        />
                        <Button type="submit">Search</Button>
                    </form>
                    <Button>Add Pet (Admin)</Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr className="text-left">
                                <th className="p-4">Name</th>
                                <th className="p-4">Species</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Submitted By</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map(pet => (
                                <tr key={pet._id} className="border-b hover:bg-muted/10 transition-colors">
                                    <td className="p-4 font-medium">{pet.name}</td>
                                    <td className="p-4">{pet.species}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${pet.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                            pet.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {STATUS_LABELS[pet.status] || pet.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{pet.submittedByUserId ? 'User' : 'Admin'}</td>
                                    <td className="p-4 flex gap-2">
                                        <Link href={`/pets/${pet._id}`}><Button variant="ghost" size="sm">View</Button></Link>
                                        {pet.status === 'PENDING_REVIEW' && (
                                            <>
                                                <Button size="sm" onClick={() => updateStatus(pet._id, 'AVAILABLE')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => updateStatus(pet._id, 'REJECTED')}>Reject</Button>
                                            </>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => confirmDelete(pet._id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={deletePet}
                title="Delete Pet"
                description="Are you sure you want to delete this pet? This action cannot be undone."
                destructive
            />
        </div>
    );
}
