const fs = require('fs');

async function promoteAllToAdmin() {
    try {
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

        // List all profiles first
        console.log('Fetching all profiles...');
        const listResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
            }
        });

        const profiles = await listResponse.json();
        console.log('Current Profiles:');
        profiles.forEach(p => console.log(`- ID: ${p.id}, Name: ${p.full_name}, Role: ${p.role}`));

        // Promote all users to admin for testing purposes
        console.log('\nPromoting all users to admin...');
        const patchResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=not.is.null`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ role: 'admin' })
        });

        if (patchResponse.ok) {
            console.log('✓ Successfully promoted all users to admin role');
            process.exit(0);
        } else {
            const error = await patchResponse.text();
            console.error('Failed to promote:', error);
            process.exit(1);
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

promoteAllToAdmin();
