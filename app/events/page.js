import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

async function getEvents() {
    try {
        const res = await fetch('https://animal-shelter-backend-eight.vercel.app/api/events', { cache: 'no-store' }); // fetches all by default or we can filter
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (err) {
        return [];
    }
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <Card key={event._id}>
                        {event.images && event.images[0] && (
                            <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{new Date(event.startDateTime).toDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 font-medium">📍 {event.location}</p>
                            <p className="line-clamp-2 text-muted-foreground">{event.description}</p>
                        </CardContent>
                        <CardFooter>
                            {/* Add details page if needed or just show basic info */}
                            <span className="text-sm text-primary">Join us!</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
