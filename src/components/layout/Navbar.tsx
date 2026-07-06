import { createClient } from '@/utils/supabase/server'
import NavbarUI from './NavbarUI'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profileData } = user
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null }
    const profile = profileData as any

    return (
        <NavbarUI user={user} profile={profile} />
    )
}
