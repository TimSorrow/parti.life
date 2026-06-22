'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { extractEventsFromText } from '@/lib/agent/event-extractor'
import { scrapeUrlInternal } from '@/lib/agent/scraper'
import type { DiscoveredEvent } from '@/lib/agent/scraper'

export type { DiscoveredEvent };

export async function scrapeUrl(url: string): Promise<{ success: boolean; events?: DiscoveredEvent[]; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Unauthorized' }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if ((profile as any)?.role !== 'admin' && (profile as any)?.role !== 'agent') {
            return { success: false, error: 'Unauthorized to use discovery tools' }
        }

        return await scrapeUrlInternal(url)
    } catch (error: any) {
        console.error('Scraping error:', error)
        return { success: false, error: error.message }
    }
}

export async function parseMagicPaste(text: string): Promise<{ success: boolean; event?: DiscoveredEvent; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Unauthorized' }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if ((profile as any)?.role !== 'admin' && (profile as any)?.role !== 'agent') {
            return { success: false, error: 'Unauthorized to use discovery tools' }
        }

        const events = await extractEventsFromText(text, 'Magic Paste');

        if (!events || events.length === 0) {
            return { success: false, error: 'No events found in the given text.' }
        }

        return {
            success: true,
            event: events[0]
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
