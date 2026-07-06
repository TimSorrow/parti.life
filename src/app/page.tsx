import { createClient } from '@/utils/supabase/server'
import Hero from '@/components/home/Hero'
import EventCard from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter, CalendarSearch, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-white">
      <Hero />

      {/* Upcoming Events Section */}
      <section id="events" className="max-w-[1440px] mx-auto px-8 py-32 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="transform -rotate-1">
            <h2 className="font-headline text-6xl md:text-8xl font-black italic uppercase leading-none mb-4 text-white">
              UPCOMING <span className="text-primary">EVENTS</span>
            </h2>
            <p className="text-secondary font-black italic text-xl uppercase tracking-widest mt-4">
              Find the hottest parties, beach clubs and island experiences in Tenerife.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-white/5 border border-white/5 p-1 rounded-none h-auto">
                <TabsTrigger value="all" className="rounded-none px-6 py-3 text-xs font-headline font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">All</TabsTrigger>
                <TabsTrigger value="today" className="rounded-none px-6 py-3 text-xs font-headline font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">Today</TabsTrigger>
                <TabsTrigger value="weekend" className="rounded-none px-6 py-3 text-xs font-headline font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all italic">Weekend</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" className="rounded-none border-white hover:bg-primary hover:text-white hover:border-primary h-12 w-12 shrink-0 transition-colors">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                userProfile={profile}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface border-4 border-dashed border-white/10 max-w-4xl mx-auto transform rotate-1">
            <CalendarSearch className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-headline font-black italic text-white uppercase mb-3">No events found</h3>
            <p className="text-white/60 font-headline font-black italic uppercase text-sm">Check back later for new targets.</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link href="/events" className="persona-btn text-xl group inline-flex items-center gap-2 select-none">
            VIEW ALL EVENTS <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Explore by Vibe Section */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <div className="transform -rotate-1">
            <h2 className="font-headline text-6xl md:text-8xl font-black italic uppercase leading-none mb-4 text-white">
              <span className="text-primary">EXPLORE</span> BY<br/>
              <span className="bg-white text-black px-4">VIBE</span>
            </h2>
            <p className="text-secondary font-black italic text-xl uppercase tracking-widest mt-4">Find your rhythm in the island's best spots</p>
          </div>
          <Link href="/events" className="persona-btn text-xl group select-none flex items-center gap-2">
            VIEW ALL <span className="material-symbols-outlined inline-block group-hover:translate-x-2 transition-transform">trending_flat</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Nightlife */}
          <Link href="/events?q=Nightlife" className="vibe-card relative h-[500px] overflow-hidden cursor-pointer group block">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnu44meaK8PIcN6MA_BGSn9PlGTv1q_MLIjtU2nYn3L247Xv7ICH2zXJSrUQJYZHfzr1_MywSWB42jIq_hHBm5CrYmXVrPf-4k4hfaCmCV9CHPYBkWaFtR5ul7D8vr6-Th3X4qJQlTwseYdRb2RhT5IPzftQ7_p2Vcs8_vYF9vahPoftLmX0WSJ9eztWAUEHk-v5bx5x4XmMNLZEsJMXIarlVtRjiA4kSxFNYKf0Luv4se3534Z274Y0orkDfjrtyraBhbQB6dIbw" alt="Nightlife" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-black/40 to-transparent mix-blend-multiply opacity-60"></div>
            <div className="absolute bottom-10 left-8 right-8 z-10">
              <h3 className="font-headline text-5xl font-black italic uppercase leading-none text-white drop-shadow-lg">Nightlife</h3>
              <div className="speech-bubble mt-4 text-xs font-label">Elite Clubs & Lounges</div>
            </div>
          </Link>

          {/* Festivals */}
          <Link href="/events?q=Festivals" className="vibe-card relative h-[500px] overflow-hidden cursor-pointer group md:translate-y-16 block">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYQXB9pLHJGnMxFj9YAh4BTFuSscOVr14UG9MxB05UonGsNCaj5eOQaG2rwemDbwVgVAZzjmGTDYucbUQpDKbsjPpY63lqtH3i4qNWppj2_RErzGP45bLTkM3Kot_YWfVmK5arR6SVhWMWdVM9BNU9cz68yFvzc8eY83H_oJHj5JCwdF-A0w60JvNlscJ_QAxU4rhudTjnyZ_4BhC-T1Q8S28_7oRRxK4G2M2KQ8zG-RkxY7vraN5qMaHbdrNEUcfbIwtbo0QIpf0" alt="Festivals" />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-black/40 to-transparent mix-blend-multiply opacity-60"></div>
            <div className="absolute bottom-10 left-8 right-8 z-10">
              <h3 className="font-headline text-5xl font-black italic uppercase leading-none text-white drop-shadow-lg">Festivals</h3>
              <div className="speech-bubble mt-4 text-xs font-label">Large Scale Raves</div>
            </div>
          </Link>

          {/* Beach */}
          <Link href="/events?q=Beach" className="vibe-card relative h-[500px] overflow-hidden cursor-pointer group block">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbw0Qn3xvAXEfuo5A1-Kc_DvJ4YySJE-iztXNQXL2DFHWnngYRWwpWeS--NTNT9XBed-4LJn1ql8zS_7HcGtNhkjqel0F-XgledzQu3XPIOE7kYFdTHCrYRXNt2-ONU8qfm7iN_E3Y3_CWPUuU4PwpbgZxvPtTIUexm65ABR9X077EYqHMJiJ0Qs_kK36OrGQU7FZaeNYsSV8URwmTRSjvIWENoo7RXCCOuz-kwKA7jAAuxzWZXRRTusoLKzsDxo19TCpWfYYeIvU" alt="Beach" />
            <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/80 via-black/40 to-transparent mix-blend-multiply opacity-60"></div>
            <div className="absolute bottom-10 left-8 right-8 z-10">
              <h3 className="font-headline text-5xl font-black italic uppercase leading-none text-white drop-shadow-lg">Beach</h3>
              <div className="speech-bubble mt-4 text-xs font-label">Day Parties & Sunsets</div>
            </div>
          </Link>

          {/* Live Music */}
          <Link href="/events?q=Live" className="vibe-card relative h-[500px] overflow-hidden cursor-pointer group md:translate-y-16 block">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf4Ty94-suhmjoUhOCLkoCopTmq31sIl-_dmRd9rX3eMj5wpH4uiOW-b-0uJui2pNcnSHmibUH0CgZ4HJfcgvLwuYgO5GUl9P7nM0PkexAwLdik0c8QGNUerJf3McDKtPoSCpnwCq1xeDtCYnDwZnygzoZ81Olu4NsloRQ2MfkA8iYQ5DUPxoFViP1ryOmGJq3jtSSlzZc2G-qfF2zhGU1FGUDQtbxn5vda15jFPquAa01aB3OM7-TTdwI-2REbzOzUKpODZmj0ng" alt="Live Music" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-black/40 to-transparent mix-blend-multiply opacity-60"></div>
            <div className="absolute bottom-10 left-8 right-8 z-10">
              <h3 className="font-headline text-5xl font-black italic uppercase leading-none text-white drop-shadow-lg">Live Music</h3>
              <div className="speech-bubble mt-4 text-xs font-label">Bands & Solo Acts</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-32 bg-surface relative overflow-hidden mt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-12 -mr-32"></div>
        <div className="max-w-[1440px] mx-auto px-8 mb-20 relative">
          <h2 className="font-headline text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
            DON'T <span className="knockout-text">MISS</span> OUT
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-1 w-24 bg-primary"></div>
            <p className="text-white/60 font-black italic uppercase text-lg font-headline">Hottest events trending this week</p>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-12 px-8 gap-12 scrollbar-hide">
          {events && events.length > 0 ? (
            events.slice(0, 4).map((event, index) => (
              <div key={event.id} className="flex-shrink-0 w-[450px]">
                <EventCard
                  event={event}
                  userProfile={profile}
                  index={index}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-white/50 font-headline font-black italic uppercase">
              No trending events listed
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-40 relative bg-black overflow-hidden mt-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20 transform -rotate-3 translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform rotate-2 -translate-y-20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
          <div className="mb-12">
            <span className="knockout-text text-3xl font-black italic mb-6 font-headline">WAKE UP, GET UP, GET OUT THERE</span>
            <h2 className="font-headline text-7xl md:text-[100px] font-black italic uppercase leading-[0.85] mt-6 transform -rotate-1 text-white">
              NEVER MISS<br/>
              <span className="text-primary italic">A PARTY.</span>
            </h2>
          </div>
          <p className="text-white/80 font-headline font-black italic text-xl mb-16 max-w-2xl mx-auto uppercase">
            Curated event recommendations and VIP access delivered directly to your inbox.
          </p>
          
          <form className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto transform -rotate-1">
            <input 
              className="flex-1 bg-white border-none px-8 py-6 text-black font-black italic text-xl focus:ring-4 focus:ring-primary outline-none transition-all placeholder-black/50 font-headline" 
              placeholder="ENTER YOUR EMAIL..." 
              type="email" 
              required
            />
            <button className="bg-primary text-white font-headline font-black italic text-2xl px-12 py-6 uppercase hover:bg-white hover:text-black transition-all border-l-4 border-black font-headline">
              SUBSCRIBE
            </button>
          </form>
          
          <p className="text-white/40 text-xs mt-12 font-black italic uppercase tracking-tighter font-label">
            By subscribing you agree to the Terms of Phantasy
          </p>
        </div>
      </section>
    </div>
  )
}
