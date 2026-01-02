const fs = require('fs');

async function promoteAll() {
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

        // Use a filter that matches everyone to satisfy the WHERE clause requirement
        const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=not.is.null`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ role: 'admin' })
        });

        if (response.ok) {
            console.log('Successfully promoted all users to admin');
            process.exit(0);
        } else {
            const error = await response.text();
            console.error('Failed to promote users:', error);
            process.exit(1);
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

promoteAll();
