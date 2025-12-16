'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

function FailContent() {
    const searchParams = useSearchParams();
    const tranId = searchParams.get('tranId');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-red-500 animate-in zoom-in duration-500">
                <XCircle size={80} />
            </div>

            <Card className="w-full max-w-md text-center border-red-200 bg-red-50/50">
                <CardHeader>
                    <CardTitle className="text-2xl text-red-700">Donation Failed</CardTitle>
                    <CardDescription>
                        We couldn't process your donation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Something went wrong during the payment process.
                        <br />
                        <span className="font-mono text-xs text-gray-400">Transaction ID: {tranId}</span>
                    </p>
                    <div className="pt-4">
                        <Link href="/donate">
                            <Button className="w-full bg-red-600 hover:bg-red-700">
                                Try Again
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

export default function PaymentFail() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FailContent />
        </Suspense>
    );
}
