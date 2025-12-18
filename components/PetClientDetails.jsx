'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import api from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PetClientDetails({ pet }) {
    const { user } = useAuth();
    const [inquiryOpen, setInquiryOpen] = useState(false);
    const [adoptionOpen, setAdoptionOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInquiry = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (pet.status === 'AVAILABLE') {
                // If available and user wants to adopt directly? 
                // Requirements said: POST /api/inquiries (Public) -> create inquiry
                // AND POST /api/adoptions/apply (User) for application.
                // This form handles INQUIRY (Public).
                await api.post('/inquiries', {
                    petId: pet._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    message: data.message
                });
                toast.success('Inquiry sent successfully!'); // Changed from alert to toast.success
                setInquiryOpen(false);
            }
        } catch (err) {
            alert('Error sending inquiry: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdoption = async (e) => {
        e.preventDefault();
        // Application form
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.post('/adoptions/apply', {
                petId: pet._id,
                applicantInfo: {
                    address: data.address,
                    experience: data.experience,
                    householdInfo: data.householdInfo,
                    notes: data.notes
                }
            }, user ? document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1") : null);
            // Note: Client side cookie read for token or auth context.
            // Better to use a helper that grabs token from context or cookies. 
            // Here we rely on api helper interceptor logic if we passed it? 
            // Actually api.js expects token as arg. We should get it from useAuth or cookie.
            // Ideally useAuth provides it.
            // Let's assume auth is required for this route (protected button).

            toast.success('Application submitted!');
            router.push('/my/adoptions');
        } catch (err) {
            toast.error('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSponsor = async () => {
        // Redirect to payment init
        try {
            const res = await api.post('/donations/init', {
                amount: 500, // Fixed 500 or ask? Let's default 500 for sponsor button
                purpose: 'SPONSOR_PET',
                petId: pet._id,
                donorName: user?.name,
                donorEmail: user?.email,
                donorPhone: user?.phone,
                userId: user?._id
            });
            if (res.success && res.url) {
                window.location.href = res.url;
            }
        } catch (err) {
            toast.error('Error: ' + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                {pet.status === 'AVAILABLE' && (
                    <>
                        <Button size="lg" onClick={() => user ? setAdoptionOpen(!adoptionOpen) : router.push('/auth/login')}>
                            Adopt Me
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => setInquiryOpen(!inquiryOpen)}>
                            Inquire
                        </Button>
                    </>
                )}
                <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleSponsor}
                    disabled={['PENDING_REVIEW', 'ADOPTED'].includes(pet.status)}
                >
                    Sponsor Me (500 BDT)
                </Button>
            </div>

            {inquiryOpen && (
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-bold mb-4">Send an Inquiry</h3>
                        <form onSubmit={handleInquiry} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input name="name" required defaultValue={user?.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phone</Label>
                                    <Input name="phone" required defaultValue={user?.phone} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input name="email" type="email" required defaultValue={user?.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Message</Label>
                                <Textarea name="message" required placeholder="I am interested in..." />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Inquiry'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {adoptionOpen && user && (
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-bold mb-4">Adoption Application</h3>
                        <form onSubmit={handleAdoption} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Input name="address" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Pet Experience</Label>
                                <Textarea name="experience" placeholder="Have you owned pets before?" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Household Info</Label>
                                <Input name="householdInfo" placeholder="e.g., 2 adults, 1 child, fenced yard" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Additional Notes</Label>
                                <Textarea name="notes" />
                            </div>
                            <div className="grid gap-2 hidden">
                                <Label>Token (Testing)</Label>
                                <Input disabled value={'Token will be auto-attached from cookies'} />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
