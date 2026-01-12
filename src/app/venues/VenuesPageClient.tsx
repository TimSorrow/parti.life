'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MapPin, Star, Users, Coffee, Music, UtensilsCrossed, Pencil } from 'lucide-react'
import { Database } from '@/types/database'
import EditVenueDialog from '@/components/admin/EditVenueDialog'
import { Button } from '@/components/ui/button'

type Venue = Database['public']['Tables']['venues']['Row']

const categoryConfig = {
    clubs: { name: 'Clubs', icon: Music },
    cafes: { name: 'Cafes', icon: Coffee },
    restaurants: { name: 'Restaurants', icon: UtensilsCrossed },
}

const categories = [
    { id: 'all', name: 'All Venues', icon: MapPin },
    { id: 'clubs', name: 'Clubs', icon: Music },
    { id: 'cafes', name: 'Cafes', icon: Coffee },
    { id: 'restaurants', name: 'Restaurants', icon: UtensilsCrossed },
]

interface VenuesPageClientProps {
    venues: Venue[]
    isAdmin: boolean
}

export default function VenuesPageClient({ venues, isAdmin }: VenuesPageClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null)

    const filteredVenues = activeCategory === 'all'
        ? venues
        : venues.filter(venue => venue.category === activeCategory)

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Hero Section */}
            <section className="relative py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-6 text-white uppercase italic">
                            Discover <span className="text-primary tracking-normal">Venues</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            Explore the best clubs, cafes, and restaurants in Tenerife. Find your perfect spot for any occasion.
                        </p>
                        {isAdmin && (
                            <p className="text-primary text-sm mt-4">
                                👑 Admin mode: Click edit buttons on venue cards to modify
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon
                        const isActive = activeCategory === category.id
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {category.name}
                            </button>
                        )
                    })}
                </div>
            </section>

            {/* Venues Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVenues.map((venue) => (
                        <div
                            key={venue.id}
                            className="group relative bg-[#0F0F11] rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
                        >
                            {/* Admin Edit Button */}
                            {isAdmin && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setEditingVenue(venue)
                                    }}
                                    className="absolute top-4 right-14 z-20 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:border-primary"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            )}

                            <Link href={`/venues/${venue.id}`}>
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={venue.image_url || '/images/venue-hero.png'}
                                        alt={venue.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent"></div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-wider ${venue.is_open
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${venue.is_open ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                                            {venue.is_open ? 'Open' : 'Closed'}
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/10">
                                            {venue.category}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {venue.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {venue.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>{venue.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                <span className="font-bold">{venue.rating}</span>
                                            </div>
                                            {venue.capacity && (
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <Users className="h-3.5 w-3.5" />
                                                    <span>{venue.capacity}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {filteredVenues.length === 0 && (
                    <div className="text-center py-20">
                        <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No venues found</h3>
                        <p className="text-gray-500">Try selecting a different category.</p>
                    </div>
                )}
            </section>

            {/* Edit Venue Dialog */}
            {editingVenue && (
                <EditVenueDialog
                    venue={editingVenue}
                    open={!!editingVenue}
                    onOpenChange={(open) => !open && setEditingVenue(null)}
                />
            )}
        </div>
    )
}
