'use client'

import { useState } from 'react'
import EventForm from '@/components/agent/EventForm'
import DiscoveryTool from '@/components/agent/DiscoveryTool'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DiscoveredEvent } from '@/app/agent/discovery-actions'
import { FilePlus, Search } from 'lucide-react'

export default function AgentDashboardClient() {
    const [draftEvent, setDraftEvent] = useState<DiscoveredEvent | null>(null)
    const [activeTab, setActiveTab] = useState('manual')

    const handleImport = (event: DiscoveredEvent) => {
        setDraftEvent(event)
        setActiveTab('manual') // Switch to form tab after import
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50 border border-primary/10">
                <TabsTrigger value="manual" className="flex items-center gap-2 py-3">
                    <FilePlus className="h-4 w-4" /> Manual Submission
                </TabsTrigger>
                <TabsTrigger value="discovery" className="flex items-center gap-2 py-3">
                    <Search className="h-4 w-4" /> Discover Events
                </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-0 focus-visible:ring-0">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EventForm initialData={draftEvent} key={draftEvent?.title} />
                </div>
            </TabsContent>

            <TabsContent value="discovery" className="mt-0 focus-visible:ring-0">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DiscoveryTool onImport={handleImport} />
                </div>
            </TabsContent>
        </Tabs>
    )
}
