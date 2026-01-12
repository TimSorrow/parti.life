'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'

type Venue = Database['public']['Tables']['venues']['Row']
type VenueInsert = Database['public']['Tables']['venues']['Insert']
type VenueUpdate = Database['public']['Tables']['venues']['Update']

export async function getVenues() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching venues:', error)
        return []
    }

    return data as Venue[]
}

export async function getVenueById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching venue:', error)
        return null
    }

    return data as Venue
}

export async function updateVenue(id: string, venueData: VenueUpdate) {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Not authorized. Admin access required.' }
    }

    const { data, error } = await supabase
        .from('venues')
        .update({
            ...venueData,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating venue:', error)
        return { error: error.message }
    }

    revalidatePath('/venues')
    revalidatePath(`/venues/${id}`)

    return { data }
}

export async function createVenue(venueData: VenueInsert) {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Not authorized. Admin access required.' }
    }

    const { data, error } = await supabase
        .from('venues')
        .insert(venueData)
        .select()
        .single()

    if (error) {
        console.error('Error creating venue:', error)
        return { error: error.message }
    }

    revalidatePath('/venues')

    return { data }
}

export async function deleteVenue(id: string) {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Not authorized. Admin access required.' }
    }

    const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting venue:', error)
        return { error: error.message }
    }

    revalidatePath('/venues')

    return { success: true }
}
