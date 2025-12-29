import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, Inbox, Calendar, MapPin, User as UserIcon, Star } from 'lucide-react'
import ModerationButtons from '@/components/admin/ModerationButtons'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'

type EventWithProfile = Database['public']['Tables']['events']['Row'] & {
    profiles: { full_name: string | null } | null
}

export default async function AdminDashboard() {
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
    const pendingEvents = pendingEventsData as EventWithProfile[] | null

    // Fetch all users/profiles
    const { data: allProfilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
    const allProfiles = allProfilesData as Database['public']['Tables']['profiles']['Row'][] | null

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                    <Shield className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Admin Control</h1>
                    <p className="text-muted-foreground">Manage platform events and user permissions.</p>
                </div>
            </div>

            <Tabs defaultValue="moderation" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-primary/10 p-1 h-auto">
                    <TabsTrigger value="moderation" className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Inbox className="h-4 w-4 mr-2" /> Moderation Queue
                        {pendingEvents && pendingEvents.length > 0 && (
                            <Badge className="ml-2 bg-amber-500 text-white border-0">{pendingEvents.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="users" className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-4 w-4 mr-2" /> User Management
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="moderation">
                    <Card className="border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle>Pending Events</CardTitle>
                            <CardDescription>Review and approve or reject event submissions from agents.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {pendingEvents && pendingEvents.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-primary/5">
                                            <TableHead className="pl-6">Event Details</TableHead>
                                            <TableHead>Agent</TableHead>
                                            <TableHead>Schedule</TableHead>
                                            <TableHead>Tier</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingEvents.map((event: EventWithProfile) => (
                                            <TableRow key={event.id} className="hover:bg-primary/5 transition-colors border-primary/5 group">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {event.image_url && (
                                                            <img src={event.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-primary/10" />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" /> {event.location_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        {event.profiles?.full_name || 'Unknown'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs space-y-1">
                                                        <span className="flex items-center gap-1 font-medium">
                                                            <Calendar className="h-3 w-3 text-primary/70" /> {new Date(event.date_time).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={event.min_tier_required === 'vip' ? 'border-amber-500/50 text-amber-500' : ''}>
                                                        {event.min_tier_required.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <ModerationButtons eventId={event.id} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Inbox className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                    <p className="text-muted-foreground italic">No events pending moderation.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card className="border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle>Platform Users</CardTitle>
                            <CardDescription>View all registered users and manage their roles and subscription tiers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="pl-6">User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Subscription</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right pr-6">Management</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allProfiles?.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-primary/5 transition-colors border-primary/5">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{user.full_name || 'Unnamed User'}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{user.id}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin' ? 'default' : user.role === 'agent' ? 'secondary' : 'outline'} className="capitalize">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    {user.subscription_tier === 'vip' && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                                                    <span className={user.subscription_tier === 'vip' ? 'text-amber-500 font-bold' : 'text-muted-foreground'}>
                                                        {user.subscription_tier.toUpperCase()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {/* Placeholder for role/tier update popovers or buttons */}
                                                <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/10">Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
