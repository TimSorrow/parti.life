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
import { User, Menu, LogOut, LayoutDashboard, Settings } from 'lucide-react'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        profile = data
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tighter text-primary">
                            parti<span className="text-foreground">.life</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Events
                        </Link>
                        {profile?.role === 'agent' || profile?.role === 'admin' ? (
                            <Link href="/agent" className="text-sm font-medium hover:text-primary transition-colors">
                                Agent Panel
                            </Link>
                        ) : null}
                        {profile?.role === 'admin' ? (
                            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                                Admin
                            </Link>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full border border-primary/20 bg-primary/5">
                                    <User className="h-5 w-5 text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{profile?.full_name || user.email}</p>
                                        <p className="text-xs leading-none text-muted-foreground uppercase tracking-wider">
                                            {profile?.subscription_tier === 'vip' ? '👑 VIP Member' : 'Basic Member'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                {profile?.role === 'agent' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/agent" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>My Events</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {profile?.role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" asChild>
                                    <form action={signOut} className="w-full">
                                        <button type="submit" className="flex w-full items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90" asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
