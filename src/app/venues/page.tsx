'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MapPin, Star, Users, Coffee, Music, UtensilsCrossed } from 'lucide-react'

// Mock data - in production this would come from Supabase
const venues = [
    {
        id: '1',
        name: 'Papagayo Beach Club',
        category: 'clubs',
        description: 'The ultimate beachfront nightlife experience',
        image: '/images/venue-hero.png',
        location: 'Playa de las Américas',
        rating: 4.8,
        capacity: 2000,
        isOpen: true,
    },
    {
        id: '2',
        name: 'Monkey Beach Club',
        category: 'clubs',
        description: 'Sunset sessions and electronic beats',
        image: '/images/vibe-beach.png',
        location: 'Costa Adeje',
        rating: 4.6,
        capacity: 1500,
        isOpen: true,
    },
    {
        id: '3',
        name: 'Café del Mar',
        category: 'cafes',
        description: 'Iconic sunset views with chill vibes',
        image: '/images/vibe-cafe.png',
        location: 'Los Cristianos',
        rating: 4.7,
        capacity: 300,
        isOpen: false,
    },
    {
        id: '4',
        name: 'The Coffee House',
        category: 'cafes',
        description: 'Artisan coffee and cozy atmosphere',
        image: '/images/vibe-cafe.png',
        location: 'Santa Cruz',
        rating: 4.5,
        capacity: 80,
        isOpen: true,
    },
    {
        id: '5',
        name: 'El Rincón',
        category: 'restaurants',
        description: 'Traditional Canarian cuisine with a modern twist',
        image: '/images/vibe-restaurant.png',
        location: 'La Laguna',
        rating: 4.9,
        capacity: 120,
        isOpen: true,
    },
    {
        id: '6',
        name: 'Skyline Rooftop',
        category: 'restaurants',
        description: 'Fine dining with panoramic ocean views',
        image: '/images/vibe-restaurant.png',
        location: 'Puerto de la Cruz',
        rating: 4.8,
        capacity: 200,
        isOpen: true,
    },
    {
        id: '7',
        name: 'Tropic Club',
        category: 'clubs',
        description: 'Latin rhythms and tropical cocktails',
        image: '/images/vibe-techno.png',
        location: 'Playa de las Américas',
        rating: 4.4,
        capacity: 800,
        isOpen: false,
    },
    {
        id: '8',
        name: 'Sunrise Café',
        category: 'cafes',
        description: 'Beachfront breakfast and brunch spot',
        image: '/images/vibe-beach.png',
        location: 'El Médano',
        rating: 4.6,
        capacity: 60,
        isOpen: true,
    },
]

const categories = [
    { id: 'all', name: 'All Venues', icon: MapPin },
    { id: 'clubs', name: 'Clubs', icon: Music },
    { id: 'cafes', name: 'Cafes', icon: Coffee },
    { id: 'restaurants', name: 'Restaurants', icon: UtensilsCrossed },
]

export default function VenuesPage() {
    const [activeCategory, setActiveCategory] = useState('all')

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
                        <Link
                            key={venue.id}
                            href={`/venues/${venue.id}`}
                            className="group relative bg-[#0F0F11] rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent"></div>

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-wider ${venue.isOpen
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${venue.isOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                                        {venue.isOpen ? 'Open' : 'Closed'}
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
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{venue.capacity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
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
        </div>
    )
}
