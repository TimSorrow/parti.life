import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Lock, ArrowLeft, Ticket, Share2, Info, User as UserIcon, Check } from 'lucide-react'
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
            <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
                <div className="max-w-md w-full p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <Lock className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h1 className="text-3xl font-display font-black text-white mb-4 uppercase italic tracking-tighter">Locked VIP Event</h1>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        This event is exclusive to VIP members. Upgrade your account to see the full details and location.
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-widest text-sm">
                        Upgrade to VIP Now
                    </Button>
                    <Link href="/" className="inline-flex items-center gap-2 mt-6 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" /> Back to Events
                    </Link>
                </div>
            </div>
        )
    }

    if (event.status !== 'approved' && !isAdmin && !isCreator) {
        return notFound()
    }

    const eventDate = new Date(event.date_time)
    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    return (
        <div className="min-h-screen bg-[#050505] pb-24">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                <div className="absolute top-24 left-4 sm:left-8 z-10">
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs border border-white/5">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                </div>

                <div className="absolute bottom-12 left-0 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-primary text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
                                {event.status === 'approved' ? 'Active' : event.status}
                            </span>
                            {isVipRequired && (
                                <span className="px-4 py-1.5 bg-amber-500 text-[10px] font-bold uppercase tracking-widest text-white rounded-full shadow-lg shadow-amber-500/20">VIP Exclusive</span>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white mb-6 uppercase italic leading-none max-w-4xl">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-gray-300 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                                {formattedDate}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                {event.location_name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-2xl font-display font-black tracking-tighter text-white uppercase italic mb-6 flex items-center gap-3">
                                <Info className="h-6 w-6 text-primary" /> About <span className="text-primary tracking-normal font-bold">this event</span>
                            </h2>
                            <p className="text-xl text-gray-400 font-light leading-relaxed whitespace-pre-wrap">
                                {event.description || 'No description provided for this event.'}
                            </p>
                        </section>

                        <section className="p-10 rounded-[3rem] bg-white/2 border border-white/5 relative overflow-hidden group hover:bg-white/5 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <h2 className="text-2xl font-display font-black tracking-tighter text-white uppercase italic mb-8">Location & <span className="text-primary tracking-normal font-bold">Details</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    {[
                                        { label: 'Venue', val: event.location_name, icon: 'location_on' },
                                        { label: 'Time', val: `Starts at ${formattedTime}`, icon: 'schedule' },
                                        { label: 'Organized by', val: event.profiles?.full_name || 'Verified Agent', icon: 'verified_user' }
                                    ].map((detail, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                                <span className="material-symbols-outlined text-primary">{detail.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">{detail.label}</h4>
                                                <p className="text-white font-bold">{detail.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#121212] w-full aspect-square rounded-[2rem] border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-white/10 transition-colors">
                                    <span className="material-symbols-outlined text-4xl text-gray-700">map</span>
                                    <div className="absolute bottom-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        Interactive map coming soon
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Pass */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] border border-white/10 p-8 shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                <div className="mb-8 border-b border-white/5 pb-6">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Access Type</div>
                                    <div className="text-4xl font-display font-black text-white italic tracking-tighter">€{(event as any).price || 'FREE'}<span className="text-gray-500 text-sm italic font-medium ml-2 uppercase tracking-normal">/ ENTRY</span></div>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    {[
                                        'Instant confirmation',
                                        'Access to all public areas',
                                        'Verified secure ticket'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Button className="w-full h-16 text-sm font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                    <Ticket className="mr-3 h-5 w-5" /> Get Entry Pass
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/5 bg-white/2 hover:bg-white/5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/5 bg-white/2 hover:bg-white/5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                                    Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
