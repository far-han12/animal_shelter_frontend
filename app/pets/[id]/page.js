import PetClientDetails from '@/components/PetClientDetails';

export const dynamic = 'force-dynamic';

async function getPet(id) {
    try {
        const res = await fetch(`https://animal-shelter-backend-eight.vercel.app/api/pets/${id}`, { cache: 'no-store' });
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (err) {
        return null;
    }
}

export default async function PetDetails({ params }) {
    const { id } = await params;
    const pet = await getPet(id);

    if (!pet) return <div className="p-8 text-center">Pet not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden border bg-muted">
                        <img
                            src={pet.photos[0] || 'https://via.placeholder.com/600'}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {pet.photos.slice(1).map((photo, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                                <img src={photo} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold">{pet.name}</h1>
                        <p className="text-xl text-muted-foreground">{pet.breed} • {pet.age} yrs • {pet.gender}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 border rounded bg-muted/20">
                            <span className="font-semibold block">Species</span>
                            {pet.species}
                        </div>
                        <div className="p-3 border rounded bg-muted/20">
                            <span className="font-semibold block">Size</span>
                            {pet.size}
                        </div>
                        <div className="p-3 border rounded bg-muted/20">
                            <span className="font-semibold block">Special Needs</span>
                            {pet.specialNeeds ? 'Yes' : 'No'}
                        </div>
                        <div className="p-3 border rounded bg-muted/20">
                            <span className="font-semibold block">Status</span>
                            {pet.status}
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h3 className="text-xl font-bold">About {pet.name}</h3>
                        <p className="whitespace-pre-line text-muted-foreground">{pet.description}</p>

                        {pet.medicalNotes && (
                            <div className="mt-4 p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg text-yellow-800">
                                <span className="font-semibold block mb-1">Medical Notes</span>
                                {pet.medicalNotes}
                            </div>
                        )}
                    </div>

                    <PetClientDetails pet={pet} />
                </div>
            </div>
        </div>
    );
}
