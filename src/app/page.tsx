import { createClient } from '@/utils/supabase/server'
import Hero from '@/components/home/Hero'
import EventCard from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter, CalendarSearch } from 'lucide-react'

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
  const events = eventsData as any[] | null

  return (
    <div className="min-h-screen">
      <Hero />

      <section id="events" className="container px-4 py-16 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground">The hottest parties in Tenerife for the coming weeks.</p>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <Tabs defaultValue="all" className="w-[400px]">
              <TabsList className="bg-secondary/50 border border-primary/10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="weekend">This Weekend</TabsTrigger>
                <TabsTrigger value="vip" className="text-amber-500">VIP Only</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" className="shrink-0 border-primary/20">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userProfile={profile}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-primary/5 rounded-3xl bg-secondary/10">
            <CalendarSearch className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground max-w-sm">
              Either there are no upcoming events or they are still in the moderation queue. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Subscription CTA Section */}
      {!profile || profile.subscription_tier !== 'vip' ? (
        <section className="container px-4 py-20 mx-auto">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-blue-600/10 border border-primary/20 p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[100%] rounded-full bg-primary/10 blur-[100px]" />

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Unlock the <span className="text-primary italic">Full Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Get access to secret garden raves, luxury yacht parties, and exclusive underground locations. Upgrade to VIP and never miss the true Tenerife nightlife.
            </p>
            <Button size="lg" className="rounded-full px-12 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(245,158,11,0.4)]">
              Go VIP Now
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}
