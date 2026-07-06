'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { User, Menu, LogOut, LayoutDashboard, Settings, Search, Heart, Loader2 } from 'lucide-react'

export default function NavbarUI({ user, profile }: { user: any, profile: any }) {
    const pathname = usePathname()
    const router = useRouter()

    // Search Dialog States
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const supabase = createClient()

    // Search query debouncing & querying Supabase
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            return
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true)
            try {
                const { data } = await supabase
                    .from('events')
                    .select('*')
                    .eq('status', 'approved')
                    .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location_name.ilike.%${searchQuery}%`)
                    .gte('date_time', new Date().toISOString())
                    .order('date_time', { ascending: true })
                    .limit(5)
                
                setSearchResults(data || [])
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, supabase])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsSearchOpen(false)
            router.push(`/events?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md md:bg-transparent mix-blend-difference">
                <div className="flex justify-between items-center px-8 py-6 w-full max-w-[1440px] mx-auto">
                    {/* Logo */}
                    <Link href="/" className="hero-logo-mask text-3xl font-black italic tracking-tighter font-headline text-black select-none">
                        parti.life
                    </Link>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center gap-10 font-headline font-black italic text-lg uppercase text-white">
                        <Link href="/events" className="hover:text-primary transition-colors hover:-translate-y-1 block">
                            Events
                        </Link>
                        <Link href="/venues" className="hover:text-primary transition-colors hover:-translate-y-1 block">
                            Venues
                        </Link>
                        <Link href="/calendar" className="hover:text-primary transition-colors hover:-translate-y-1 block">
                            Calendar
                        </Link>
                        {(profile?.role === 'agent' || profile?.role === 'admin') && (
                            <Link href="/agent" className="hover:text-primary transition-colors hover:-translate-y-1 block">
                                Agent Panel
                            </Link>
                        )}
                    </nav>

                    {/* Right side controls */}
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsSearchOpen(true)}
                            className="text-white hover:bg-white/10 focus:outline-none rounded-full"
                        >
                            <Search className="h-6 w-6" />
                        </Button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 focus:outline-none group">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent-purple p-[2px] transition-transform group-hover:scale-105">
                                            <div className="rounded-full h-full w-full bg-background flex items-center justify-center overflow-hidden border-2 border-black">
                                                {profile?.avatar_url ? (
                                                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 text-white rounded-2xl p-2 shadow-2xl">
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
                            <Link href="/login" className="persona-btn text-sm py-2 px-6 flex items-center justify-center font-headline select-none">
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu trigger */}
                        <div className="md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 focus:outline-none">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 text-white rounded-xl p-2 shadow-2xl">
                                    <DropdownMenuItem asChild className="rounded-lg focus:bg-white/5 focus:text-primary transition-colors cursor-pointer py-2 px-3">
                                        <Link href="/events" className="flex items-center w-full">
                                            <span className="font-medium text-sm">Events</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg focus:bg-white/5 focus:text-primary transition-colors cursor-pointer py-2 px-3">
                                        <Link href="/venues" className="flex items-center w-full">
                                            <span className="font-medium text-sm">Venues</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg focus:bg-white/5 focus:text-primary transition-colors cursor-pointer py-2 px-3">
                                        <Link href="/calendar" className="flex items-center w-full">
                                            <span className="font-medium text-sm">Calendar</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    {(profile?.role === 'agent' || profile?.role === 'admin') && (
                                        <>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem asChild className="rounded-lg focus:bg-white/5 focus:text-primary transition-colors cursor-pointer py-2 px-3">
                                                <Link href="/agent" className="flex items-center w-full">
                                                    <span className="font-medium text-sm">Agent Panel</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 text-white rounded-2xl max-w-lg p-6 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-white mb-2 uppercase italic font-headline">
                            Search <span className="text-primary font-headline font-black tracking-normal">parti.life</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSearchSubmit} className="relative mt-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Type a festival, party, or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-5 bg-white/5 border-white/10 rounded-xl text-white placeholder-gray-500 focus-visible:ring-primary focus-visible:border-primary text-base font-body"
                            autoFocus
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                        )}
                    </form>

                    {/* Quick Results */}
                    <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                        {searchResults.length > 0 ? (
                            <>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2 font-label">
                                    Quick Results
                                </div>
                                {searchResults.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        onClick={() => setIsSearchOpen(false)}
                                        className="flex items-center gap-4 p-2 rounded-xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-200"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
                                            {event.image_url ? (
                                                <img src={event.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={event.title} />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-purple/20" />
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate font-body">{event.title}</h4>
                                            <p className="text-xs text-gray-400 truncate mt-0.5 font-body">{event.location_name}</p>
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider shrink-0 hidden sm:block font-label">
                                            {new Date(event.date_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </Link>
                                ))}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsSearchOpen(false)
                                        router.push(`/events?q=${encodeURIComponent(searchQuery)}`)
                                    }}
                                    className="w-full text-center text-primary text-xs font-bold uppercase tracking-widest mt-2 hover:bg-white/5 hover:text-white py-4 rounded-xl font-label"
                                >
                                    View all results
                                </Button>
                            </>
                        ) : searchQuery.trim() ? (
                            !isSearching && (
                                <div className="text-center py-6 text-sm text-gray-500 font-body">
                                    No events found for &quot;{searchQuery}&quot;
                                </div>
                            )
                        ) : (
                            <div className="text-center py-6 text-sm text-gray-500 italic font-body">
                                Type above to find upcoming festivals and events in Tenerife...
                             </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
