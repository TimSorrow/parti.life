import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'

type Event = Database['public']['Tables']['events']['Row'] & {
    categories?: {
        name: string
        icon: string
    } | null
}
type Profile = Database['public']['Tables']['profiles']['Row']

interface EventCardProps {
    event: Event
    userProfile?: Profile | null
}

export default function EventCard({ event, userProfile }: EventCardProps) {
    const isVipRequired = event.min_tier_required === 'vip'
    const isVipUser = userProfile?.subscription_tier === 'vip'
    const isAdmin = userProfile?.role === 'admin'
    const isCreator = userProfile?.id === event.created_by

    const canView = !isVipRequired || isVipUser || isAdmin || isCreator

    const eventDate = new Date(event.date_time)
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    return (
        <Link href={canView ? `/events/${event.id}` : '#'} className="block">
            <article className="group relative bg-[#0F0F0F] rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 h-full">
                <div className="aspect-[4/5] relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        alt={event.title}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!canView ? 'blur-xl grayscale' : 'opacity-80 group-hover:opacity-100'}`}
                        src={event.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr_zaxkI3PC8EGebMFTxSRvTozhV0UksO5fE6ILaink8PBJpVJw7WwKqmQs5lVdzAoZqCDtHUnsWb-xQJ4_QPqP7w1j4O5-JeYuGiccFcPxsktUWSnL1FQNrnXsJsEQ0iOavQJK3EPKf4sFwSKYWGcfSEDNPFMb-KMvH9wtwTsC6GTPtjC-r443zfEW7PNQz_RrHu9fZxWr8HGZH0xLHkdnmDXUBgCIZ3LmFbDa2xlG_R930hAdGAJIQWNvfilloWz0UQIQxkT7bA'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>

                    <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                        {isVipRequired && (
                            <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/20 rounded-full shadow-lg flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" /> VIP
                            </span>
                        )}
                        {event.categories && (
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 rounded-full group-hover:bg-primary group-hover:border-primary transition-colors shadow-lg">
                                {event.categories.name}
                            </span>
                        )}
                    </div>

                    {!canView && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                            <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">lock</span>
                            <h4 className="text-lg font-bold text-white px-4 text-center">VIP Exclusive</h4>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-4 flex items-center group-hover:text-gray-300 transition-colors">
                            <span className="material-symbols-outlined text-sm mr-1 text-primary">location_on</span>
                            {event.location_name}
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 group-hover:border-white/20">
                            <span className="text-white font-display font-bold text-lg">€{(event as any).price || 'TBA'}</span>
                            <span className="text-xs font-medium text-gray-500 group-hover:text-primary transition-colors">
                                {formattedDate} • {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}
