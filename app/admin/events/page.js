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

export default function AdminEvents() {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (token) loadEvents();
    }, [token]);

    const loadEvents = () => api.get('/admin/events', token).then(res => setEvents(res.data));

    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            await api.delete(`/admin/events/${selectedId}`, token);
            loadEvents();
            toast.success('Event deleted');
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

        // Quick array fix for images if needed, but backend takes array of strings. 
        // For now single image url logic in form:
        if (data.imageUrl) {
            data.images = [data.imageUrl];
            delete data.imageUrl;
        }

        try {
            if (currentEvent) {
                await api.patch(`/admin/events/${currentEvent._id}`, data, token);
                toast.success('Event updated');
            } else {
                await api.post('/admin/events', data, token);
                toast.success('Event created');
            }
            setIsEditing(false);
            setCurrentEvent(null);
            loadEvents();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Events</h1>
                <Button onClick={() => { setIsEditing(true); setCurrentEvent(null); }}>Create Event</Button>
            </div>

            {isEditing && (
                <Card className="mb-6 border-primary">
                    <CardContent className="pt-6">
                        <h3 className="font-bold mb-4">{currentEvent ? 'Edit Event' : 'New Event'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input name="title" required defaultValue={currentEvent?.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Image URL</Label>
                                <Input name="imageUrl" defaultValue={currentEvent?.images?.[0]} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Location</Label>
                                    <Input name="location" required defaultValue={currentEvent?.location} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Input name="startDateTime" type="datetime-local" required defaultValue={currentEvent?.startDateTime ? new Date(currentEvent.startDateTime).toISOString().slice(0, 16) : ''} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea name="description" required defaultValue={currentEvent?.description} />
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
                {events.map(event => (
                    <Card key={event._id} className="flex flex-row p-4 gap-4 items-center">
                        <div className="h-16 w-24 bg-muted rounded overflow-hidden flex-shrink-0">
                            {event.images && event.images[0] && <img src={event.images[0]} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold">{event.title}</h3>
                            <p className="text-xs text-muted-foreground">{new Date(event.startDateTime).toLocaleString()} @ {event.location}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setCurrentEvent(event); setIsEditing(true); }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => confirmDelete(event._id)}>Delete</Button>
                        </div>
                    </Card>
                ))}
            </div>
            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Event"
                description="Are you sure you want to delete this event?"
                destructive
            />
        </div>
    );
}
