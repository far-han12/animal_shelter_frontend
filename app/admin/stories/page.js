'use client';

import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function AdminStories() {
    const { token } = useAuth();
    const [stories, setStories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (token) loadStories();
    }, [token]);

    const loadStories = () => api.get('/admin/stories', token).then(res => setStories(res.data));

    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            await api.delete(`/admin/stories/${selectedId}`, token);
            loadStories();
            toast.success('Story deleted');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const confirmDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());

        try {
            if (currentStory) {
                await api.patch(`/admin/stories/${currentStory._id}`, data, token);
                toast.success('Story updated');
            } else {
                await api.post('/admin/stories', data, token);
                toast.success('Story created');
            }
            setIsEditing(false);
            setCurrentStory(null);
            loadStories();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Stories</h1>
                <Button onClick={() => { setIsEditing(true); setCurrentStory(null); }}>Create Story</Button>
            </div>

            {isEditing && (
                <Card className="mb-6 border-primary">
                    <CardContent className="pt-6">
                        <h3 className="font-bold mb-4">{currentStory ? 'Edit Story' : 'New Story'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input name="title" required defaultValue={currentStory?.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Cover Image URL</Label>
                                <Input name="coverImage" defaultValue={currentStory?.coverImage} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Body</Label>
                                <Textarea name="body" required defaultValue={currentStory?.body} className="h-32" />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">Save</Button>
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {stories.map(story => (
                    <Card key={story._id} className="flex flex-row p-4 gap-4 items-center">
                        <div className="h-16 w-24 bg-muted rounded overflow-hidden flex-shrink-0">
                            {story.coverImage && <img src={story.coverImage} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold">{story.title}</h3>
                            <p className="text-xs text-muted-foreground">Published: {new Date(story.publishedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setCurrentStory(story); setIsEditing(true); }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => confirmDelete(story._id)}>Delete</Button>
                        </div>
                    </Card>
                ))}
            </div>
            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Story"
                description="Are you sure you want to delete this story?"
                destructive
            />
        </div>
    );
}
