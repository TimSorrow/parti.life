import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'
import { format } from 'date-fns'

type Event = Database['public']['Tables']['events']['Row'] & {
    categories?: {
        name: string
        icon_name: string
    } | null
}

interface AfishaEventCardProps {
    event: Event
    variant?: 'default' | 'featured'
}

export default function AfishaEventCard({ event, variant = 'default' }: AfishaEventCardProps) {
    const eventDate = new Date(event.date_time)
    const formattedDate = format(eventDate, 'MMM d')
    const formattedTime = format(eventDate, 'h:mm a')
    const price = (event as any).price

    const isFeatured = variant === 'featured'

    return (
        <Link
            href={`/events/${event.id}`}
            className={`
                group block rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 
                hover:border-white/10 transition-all duration-300
                ${isFeatured ? 'hover:shadow-xl hover:shadow-primary/5' : ''}
            `}
        >
            {/* Image Container */}
            <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                <img
                    alt={event.title}
                    src={event.image_url || '/images/hero-bg-v2.webp'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category badge - top left */}
                {event.categories && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white rounded-md">
                            {event.categories.name}
                        </span>
                    </div>
                )}

                {/* Rating/Price badge - top right */}
                <div className="absolute top-3 right-3">
                    {price ? (
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-xs font-bold text-white rounded-md border border-white/10">
                            €{price}
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 bg-green-500/80 backdrop-blur-sm text-[10px] font-bold uppercase text-white rounded-md">
                            Free
                        </span>
                    )}
                </div>

                {/* Title overlay for featured cards */}
                {isFeatured && (
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center">
                            <MapPin className="h-3 w-3 mr-1.5" />
                            {event.location_name}
                        </p>
                    </div>
                )}
            </div>

            {/* Content - only for non-featured cards */}
            {!isFeatured && (
                <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {event.title}
                    </h3>

                    <div className="flex items-center text-gray-500 text-xs mb-2">
                        <MapPin className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">{event.location_name}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-xs text-gray-400">
                            {formattedDate} • {formattedTime}
                        </span>
                        <span className="text-xs text-primary font-semibold group-hover:underline">
                            View Details →
                        </span>
                    </div>
                </div>
            )}
        </Link>
    )
}
