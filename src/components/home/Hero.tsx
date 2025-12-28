import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/40 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/30 blur-[100px]" />
            </div>

            <div className="container px-4 mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    The Ultimate Tenerife Party Guide
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Discover Tenerife&apos;s <br />
                    <span className="text-primary italic">Best Nightlife</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    From golden sunset beach clubs to exclusive underground raves.
                    The only platform you need to find the island&apos;s most vibrant events.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-lg shadow-[0_0_30px_rgba(var(--primary),0.4)]" asChild>
                        <Link href="#events">
                            Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5 text-lg" asChild>
                        <Link href="/signup?role=agent">
                            Post an Event
                        </Link>
                    </Button>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">50+</span>
                        <span className="text-xs uppercase tracking-widest">Active Events</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">12</span>
                        <span className="text-xs uppercase tracking-widest">Secret Parties</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">5k+</span>
                        <span className="text-xs uppercase tracking-widest">Party Goers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">100%</span>
                        <span className="text-xs uppercase tracking-widest">Island Vibe</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
