import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-primary/10 bg-background pt-12 pb-8">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Link href="/" className="inline-block">
                            <span className="text-xl font-bold tracking-tighter text-primary">
                                parti<span className="text-foreground">.life</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Tenerife&apos;s ultimate event aggregator. Discover the best island parties, from sunset chillouts to exclusive VIP raves.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">All Events</Link></li>
                            <li><Link href="/categories/beach" className="hover:text-primary transition-colors">Beach Parties</Link></li>
                            <li><Link href="/categories/club" className="hover:text-primary transition-colors">Clubs</Link></li>
                            <li><Link href="/categories/secret" className="hover:text-primary transition-colors">Secret Events</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">For Partners</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/signup?role=agent" className="hover:text-primary transition-colors">Become an Agent</Link></li>
                            <li><Link href="/agent/guidelines" className="hover:text-primary transition-colors">Event Guidelines</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-primary/5 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} parti.life. All rights reserved. Made with 🏝️ in Tenerife.
                </div>
            </div>
        </footer>
    )
}
