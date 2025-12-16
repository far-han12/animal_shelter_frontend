import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export const dynamic = 'force-dynamic';

// Server Component for fetching
async function getPets(searchParams) {
    const params = new URLSearchParams(searchParams);
    // Default to limit 9
    if (!params.has('limit')) params.set('limit', '9');

    try {
        const res = await fetch(`https://animal-shelter-backend-eight.vercel.app/api/pets?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        return data.success ? data : { data: [], meta: {} };
    } catch (err) {
        console.error(err);
        return { data: [], meta: {} };
    }
}

export default async function PetsPage({ searchParams }) {
    const params = await searchParams;
    const { data: pets, meta } = await getPets(params);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Adopt a Pet</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="space-y-6">
                    <form className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg">Filters</h3>

                        <div className="grid gap-2">
                            <Label>Search</Label>
                            <Input name="q" placeholder="Name..." defaultValue={params.q} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Species</Label>
                            <select name="species" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={params.species}>
                                <option value="">All</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Size</Label>
                            <select name="size" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={params.size}>
                                <option value="">Any</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full">Apply Filters</Button>
                        {Object.keys(params).length > 0 && (
                            <Link href="/pets">
                                <Button variant="ghost" className="w-full mt-2">Clear Filters</Button>
                            </Link>
                        )}
                    </form>
                </div>

                {/* Gallery Grid */}
                <div className="md:col-span-3">
                    {pets.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No pets found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <Card key={pet._id} className="overflow-hidden flex flex-col">
                                    <div className="aspect-square relative">
                                        <img
                                            src={pet.photos[0] || 'https://via.placeholder.com/300'}
                                            alt={pet.name}
                                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                        />
                                        {pet.status === 'PENDING_ADOPTION' && (
                                            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                Adoption in Progress
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle>{pet.name}</CardTitle>
                                        <CardDescription>{pet.breed} • {pet.age} yrs • {pet.gender}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="line-clamp-2 text-sm text-muted-foreground">{pet.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href={`/pets/${pet._id}`} className="w-full">
                                            <Button className="w-full">Meet {pet.name}</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {meta.page > 1 && (
                                <Link href={{ pathname: '/pets', query: { ...params, page: meta.page - 1 } }}>
                                    <Button variant="outline">Previous</Button>
                                </Link>
                            )}
                            <span className="flex items-center px-4 text-sm">
                                Page {meta.page} of {meta.totalPages}
                            </span>
                            {meta.page < meta.totalPages && (
                                <Link href={{ pathname: '/pets', query: { ...params, page: meta.page + 1 } }}>
                                    <Button variant="outline">Next</Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
