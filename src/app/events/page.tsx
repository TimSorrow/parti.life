import { createClient } from '@/utils/supabase/server'
import EventCard from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Filter, CalendarSearch, Grid, Map, Megaphone, Plus } from 'lucide-react'
import Link from 'next/link'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default async function EventsPage() {
    const supabase = await createClient()

    // Get current user profile for visibility logic
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profileData } = user
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null }
    const profile = profileData as any

    // Fetch categories for the filter bar
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    // Fetch approved events with categories
    const { data: eventsData } = await supabase
        .from('events')
        .select('*, categories(*)')
        .eq('status', 'approved')
        .gte('date_time', new Date().toISOString())
        .order('date_time', { ascending: true })

    const events = eventsData as any[] | null

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white pb-24 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-4">
                        <CalendarSearch className="h-3 w-3" /> Discover Nightlife
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white uppercase italic leading-none mb-6">
                        Upcoming <span className="text-primary tracking-normal">Events</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                        Find the best parties, beach clubs, and festivals happening in Tenerife.
                    </p>
                </div>

                {/* Filter & Sort Bar */}
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest bg-white text-black border-transparent hover:bg-gray-200">
                            All Events
                        </Button>
                        {categories?.map((cat: any) => (
                            <Button key={cat.id} variant="outline" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all">
                                {cat.name}
                            </Button>
                        ))}
                        <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/5 h-10 w-10 shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Sort by:
                            <Select defaultValue="date">
                                <SelectTrigger className="w-[120px] bg-transparent border-none text-white focus:ring-0 p-0 h-auto font-black uppercase text-xs">
                                    <SelectValue placeholder="Date" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0F0F11] border-white/10 text-white">
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="popular">Popularity</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <Button variant="ghost" size="icon" className="h-8 w-12 rounded-lg bg-white/10 text-white">
                                <Grid className="h-4 w-4" />
                                <span className="sr-only">Grid View</span>
                                <span className="text-[8px] font-black ml-1">GRID</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-12 rounded-lg text-gray-500 hover:text-white">
                                <Map className="h-4 w-4" />
                                <span className="sr-only">Map View</span>
                                <span className="text-[8px] font-black ml-1">MAP</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                {events && events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Featured Slots and Regular Events */}
                        {events.map((event, index) => {
                            // Insert the "Promote Your Event" card at a specific position (e.g., after 7 events)
                            if (index === 7) {
                                return (
                                    <div key="promote-card" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-purple p-8 flex flex-col items-center justify-center text-center group">
                                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Megaphone className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-4">
                                            Promote Your <br /> Event
                                        </h3>
                                        <p className="text-white/80 text-sm mb-8 leading-relaxed">
                                            Reach thousands of party-goers in Tenerife. Get featured on our homepage and top lists.
                                        </p>
                                        <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-bold py-6 group-hover:shadow-xl transition-all">
                                            Learn More
                                        </Button>
                                    </div>
                                )
                            }
                            return (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    userProfile={profile}
                                    index={index}
                                />
                            )
                        })}

                        {/* If events are few, still show promote card at the end */}
                        {events.length < 7 && (
                            <div key="promote-card" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-purple p-8 flex flex-col items-center justify-center text-center group">
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Megaphone className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-4">
                                    Promote Your <br /> Event
                                </h3>
                                <p className="text-white/80 text-sm mb-8 leading-relaxed">
                                    Reach thousands of party-goers in Tenerife. Get featured on our homepage and top lists.
                                </p>
                                <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-bold py-6 group-hover:shadow-xl transition-all">
                                    Learn More
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white/2 rounded-[3rem] border-2 border-dashed border-white/5">
                        <CalendarSearch className="h-16 w-16 text-gray-800 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2 uppercase italic tracking-tighter">No events found</h3>
                        <p className="text-gray-500 text-lg">Check back later for new updates.</p>
                    </div>
                )}

                {/* Load More Section */}
                <div className="mt-20 text-center">
                    <Button variant="outline" size="lg" className="rounded-2xl px-12 py-8 bg-white/2 border-white/10 hover:bg-white/5 text-sm font-bold uppercase tracking-widest group transition-all">
                        Load More Events <Plus className="ml-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
