const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const email = process.argv[2] || 'admin@parti.life';

async function checkUserRole() {
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
        const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('❌ Missing Supabase configuration in .env');
            process.exit(1);
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        console.log(`Checking user: ${email}\n`);

        // Try to get user from auth.users
        try {
            const { data: { users }, error } = await supabase.auth.admin.listUsers();
            if (error) throw error;

            const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (!user) {
                console.log(`❌ User "${email}" not found in auth.users`);
                console.log('\nAvailable users:');
                users.forEach(u => console.log(`  - ${u.email || 'no email'} (${u.id})`));
                return;
            }

            console.log(`✓ Found auth user: ${user.email} (ID: ${user.id})`);

            // Check profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('❌ Error fetching profile:', profileError.message);
                return;
            }

            console.log(`\n📊 Profile Information:`);
            console.log(`  - ID: ${profile.id}`);
            console.log(`  - Full Name: ${profile.full_name || 'N/A'}`);
            console.log(`  - Role: ${profile.role}`);
            console.log(`  - Subscription Tier: ${profile.subscription_tier}`);

            if (profile.role !== 'admin') {
                console.log(`\n⚠️  User does NOT have admin role!`);
                console.log(`\nTo promote to admin, run this SQL in Supabase SQL Editor:`);
                console.log(`UPDATE public.profiles SET role = 'admin' WHERE id = '${user.id}';`);
            } else {
                console.log(`\n✓ User has admin role - should be able to access /admin`);
            }

        } catch (adminError) {
            console.error('❌ Cannot access Admin API:', adminError.message);
            console.log('\nPlease use SQL method to check user role:');
            console.log(`SELECT p.id, p.role, p.full_name, u.email`);
            console.log(`FROM public.profiles p`);
            console.log(`JOIN auth.users u ON u.id = p.id`);
            console.log(`WHERE u.email = '${email}';`);
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkUserRole();
