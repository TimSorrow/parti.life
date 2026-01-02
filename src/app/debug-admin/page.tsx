import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugAdminPage() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    const profileData = user 
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null, error: null }
    
    const profile = profileData.data

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Access Debug</h1>
            
            <div className="space-y-4 p-4 bg-card border rounded-lg">
                <div>
                    <strong>Auth User:</strong> {user ? '✓ Authenticated' : '❌ Not authenticated'}
                </div>
                {user && (
                    <div>
                        <strong>User ID:</strong> {user.id}
                    </div>
                )}
                {user && (
                    <div>
                        <strong>User Email:</strong> {user.email}
                    </div>
                )}
                {userError && (
                    <div className="text-red-500">
                        <strong>Auth Error:</strong> {userError.message}
                    </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                    <strong>Profile:</strong> {profile ? '✓ Found' : '❌ Not found'}
                </div>
                {profile && (
                    <>
                        <div>
                            <strong>Profile ID:</strong> {profile.id}
                        </div>
                        <div>
                            <strong>Full Name:</strong> {profile.full_name || 'N/A'}
                        </div>
                        <div>
                            <strong>Role:</strong> <span className={profile.role === 'admin' ? 'text-green-500' : 'text-red-500'}>
                                {profile.role}
                            </span>
                        </div>
                        <div>
                            <strong>Subscription Tier:</strong> {profile.subscription_tier}
                        </div>
                    </>
                )}
                {profileData.error && (
                    <div className="text-red-500">
                        <strong>Profile Error:</strong> {profileData.error.message}
                    </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                    <strong>Can Access /admin?</strong>{' '}
                    {user && profile?.role === 'admin' ? (
                        <span className="text-green-500">✓ YES</span>
                    ) : (
                        <span className="text-red-500">❌ NO</span>
                    )}
                </div>
                
                {user && profile?.role !== 'admin' && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
                        <p className="font-semibold">To fix:</p>
                        <p className="text-sm mt-2">
                            Run this SQL in Supabase SQL Editor:
                        </p>
                        <pre className="mt-2 p-2 bg-background rounded text-xs overflow-x-auto">
{`UPDATE public.profiles 
SET role = 'admin' 
WHERE id = '${user.id}';`}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
