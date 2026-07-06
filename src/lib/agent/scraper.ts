import * as cheerio from 'cheerio'
import { extractEventsFromText } from './event-extractor'

export type DiscoveredEvent = {
    title: string
    description: string
    date_time: string
    location_name: string
    image_url: string | null
    source_url: string
}

export async function scrapeUrlInternal(url: string): Promise<{ success: boolean; events?: DiscoveredEvent[]; error?: string }> {
    const apiKey = process.env.SCRAPEGRAPH_API_KEY
    if (apiKey) {
        try {
            console.log(`[Scraper] Calling Scrapegraph AI to extract from ${url}...`)
            const response = await fetch('https://v2-api.scrapegraphai.com/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'SGAI-APIKEY': apiKey,
                },
                body: JSON.stringify({
                    url,
                    prompt: 'Extract all upcoming events or parties from the page. Ensure date_time is strictly formatted as an ISO 8601 string (e.g. 2026-03-31T23:00:00). If the year is missing, use the current year (2026). If the time is missing, default to 23:00. Make sure to retrieve image_url if available.',
                    wait_for: 5,
                    schema: {
                        type: 'object',
                        properties: {
                            events: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string' },
                                        description: { type: 'string' },
                                        date_time: { type: 'string' },
                                        location_name: { type: 'string' },
                                        image_url: { type: 'string' }
                                    },
                                    required: ['title', 'description', 'date_time', 'location_name']
                                }
                            }
                        },
                        required: ['events']
                    }
                })
            })

            if (!response.ok) {
                const errText = await response.text()
                throw new Error(`Scrapegraph AI API error: ${response.status} ${response.statusText} - ${errText}`)
            }

            const responseData = await response.json()
            if (!responseData.json || !responseData.json.events) {
                throw new Error(`Scrapegraph AI returned invalid data format: ${JSON.stringify(responseData)}`)
            }

            const events: DiscoveredEvent[] = responseData.json.events.map((e: any) => ({
                title: e.title,
                description: e.description,
                date_time: e.date_time,
                location_name: e.location_name,
                image_url: e.image_url || null,
                source_url: url
            }))

            console.log(`[Scraper] Scrapegraph AI successfully extracted ${events.length} events from ${url}`)
            return { success: true, events }
        } catch (error: any) {
            console.error('[Scraper] Scrapegraph AI failed, falling back to local scraper:', error)
        }
    }

    // Fallback Cheerio + Gemini scraper
    try {
        console.log(`[Scraper] Running fallback Cheerio + Gemini scraper for ${url}...`)
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch URL: ${response.statusText}`)

        const html = await response.text()
        const $ = cheerio.load(html)
        
        // Remove non-content elements to save tokens
        $('script, style, nav, footer, iframe, noscript').remove()
        
        const bodyText = $('body').text().replace(/\s+/g, ' ')
        const imagesInfo = $('img').map((_, el) => {
            const src = $(el).attr('src')
            if (src && !src.startsWith('data:') && src.length > 5) {
                return src.startsWith('http') ? src : new URL(src, url).href;
            }
            return null;
        }).get().filter(Boolean).slice(0, 15).join('\n')
        
        const metaImages = $('meta[property="og:image"]').attr('content') || ''
        
        const textToAnalyze = `
        МЕТАДАННЫЕ ТЕГИ КАРТИНОК:
        ${metaImages}
        
        ССЫЛКИ НА КАРТИНКИ СО СТРАНИЦЫ:
        ${imagesInfo}
        
        ТЕКСТ СО СТРАНИЦЫ:
        ${bodyText}
        `.trim();

        const events = await extractEventsFromText(textToAnalyze, url);
        return { success: true, events }
    } catch (error: any) {
        console.error('[Scraper] Fallback scraper error:', error)
        return { success: false, error: error.message }
    }
}
