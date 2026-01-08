import { Lock, Heart, MapPin, Ticket } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'
import { Button } from '@/components/ui/button'

type Event = Database['public']['Tables']['events']['Row'] & {
    categories?: {
        name: string
        icon_name: string
    } | null
}
type Profile = Database['public']['Tables']['profiles']['Row']

interface EventCardProps {
    event: Event
    userProfile?: Profile | null
    index?: number
}

export default function EventCard({ event, userProfile, index = 0 }: EventCardProps) {
    const isVipRequired = event.min_tier_required === 'vip'
    const isVipUser = userProfile?.subscription_tier === 'vip'
    const isAdmin = userProfile?.role === 'admin'
    const isCreator = userProfile?.id === event.created_by

    const canView = !isVipRequired || isVipUser || isAdmin || isCreator

    const eventDate = new Date(event.date_time)
    const day = eventDate.getDate()
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' })
    const formattedDate = `${weekday}, ${day} ${eventDate.toLocaleDateString('en-US', { month: 'long' })}`

    return (
        <article className="group relative bg-[#0F0F11] rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
            {/* Image Section */}
            <div className="aspect-[1.2/1] relative overflow-hidden">
                <img
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!canView ? 'blur-xl grayscale' : 'opacity-90 group-hover:opacity-100'}`}
                    src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    {index % 4 === 0 && (
                        <span className="px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg">
                            Featured
                        </span>
                    )}
                    {isVipRequired && (
                        <span className="px-3 py-1 bg-amber-500 text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" /> VIP
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all group/heart">
                    <Heart className="h-4 w-4 transition-transform group-hover/heart:scale-110" />
                </button>

                {/* Date Overlay (Top Left Style if preferred, but following reference layout) */}
                <div className="absolute bottom-4 left-4 z-10 flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">{month}</span>
                    <span className="text-xl font-black text-white leading-none mt-1">{day}</span>
                </div>

                {!canView && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <Lock className="h-8 w-8 text-amber-500 mb-2" />
                        <h4 className="text-sm font-black text-white px-4 text-center uppercase tracking-widest">VIP Exclusive</h4>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    {event.categories && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {event.categories.name}
                        </span>
                    )}
                    <span className="h-1 w-1 rounded-full bg-gray-700"></span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {formattedDate}
                    </span>
                </div>

                <Link href={canView ? `/events/${event.id}` : '#'}>
                    <h3 className="text-xl font-display font-black text-white mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase italic tracking-tighter">
                        {event.title}
                    </h3>
                </Link>

                <p className="text-gray-500 text-xs mb-6 flex items-center">
                    <MapPin className="h-3 w-3 mr-1.5 text-gray-700" />
                    {event.location_name}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-white italic tracking-tighter">
                            {(event as any).price ? `€${(event as any).price}` : 'FREE'}
                        </span>
                        {(event as any).price && <span className="text-[8px] font-bold text-gray-600 block uppercase tracking-widest mt-1">Starting from</span>}
                    </div>

                    <Button asChild className="rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:border-primary text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all active:scale-95">
                        <Link href={canView ? `/events/${event.id}` : '#'}>
                            {canView ? 'Get Tickets' : 'Locked'}
                        </Link>
                    </Button>
                </div>
            </div>
        </article>
    )
}
