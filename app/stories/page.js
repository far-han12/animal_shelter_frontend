import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

async function getStories() {
    try {
        const res = await fetch('https://animal-shelter-backend-eight.vercel.app/api/stories', { cache: 'no-store' });
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (err) {
        return [];
    }
}

export default async function StoriesPage() {
    const stories = await getStories();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Success Stories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map(story => (
                    <Card key={story._id}>
                        {story.coverImage && (
                            <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{story.title}</CardTitle>
                            <CardDescription>{new Date(story.publishedAt).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3 text-muted-foreground">{story.body}</p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/stories/${story.slug}`} className="w-full text-primary hover:underline">
                                Read More
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
