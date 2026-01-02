'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'

export async function updateUserRole(userId: string, role: 'user' | 'agent' | 'admin') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: adminProfileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const adminProfile = (adminProfileData as any) as { role: string } | null
    if (adminProfile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('profiles') as any)
        .update({ role })
        .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function updateUserTier(userId: string, subscription_tier: 'basic' | 'vip') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: adminProfileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const adminProfile = (adminProfileData as any) as { role: string } | null
    if (adminProfile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('profiles') as any)
        .update({ subscription_tier })
        .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function approveEvent(eventId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: adminProfileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const adminProfile = (adminProfileData as any) as { role: string } | null
    if (adminProfile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('events') as any)
        .update({ status: 'approved' })
        .eq('id', eventId)

    if (error) {
        console.error('Error approving event:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function rejectEvent(eventId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: adminProfileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const adminProfile = (adminProfileData as any) as { role: string } | null
    if (adminProfile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('events') as any)
        .update({ status: 'rejected' })
        .eq('id', eventId)

    if (error) {
        console.error('Error rejecting event:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function updateEvent(
    eventId: string,
    eventData: {
        title: string
        description: string
        date_time: string
        location_name: string
        image_url?: string
        min_tier_required: 'basic' | 'vip'
    }
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: adminProfileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const adminProfile = (adminProfileData as any) as { role: string } | null
    if (adminProfile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('events') as any)
        .update({
            title: eventData.title,
            description: eventData.description,
            date_time: new Date(eventData.date_time).toISOString(),
            location_name: eventData.location_name,
            image_url: eventData.image_url || null,
            min_tier_required: eventData.min_tier_required,
        })
        .eq('id', eventId)

    if (error) {
        console.error('Error updating event:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function deleteEvent(eventId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: adminProfileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const adminProfile = (adminProfileData as any) as { role: string } | null
    if (adminProfile?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('events') as any)
        .delete()
        .eq('id', eventId)

    if (error) {
        console.error('Error deleting event:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}
