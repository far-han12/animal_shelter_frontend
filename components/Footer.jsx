import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold">Paws & Claws</h3>
                        <p className="text-sm text-muted-foreground">
                            Dedicated to finding loving homes for every pet in need.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Adopt</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/pets?species=Dog" className="hover:text-primary">Dogs</Link></li>
                            <li><Link href="/pets?species=Cat" className="hover:text-primary">Cats</Link></li>
                            <li><Link href="/pets" className="hover:text-primary">All Pets</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Community</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/stories" className="hover:text-primary">Success Stories</Link></li>
                            <li><Link href="/events" className="hover:text-primary">Events</Link></li>
                            <li><Link href="/volunteer" className="hover:text-primary">Volunteer</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/donate" className="hover:text-primary">Donate</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Paws & Claws Shelter. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
