const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const email = 'admin@parti.life';

async function promoteUser() {
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
        const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl) {
            console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env');
            process.exit(1);
        }

        if (!serviceRoleKey) {
            console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env');
            console.error('\nPlease use the SQL method instead:');
            console.error('Run this in Supabase SQL Editor:');
            console.error(`UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = '${email}');`);
            process.exit(1);
        }

        // Create Supabase admin client
        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        console.log(`Looking up user: ${email}...`);

        // List all users
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
            console.error('❌ Error listing users:', listError.message);
            process.exit(1);
        }

        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            console.error(`❌ User with email "${email}" not found.`);
            console.log('\nAvailable users:');
            users.forEach(u => console.log(`  - ${u.email || 'no email'} (${u.id})`));
            process.exit(1);
        }

        console.log(`✓ Found user: ${user.email} (ID: ${user.id})`);

        // Update profile
        const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            console.error('❌ Error updating profile:', updateError.message);
            process.exit(1);
        }

        console.log(`\n✓ Successfully promoted ${email} to admin role!`);
        console.log(`Updated profile:`, data);
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

promoteUser();
