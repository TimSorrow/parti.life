'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import DateStrip from '@/components/events/DateStrip'
import FilterChips from '@/components/events/FilterChips'
import AfishaEventCard from '@/components/events/AfishaEventCard'
import { Button } from '@/components/ui/button'
import { CalendarSearch, Megaphone, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { startOfDay, endOfDay, format } from 'date-fns'

interface Category {
    id: string
    name: string
    icon_name?: string
}

interface Event {
    id: string
    title: string
    description: string | null
    date_time: string
    location_name: string
    image_url: string | null
    min_tier_required: string
    status: string
    price?: number
    categories?: {
        name: string
        icon_name: string
    } | null
}

export default function EventsPageClient() {
    const [categories, setCategories] = useState<Category[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createClient()

    // Fetch categories on mount
    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])

    // Fetch events when filters change
    const fetchEvents = useCallback(async () => {
        setIsLoading(true)

        let query = supabase
            .from('events')
            .select('*, categories(*)')
            .eq('status', 'approved')
            .order('date_time', { ascending: true })

        // Date filter
        if (selectedDate) {
            const dayStart = startOfDay(selectedDate).toISOString()
            const dayEnd = endOfDay(selectedDate).toISOString()
            query = query.gte('date_time', dayStart).lte('date_time', dayEnd)
        } else {
            query = query.gte('date_time', new Date().toISOString())
        }

        // Category filter
        if (selectedCategory) {
            query = query.eq('category_id', selectedCategory)
        }

        const { data } = await query
        setEvents(data || [])
        setIsLoading(false)
    }, [selectedDate, selectedCategory])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    // Split events into featured (first 2) and regular
    const featuredEvents = events.slice(0, 2)
    const regularEvents = events.slice(2)

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-24">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                        Events in <span className="text-primary">Tenerife</span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Find the best parties, concerts, and experiences.
                    </p>
                </div>

                {/* Date Strip */}
                <div className="mb-6 -mx-4 sm:mx-0">
                    <DateStrip
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        daysToShow={14}
                    />
                </div>

                {/* Filter Chips */}
                <div className="-mx-4 sm:mx-0">
                    <FilterChips
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={setSelectedCategory}
                    />
                </div>

                {/* Active Filters Info */}
                {(selectedDate || selectedCategory) && (
                    <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
                        <span>
                            Showing events
                            {selectedDate && ` on ${format(selectedDate, 'MMMM d, yyyy')}`}
                            {selectedCategory && categories.find(c => c.id === selectedCategory) &&
                                ` in ${categories.find(c => c.id === selectedCategory)?.name}`
                            }
                        </span>
                        <button
                            onClick={() => {
                                setSelectedDate(null)
                                setSelectedCategory(null)
                            }}
                            className="text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Events Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                ) : events.length > 0 ? (
                    <>
                        {/* Featured Events Section */}
                        {!selectedDate && !selectedCategory && featuredEvents.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <span className="w-1 h-6 bg-primary rounded-full mr-3" />
                                    Featured Events
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredEvents.map((event) => (
                                        <AfishaEventCard
                                            key={event.id}
                                            event={event as any}
                                            variant="featured"
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All Events Grid */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <span className="w-1 h-6 bg-primary rounded-full mr-3" />
                                {selectedDate || selectedCategory ? 'Results' : 'All Events'}
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({(selectedDate || selectedCategory ? events : regularEvents).length} events)
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {(selectedDate || selectedCategory ? events : regularEvents).map((event, index) => (
                                    <React.Fragment key={event.id}>
                                        <AfishaEventCard
                                            event={event as any}
                                        />

                                        {/* Promotional card after 7 events */}
                                        {index === 6 && (
                                            <div
                                                className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/80 to-purple-600/80 p-6 flex flex-col items-center justify-center text-center"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                                    <Megaphone className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    Promote Your Event
                                                </h3>
                                                <p className="text-white/70 text-sm mb-4">
                                                    Reach thousands of party-goers in Tenerife.
                                                </p>
                                                <Button asChild className="w-full bg-white text-black hover:bg-gray-100 rounded-lg font-semibold">
                                                    <Link href="/agent">Get Started</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </section>

                        {/* Load More */}
                        {events.length >= 12 && (
                            <div className="mt-16 text-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-xl px-10 py-6 bg-white/5 border-white/10 hover:bg-white/10 text-sm font-semibold"
                                >
                                    Load More Events
                                    <Plus className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-32 bg-white/2 rounded-3xl border border-white/5">
                        <CalendarSearch className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                        <p className="text-gray-500 mb-6">
                            {selectedDate || selectedCategory
                                ? 'Try adjusting your filters.'
                                : 'Check back later for new updates.'
                            }
                        </p>
                        {(selectedDate || selectedCategory) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedDate(null)
                                    setSelectedCategory(null)
                                }}
                                className="rounded-lg border-white/10"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
