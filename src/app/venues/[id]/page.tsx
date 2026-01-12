import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import VenueDetailClient from './VenueDetailClient'

export default async function VenueDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Get current user profile for admin check
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profileData } = user
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null }

    const isAdmin = profileData?.role === 'admin'

    // Fetch venue from database
    const { data: venue } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single()

    if (!venue) {
        notFound()
    }

    // Fetch events at this venue location (approximate match)
    const { data: events } = await supabase
        .from('events')
        .select('*, categories(*)')
        .eq('status', 'approved')
        .ilike('location_name', `%${venue.location}%`)
        .gte('date_time', new Date().toISOString())
        .order('date_time', { ascending: true })
        .limit(5)

    return (
        <VenueDetailClient
            venue={venue}
            events={events || []}
            isAdmin={isAdmin}
        />
    )
}
