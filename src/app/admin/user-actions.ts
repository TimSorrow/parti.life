'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, role: 'user' | 'agent' | 'admin') {
    const supabase = await createClient()

    const { data: { user: adminUser } } = await supabase.auth.getUser()
    if (!adminUser) throw new Error('Not authenticated')

    // Verify admin status
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', adminUser.id).single()
    if ((adminProfile as any)?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('profiles') as any)
        .update({ role })
        .eq('id', userId)

    if (error) {
        console.error('Error updating role:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function updateUserTier(userId: string, tier: 'basic' | 'vip') {
    const supabase = await createClient()

    const { data: { user: adminUser } } = await supabase.auth.getUser()
    if (!adminUser) throw new Error('Not authenticated')

    // Verify admin status
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', adminUser.id).single()
    if ((adminProfile as any)?.role !== 'admin') throw new Error('Not authorized')

    const { error } = await (supabase
        .from('profiles') as any)
        .update({ subscription_tier: tier })
        .eq('id', userId)

    if (error) {
        console.error('Error updating tier:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}
