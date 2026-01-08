'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createEvent } from '@/app/agent/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar, Image as ImageIcon, MapPin, Type, Crown, Tags } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

import { DiscoveredEvent } from '@/app/agent/discovery-actions'

type Category = Database['public']['Tables']['categories']['Row']

interface EventFormProps {
    initialData?: Partial<DiscoveredEvent> | null
}

export default function EventForm({ initialData }: EventFormProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const supabase = createClient()

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from('categories').select('*').order('name')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [supabase])

    // Format date for datetime-local input
    const formattedDate = initialData?.date_time
        ? new Date(initialData.date_time).toISOString().slice(0, 16)
        : ''

    return (
        <Card className="border-primary/20 bg-card/30 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Submit New Event</CardTitle>
                <CardDescription>
                    Fill in the details below. Your event will be reviewed by an admin before going live.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={createEvent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-primary" /> Event Title
                            </Label>
                            <Input id="title" name="title" defaultValue={initialData?.title} placeholder="E.g. Neon Beach Rave" required className="bg-background/50" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_time" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" /> Date and Time
                            </Label>
                            <Input id="date_time" name="date_time" type="datetime-local" defaultValue={formattedDate} required className="bg-background/50" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location_name" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" /> Location Name
                            </Label>
                            <Input id="location_name" name="location_name" defaultValue={initialData?.location_name} placeholder="E.g. Playa de las Americas" required className="bg-background/50" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="flex items-center gap-2">
                                <Tags className="h-4 w-4 text-primary" /> Category
                            </Label>
                            <Select name="category_id">
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
                            <Select name="min_tier_required" defaultValue="basic">
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
                            <Input id="image_url" name="image_url" defaultValue={initialData?.image_url || ''} placeholder="https://images.unsplash.com/..." className="bg-background/50" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Event Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={initialData?.description}
                            placeholder="Tell us more about the event, the vibe, and what to expect..."
                            required
                            rows={5}
                            className="bg-background/50 resize-none"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                        Submit for Moderation
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
