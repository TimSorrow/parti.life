import { Lock, MapPin, Calendar, Heart } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'

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
    const formattedDate = `${weekday}, ${month} ${day}`

    // Alternate hover border colors based on index for the Persona vibe
    const hoverBorders = [
        'group-hover:border-primary',
        'group-hover:border-secondary',
        'group-hover:border-accent-purple',
        'group-hover:border-white'
    ]
    const activeHoverBorder = hoverBorders[index % hoverBorders.length]

    const textColors = [
        'text-primary',
        'text-secondary',
        'text-accent-purple',
        'text-white'
    ]
    const activeTextColor = textColors[index % textColors.length]

    const badgeBg = [
        'bg-primary text-white -rotate-3',
        'bg-secondary text-black rotate-2',
        'bg-accent-purple text-white -rotate-1',
        'bg-white text-black rotate-3'
    ]
    const activeBadgeBg = badgeBg[index % badgeBg.length]

    const formattedPrice = (event as any).price ? `€${(event as any).price}` : 'FREE'

    return (
        <article className="group relative w-full">
            <div className={`event-card-jagged relative h-[550px] overflow-hidden bg-black border-4 border-white ${activeHoverBorder} transition-colors duration-300`}>
                {/* Image */}
                <img
                    alt={event.title}
                    className={`w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 ${!canView ? 'blur-xl' : ''}`}
                    src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'}
                />

                {/* Price Speech Bubble */}
                <div className="absolute top-6 right-6 z-10">
                    <div className="speech-bubble text-xl font-black italic">
                        {formattedPrice}
                    </div>
                </div>

                {/* Locked / VIP overlay */}
                {!canView && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20">
                        <Lock className="h-12 w-12 text-primary mb-3" />
                        <h4 className="text-xl font-black text-white px-4 text-center uppercase tracking-widest font-headline">VIP Exclusive</h4>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Card Content */}
                <div className="absolute bottom-10 left-8 right-8 z-10">
                    {/* Badge */}
                    <span className={`${activeBadgeBg} font-black italic uppercase px-4 py-1 text-xs tracking-widest mb-4 inline-block transform font-headline`}>
                        {event.categories?.name || 'Party'}
                    </span>

                    {/* Title */}
                    <Link href={canView ? `/events/${event.id}` : '#'}>
                        <h3 className="font-headline text-3xl font-black italic mb-4 leading-[0.9] text-white uppercase transform skew-x-[-10deg] hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                        </h3>
                    </Link>

                    {/* Metadata */}
                    <div className="flex flex-col gap-2 text-white/80 font-black italic text-xs uppercase font-headline">
                        <span className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${activeTextColor}`} /> {formattedDate}
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 ${activeTextColor}`} /> {event.location_name}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )
}
