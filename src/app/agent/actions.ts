'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database'

export async function createEvent(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = (profile as any)?.role === 'admin'

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dateTime = formData.get('date_time') as string
    const locationName = formData.get('location_name') as string
    const imageUrl = formData.get('image_url') as string
    const minTierRequired = formData.get('min_tier_required') as 'basic' | 'vip'

    const { error } = await (supabase.from('events') as any).insert({
        title,
        description,
        date_time: new Date(dateTime).toISOString(),
        location_name: locationName,
        image_url: imageUrl || null,
        min_tier_required: minTierRequired,
        created_by: user.id,
        status: isAdmin ? 'approved' : 'pending',
    })

    if (error) {
        console.error('Error creating event:', error)
        const redirectPath = isAdmin ? '/admin' : '/agent'
        return redirect(`${redirectPath}?error=${error.message}`)
    }

    if (isAdmin) {
        return redirect('/admin?message=Event created and approved successfully')
    }

    return redirect('/agent?message=Event submitted successfully and is pending approval')
}

export async function updateEventStatus(eventId: string, status: 'approved' | 'rejected') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if user is admin
    const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const profile = (profileData as any) as { role: string } | null
    if (profile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('events') as any)
        .update({ status })
        .eq('id', eventId)

    if (error) {
        console.error('Error updating event status:', error)
        return { error: error.message }
    }

    return { success: true }
}
