import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, MapPin, Lock, ChevronRight, Tags } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'
import * as LucideIcons from 'lucide-react'

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

    // Helper to get Lucide icon component by name
    const getIcon = (name: string | undefined | null) => {
        if (!name) return <Tags className="h-3 w-3 mr-1" />

        // Lucide React exports icons in PascalCase (e.g. 'music' -> 'Music', 'glass-water' -> 'GlassWater')
        const pascalName = name
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')

        const Icon = (LucideIcons as any)[pascalName] || (LucideIcons as any)[name.charAt(0).toUpperCase() + name.slice(1)] || Tags
        return <Icon className="h-3 w-3 mr-1" />
    }

    return (
        <Card className="group overflow-hidden bg-card/40 border-primary/10 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm flex flex-col h-full">
            <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={event.image_url || '/api/placeholder/800/450'}
                    alt={event.title}
                    className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 ${!canView ? 'blur-xl grayscale' : ''}`}
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {isVipRequired && (
                        <Badge variant="secondary" className="bg-amber-500/90 text-white border-0 shadow-lg">
                            <Lock className="h-3 w-3 mr-1" />
                            VIP
                        </Badge>
                    )}
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-primary/20 text-primary-foreground">
                        {new Date(event.date_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Badge>
                    {event.categories && (
                        <Badge variant="outline" className="bg-primary/20 backdrop-blur-md border-primary/30 text-primary-foreground">
                            {getIcon(event.categories.icon)}
                            {event.categories.name}
                        </Badge>
                    )}
                </div>

                {!canView && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
                        <Lock className="h-10 w-10 text-amber-500 mb-2" />
                        <h4 className="text-lg font-bold text-white">VIP Exclusive</h4>
                        <p className="text-xs text-slate-300">Upgrade to VIP to unlock this secret event</p>
                    </div>
                )}
            </div>

            <CardHeader className="p-5 pb-2">
                <h3 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>
            </CardHeader>

            <CardContent className="p-5 pt-0 flex-grow">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span>{new Date(event.date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span className="line-clamp-1">{event.location_name}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 border-t border-primary/5 mt-auto">
                <div className="w-full pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Price to join</span>
                        <span className="text-lg font-bold text-primary">Free / TBA</span>
                    </div>
                    <Button
                        disabled={!canView}
                        asChild={canView}
                        size="sm"
                        className={`rounded-full px-6 ${canView ? 'bg-primary hover:bg-primary/90' : 'bg-muted pointer-events-none'}`}
                    >
                        {canView ? (
                            <Link href={`/events/${event.id}`}>
                                Details <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                        ) : (
                            'Locked'
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
