
export const dynamic = 'force-dynamic';

async function getStory(slug) {
    try {
        const res = await fetch(`https://animal-shelter-backend-eight.vercel.app/api/stories/${slug}`, { cache: 'no-store' });
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (err) {
        return null;
    }
}

export default async function StoryDetail({ params }) {
    const { slug } = await params;
    const story = await getStory(slug);

    if (!story) return <div className="p-8 text-center">Story not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {story.coverImage && (
                <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
                    <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
            <p className="text-muted-foreground mb-8">
                Published on {new Date(story.publishedAt).toLocaleDateString()}
            </p>
            <div className="prose max-w-none">
                <p className="whitespace-pre-line leading-relaxed">{story.body}</p>
            </div>
        </div>
    );
}
