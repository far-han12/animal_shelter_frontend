'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

function CancelContent() {
    const searchParams = useSearchParams();
    const tranId = searchParams.get('tranId');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-yellow-500 animate-in zoom-in duration-500">
                <AlertCircle size={80} />
            </div>

            <Card className="w-full max-w-md text-center border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                    <CardTitle className="text-2xl text-yellow-700">Donation Cancelled</CardTitle>
                    <CardDescription>
                        You cancelled the donation process.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        No charges were made.
                        <br />
                        <span className="font-mono text-xs text-gray-400">Transaction ID: {tranId}</span>
                    </p>
                    <div className="pt-4">
                        <Link href="/donate">
                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                                Try Again
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentCancel() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CancelContent />
        </Suspense>
    );
}
