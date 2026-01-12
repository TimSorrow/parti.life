'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MapPin, Star, Users, Pencil, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Database } from '@/types/database'
import EditVenueDialog from '@/components/admin/EditVenueDialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

type Venue = Database['public']['Tables']['venues']['Row']
type Event = Database['public']['Tables']['events']['Row'] & {
    categories?: { name: string; icon_name: string } | null
}

interface VenueDetailClientProps {
    venue: Venue
    events: Event[]
    isAdmin: boolean
}

export default function VenueDetailClient({ venue, events, isAdmin }: VenueDetailClientProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const categoryColors = {
        clubs: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        cafes: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        restaurants: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Hero Section */}
            <div className="w-full relative overflow-hidden">
                <div
                    className="relative flex min-h-[450px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 lg:p-12"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.3) 0%, rgba(5, 5, 5, 0.95) 100%), url("${venue.image_url || '/images/venue-hero.png'}")`,
                    }}
                >
                    {/* Back Button */}
                    <Link
                        href="/venues"
                        className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">All Venues</span>
                    </Link>

                    {/* Admin Edit Button */}
                    {isAdmin && (
                        <Button
                            onClick={() => setEditDialogOpen(true)}
                            className="absolute top-8 right-8 gap-2 bg-primary hover:bg-primary/90"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit Venue
                        </Button>
                    )}

                    <div className="flex flex-col gap-4 text-center z-10 max-w-3xl mt-8">
                        {/* Status Badge */}
                        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit mx-auto">
                            <span className={`w-2 h-2 rounded-full ${venue.is_open ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                            <span className="text-xs font-semibold text-white uppercase tracking-wider">
                                {venue.is_open ? 'Open Now' : 'Closed'}
                            </span>
                        </div>

                        <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] drop-shadow-xl">
                            {venue.name}
                        </h1>

                        <div className="flex items-center justify-center gap-4 text-gray-300">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${categoryColors[venue.category]}`}>
                                {venue.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {venue.location}
                            </span>
                            {venue.capacity && (
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {venue.capacity} capacity
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-yellow-500">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="text-xl font-bold">{venue.rating}</span>
                            <span className="text-gray-400 text-sm">rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="w-full max-w-[1200px] mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <section className="p-6 bg-[#0F0F11] rounded-3xl border border-white/5">
                            <h2 className="text-white text-2xl font-bold mb-4">About</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {venue.description || 'No description available.'}
                            </p>
                        </section>

                        {/* Upcoming Events */}
                        {events.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-white text-2xl font-bold">Upcoming Events</h2>
                                    <Link href="/events" className="text-primary text-sm font-bold hover:underline">
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {events.map((event) => (
                                        <Link
                                            key={event.id}
                                            href={`/events/${event.id}`}
                                            className="group flex gap-4 p-4 rounded-2xl bg-[#0F0F11] border border-white/5 hover:border-primary/50 transition-all"
                                        >
                                            <div className="w-20 h-20 rounded-xl bg-[#18181B] flex flex-col items-center justify-center shrink-0">
                                                <span className="text-xs text-gray-400 uppercase">
                                                    {format(new Date(event.date_time), 'MMM')}
                                                </span>
                                                <span className="text-2xl font-bold text-white">
                                                    {format(new Date(event.date_time), 'd')}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm truncate">
                                                    {event.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {format(new Date(event.date_time), 'h:mm a')}
                                                    </span>
                                                    {event.categories && (
                                                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">
                                                            {event.categories.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info Card */}
                        <div className="p-6 bg-[#0F0F11] rounded-3xl border border-white/5">
                            <h3 className="text-white text-lg font-bold mb-4">Venue Details</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <span className="text-gray-400">Category</span>
                                    <span className="text-white font-medium capitalize">{venue.category}</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <span className="text-gray-400">Location</span>
                                    <span className="text-white font-medium">{venue.location}</span>
                                </div>
                                {venue.capacity && (
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <span className="text-gray-400">Capacity</span>
                                        <span className="text-white font-medium">{venue.capacity} people</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <span className="text-gray-400">Rating</span>
                                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-current" />
                                        {venue.rating}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Status</span>
                                    <span className={`flex items-center gap-1.5 ${venue.is_open ? 'text-green-400' : 'text-gray-400'}`}>
                                        <span className={`w-2 h-2 rounded-full ${venue.is_open ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                                        {venue.is_open ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12">
                                Follow Venue
                            </Button>
                            <Button variant="outline" className="w-full rounded-full border-white/10 text-white hover:bg-white/5 font-bold h-12">
                                Share
                            </Button>
                        </div>

                        {/* Admin Info */}
                        {isAdmin && (
                            <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl">
                                <p className="text-primary text-sm font-medium">
                                    👑 Admin: You can edit this venue using the button in the header.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Dialog */}
            <EditVenueDialog
                venue={venue}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </div>
    )
}
