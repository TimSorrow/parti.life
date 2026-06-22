import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Lock, ArrowLeft, Ticket, Share2, Info, User as UserIcon, Check } from 'lucide-react'
import Link from 'next/link'

type EventTheme = {
    bg: string
    textColor: string
    primaryText: string
    primaryBg: string
    primaryHex: string
    gradient: string
    border: string
    glow: string
    badgeBg: string
    titleFont: string
}

function getEventTheme(title: string): EventTheme {
    const t = title.toLowerCase();
    if (t.includes('la misa')) {
        return {
            bg: 'bg-black',
            textColor: 'text-zinc-200',
            primaryText: 'text-red-500',
            primaryBg: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20',
            primaryHex: '#EF4444',
            gradient: 'from-black via-zinc-950 to-red-950/20',
            border: 'border-red-950/40',
            glow: 'shadow-[0_0_50px_rgba(239,68,68,0.08)] border-red-500/10',
            badgeBg: 'bg-red-500/10 border-red-500/20 text-red-400',
            titleFont: 'font-serif tracking-normal italic font-black'
        };
    }
    if (t.includes('sunblast')) {
        return {
            bg: 'bg-[#030303]',
            textColor: 'text-zinc-300',
            primaryText: 'text-[#BFFF00]',
            primaryBg: 'bg-[#BFFF00] hover:bg-[#A3D900] text-black font-bold shadow-lg shadow-[#BFFF00]/10',
            primaryHex: '#BFFF00',
            gradient: 'from-black via-zinc-950 to-[#BFFF00]/5',
            border: 'border-[#BFFF00]/15',
            glow: 'shadow-[0_0_50px_rgba(191,255,0,0.08)] border-[#BFFF00]/25',
            badgeBg: 'bg-[#BFFF00]/10 border-[#BFFF00]/20 text-[#BFFF00]',
            titleFont: 'font-mono uppercase tracking-tighter font-extrabold'
        };
    }
    if (t.includes('phe festival')) {
        return {
            bg: 'bg-[#080B10]',
            textColor: 'text-slate-300',
            primaryText: 'text-emerald-400',
            primaryBg: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20',
            primaryHex: '#34D399',
            gradient: 'from-[#080B10] via-slate-950 to-emerald-950/15',
            border: 'border-emerald-950/40',
            glow: 'shadow-[0_0_50px_rgba(52,211,153,0.06)] border-emerald-400/20',
            badgeBg: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
            titleFont: 'font-sans tracking-tight font-black'
        };
    }
    if (t.includes('noctámbula') || t.includes('noctambula')) {
        return {
            bg: 'bg-slate-950',
            textColor: 'text-slate-300',
            primaryText: 'text-cyan-400',
            primaryBg: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20',
            primaryHex: '#22D3EE',
            gradient: 'from-slate-950 via-slate-950 to-purple-950/25',
            border: 'border-cyan-500/20',
            glow: 'shadow-[0_0_50px_rgba(34,211,238,0.08)] border-cyan-400/20',
            badgeBg: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-400',
            titleFont: 'font-sans tracking-tighter uppercase font-black italic'
        };
    }
    if (t.includes('peñón') || t.includes('penon') || t.includes('peñon')) {
        return {
            bg: 'bg-[#0f0e0c]',
            textColor: 'text-[#e5e5e0]',
            primaryText: 'text-amber-400',
            primaryBg: 'bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20',
            primaryHex: '#FBBF24',
            gradient: 'from-[#0f0e0c] via-stone-950 to-amber-950/20',
            border: 'border-amber-500/20',
            glow: 'shadow-[0_0_50px_rgba(251,191,36,0.08)] border-amber-400/20',
            badgeBg: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
            titleFont: 'font-display font-black tracking-normal'
        };
    }
    if (t.includes('brunch')) {
        return {
            bg: 'bg-[#080d1a]',
            textColor: 'text-sky-100',
            primaryText: 'text-sky-400',
            primaryBg: 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20',
            primaryHex: '#38BDF8',
            gradient: 'from-[#080d1a] via-[#0b162c] to-amber-950/10',
            border: 'border-sky-500/20',
            glow: 'shadow-[0_0_50px_rgba(56,189,248,0.08)] border-sky-400/20',
            badgeBg: 'bg-sky-400/10 border-sky-400/20 text-sky-400',
            titleFont: 'font-sans font-bold tracking-tight'
        };
    }
    if (t.includes('cook music')) {
        return {
            bg: 'bg-[#050505]',
            textColor: 'text-orange-50',
            primaryText: 'text-orange-500',
            primaryBg: 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20',
            primaryHex: '#F97316',
            gradient: 'from-black via-zinc-950 to-orange-950/15',
            border: 'border-orange-500/20',
            glow: 'shadow-[0_0_50px_rgba(249,115,22,0.08)] border-orange-500/20',
            badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
            titleFont: 'font-display font-black tracking-tighter uppercase italic'
        };
    }
    // Default theme (original website styles)
    return {
        bg: 'bg-[#050505]',
        textColor: 'text-white',
        primaryText: 'text-primary',
        primaryBg: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20',
        primaryHex: '#FF5A1F',
        gradient: 'from-[#050505] via-[#050505]/40 to-transparent',
        border: 'border-white/5',
        glow: '',
        badgeBg: 'bg-primary text-white',
        titleFont: 'font-display font-black tracking-tighter uppercase italic'
    };
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .trim()
}

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isUuid = uuidRegex.test(id)

    let eventData: any = null
    if (isUuid) {
        const { data } = await supabase
            .from('events')
            .select('*, profiles(full_name)')
            .eq('id', id)
            .single()
        eventData = data
    } else {
        // It's a slug, try to search by title
        const cleanSlug = decodeURIComponent(id)
        const words = cleanSlug.split(/[- ]+/).filter(w => w.length > 2)
        if (words.length > 0) {
            let query = supabase
                .from('events')
                .select('*, profiles(full_name)')
            
            const orConditions = words.map(w => `title.ilike.%${w}%`).join(',')
            const { data } = await query.or(orConditions).limit(20) as any
            
            if (data && data.length > 0) {
                const slugifiedId = slugify(cleanSlug)
                let bestMatch = data[0]
                let foundMatch = false
                
                for (const item of data) {
                    const itemSlug = slugify(item.title)
                    if (itemSlug === slugifiedId || itemSlug.includes(slugifiedId) || slugifiedId.includes(itemSlug)) {
                        bestMatch = item
                        foundMatch = true
                        break
                    }
                }
                
                if (foundMatch) {
                    eventData = bestMatch
                }
            }
        }
    }

    const event = eventData as (Database['public']['Tables']['events']['Row'] & { profiles: { full_name: string | null } | null }) | null

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

    const theme = getEventTheme(event.title)

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.textColor} pb-24 transition-colors duration-500`}>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <img
                    src={event.image_url || "/images/hero-bg-v2.webp"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient}`} />

                <div className="absolute top-24 left-4 sm:left-8 z-10">
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs border border-white/5">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                </div>

                <div className="absolute bottom-12 left-0 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className={`px-4 py-1.5 ${theme.badgeBg} text-[10px] font-bold uppercase tracking-widest rounded-full border`}>
                                {event.status === 'approved' ? 'Active' : event.status}
                            </span>
                            {isVipRequired && (
                                <span className="px-4 py-1.5 bg-amber-500 text-[10px] font-bold uppercase tracking-widest text-white rounded-full shadow-lg shadow-amber-500/20">VIP Exclusive</span>
                            )}
                        </div>
                        <h1 className={`text-5xl md:text-7xl ${theme.titleFont} text-white mb-6 leading-none max-w-4xl`}>
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-gray-300 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined ${theme.primaryText} text-xl`}>calendar_today</span>
                                {formattedDate}
                            </div>
                            <Link 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name + ' Tenerife')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                            >
                                <span className={`material-symbols-outlined ${theme.primaryText} text-xl group-hover:scale-110 transition-transform`}>location_on</span>
                                <span className={`underline decoration-white/20 underline-offset-4 group-hover:decoration-current/50 transition-colors`}>{event.location_name}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className={`text-2xl font-display font-black tracking-tighter text-white uppercase italic mb-6 flex items-center gap-3`}>
                                <Info className={`h-6 w-6 ${theme.primaryText}`} /> About <span className={`${theme.primaryText} tracking-normal font-bold`}>this event</span>
                            </h2>
                            <p className="text-xl text-gray-400 font-light leading-relaxed whitespace-pre-wrap">
                                {event.description || 'No description provided for this event.'}
                            </p>
                        </section>

                        <section className={`p-10 rounded-[3rem] bg-white/2 border ${theme.border} ${theme.glow} relative overflow-hidden group hover:bg-white/5 transition-all duration-500`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <h2 className="text-2xl font-display font-black tracking-tighter text-white uppercase italic mb-8">Location & <span className={`${theme.primaryText} tracking-normal font-bold`}>Details</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    {[
                                        { label: 'Venue', val: event.location_name, icon: 'location_on' },
                                        { label: 'Time', val: `Starts at ${formattedTime}`, icon: 'schedule' },
                                        { label: 'Organized by', val: event.profiles?.full_name || 'Verified Agent', icon: 'verified_user' }
                                    ].map((detail, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                                <span className={`material-symbols-outlined ${theme.primaryText}`}>{detail.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">{detail.label}</h4>
                                                <p className="text-white font-bold">{detail.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#121212] w-full aspect-square rounded-[2rem] border border-white/5 relative overflow-hidden group-hover:border-white/10 transition-colors group/map">
                                    <iframe 
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location_name + ' Tenerife')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(85%)' }} 
                                        allowFullScreen 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="absolute inset-0 opacity-80"
                                    ></iframe>
                                    <Link 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name + ' Tenerife')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 z-10"
                                        aria-label="Open in Google Maps"
                                    />
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl opacity-0 translate-y-2 group-hover/map:translate-y-0 group-hover/map:opacity-100 transition-all duration-300 z-20 whitespace-nowrap flex items-center justify-center gap-2 pointer-events-none">
                                        <MapPin className={`h-3 w-3 ${theme.primaryText}`} /> Open in Google Maps
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Pass */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className={`relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] border ${theme.border} ${theme.glow} p-8 shadow-2xl`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                <div className="mb-8 border-b border-white/5 pb-6">
                                    <div className={`text-[10px] font-bold uppercase tracking-widest ${theme.primaryText} mb-2`}>Access Type</div>
                                    <div className="text-4xl font-display font-black text-white italic tracking-tighter">€{(event as any).price || 'FREE'}<span className="text-gray-500 text-sm italic font-medium ml-2 uppercase tracking-normal">/ ENTRY</span></div>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    {[
                                        'Instant confirmation',
                                        'Access to all public areas',
                                        'Verified secure ticket'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                                <Check className={`h-3 w-3 ${theme.primaryText}`} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Button className={`w-full h-16 text-sm font-bold uppercase tracking-widest ${theme.primaryBg} rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]`}>
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

