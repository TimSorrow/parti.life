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
import { updateVenue } from '@/app/venues/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Database } from '@/types/database'

type Venue = Database['public']['Tables']['venues']['Row']

interface EditVenueDialogProps {
    venue: Venue
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditVenueDialog({ venue, open, onOpenChange }: EditVenueDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const venueData = {
            name: formData.get('name') as string,
            category: formData.get('category') as 'clubs' | 'cafes' | 'restaurants',
            description: formData.get('description') as string,
            image_url: formData.get('image_url') as string || null,
            location: formData.get('location') as string,
            rating: parseFloat(formData.get('rating') as string) || 0,
            capacity: parseInt(formData.get('capacity') as string) || null,
            is_open: formData.get('is_open') === 'on',
        }

        try {
            const result = await updateVenue(venue.id, venueData)
            if (result.error) {
                toast.error(`Failed to update venue: ${result.error}`)
            } else {
                toast.success('Venue updated successfully!')
                onOpenChange(false)
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred while updating the venue')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F0F11] border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Venue</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Make changes to the venue details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">Venue Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={venue.name}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-gray-300">Category</Label>
                            <Select name="category" defaultValue={venue.category}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0F0F11] border-white/10">
                                    <SelectItem value="clubs">Clubs</SelectItem>
                                    <SelectItem value="cafes">Cafes</SelectItem>
                                    <SelectItem value="restaurants">Restaurants</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-300">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            defaultValue={venue.location}
                            required
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating" className="text-gray-300">Rating (0-5)</Label>
                            <Input
                                id="rating"
                                name="rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                defaultValue={venue.rating}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity" className="text-gray-300">Capacity</Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="0"
                                defaultValue={venue.capacity ?? ''}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Status</Label>
                            <div className="flex items-center h-10 px-3 bg-white/5 border border-white/10 rounded-md">
                                <input
                                    type="checkbox"
                                    id="is_open"
                                    name="is_open"
                                    defaultChecked={venue.is_open}
                                    className="mr-2 h-4 w-4 rounded border-white/20 bg-white/5"
                                />
                                <Label htmlFor="is_open" className="text-sm text-gray-300 cursor-pointer">
                                    Open Now
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url" className="text-gray-300">Image URL</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            defaultValue={venue.image_url ?? ''}
                            placeholder="/images/venue.png or https://..."
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={venue.description ?? ''}
                            rows={4}
                            className="bg-white/5 border-white/10 text-white resize-none"
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="border-white/10 text-gray-300 hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
