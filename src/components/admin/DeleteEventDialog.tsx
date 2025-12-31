'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { deleteEvent } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Database } from '@/types/database'

type Event = Database['public']['Tables']['events']['Row']

interface DeleteEventDialogProps {
    event: Event
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function DeleteEventDialog({ event, open, onOpenChange }: DeleteEventDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)

        try {
            const result = await deleteEvent(event.id)
            if (result.error) {
                toast.error(`Failed to delete event: ${result.error}`)
            } else {
                toast.success('Event deleted successfully!')
                onOpenChange(false)
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred while deleting the event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle>Delete Event</DialogTitle>
                    </div>
                    <DialogDescription className="pt-4">
                        Are you sure you want to delete this event? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-semibold text-sm mb-1">Event to delete:</h4>
                    <p className="text-sm text-muted-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.date_time).toLocaleDateString()} at {event.location_name}
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Delete Event
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
