const fs = require('fs');

// Usage: node promote_user.js <email>
const email = process.argv[2];

if (!email) {
    console.error('Usage: node promote_user.js <email>');
    console.error('Example: node promote_user.js admin@example.com');
    process.exit(1);
}

async function promoteUserToAdmin(email) {
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

        // First, get the user ID from auth.users by email
        console.log(`Looking up user with email: ${email}...`);
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Use Admin API to list users and find by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
            console.error('Error listing users:', listError);
            process.exit(1);
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            console.error(`User with email ${email} not found.`);
            console.log('\nAvailable users:');
            users.forEach(u => console.log(`  - ${u.email} (${u.id})`));
            process.exit(1);
        }

        console.log(`Found user: ${user.email} (ID: ${user.id})`);

        // Promote to admin
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error promoting user:', updateError);
            process.exit(1);
        }

        console.log(`✓ Successfully promoted ${email} to admin role`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

promoteUserToAdmin(email);
