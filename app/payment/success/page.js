'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

function SuccessContent() {
    const searchParams = useSearchParams();
    const tranId = searchParams.get('tranId');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-green-500 animate-in zoom-in duration-500">
                <CheckCircle2 size={80} />
            </div>

            <Card className="w-full max-w-md text-center border-green-200 bg-green-50/50">
                <CardHeader>
                    <CardTitle className="text-2xl text-green-700">Donation Successful!</CardTitle>
                    <CardDescription>
                        Thank you for your generous support.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Your transaction has been completed successfully.
                        <br />
                        <span className="font-mono text-xs text-gray-400">Transaction ID: {tranId}</span>
                    </p>
                    <div className="pt-4">
                        <Link href="/my/donations">
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                View My Donations
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
