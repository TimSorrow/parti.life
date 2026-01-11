'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    const categoryId = formData.get('category_id') as string
    const minTierRequired = formData.get('min_tier_required') as 'basic' | 'vip'

    const { error } = await (supabase.from('events') as any).insert({
        title,
        description,
        date_time: new Date(dateTime).toISOString(),
        location_name: locationName,
        image_url: imageUrl || null,
        category_id: categoryId || null,
        min_tier_required: minTierRequired,
        created_by: user.id,
        status: isAdmin ? 'approved' : 'pending',
    })

    if (error) {
        console.error('Error creating event:', error)
        const redirectPath = isAdmin ? '/admin' : '/agent'
        return redirect(`${redirectPath}?error=${error.message}`)
    }

    revalidatePath('/agent')
    revalidatePath('/events')

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

export async function updateEvent(eventId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Verify ownership and that event is still pending
    const { data: existingEvent } = await (supabase
        .from('events') as any)
        .select('created_by, status')
        .eq('id', eventId)
        .single()

    if (!existingEvent) {
        return { error: 'Event not found' }
    }

    if (existingEvent.created_by !== user.id) {
        // Check if user is admin
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if ((profile as any)?.role !== 'admin') {
            return { error: 'Not authorized to edit this event' }
        }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dateTime = formData.get('date_time') as string
    const locationName = formData.get('location_name') as string
    const imageUrl = formData.get('image_url') as string
    const categoryId = formData.get('category_id') as string
    const minTierRequired = formData.get('min_tier_required') as 'basic' | 'vip'

    const { error } = await (supabase.from('events') as any)
        .update({
            title,
            description,
            date_time: new Date(dateTime).toISOString(),
            location_name: locationName,
            image_url: imageUrl || null,
            category_id: categoryId || null,
            min_tier_required: minTierRequired,
            status: 'pending', // Reset to pending after edit
        })
        .eq('id', eventId)

    if (error) {
        console.error('Error updating event:', error)
        return { error: error.message }
    }

    revalidatePath('/agent')
    revalidatePath('/events')

    return { success: true }
}
