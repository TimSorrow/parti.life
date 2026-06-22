import { Suspense } from 'react'
import EventsPageClient from './EventsPageClient'

export default function EventsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        }>
            <EventsPageClient />
        </Suspense>
    )
}
