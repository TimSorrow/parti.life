import { NextResponse } from 'next/server'
import { scrapeUrl } from '@/app/agent/discovery-actions'
import { createClient } from '@/utils/supabase/server'

// Permitir más tiempo de ejecución si se usa en Vercel (hasta 5 min)
export const maxDuration = 300 

const targetUrls = [
    'https://papagayotenerife.com/events/#/events',
    'https://magicbartenerife.com/weekly-events/#/events',
    'https://www.trampstenerife.com/events-calendar/',
    'https://www.adeje.es/agenda',
    'https://www.arona.org/DesktopModules/Agenda/Feed.ashx?format=rss'
];

export async function GET(request: Request) {
    // Basic protection against unauthorized calls
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient()

    // Find an Admin user to assign these events to
    const { data: adminUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

    const adminId = (adminUsers as any[])?.[0]?.id;

    if (!adminId) {
        return NextResponse.json({ error: 'No admin user found to assign events to. Please ensure you have at least one admin profile.' }, { status: 500 });
    }

    const results = [];
    let totalInserted = 0;

    for (const url of targetUrls) {
        try {
            console.log(`[AI Agent] Scraping ${url}...`);
            const scrapingResult = await scrapeUrl(url);

            if (!scrapingResult.success || !scrapingResult.events) {
                results.push({ url, status: 'failed', error: scrapingResult.error });
                continue;
            }

            let insertedCount = 0;

            for (const event of scrapingResult.events) {
                // Check if event already exists (deduplication by title)
                const { data: existing } = await supabase
                    .from('events')
                    .select('id')
                    .ilike('title', event.title)
                    .limit(1);

                if (existing && existing.length > 0) {
                    continue; // Skip, already in DB
                }

                const { error: insertError } = await supabase
                    .from('events')
                    .insert({
                        title: event.title,
                        description: event.description,
                        date_time: event.date_time,
                        location_name: event.location_name,
                        image_url: event.image_url,
                        created_by: adminId,
                        status: 'pending', // Save as pending for manual review
                        min_tier_required: 'basic',
                    } as any);

                if (insertError) {
                    console.error(`[AI Agent] Error inserting ${event.title}:`, insertError);
                } else {
                    insertedCount++;
                    totalInserted++;
                }
            }

            results.push({ 
                url, 
                status: 'success', 
                eventsFound: scrapingResult.events.length, 
                eventsInserted: insertedCount 
            });
        } catch (err: any) {
            results.push({ url, status: 'error', message: err.message });
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: `Agent finished. Inserted ${totalInserted} new pending events.`,
        details: results 
    });
}
