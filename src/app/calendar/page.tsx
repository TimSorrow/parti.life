'use client'

import { useEffect, useState, useCallback } from 'react'
import { addMonths, format, parseISO, startOfDay, endOfDay, addDays, isSameDay, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CalendarDays, Filter, Sparkles, Heart, MapPin, ChevronLeft, ChevronRight, Bookmark, ArrowRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import { getEventDatesForMonth, getFilteredEvents, getCategories } from './actions'
import type { DateRange } from 'react-day-picker'
import { Database } from '@/types/database'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Category = Database['public']['Tables']['categories']['Row']
type Event = Database['public']['Tables']['events']['Row'] & {
    categories?: {
        name: string
        icon_name: string
    } | null
}

const IconLoader = ({ iconName, ...props }: { iconName: string } & React.ComponentProps<typeof Icons.HelpCircle>) => {
    const Icon = (Icons as any)[iconName] || Icons.HelpCircle
    return <Icon {...props} />
}

// Custom Calendar Component matching the design
function CustomCalendar({
    selectedRange,
    onRangeChange,
    eventDates,
    currentMonth,
    onMonthChange
}: {
    selectedRange: DateRange | undefined
    onRangeChange: (range: DateRange | undefined) => void
    eventDates: string[]
    currentMonth: Date
    onMonthChange: (date: Date) => void
}) {
    const [rangeStart, setRangeStart] = useState<Date | null>(selectedRange?.from || null)

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = getDay(monthStart)
    // Adjust for Monday start (0 = Monday in our grid)
    const blankDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

    const handleDayClick = (day: Date) => {
        if (!rangeStart) {
            setRangeStart(day)
            onRangeChange({ from: day, to: undefined })
        } else {
            if (day < rangeStart) {
                onRangeChange({ from: day, to: rangeStart })
            } else {
                onRangeChange({ from: rangeStart, to: day })
            }
            setRangeStart(null)
        }
    }

    const isInRange = (day: Date) => {
        if (!selectedRange?.from || !selectedRange?.to) return false
        return isWithinInterval(day, { start: selectedRange.from, end: selectedRange.to })
    }

    const isRangeStart = (day: Date) => selectedRange?.from && isSameDay(day, selectedRange.from)
    const isRangeEnd = (day: Date) => selectedRange?.to && isSameDay(day, selectedRange.to)
    const hasEvent = (day: Date) => eventDates.some(d => isSameDay(parseISO(d), day))

    return (
        <div className="bg-[#0F0F11] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h4>
                <div className="flex gap-2">
                    <button
                        onClick={() => onMonthChange(addMonths(currentMonth, -1))}
                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onMonthChange(addMonths(currentMonth, 1))}
                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-4 text-center">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                    <span key={day} className="text-[10px] text-gray-500 font-bold uppercase">{day}</span>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-sm">
                {/* Blank days from previous month */}
                {Array.from({ length: blankDays }).map((_, i) => {
                    const prevDay = subDays(monthStart, blankDays - i)
                    return (
                        <div key={`blank-${i}`} className="aspect-square flex items-center justify-center text-gray-700">
                            {format(prevDay, 'd')}
                        </div>
                    )
                })}

                {/* Actual days */}
                {calendarDays.map(day => {
                    const inRange = isInRange(day)
                    const isStart = isRangeStart(day)
                    const isEnd = isRangeEnd(day)
                    const dayHasEvent = hasEvent(day)

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => handleDayClick(day)}
                            className={`
                                relative aspect-square flex flex-col items-center justify-center transition-colors
                                ${isStart ? 'rounded-l-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 z-10' : ''}
                                ${isEnd ? 'rounded-r-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 z-10' : ''}
                                ${inRange && !isStart && !isEnd ? 'bg-primary/20 text-white border-y border-primary/20' : ''}
                                ${!inRange && !isStart && !isEnd ? 'hover:bg-white/5 text-gray-400' : ''}
                            `}
                        >
                            {format(day, 'd')}
                            {dayHasEvent && (
                                <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${inRange ? 'bg-white opacity-70' : 'bg-primary'}`} />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Event
                </div>
                <button
                    onClick={() => {
                        onRangeChange(undefined)
                        setRangeStart(null)
                    }}
                    className="text-white hover:text-primary transition-colors"
                >
                    Clear dates
                </button>
            </div>
        </div>
    )
}

// New Event Card matching the design
function CalendarEventCard({ event, index }: { event: Event; index: number }) {
    const eventDate = new Date(event.date_time)
    const formattedDate = format(eventDate, "MMM d")
    const formattedTime = format(eventDate, "h:mma")

    // Alternate accent colors
    const accentColors = ['primary', 'purple', 'amber-400']
    const accentColor = accentColors[index % accentColors.length]

    return (
        <article className={`group relative bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/5 hover:border-${accentColor}/50 transition-all duration-300 shadow-lg hover:shadow-${accentColor}/10`}>
            <div className="aspect-[4/5] relative overflow-hidden">
                <img
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                {/* Category Badge */}
                {event.categories && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2 py-1 bg-${accentColor} text-[10px] font-bold uppercase tracking-wider text-white rounded shadow-lg shadow-${accentColor}/40`}>
                            {event.categories.name}
                        </span>
                    </div>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-5 w-full">
                    <Link href={`/events/${event.id}`}>
                        <h3 className={`text-lg font-bold text-white mb-1 group-hover:text-${accentColor} transition-colors`}>
                            {event.title}
                        </h3>
                    </Link>
                    <p className="text-gray-400 text-xs mb-3 flex items-center">
                        <MapPin className={`h-3 w-3 mr-1 text-${accentColor}`} />
                        {event.location_name}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-white font-medium text-sm">
                            {(event as any).price ? `€${(event as any).price}` : 'Free Entry'}
                        </span>
                        <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded">
                            {formattedDate} • {formattedTime}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function CalendarPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7)
    })
    const [events, setEvents] = useState<Event[]>([])
    const [eventDates, setEventDates] = useState<string[]>([])
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false)

    // Fetch categories on mount
    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    // Fetch event dates for the current month (for calendar dots)
    useEffect(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        getEventDatesForMonth(year, month).then(setEventDates)
    }, [currentMonth])

    // Fetch filtered events when date range or categories change
    const fetchEvents = useCallback(async () => {
        if (!dateRange?.from || !dateRange?.to) return

        setIsLoading(true)
        const startDate = startOfDay(dateRange.from).toISOString()
        const endDate = endOfDay(dateRange.to).toISOString()
        const data = await getFilteredEvents(startDate, endDate, selectedCategories)
        setEvents(data)
        setIsLoading(false)
    }, [dateRange, selectedCategories])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    return (
        <div className="container px-4 pt-24 pb-8 mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Column - Filters */}
                <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-10">
                    {/* Saved Presets */}
                    <div className="p-5 bg-[#0F0F11] border border-white/10 rounded-2xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-lg font-display font-bold text-white flex items-center">
                                <Bookmark className="h-5 w-5 mr-2 text-purple-500 fill-purple-500" />
                                Saved Presets
                            </h3>
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">Edit</button>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all group/item text-left">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-3 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
                                    <span className="text-sm font-medium text-gray-200 group-hover/item:text-white">Techno Weekends</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-600 group-hover/item:text-purple-500 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all group/item text-left">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-primary mr-3 shadow-[0_0_8px_rgba(255,77,0,0.6)]" />
                                    <span className="text-sm font-medium text-gray-200 group-hover/item:text-white">Boat Parties Adeje</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-600 group-hover/item:text-primary transition-colors" />
                            </button>
                        </div>
                        <button className="mt-4 w-full py-2.5 px-4 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                            <Heart className="h-4 w-4" />
                            Save Current Filters
                        </button>
                    </div>

                    {/* Browse by Category */}
                    <div>
                        <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-primary" />
                            Browse by Category
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => {
                                const isSelected = selectedCategories.includes(category.id)
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => toggleCategory(category.id)}
                                        className={`
                                            px-4 py-2 rounded-full text-xs font-bold border transition-all
                                            ${isSelected
                                                ? 'border-primary bg-primary text-white shadow-[0_0_15px_rgba(255,77,0,0.4)]'
                                                : 'border-white/10 bg-[#0F0F11] hover:bg-white/5 text-gray-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        {category.name}
                                    </button>
                                )
                            })}
                            {categories.length === 0 && (
                                <p className="text-xs text-gray-500 italic">Loading categories...</p>
                            )}
                        </div>
                    </div>

                    {/* Select Dates */}
                    <div>
                        <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center">
                            <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                            Select Dates
                        </h3>
                        <CustomCalendar
                            selectedRange={dateRange}
                            onRangeChange={setDateRange}
                            eventDates={eventDates}
                            currentMonth={currentMonth}
                            onMonthChange={setCurrentMonth}
                        />
                    </div>
                </aside>

                {/* Right Column - Results */}
                <section className="w-full lg:w-2/3 xl:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-8 pb-6 border-b border-white/10">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                                {dateRange?.from && dateRange?.to ? (
                                    <>Events from {format(dateRange.from, 'MMM d')} to {format(dateRange.to, 'MMM d')}</>
                                ) : (
                                    'Select a date range'
                                )}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {isLoading
                                    ? 'Loading events...'
                                    : `Showing ${events.length} parties in Tenerife matching your filters.`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mr-2">Sort by:</span>
                            <button className="flex items-center gap-1 text-sm text-white font-medium hover:text-primary transition-colors">
                                Date <ChevronRight className="h-4 w-4 rotate-90" />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : events.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event, index) => (
                                    <CalendarEventCard key={event.id} event={event} index={index} />
                                ))}
                            </div>
                            {events.length >= 6 && (
                                <div className="mt-12 flex justify-center">
                                    <Button variant="outline" className="px-8 py-3 rounded-xl bg-[#0F0F11] border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                                        Load More Events
                                        <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-[#0F0F11] flex items-center justify-center mb-4">
                                <CalendarDays className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No parties found for these dates</h3>
                            <p className="text-gray-400 mb-6">Try adjusting your filters or selecting a different date range.</p>
                            <button
                                onClick={() => {
                                    setSelectedCategories([])
                                    setDateRange({ from: new Date(), to: addDays(new Date(), 14) })
                                }}
                                className="text-primary hover:text-white transition-colors font-medium"
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
