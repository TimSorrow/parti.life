'use client'

import { Button } from '@/components/ui/button'
import { approveEvent, rejectEvent } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ModerationButtons({ eventId }: { eventId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState<'approved' | 'rejected' | null>(null)

    const handleAction = async (status: 'approved' | 'rejected') => {
        setLoading(status)
        try {
            const result = status === 'approved'
                ? await approveEvent(eventId)
                : await rejectEvent(eventId)
            if (result.success) {
                toast.success(`Event ${status === 'approved' ? 'approved' : 'rejected'} successfully`)
                router.refresh()
            } else {
                toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} event: ${result.error}`)
            }
        } catch (error) {
            toast.error(`An error occurred while ${status === 'approved' ? 'approving' : 'rejecting'} the event`)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="flex gap-2 justify-end">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8"
                onClick={() => handleAction('approved')}
                disabled={!!loading}
            >
                {loading === 'approved' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span className="ml-1 hidden sm:inline">Approve</span>
            </Button>
            <Button
                size="sm"
                variant="destructive"
                className="h-8"
                onClick={() => handleAction('rejected')}
                disabled={!!loading}
            >
                {loading === 'rejected' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                <span className="ml-1 hidden sm:inline">Reject</span>
            </Button>
        </div>
    )
}
