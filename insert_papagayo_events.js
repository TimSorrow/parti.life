const fs = require('fs');

// Papagayo Events Data
const papagayoEvents = [
    {
        "title": "Follow",
        "date": "2026-01-08",
        "time": "23:00",
        "lineup": ["Aitor Robles", "Rayconen"],
        "location": "Papagayo Tenerife"
    },
    {
        "title": "The Hype",
        "date": "2026-01-08",
        "time": "23:05",
        "lineup": ["Dj Vojtano", "El Morinke"],
        "location": "Sala El Nido (Papagayo Tenerife)"
    },
    {
        "title": "La Loka",
        "date": "2026-01-09",
        "time": "23:00",
        "lineup": ["Adrián Denniz", "Mike"],
        "location": "Papagayo Tenerife"
    },
    {
        "title": "Few",
        "date": "2026-01-09",
        "time": "23:05",
        "lineup": ["M.U.S.E", "Barto +1"],
        "location": "Sala El Nido (Papagayo Tenerife)"
    },
    {
        "title": "Essence",
        "date": "2026-01-10",
        "time": "23:00",
        "lineup": ["Alex Wellmann", "Beto Uña +1"],
        "location": "Papagayo Tenerife"
    },
    {
        "title": "Hija De Fruta",
        "date": "2026-01-10",
        "time": "23:05",
        "lineup": ["Adrián Denniz", "Mike"],
        "location": "Sala El Nido (Papagayo Tenerife)"
    },
    {
        "title": "Freak & Chic",
        "date": "2026-01-11",
        "time": "23:00",
        "lineup": ["Beto Uña"],
        "location": "Papagayo Tenerife"
    },
    {
        "title": "Flirt",
        "date": "2026-01-11",
        "time": "23:05",
        "lineup": [],
        "location": "Sala El Nido (Papagayo Tenerife)"
    },
    {
        "title": "Move On",
        "date": "2026-01-14",
        "time": "23:00",
        "lineup": ["Jacobo Padilla"],
        "location": "Papagayo Tenerife"
    },
    {
        "title": "Follow",
        "date": "2026-01-15",
        "time": "23:00",
        "lineup": ["Ana Pak", "Castion"],
        "location": "Papagayo Tenerife"
    },
    {
        "title": "The Hype",
        "date": "2026-01-15",
        "time": "23:05",
        "lineup": ["Sbenz", "El Morinke"],
        "location": "Sala El Nido (Papagayo Tenerife)"
    }
];

async function insertEvents() {
    try {
        // Read .env file
        const envContent = fs.readFileSync('.env', 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                env[key.trim()] = valueParts.join('=').trim();
            }
        });

        const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase configuration in .env');
            process.exit(1);
        }

        console.log('Fetching admin user for created_by...');

        // Fetch an admin user to use as created_by
        const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?role=eq.admin&limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
            }
        });

        const profiles = await profilesResponse.json();

        if (!profiles || profiles.length === 0) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        const createdBy = profiles[0].id;
        console.log(`Using admin user: ${profiles[0].full_name || createdBy}`);

        // Transform events for insertion
        const eventsToInsert = papagayoEvents.map(event => {
            const dateTime = new Date(`${event.date}T${event.time}:00`);
            const description = event.lineup.length > 0
                ? `Featuring: ${event.lineup.join(', ')}`
                : 'Join us for an amazing night!';

            return {
                title: event.title,
                description: description,
                date_time: dateTime.toISOString(),
                location_name: event.location,
                created_by: createdBy,
                status: 'approved',
                min_tier_required: 'basic',
                image_url: '/images/venue-hero.png'
            };
        });

        console.log(`\nInserting ${eventsToInsert.length} events...`);

        // Use service role to bypass RLS
        const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is required to bypass RLS');
            process.exit(1);
        }

        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(eventsToInsert)
        });

        if (insertResponse.ok) {
            const inserted = await insertResponse.json();
            console.log(`\n✓ Successfully inserted ${inserted.length} Papagayo events!`);
            inserted.forEach(e => {
                console.log(`  - ${e.title} @ ${e.location_name} (${new Date(e.date_time).toLocaleDateString()})`);
            });
        } else {
            const error = await insertResponse.text();
            console.error('Failed to insert events:', error);
            process.exit(1);
        }

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

insertEvents();
