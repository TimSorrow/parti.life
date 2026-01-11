'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { updateEvent } from '@/app/agent/actions'
import { createClient } from '@/utils/supabase/client'
import { Calendar, Image as ImageIcon, MapPin, Type, Crown, Tags, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface EditEventDialogProps {
    event: {
        id: string
        title: string
        description: string | null
        date_time: string
        location_name: string
        image_url: string | null
        category_id: string | null
        min_tier_required: 'basic' | 'vip'
    }
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditEventDialog({ event, open, onOpenChange }: EditEventDialogProps) {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(event.category_id || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from('categories').select('id, name').order('name')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [supabase])

    // Format date for datetime-local input
    const formattedDate = new Date(event.date_time).toISOString().slice(0, 16)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        formData.set('category_id', selectedCategoryId)

        const result = await updateEvent(event.id, formData)

        setIsSubmitting(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Event updated successfully!')
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-[#0F0F11] border-primary/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">Edit Event</DialogTitle>
                    <DialogDescription>
                        Make changes to your event. After saving, it will be re-submitted for moderation.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-primary" /> Event Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={event.title}
                                placeholder="E.g. Neon Beach Rave"
                                required
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_time" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" /> Date and Time
                            </Label>
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
                            <Label htmlFor="location_name" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" /> Location Name
                            </Label>
                            <Input
                                id="location_name"
                                name="location_name"
                                defaultValue={event.location_name}
                                placeholder="E.g. Playa de las Americas"
                                required
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="flex items-center gap-2">
                                <Tags className="h-4 w-4 text-primary" /> Category
                            </Label>
                            <Select
                                value={selectedCategoryId}
                                onValueChange={setSelectedCategoryId}
                            >
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="min_tier_required" className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-primary" /> Minimum Tier Required
                            </Label>
                            <Select name="min_tier_required" defaultValue={event.min_tier_required}>
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Public (All Users)</SelectItem>
                                    <SelectItem value="vip">VIP Only (Locked)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url" className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-primary" /> Image URL
                            </Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                defaultValue={event.image_url || ''}
                                placeholder="https://images.unsplash.com/..."
                                className="bg-background/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Event Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={event.description || ''}
                            placeholder="Tell us more about the event, the vibe, and what to expect..."
                            required
                            rows={4}
                            className="bg-background/50 resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
