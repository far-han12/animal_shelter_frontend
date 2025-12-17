'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import api from '@/lib/api';
import { toast } from 'sonner';

import { useAuth } from '@/lib/authContext';

export default function DonatePage() {
    const { user } = useAuth();
    const [amount, setAmount] = useState('500');
    const [customAmount, setCustomAmount] = useState('');

    const handleDonate = async () => {
        try {
            const finalAmount = customAmount || amount;
            if (!finalAmount) {
                toast.error('Please select an amount');
                return;
            }

            console.log('Donating as User:', user);
            const res = await api.post('/donations/init', {
                amount: finalAmount,
                purpose: 'GENERAL',
                donorName: user?.name || 'Guest Donor',
                donorEmail: user?.email || 'guest@example.com',
                donorPhone: user?.phone || '00000000000',
                userId: user?._id // Only if logged in
            });

            if (res.success && res.url) {
                window.location.href = res.url;
            }
        } catch (err) {
            toast.error('Error: ' + err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Support Our Cause</h1>
            <p className="text-muted-foreground mb-8">
                Your donations help us provide food, shelter, and medical care to animals in need.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Secure payment via SSLCommerz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        {['100', '500', '1000'].map(val => (
                            <Button
                                key={val}
                                variant={amount === val && !customAmount ? 'default' : 'outline'}
                                onClick={() => { setAmount(val); setCustomAmount(''); }}
                            >
                                {val} BDT
                            </Button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or Custom Amount</span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Amount (BDT)</Label>
                        <Input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                    </div>

                    <Button className="w-full" size="lg" onClick={handleDonate}>
                        Donate Now
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
