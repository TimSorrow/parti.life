import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, MapPin, Ticket, Heart, Clock, CreditCard, Bell, LogOut, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/app/auth/actions'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
    const profile = profileData as any

    return (
        <div className="min-h-screen bg-[#050505] pt-20">
            {/* Profile Header / Hero */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRTe1C0owJhUg4KGciryFSLSOtW-p6S2EbxlFnEgvvAZjfLQvd-scAyRYzQtlocCg6q14afSZ6rQFEcfjPJvV3_yMRbRVOudBVRlDkc2ZN8L2RL6rbMpA-bzYhyM6nqCDrev0x09xypoIFRBQtHo8c0qjT-D37lMNyRt1H_lzelwi1ZqnG_gvvWv4jlfL9SMcfCY5EaB2fOlG6wPCRLS_2pfX4L8ZRslO5Qu23k3l1tqUfI3ZmzcuIvvOf3dDYcPcc88ld-t0oFoo"
                    className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                    alt="Cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
                <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-3xl bg-gradient-to-tr from-primary to-purple p-1 shadow-2xl transition-transform hover:scale-105">
                            <div className="h-full w-full bg-[#0F0F11] rounded-[calc(1.5rem-2px)] flex items-center justify-center overflow-hidden border-4 border-[#050505]">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="h-full w-full object-cover" alt="Avatar" />
                                ) : (
                                    <User className="h-20 w-20 text-primary opacity-20" />
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-all border-4 border-[#050505]">
                            <Edit2 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-grow pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-display font-black tracking-tighter text-white">
                                {profile?.full_name || 'Your Name'}
                            </h1>
                            <span className="px-3 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
                                {profile?.subscription_tier === 'vip' ? 'VIP' : 'Basic'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" /> Tenerife, Spain
                            </span>
                            <span className="flex items-center gap-2 text-gray-400">
                                {user.email}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 pb-4">
                        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-xl">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { name: 'My Tickets', icon: Ticket, active: true },
                            { name: 'Saved Events', icon: Heart },
                            { name: 'Past Events', icon: Clock },
                            { name: 'Billing', icon: CreditCard },
                            { name: 'Notifications', icon: Bell },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/5'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </button>
                        ))}
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <form action={signOut}>
                                <button type="submit" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm uppercase tracking-widest">
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Events Attended', val: '24' },
                                { label: 'Loyalty Points', val: '1,250' },
                                { label: 'Member Since', val: '2023' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center group hover:bg-white/10 transition-colors">
                                    <div className="text-3xl font-display font-black text-white mb-2 group-hover:scale-110 transition-transform">
                                        {stat.val}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upcoming Tickets Section */}
                        <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 sm:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-display font-black tracking-tighter text-white uppercase italic">
                                    Upcoming <span className="text-primary tracking-normal font-bold">Tickets</span>
                                </h2>
                                <Link href="/" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline transition-all">
                                    Find More Events
                                </Link>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr_zaxkI3PC8EGebMFTxSRvTozhV0UksO5fE6ILaink8PBJpVJw7WwKqmQs5lVdzAoZqCDtHUnsWb-xQJ4_QPqP7w1j4O5-JeYuGiccFcPxsktUWSnL1FQNrnXsJsEQ0iOavQJK3EPKf4sFwSKYWGcfSEDNPFMb-KMvH9wtwTsC6GTPtjC-r443zfEW7PNQz_RrHu9fZxWr8HGZH0xLHkdnmDXUBgCIZ3LmFbDa2xlG_R930hAdGAJIQWNvfilloWz0UQIQxkT7bA" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Ticket" />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Confirmed</span>
                                            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Aug 15 • 22:00</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Ocean View Pool Rave 2024</h4>
                                        <p className="text-sm text-gray-500">Costa Adeje • General Admission</p>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button variant="outline" className="flex-grow sm:flex-none rounded-xl border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5">
                                            Download
                                        </Button>
                                        <Button className="flex-grow sm:flex-none bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20">
                                            Transfer
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-8 text-center text-gray-500 text-sm font-medium bg-white/2 rounded-3xl border border-dashed border-white/5">
                                    No other upcoming tickets.
                                </div>
                            </div>
                        </div>

                        {/* Account Settings Placeholder */}
                        <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 sm:p-10">
                            <h2 className="text-2xl font-display font-black tracking-tighter text-white uppercase italic mb-8">
                                Account <span className="text-primary tracking-normal font-bold">Settings</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { label: 'Email Notifications', desc: 'Receive updates about your favorite artists' },
                                    { label: 'Public Profile', desc: 'Allow others to see your upcoming events' }
                                ].map((setting, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                        <div>
                                            <div className="text-white font-bold text-sm tracking-wide">{setting.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{setting.desc}</div>
                                        </div>
                                        <div className="h-6 w-12 rounded-full bg-primary/20 relative cursor-pointer overflow-hidden p-1 shadow-inner">
                                            <div className="h-full w-4/12 rounded-full bg-primary shadow-lg translate-x-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
