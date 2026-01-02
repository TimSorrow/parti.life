'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Inbox, Users, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapPin, User as UserIcon, Star, Loader2 } from 'lucide-react'
import ModerationButtons from './ModerationButtons'
import EditEventDialog from './EditEventDialog'
import DeleteEventDialog from './DeleteEventDialog'
import { updateUserRole, updateUserTier } from '@/app/admin/user-actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Database } from '@/types/database'

type EventWithProfile = Database['public']['Tables']['events']['Row'] & {
    profiles: { full_name: string | null } | null
}

type Profile = Database['public']['Tables']['profiles']['Row']

interface AdminDashboardClientProps {
    pendingEvents: EventWithProfile[]
    allEvents: EventWithProfile[]
    allProfiles: Profile[]
}

export default function AdminDashboardClient({
    pendingEvents,
    allEvents,
    allProfiles
}: AdminDashboardClientProps) {
    const router = useRouter()
    const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({})
    const [editingEvent, setEditingEvent] = useState<EventWithProfile | null>(null)
    const [deletingEvent, setDeletingEvent] = useState<EventWithProfile | null>(null)

    const handleRoleChange = async (userId: string, newRole: 'user' | 'agent' | 'admin') => {
        setLoadingUsers(prev => ({ ...prev, [userId]: true }))
        try {
            const result = await updateUserRole(userId, newRole)
            if (result.error) {
                toast.error(`Failed to update role: ${result.error}`)
            } else {
                toast.success('User role updated successfully')
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred while updating the role')
        } finally {
            setLoadingUsers(prev => ({ ...prev, [userId]: false }))
        }
    }

    const handleTierChange = async (userId: string, newTier: 'basic' | 'vip') => {
        setLoadingUsers(prev => ({ ...prev, [userId]: true }))
        try {
            const result = await updateUserTier(userId, newTier)
            if (result.error) {
                toast.error(`Failed to update tier: ${result.error}`)
            } else {
                toast.success('User subscription tier updated successfully')
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred while updating the tier')
        } finally {
            setLoadingUsers(prev => ({ ...prev, [userId]: false }))
        }
    }

    return (
        <>
            <Tabs defaultValue="moderation" className="space-y-6">
                <TabsList className="bg-secondary/50 border border-primary/10 p-1 h-auto">
                    <TabsTrigger value="moderation" className="px-6 py-2.5">
                        <Inbox className="h-4 w-4 mr-2" /> Event Moderation
                        {pendingEvents.length > 0 && (
                            <Badge className="ml-2 bg-amber-500 text-white border-0">{pendingEvents.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all-events" className="px-6 py-2.5">
                        <Inbox className="h-4 w-4 mr-2" /> All Events
                        <Badge className="ml-2 bg-primary/20 text-primary border-0">{allEvents.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="users" className="px-6 py-2.5">
                        <Users className="h-4 w-4 mr-2" /> User Management
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="moderation">
                    <Card className="border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle>Event Moderation</CardTitle>
                            <CardDescription>Review and approve pending event submissions.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {pendingEvents.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-primary/5">
                                            <TableHead className="pl-6">Title</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead className="text-right pr-6" colSpan={2}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingEvents.map((event) => (
                                            <TableRow key={event.id} className="hover:bg-primary/5 border-primary/5">
                                                <TableCell className="pl-6 py-4">
                                                    <span className="font-semibold">{event.title}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span>{new Date(event.date_time).toLocaleDateString()}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span>{event.profiles?.full_name || 'Unknown'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>{event.location_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-3">
                                                    <ModerationButtons eventId={event.id} />
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-primary/20 hover:bg-primary/10"
                                                            onClick={() => setEditingEvent(event)}
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-red-500/20 hover:bg-red-500/10 text-red-500"
                                                            onClick={() => setDeletingEvent(event)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground italic">
                                    No pending events to review.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all-events">
                    <Card className="border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle>All Events</CardTitle>
                            <CardDescription>Manage all events in the system.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {allEvents.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-primary/5">
                                            <TableHead className="pl-6">Title</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right pr-6" colSpan={2}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allEvents.map((event) => (
                                            <TableRow key={event.id} className="hover:bg-primary/5 border-primary/5">
                                                <TableCell className="pl-6 py-4">
                                                    <span className="font-semibold">{event.title}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span>{new Date(event.date_time).toLocaleDateString()}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span>{event.profiles?.full_name || 'Unknown'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {event.status === 'approved' && (
                                                        <Badge className="bg-green-500/20 text-green-500 border-green-500/20">Approved</Badge>
                                                    )}
                                                    {event.status === 'rejected' && (
                                                        <Badge className="bg-red-500/20 text-red-500 border-red-500/20">Rejected</Badge>
                                                    )}
                                                    {event.status === 'pending' && (
                                                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">Pending</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-6" colSpan={2}>
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-primary/20 hover:bg-primary/10"
                                                            onClick={() => setEditingEvent(event)}
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-red-500/20 hover:bg-red-500/10 text-red-500"
                                                            onClick={() => setDeletingEvent(event)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground italic">
                                    No events in the system.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card className="border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-primary/5">
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage user roles and subscription tiers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-primary/5">
                                        <TableHead className="pl-6">Email / ID</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Current Role</TableHead>
                                        <TableHead>Current Tier</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allProfiles.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-primary/5 border-primary/5">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground font-mono">{user.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{user.full_name || 'Anonymous'}</span>
                                            </TableCell>
                                            <TableCell>
                                                {loadingUsers[user.id] ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Select
                                                        value={user.role}
                                                        onValueChange={(value) => handleRoleChange(user.id, value as 'user' | 'agent' | 'admin')}
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">User</SelectItem>
                                                            <SelectItem value="agent">Agent</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {loadingUsers[user.id] ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Select
                                                        value={user.subscription_tier}
                                                        onValueChange={(value) => handleTierChange(user.id, value as 'basic' | 'vip')}
                                                    >
                                                        <SelectTrigger className="w-[120px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="basic">Basic</SelectItem>
                                                            <SelectItem value="vip">
                                                                <div className="flex items-center gap-2">
                                                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                                    <span>VIP</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {editingEvent && (
                <EditEventDialog
                    event={editingEvent}
                    open={!!editingEvent}
                    onOpenChange={(open) => !open && setEditingEvent(null)}
                />
            )}

            {deletingEvent && (
                <DeleteEventDialog
                    event={deletingEvent}
                    open={!!deletingEvent}
                    onOpenChange={(open) => !open && setDeletingEvent(null)}
                />
            )}
        </>
    )
}
