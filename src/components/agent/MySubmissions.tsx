'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin, CheckCircle2, XCircle, Timer, Tags, Pencil } from 'lucide-react'
import EditEventDialog from './EditEventDialog'

interface Event {
    id: string
    title: string
    description: string | null
    date_time: string
    location_name: string
    image_url: string | null
    category_id: string | null
    min_tier_required: 'basic' | 'vip'
    status: 'pending' | 'approved' | 'rejected'
    categories?: {
        name: string
    } | null
}

interface MySubmissionsProps {
    events: Event[] | null
}

export default function MySubmissions({ events }: MySubmissionsProps) {
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500/20 text-green-500 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>
            case 'rejected':
                return <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/20"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
            default:
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20"><Timer className="h-3 w-3 mr-1" /> Pending</Badge>
        }
    }

    return (
        <>
            <Card className="border-primary/10 bg-card/20 backdrop-blur-sm h-full">
                <CardHeader>
                    <CardTitle>My Submissions</CardTitle>
                    <CardDescription>Your event history</CardDescription>
                </CardHeader>
                <CardContent>
                    {events && events.length > 0 ? (
                        <div className="space-y-3">
                            {events.slice(0, 10).map((event) => (
                                <div key={event.id} className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {event.location_name}
                                                    </p>
                                                    {event.categories && (
                                                        <p className="text-[10px] text-primary/70 flex items-center gap-1 font-medium bg-primary/5 px-1.5 py-0.5 rounded">
                                                            <Tags className="h-2.5 w-2.5" /> {event.categories.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary"
                                                onClick={() => setEditingEvent(event)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(event.date_time).toLocaleDateString()}
                                            </span>
                                            {getStatusBadge(event.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {events.length > 10 && (
                                <p className="text-xs text-center text-muted-foreground italic pt-2">
                                    +{events.length - 10} more events
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-primary/5 rounded-xl border border-dashed border-primary/20">
                            <p className="text-xs text-muted-foreground italic">No events yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {editingEvent && (
                <EditEventDialog
                    event={editingEvent}
                    open={!!editingEvent}
                    onOpenChange={(open) => !open && setEditingEvent(null)}
                />
            )}
        </>
    )
}
