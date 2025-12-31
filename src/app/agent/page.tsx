import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AgentDashboardClient from './AgentDashboardClient'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Timer } from 'lucide-react'

export default async function AgentDashboard({
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
    const profile = profileData as any

    if (profile?.role !== 'agent' && profile?.role !== 'admin') {
        return redirect('/')
    }

    // Fetch agent's events
    const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
    const events = eventsData as any[] | null

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500/20 text-green-500 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>
            case 'rejected':
                return <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/20"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
            default:
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20"><Timer className="h-3 w-3 mr-1" /> Pending</Badge>
        }
    }

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Agent Dashboard</h1>
                    <p className="text-muted-foreground">Manage your event submissions and track their approval status.</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AgentDashboardClient />
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="border-primary/10 bg-card/20 backdrop-blur-sm h-full">
                            <CardHeader>
                                <CardTitle>My Submissions</CardTitle>
                                <CardDescription>Your event history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {events && events.length > 0 ? (
                                    <div className="space-y-3">
                                        {events.slice(0, 5).map((event) => (
                                            <div key={event.id} className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                            <MapPin className="h-3 w-3" /> {event.location_name}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(event.date_time).toLocaleDateString()}
                                                        </span>
                                                        {getStatusBadge(event.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {events.length > 5 && (
                                            <p className="text-xs text-center text-muted-foreground italic pt-2">
                                                +{events.length - 5} more events
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-primary/5 rounded-xl border border-dashed border-primary/20">
                                        <p className="text-xs text-muted-foreground italic">No events yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
