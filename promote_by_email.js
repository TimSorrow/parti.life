const fs = require('fs');

// Usage: node promote_by_email.js <email>
const email = process.argv[2];

if (!email) {
    console.error('Usage: node promote_by_email.js <email>');
    console.error('Example: node promote_by_email.js admin@parti.life');
    process.exit(1);
}

async function promoteUserByEmail(email) {
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

        console.log(`Looking up user with email: ${email}...`);

        // Use Supabase Management API to list users
        // Note: This requires SERVICE_ROLE_KEY for auth.admin.listUsers()
        // Alternative: Use REST API to get auth user by email (if available)
        
        // Try using the REST API approach - first get all profiles with their IDs
        // Then we need to match email from auth.users
        // Since we can't directly query auth.users via REST, let's use a workaround
        
        // Get all profiles first
        const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey,
            }
        });

        const profiles = await profilesResponse.json();
        console.log(`Found ${profiles.length} profiles`);

        // Now we need to check auth.users - but this requires Admin API
        // Let's use a simpler approach: use Supabase JS client if available, or provide SQL alternative
        try {
            // Try to use the Supabase JS Admin API
            const { createClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });

            // List all auth users
            const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (listError) {
                throw new Error(`Cannot access auth.users: ${listError.message}. Please use SQL method instead.`);
            }

            const authUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (!authUser) {
                console.error(`\n❌ User with email "${email}" not found in auth.users`);
                console.log('\nAvailable users:');
                users.forEach(u => console.log(`  - ${u.email || 'no email'} (${u.id})`));
                process.exit(1);
            }

            console.log(`✓ Found auth user: ${authUser.email} (ID: ${authUser.id})`);

            // Check if profile exists
            const profile = profiles.find(p => p.id === authUser.id);
            if (!profile) {
                console.error(`❌ Profile not found for user ${authUser.id}. User may need to sign up first.`);
                process.exit(1);
            }

            console.log(`Current role: ${profile.role}`);

            // Update profile to admin
            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${authUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ role: 'admin' })
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`Update failed: ${errorText}`);
            }

            const updated = await updateResponse.json();
            console.log(`\n✓ Successfully promoted ${email} to admin role`);
            console.log(`Updated profile:`, updated[0]);
            process.exit(0);

        } catch (importError) {
            console.error('\n❌ Cannot use Admin API. Please use SQL method instead:');
            console.log('\nRun this SQL in Supabase SQL Editor:');
            console.log('```sql');
            console.log(`UPDATE public.profiles`);
            console.log(`SET role = 'admin'`);
            console.log(`WHERE id = (`);
            console.log(`  SELECT id FROM auth.users WHERE email = '${email}'`);
            console.log(`);`);
            console.log('```');
            process.exit(1);
        }

    } catch (err) {
        console.error('Error:', err.message);
        if (err.message.includes('SERVICE_ROLE_KEY')) {
            console.error('\nNote: You need SUPABASE_SERVICE_ROLE_KEY in your .env file for this script.');
            console.error('Alternatively, use the SQL method described above.');
        }
        process.exit(1);
    }
}

promoteUserByEmail(email);
