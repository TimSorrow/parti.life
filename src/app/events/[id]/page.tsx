import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database'
import { notFound, redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Lock, ArrowLeft, Ticket, Share2, Info, User as UserIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch event and creator
    const { data: eventData } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('id', id)
        .single()
    const event = (eventData as any) as (Database['public']['Tables']['events']['Row'] & { profiles: { full_name: string | null } | null }) | null

    if (!event) return notFound()

    // Check auth and visibility
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    const { data: profileData } = user
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null }
    const profile = (profileData as any) as Database['public']['Tables']['profiles']['Row'] | null

    const isVipRequired = event.min_tier_required === 'vip'
    const isVipUser = profile?.subscription_tier === 'vip'
    const isAdmin = profile?.role === 'admin'
    const isCreator = profile?.id === event.created_by
    const canView = !isVipRequired || isVipUser || isAdmin || isCreator

    if (!canView && event.status === 'approved') {
        return (
            <div className="container px-4 py-24 mx-auto text-center">
                <div className="max-w-md mx-auto p-12 rounded-[2.5rem] bg-card/50 border border-primary/20 backdrop-blur-xl">
                    <Lock className="h-16 w-16 text-amber-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Locked VIP Event</h1>
                    <p className="text-muted-foreground mb-8">
                        This event is exclusive to VIP members. Upgrade your account to see the full details and location.
                    </p>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 rounded-full">
                        Upgrade to VIP
                    </Button>
                    <Button variant="ghost" asChild className="mt-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Events
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    // If not approved and not admin/creator, show 404
    if (event.status !== 'approved' && !isAdmin && !isCreator) {
        return notFound()
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="absolute top-8 left-8">
                    <Button variant="ghost" asChild className="bg-black/40 backdrop-blur-md text-white hover:bg-black/60 rounded-full">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Link>
                    </Button>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-primary text-primary-foreground">
                                {event.status === 'approved' ? 'Active' : event.status.toUpperCase()}
                            </Badge>
                            {isVipRequired && (
                                <Badge className="bg-amber-500 text-white border-0">VIP EXCLUSIVE</Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">{event.title}</h1>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="flex items-center gap-1.5 font-medium">
                                <Calendar className="h-4 w-4 text-primary" />
                                {new Date(event.date_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 mt-12 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" /> About this event
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {event.description || 'No description provided for this event.'}
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-secondary/20 border border-primary/5">
                            <h2 className="text-xl font-bold mb-6">Location & Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10 h-max">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Venue</h4>
                                            <p className="text-muted-foreground">{event.location_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10 h-max">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Time</h4>
                                            <p className="text-muted-foreground">
                                                Starts {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10 h-max">
                                            <UserIcon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Organized by</h4>
                                            <p className="text-muted-foreground">{event.profiles?.full_name || 'Verified Agent'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card w-full aspect-square md:aspect-auto rounded-2xl border border-primary/10 flex items-center justify-center relative overflow-hidden group">
                                    <MapPin className="h-12 w-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                                    <span className="text-xs text-muted-foreground absolute bottom-4">Interactive map coming soon</span>
                                    <div className="absolute inset-0 bg-primary/5 opacity-40" />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-primary/20 bg-card/60 backdrop-blur-md overflow-hidden shadow-2xl">
                                <CardHeader className="bg-primary/5 border-b border-primary/5">
                                    <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Pass Access</div>
                                    <CardTitle className="text-3xl font-bold">Free Entry</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-start gap-2 text-sm">
                                            <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                                <Check className="h-3 w-3 text-green-500" />
                                            </div>
                                            <span>Instant confirmation upon booking</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm">
                                            <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                                <Check className="h-3 w-3 text-green-500" />
                                            </div>
                                            <span>Access to all public areas</span>
                                        </li>
                                    </ul>
                                    <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-[0_10px_30px_rgba(var(--primary),0.3)]">
                                        <Ticket className="mr-2 h-5 w-5" /> Get Tickets
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 rounded-full border-primary/10">
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-full border-primary/10">
                                    Contact
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Check({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
