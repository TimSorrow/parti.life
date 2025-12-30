import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import { Database } from '@/types/database'

type EventWithProfile = Database['public']['Tables']['events']['Row'] & {
    profiles: { full_name: string | null } | null
}

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ message: string; error: string }>
}) {
    const { message, error } = await searchParams
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
    const profile = profileData as Database['public']['Tables']['profiles']['Row'] | null

    if (profile?.role !== 'admin') {
        return redirect('/')
    }

    // Fetch pending events
    const { data: pendingEventsData } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
    const pendingEvents = (pendingEventsData || []) as EventWithProfile[]

    // Fetch all users/profiles
    const { data: allProfilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
    const allProfiles = allProfilesData || []

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                        <Shield className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-primary">Admin Control</h1>
                        <p className="text-muted-foreground">Manage platform events and user permissions.</p>
                    </div>
                </div>

                {message && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                        {error}
                    </div>
                )}

                <AdminDashboardClient
                    pendingEvents={pendingEvents}
                    allProfiles={allProfiles}
                />
            </div>
        </div>
    )
}
