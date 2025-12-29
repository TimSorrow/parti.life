'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Search, Sparkles, Plus, Loader2, Globe, MessageSquare } from 'lucide-react'
import { scrapeUrl, parseMagicPaste, DiscoveredEvent } from '@/app/agent/discovery-actions'

interface DiscoveryToolProps {
    onImport: (event: DiscoveredEvent) => void
}

export default function DiscoveryTool({ onImport }: DiscoveryToolProps) {
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<DiscoveredEvent[]>([])
    const [error, setError] = useState<string | null>(null)

    const handleScrape = async () => {
        if (!url) return
        setLoading(true)
        setError(null)
        const res = await scrapeUrl(url)
        if (res.success && res.events) {
            setResults(res.events)
        } else {
            setError(res.error || 'Failed to scrape website')
        }
        setLoading(false)
    }

    const handleMagicPaste = async () => {
        if (!text) return
        setLoading(true)
        setError(null)
        const res = await parseMagicPaste(text)
        if (res.success && res.event) {
            setResults([res.event])
        } else {
            setError(res.error || 'Failed to parse text')
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <Card className="border-primary/20 bg-card/30 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5" /> Event Discovery
                    </CardTitle>
                    <CardDescription>
                        Find events from external websites or WhatsApp groups.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="url" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/50">
                            <TabsTrigger value="url" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" /> Website URL
                            </TabsTrigger>
                            <TabsTrigger value="paste" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Magic Paste
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://www.adeje.es/agenda..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="bg-background/50"
                                />
                                <Button onClick={handleScrape} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic">
                                Supports: Santa Cruz, Adeje, Arona Ayuntamientos and Lagenda.org
                            </p>
                        </TabsContent>

                        <TabsContent value="paste" className="space-y-4">
                            <Textarea
                                placeholder="Paste WhatsApp message or text from a flyer here..."
                                rows={5}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="bg-background/50 resize-none"
                            />
                            <Button onClick={handleMagicPaste} disabled={loading} className="w-full">
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Parse with Magic AI
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Discovered Results</h3>
                    <div className="grid gap-4">
                        {results.map((event, i) => (
                            <Card key={i} className="border-primary/10 bg-card/40 hover:border-primary/30 transition-all">
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        {event.image_url && (
                                            <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-primary/10">
                                                <img src={event.image_url} alt="" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-foreground truncate">{event.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-primary/70 font-medium">
                                                <span>{new Date(event.date_time).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="truncate">{event.location_name}</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="shrink-0 border-primary/20 hover:bg-primary/10"
                                            onClick={() => onImport(event)}
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Import
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
