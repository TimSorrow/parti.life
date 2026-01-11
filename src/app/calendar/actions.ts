'use server'

import { createClient } from '@/utils/supabase/server'
import { startOfMonth, endOfMonth, parseISO, format } from 'date-fns'

export async function getEventDatesForMonth(year: number, month: number) {
    const supabase = await createClient()

    const startDate = startOfMonth(new Date(year, month))
    const endDate = endOfMonth(new Date(year, month))

    const { data, error } = await supabase
        .from('events')
        .select('date_time')
        .eq('status', 'approved')
        .gte('date_time', startDate.toISOString())
        .lte('date_time', endDate.toISOString())

    if (error) {
        console.error('Error fetching event dates:', error)
        return []
    }

    // Extract unique dates (just the date part, no time)
    const uniqueDates = [...new Set(
        (data || []).map((event: { date_time: string }) =>
            format(parseISO(event.date_time), 'yyyy-MM-dd')
        )
    )]

    return uniqueDates
}

export async function getFilteredEvents(
    startDate: string,
    endDate: string,
    categoryIds: string[]
) {
    const supabase = await createClient()

    let query = supabase
        .from('events')
        .select(`
            *,
            categories (
                name,
                icon_name
            )
        `)
        .eq('status', 'approved')
        .gte('date_time', startDate)
        .lte('date_time', endDate)
        .order('date_time', { ascending: true })

    // If specific categories are selected, filter by them
    if (categoryIds.length > 0) {
        query = query.in('category_id', categoryIds)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching filtered events:', error)
        return []
    }

    return data || []
}

export async function getCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data || []
}
