import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/auth/actions'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Menu, LogOut, LayoutDashboard, Settings, Search } from 'lucide-react'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profileData } = user
        ? await supabase.from('profiles').select('*').eq('id', user.id).single()
        : { data: null }
    const profile = profileData as any

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 top-0 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-display font-black text-3xl tracking-tighter">
                            <span className="text-white">parti</span><span className="text-primary">.life</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#events" className="text-gray-300 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">
                            Events
                        </Link>
                        <Link href="/venues" className="text-gray-300 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">
                            Venues
                        </Link>
                        <Link href="/calendar" className="text-gray-300 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">
                            Calendar
                        </Link>
                        {(profile?.role === 'agent' || profile?.role === 'admin') && (
                            <Link href="/agent" className="text-gray-300 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">
                                Agent Panel
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors text-gray-300">
                            <Search className="h-5 w-5" />
                        </Button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 focus:outline-none group">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple p-[2px] transition-transform group-hover:scale-105">
                                            <div className="rounded-full h-full w-full bg-background flex items-center justify-center overflow-hidden border-2 border-[#050505]">
                                                {profile?.avatar_url ? (
                                                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-[#0F0F11]/95 backdrop-blur-xl border-white/10 text-white rounded-2xl p-2 shadow-2xl">
                                    <DropdownMenuLabel className="px-3 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold text-white leading-none">{profile?.full_name || user.email}</p>
                                            <p className="text-[10px] leading-none text-gray-500 uppercase tracking-widest mt-2 font-black">
                                                {profile?.subscription_tier === 'vip' ? '👑 VIP Member' : 'Basic Member'}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 focus:text-primary transition-colors cursor-pointer py-3 px-3">
                                        <Link href="/profile" className="flex items-center">
                                            <Settings className="mr-3 h-4 w-4" />
                                            <span className="font-medium text-sm">Profile Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuItem className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-500 transition-colors cursor-pointer py-3 px-3" asChild>
                                        <form action={signOut} className="w-full">
                                            <button type="submit" className="flex w-full items-center">
                                                <LogOut className="mr-3 h-4 w-4" />
                                                <span className="font-medium text-sm">Log out</span>
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 text-sm">
                                Sign In
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white focus:outline-none">
                            <Menu className="h-8 w-8" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
