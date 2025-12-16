import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/lib/api';

export const dynamic = 'force-dynamic';

// Fetch featured pets (Client or Server? Server Component is better in App Router)
async function getFeaturedPets() {
  try {
    const res = await fetch('https://animal-shelter-backend-eight.vercel.app/api/pets?limit=6', { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Home() {
  const pets = await getFeaturedPets();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your New Best Friend
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Providing loving homes for abandoned and rescued animals. Join us in making a difference.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/pets">
                <Button size="lg">Adopt a Pet</Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline" size="lg">Make a Donation</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Pets</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Meet some of our adorable residents waiting for a forever home.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {pets.map((pet) => (
              <Card key={pet._id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={pet.photos[0] || 'https://via.placeholder.com/300'}
                    alt={pet.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>{pet.breed} • {pet.age} yrs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{pet.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/pets/${pet._id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/pets">
              <Button variant="secondary">View All Pets</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action (Volunteer) */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-accent">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Become a Volunteer</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                We rely on volunteers to help us care for our animals. If you love animals and have some spare time, we'd love to have you.
              </p>
              <Link href="/volunteer">
                <Button size="lg">Join Us</Button>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <img src="https://i.ibb.co.com/jPVTC9WZ/download-2.jpg" alt="download-2" border="0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
