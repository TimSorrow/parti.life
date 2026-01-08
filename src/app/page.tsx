import { createClient } from '@/utils/supabase/server'
import Hero from '@/components/home/Hero'
import EventCard from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter, CalendarSearch, ArrowRight, TrendingUp, Music, Palmtree, Ghost } from 'lucide-react'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = await createClient()

  // Get current user profile for visibility logic
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profileData } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }
  const profile = profileData as any

  // Fetch approved events with categories
  const { data: eventsData } = await supabase
    .from('events')
    .select('*, categories(*)')
    .eq('status', 'approved')
    .gte('date_time', new Date().toISOString())
    .order('date_time', { ascending: true })
    .limit(8)
  const events = eventsData as any[] | null

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
      <Hero />

      {/* Upcoming Events Section */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter mb-4 text-white uppercase italic">
              Upcoming <span className="text-primary tracking-normal">Events</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Find the hottest parties, beach clubs and island experiences in Tenerife.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-white/5 border border-white/5 p-1 rounded-full h-auto">
                <TabsTrigger value="all" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">All</TabsTrigger>
                <TabsTrigger value="today" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Today</TabsTrigger>
                <TabsTrigger value="weekend" className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Weekend</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/5 h-12 w-12 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userProfile={profile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5">
            <CalendarSearch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-500">Check back later for new updates.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="rounded-full px-10 py-6 border-white/10 hover:bg-white/5 text-sm font-bold uppercase tracking-widest group transition-all">
            View All Events <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Explore by Vibe Section */}
      <section className="bg-white/2 py-24 mb-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter mb-4 text-white uppercase italic">
              Explore <span className="text-primary tracking-normal">by Vibe</span>
            </h2>
            <p className="text-gray-500 text-lg">Whatever you&apos;re feeling, we&apos;ve got it.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Beach Clubs', icon: Palmtree, color: 'from-blue-600/20 to-cyan-500/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr_zaxkI3PC8EGebMFTxSRvTozhV0UksO5fE6ILaink8PBJpVJw7WwKqmQs5lVdzAoZqCDtHUnsWb-xQJ4_QPqP7w1j4O5-JeYuGiccFcPxsktUWSnL1FQNrnXsJsEQ0iOavQJK3EPKf4sFwSKYWGcfSEDNPFMb-KMvH9wtwTsC6GTPtjC-r443zfEW7PNQz_RrHu9fZxWr8HGZH0xLHkdnmDXUBgCIZ3LmFbDa2xlG_R930hAdGAJIQWNvfilloWz0UQIQxkT7bA' },
              { name: 'Techno Raves', icon: Music, color: 'from-purple/20 to-primary/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRTe1C0owJhUg4KGciryFSLSOtW-p6S2EbxlFnEgvvAZjfLQvd-scAyRYzQtlocCg6q14afSZ6rQFEcfjPJvV3_yMRbRVOudBVRlDkc2ZN8L2RL6rbMpA-bzYhyM6nqCDrev0x09xypoIFRBQtHo8c0qjT-D37lMNyRt1H_lzelwi1ZqnG_gvvWv4jlfL9SMcfCY5EaB2fOlG6wPCRLS_2pfX4L8ZRslO5Qu23k3l1tqUfI3ZmzcuIvvOf3dDYcPcc88ld-t0oFoo' },
              { name: 'Secret Garden', icon: Ghost, color: 'from-green-600/20 to-emerald-500/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpWgm_txMARMVMW9_HUfpy-UWEzdQs4icOEOqjjpo4tWg-fjWx9PMu6QVtsVfvJgTxLQng3Yddb-CkGBchs8eWz6QfHQ-lsYvijNV9pSUQCPt2wsw3U89GmWE8y5dkgZKwEcF6iDxHeV3FEnD6fCUswks_XrHkMeh33ScF6M_55nracGaI_wlQVSQOsJShB9Iuqz4PA6Klos604DbMrebHHqx9O8t6X2B6CpmYLuI1kHrhWkviUSURczQ4f1MvoNV8QYKlnWO-nLw' },
              { name: 'Luxury VIP', icon: TrendingUp, color: 'from-amber-600/20 to-orange-500/20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRTe1C0owJhUg4KGciryFSLSOtW-p6S2EbxlFnEgvvAZjfLQvd-scAyRYzQtlocCg6q14afSZ6rQFEcfjPJvV3_yMRbRVOudBVRlDkc2ZN8L2RL6rbMpA-bzYhyM6nqCDrev0x09xypoIFRBQtHo8c0qjT-D37lMNyRt1H_lzelwi1ZqnG_gvvWv4jlfL9SMcfCY5EaB2fOlG6wPCRLS_2pfX4L8ZRslO5Qu23k3l1tqUfI3ZmzcuIvvOf3dDYcPcc88ld-t0oFoo' }
            ].map((vibe, i) => (
              <Link href={`/search?vibe=${vibe.name}`} key={i} className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5">
                <img src={vibe.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt={vibe.name} />
                <div className={`absolute inset-0 bg-gradient-to-t ${vibe.color} opacity-80`}></div>
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  <vibe.icon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-xl font-bold text-white tracking-tight">{vibe.name}</h3>
                  <div className="h-1 w-12 bg-primary mt-3 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp className="h-3 w-3" /> Popular Right Now
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter mb-6 text-white uppercase italic">
              Trending in <span className="text-primary tracking-normal">Tenerife</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              The events and locations everyone is talking about this week. Secure your spot before they sell out.
            </p>
            <Button className="bg-white text-black hover:bg-gray-200 px-10 py-6 rounded-full font-bold shadow-xl transition-all transform hover:scale-105">
              View Trending List
            </Button>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr_zaxkI3PC8EGebMFTxSRvTozhV0UksO5fE6ILaink8PBJpVJw7WwKqmQs5lVdzAoZqCDtHUnsWb-xQJ4_QPqP7w1j4O5-JeYuGiccFcPxsktUWSnL1FQNrnXsJsEQ0iOavQJK3EPKf4sFwSKYWGcfSEDNPFMb-KMvH9wtwTsC6GTPtjC-r443zfEW7PNQz_RrHu9fZxWr8HGZH0xLHkdnmDXUBgCIZ3LmFbDa2xlG_R930hAdGAJIQWNvfilloWz0UQIQxkT7bA" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Trending" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Sold Out Soon</span>
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Aug 15</span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Ocean View Pool Rave 2024</h4>
                  <p className="text-xs text-gray-400 mt-1">Costa Adeje • Luxury Venue</p>
                </div>
                <div className="pr-4 hidden sm:block">
                  <div className="text-primary font-black text-2xl italic tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">0{item}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA Section (Redesigned as Newsletter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-10">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#121212] via-[#1A1A1A] to-[#121212] border border-white/5 p-12 sm:p-20 text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 -z-0"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 -z-0"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tighter mb-6 text-white uppercase italic leading-none">
              Never Miss <span className="text-primary tracking-normal">a Beat</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Subscribe to our newsletter and get exclusive access to secret garden raves and early-bird tickets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                className="bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white focus:outline-none focus:border-primary flex-grow text-sm font-medium"
                placeholder="your@email.com"
                type="email"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-primary/20 transition-all text-sm uppercase tracking-widest h-auto">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
