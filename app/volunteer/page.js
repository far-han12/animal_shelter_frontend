'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function VolunteerPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()); // This might not handle multiple checkboxes for interests optimally, but good enough for simple text inputs

        try {
            const res = await api.post('/volunteers/apply', data, token);
            if (res.success) {
                toast.success('Application submitted successfully!');
                router.push('/profile');
            }
        } catch (err) {
            toast.error('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Volunteer Application</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <Input name="name" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Phone</Label>
                            <Input name="phone" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Availability</Label>
                            <Input name="availability" placeholder="e.g. Weekends, Mondays" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Address</Label>
                            <Textarea name="address" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Why do you want to volunteer?</Label>
                            <Textarea name="notes" placeholder="Tell us about yourself..." />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Form'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
