import { createClient } from '@/utils/supabase/server'
import VenuesPageClient from './VenuesPageClient'

export default async function VenuesPage() {
    const supabase = await createClient()

    // Get current user profile for admin check
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profileData } = user
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null }

    const isAdmin = profileData?.role === 'admin'

    // Fetch venues from database
    const { data: venues } = await supabase
        .from('venues')
        .select('*')
        .order('name')

    return (
        <VenuesPageClient
            venues={venues || []}
            isAdmin={isAdmin}
        />
    )
}
