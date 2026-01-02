'use server'

import * as cheerio from 'cheerio'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type DiscoveredEvent = {
    title: string
    description: string
    date_time: string
    location_name: string
    image_url: string | null
    source_url: string
}

export async function scrapeUrl(url: string): Promise<{ success: boolean; events?: DiscoveredEvent[]; error?: string }> {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

        const html = await response.text()
        const $ = cheerio.load(html)
        const events: DiscoveredEvent[] = []

        // Basic generic parser
        // We look for common patterns or specific selectors for supported sites
        if (url.includes('santacruzdetenerife.es')) {
            // Placeholder for SC site specific logic
            // Usually titles are in h1/h2, images in specific containers
        }

        // Generic attempt: Look for things that look like events
        // (This is a simplified version; in a real app, you'd want more robust logic or an LLM)
        $('article, .event, .agenda-item').each((_, el) => {
            const title = $(el).find('h1, h2, h3, .title').first().text().trim()
            const description = $(el).find('p, .description').first().text().trim()
            const image_url = $(el).find('img').first().attr('src')
            const dateStr = $(el).find('.date, time').first().text().trim()

            if (title) {
                events.push({
                    title,
                    description: description || 'Event details to be added.',
                    date_time: dateStr || new Date().toISOString(),
                    location_name: 'Tenerife', // Default
                    image_url: image_url ? (image_url.startsWith('http') ? image_url : new URL(image_url, url).href) : null,
                    source_url: url
                })
            }
        })

        // If no events found with specific selectors, try to get at least the page title/meta
        if (events.length === 0) {
            const title = $('title').text() || $('h1').first().text()

            // Try multiple selectors for description
            let description = $('meta[name="description"]').attr('content') ||
                $('meta[property="og:description"]').attr('content') ||
                $('.description, .content, .event-description, .descripcion').first().text().trim() ||
                $('p').first().text().trim()

            // Provide a meaningful fallback if still no description
            if (!description || description.length < 10) {
                description = `Event imported from ${new URL(url).hostname}. Please add more details about this event.`
            }

            const image = $('meta[property="og:image"]').attr('content') ||
                $('img').first().attr('src')

            if (title) {
                events.push({
                    title: title.trim(),
                    description: description.trim(),
                    date_time: new Date().toISOString(),
                    location_name: 'Tenerife',
                    image_url: image ? (image.startsWith('http') ? image : new URL(image, url).href) : null,
                    source_url: url
                })
            }
        }

        return { success: true, events }
    } catch (error: any) {
        console.error('Scraping error:', error)
        return { success: false, error: error.message }
    }
}

export async function parseMagicPaste(text: string): Promise<{ success: boolean; event?: DiscoveredEvent; error?: string }> {
    try {
        // Simple heuristic parsing for "Magic Paste"
        // In a real app, this would be a perfect place for an LLM call

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)

        let title = lines[0] || 'Unknown Event'
        let description = text
        let date_time = new Date().toISOString()
        let location_name = 'Tenerife'

        // Very basic regex for common patterns
        const dateRegex = /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/
        const timeRegex = /(\d{1,2})[:.](\d{2})/

        const dateMatch = text.match(dateRegex)
        const timeMatch = text.match(timeRegex)

        if (dateMatch) {
            // Attempt to construct a date
            // This is fragile but better than nothing for a demo
            const [_, day, month, year] = dateMatch
            const fullYear = year.length === 2 ? `20${year}` : year
            date_time = new Date(`${fullYear}-${month}-${day}`).toISOString()
        }

        // Search for location keywords
        const locationKeywords = ['Playa', 'Santa Cruz', 'Adeje', 'Arona', 'Puerto', 'Calle', 'Plaza', 'Teatro', 'Auditorio']
        for (const kw of locationKeywords) {
            if (text.includes(kw)) {
                // Find line containing keyword
                const line = lines.find(l => l.includes(kw))
                if (line) {
                    location_name = line
                    break
                }
            }
        }

        return {
            success: true,
            event: {
                title,
                description,
                date_time,
                location_name,
                image_url: null,
                source_url: 'WhatsApp/Paste'
            }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
