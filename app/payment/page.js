'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentIndex() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/donate');
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Redirecting to donation page...</p>
        </div>
    );
}
