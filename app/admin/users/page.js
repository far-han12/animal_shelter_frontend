'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function AdminUsers() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (token) loadUsers();
    }, [token]);

    const loadUsers = (query = '') => {
        const url = query ? `/users?search=${query}` : '/users';
        api.get(url, token).then(res => setUsers(res.data));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers(search);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());
        data.isDisabled = form.get('isDisabled') === 'on';
        if (!data.password) delete data.password;

        try {
            await api.patch(`/users/${currentUser._id}`, data, token);
            toast.success('User updated successfully');
            setIsEditing(false);
            setCurrentUser(null);
            loadUsers(search); // Reload with current search
        } catch (err) {
            toast.error(err.message);
        }
    };

    const deleteUser = async () => {
        if (!selectedId) return;
        try {
            await api.delete(`/users/${selectedId}`, token);
            setUsers(users.filter(u => u._id !== selectedId));
            toast.success('User deleted successfully');
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[250px]"
                    />
                    <Button type="submit">Search</Button>
                </form>
            </div>

            {isEditing && (
                <Card className="mb-6 border-primary">
                    <CardContent className="pt-6">
                        <h3 className="font-bold mb-4">Edit User</h3>
                        <form key={currentUser?._id} onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input name="name" required defaultValue={currentUser?.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input name="email" type="email" required defaultValue={currentUser?.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <select
                                    name="role"
                                    defaultValue={currentUser?.role}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            {currentUser?.role === 'ADMIN' && (
                                <div className="grid gap-2">
                                    <Label>New Password (Optional)</Label>
                                    <PasswordInput name="password" placeholder="Min 6 chars" />
                                    <p className="text-xs text-muted-foreground">Leave blank to keep current password</p>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isDisabled"
                                    id="isDisabled"
                                    defaultChecked={currentUser?.isDisabled}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="isDisabled">Disable Account</Label>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr className="text-left">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b hover:bg-muted/10">
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.isDisabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {u.isDisabled ? 'Disabled' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(u)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => confirmDelete(u._id)}>Delete</Button>
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
                onConfirm={deleteUser}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                destructive
            />
        </div>
    );
}
