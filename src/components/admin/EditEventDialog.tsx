'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { updateEvent } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Database } from '@/types/database'

type Event = Database['public']['Tables']['events']['Row']

interface EditEventDialogProps {
    event: Event
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditEventDialog({ event, open, onOpenChange }: EditEventDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Format date for datetime-local input
    const formattedDate = event.date_time
        ? new Date(event.date_time).toISOString().slice(0, 16)
        : ''

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const eventData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            date_time: formData.get('date_time') as string,
            location_name: formData.get('location_name') as string,
            image_url: formData.get('image_url') as string,
            min_tier_required: formData.get('min_tier_required') as 'basic' | 'vip',
        }

        try {
            const result = await updateEvent(event.id, eventData)
            if (result.error) {
                toast.error(`Failed to update event: ${result.error}`)
            } else {
                toast.success('Event updated successfully!')
                onOpenChange(false)
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred while updating the event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Make changes to the event details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={event.title}
                            required
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date_time">Date and Time</Label>
                        <Input
                            id="date_time"
                            name="date_time"
                            type="datetime-local"
                            defaultValue={formattedDate}
                            required
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location_name">Location Name</Label>
                        <Input
                            id="location_name"
                            name="location_name"
                            defaultValue={event.location_name}
                            required
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="min_tier_required">Minimum Tier Required</Label>
                        <Select name="min_tier_required" defaultValue={event.min_tier_required}>
                            <SelectTrigger className="bg-background/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Public (All Users)</SelectItem>
                                <SelectItem value="vip">VIP Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            defaultValue={event.image_url ?? ''}
                            placeholder="https://..."
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={event.description}
                            required
                            rows={5}
                            className="bg-background/50 resize-none"
                        />
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
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
