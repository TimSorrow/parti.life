import Link from 'next/link'

export default async function VenueDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Mock venue data - in production this would come from Supabase
    const venue = {
        id,
        name: 'Papagayo Beach Club',
        tagline: 'The Soul of Tenerife Nightlife',
        capacity: 2000,
        genres: ['House', 'Techno'],
        description: 'Papagayo Beach Club is more than just a venue; it\'s an experience that captures the vibrant soul of Tenerife. Located on the stunning coastline of Arona, we merge relaxed daytime beach vibes with electrifying nightlife energy. Our open-air architecture allows the ocean breeze to mingle with the beats of world-class DJs, creating an atmosphere that is both intimate and expansive. From sunset cocktails to sunrise dance sessions, Papagayo is the ultimate destination for those who seek the extraordinary.',
        heroImage: '/images/venue-hero.png',
        isOpen: true,
        amenities: [
            { name: 'VIP Tables', icon: 'star' },
            { name: 'Ocean View', icon: 'water_drop' },
            { name: 'House Music', icon: 'music_note' },
            { name: 'Cocktail Bar', icon: 'local_bar' },
            { name: 'Outdoor Terrace', icon: 'deck' },
        ],
        hours: { open: '10:00 PM', close: '6:00 AM' },
        address: 'Av. Rafael Puig Lluvina, 2, Arona, Tenerife',
        phone: '+34 922 78 90 11',
        rating: 4.8,
        reviewCount: 1240,
        gallery: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB8C38pzonm2emg-Ks6LUW2DvpGA2d6rjcmuP5G2HZd-1irAPEeiLiM4BGx_M3MNguXkDFI2y3A6SHOx_dU7KKAtogmIegKjvNWSR5Lr-Mk9Wuh5ACYyx7iXY7oi5ODds-H3OaRnvddPi1DG8dsAiHMHfWV_4WE6magNqFXFwalPrgIhBEKOX1lmaHocYEm771HJrvj9JR5_FtxEcjnxcjeYzqveSlOHj6HWDipiikobeg_OPrCGvYJZ5LZcJpYZWtCVfubpMxdvQA',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAWQfEHSycFQtFJ-Ds4M2kDRzBs__Px6R16s4OwDdZiGBeT4QMjzy0iIY4oVTuSAgSr963u9i8Av1-1PTYPD_eLL73MdW_Yl3qlMJ5jn4glfMWp4LMEwwkXKEg24OB6kowH-uteJhJ5pwLgG1eoNTF9ivsnV34mkt5-U_XRk0ZLglQKnOk7gZ8bd9dmCJYGSdla9bqXXhEQyyxah1k7pR2IKiz6vueBNz_c3oYHUxYfxFx6A0vQG9NSMKSRHU6yrADKKEdrTYpE0_c',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBpD5gAgWkA3XzysHWDOXJkrVBKep02ZP9Ire5ZS8Q0DojAkfSbShKkalzQsFDylepjkGoaWtmpF2k5sUcXeUK7z979R4CZXYXIDDme_OmVsHuC4lO52k0Abncy4iT42t_os1-TVoROMre0LsCw7rjnG0l45RWlmiyLUloVGwxNHTt5i2sad8IplfDpu9oQqi7z4129uD3RC62yTKXd9EDtjvpRCJdzOKEuQgpHd14BpUSBaqFKr4OnNmg3ZH--vLVA0sH5wsEg420',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBKOPxf66dBdABm_G8Z78_Ich907ijLwhWQmQ6wwF6ogtQUwv4--NgWGSyO75kM4X2Dvkt4CF784sjxJQhNB7Z5St8ytiDlPpEbbKjKj7KCcOi-rv81PPbvccHxfVECyA-5bAAVY-ibe66ka50bF4P8eyHwDbP66Zj-VL7FAAsBeKmSVq913evkqKsiIgjdQfnqhyMVIcC4u7iluWdwEMcHIZ2gHzqNfq615Y_yDLf-5modscP2pZnqRqEA3OXS6vYbeOr6MDVEhzw',
        ],
        mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe-uRv4cf9QgnxQnjaaw2JLwYSR-M3HBbD_9dCuN7zY05GTOK5J8qGBeJB4KDXgKw_Q-OAWgk8zMNUOOk0n9yWq1jYZF7DASQCVQ221O61E2jAq7btq4V4rseqJpHzGQz3iAFKNQ_QM1YAnFp9PENMVZOevDM4zcCCX0d5GNkrRTHpK1b7e83xUUUomkjJQy7wpMIZpcIEAisxO42T1olwdXvf5zVRq1yOIyRG4dbuFKSoUptorv8hOFwRHO9Yg59iBbioeV_K2wQ',
        upcomingEvents: [
            {
                id: '1',
                title: 'Sunset Sessions: Deep House Ritual',
                description: 'Featuring DJ Marco Carola & Local Guests',
                date: 'JUL 12',
                time: '10:00 PM - 06:00 AM',
                price: '€25',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA32py1Z6bHj_qexAqQK8iRdYK0bXNTXuRaq9o0DVRNgZVJEqymMxQB1JJLDLgtIoIQ6oT9xEcPZ3RQfmW8kFn7O9P6LQvtBtWWsRMTWWK6rBZpGF9FWBM_v-LWfND1rycRypeFrfZkTO_V9BoaKyerDndHNFZxvv-mwNHImVJNt88kUuGoX55D4yybYTNsqhVftnyq0_YAL7gRq6ZUMpfHZOUUGRsGgztk0MgbNwlRZ2y1wEfls8zyT2cvG3ZPgRcvCErlGy9n3eU',
            },
            {
                id: '2',
                title: 'Electric Dreams: Techno Night',
                description: 'Special Guest: Charlotte de Witte',
                date: 'JUL 14',
                time: '11:00 PM - 07:00 AM',
                price: '€40',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5xGXWV7exjt6LVD27Vowpy41fTHcyzGp635VckOq3rDhlmW35uLG22Pjg2M5Z87mKIPDRJEIMCuBn567kKJGyxqyn_XWvL39yfjqYIf35cgy0zNsAzNuAoAq1J509i71li90xhEaYkyGSsN-OfYJZK8KwWYsT9v92QKFqmxoIxcNXbuBjcO2-d9-OFOepVe04OWpJThOiPDYknyMw__orHxvlg8au8EvUPAIydYFRbm-V4q0DxbyzEXEvyi_NX-ywyDraWaLw_0w',
            },
        ],
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Hero Section */}
            <div className="w-full relative overflow-hidden">
                <div
                    className="relative flex min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 lg:p-12"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.3) 0%, rgba(5, 5, 5, 0.95) 100%), url("${venue.heroImage}")`,
                    }}
                >
                    <div className="flex flex-col gap-4 text-center z-10 max-w-3xl">
                        {venue.isOpen && (
                            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit mx-auto">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-semibold text-white uppercase tracking-wider">Open Now</span>
                            </div>
                        )}
                        <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] drop-shadow-xl">
                            {venue.name}
                        </h1>
                        <h2 className="text-gray-200 text-lg md:text-xl font-medium leading-normal max-w-2xl mx-auto drop-shadow-md">
                            {venue.tagline} • Capacity: {venue.capacity} • {venue.genres.join(' & ')}
                        </h2>
                    </div>
                    <div className="flex gap-4 z-10 mt-4">
                        <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:scale-105 transition-transform hover:shadow-[0_0_15px_rgba(255,77,0,0.5)]">
                            <span className="truncate">Follow Venue</span>
                        </button>
                        <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
                            <span className="truncate">Share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="w-full max-w-[1400px] mx-auto p-4 lg:p-8">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Amenities Chips */}
                        <div className="flex gap-3 flex-wrap">
                            {venue.amenities.map((amenity, index) => (
                                <div
                                    key={index}
                                    className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#18181B] hover:bg-primary/20 transition-colors pl-5 pr-5 cursor-default border border-white/5"
                                >
                                    <span className="material-symbols-outlined text-primary text-[20px]">{amenity.icon}</span>
                                    <p className="text-white text-sm font-medium">{amenity.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* About Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-white text-2xl font-bold">About the Venue</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {venue.description}
                            </p>
                        </div>

                        {/* Upcoming Events */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-white text-2xl font-bold">Upcoming Events</h2>
                                <Link href="/events" className="text-primary text-sm font-bold hover:underline">View All</Link>
                            </div>
                            <div className="flex flex-col gap-4">
                                {venue.upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-[#0F0F11] border border-white/5 hover:border-primary/50 transition-all hover:bg-[#18181B]/50"
                                    >
                                        <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-800 relative">
                                            <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg z-20 text-center border border-white/10">
                                                <span className="block text-xs text-gray-400 uppercase">{event.date.split(' ')[0]}</span>
                                                <span className="block text-lg font-bold text-white">{event.date.split(' ')[1]}</span>
                                            </div>
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                style={{ backgroundImage: `url("${event.image}")` }}
                                            ></div>
                                        </div>
                                        <div className="flex flex-col justify-between flex-1 gap-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                                                <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">schedule</span> {event.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">confirmation_number</span> Starting at {event.price}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <button className="w-full md:w-auto h-10 px-6 rounded-full bg-white/5 hover:bg-primary text-white font-bold text-sm transition-all border border-white/10 hover:border-transparent hover:shadow-[0_0_15px_rgba(255,77,0,0.5)]">
                                                Get Tickets
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-white text-2xl font-bold">Venue Gallery</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-96">
                                {/* Large Item */}
                                <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${venue.gallery[0]}")` }}
                                    ></div>
                                </div>
                                {/* Small Items */}
                                <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${venue.gallery[1]}")` }}
                                    ></div>
                                </div>
                                <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${venue.gallery[2]}")` }}
                                    ></div>
                                </div>
                                <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative group">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${venue.gallery[3]}")` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Info Card */}
                        <div className="p-6 bg-[#0F0F11] rounded-3xl border border-white/5">
                            <h3 className="text-white text-lg font-bold mb-4">Venue Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-x-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">schedule</span>
                                        <span className="text-sm font-medium">Hours</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white text-sm font-medium">Daily</p>
                                        <p className="text-gray-400 text-xs">{venue.hours.open} - {venue.hours.close}</p>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between gap-x-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                        <span className="text-sm font-medium">Address</span>
                                    </div>
                                    <p className="text-white text-sm font-medium text-right max-w-[180px]">{venue.address}</p>
                                </div>
                                <div className="flex items-start justify-between gap-x-4">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                        <span className="text-sm font-medium">Contact</span>
                                    </div>
                                    <p className="text-white text-sm font-medium text-right">{venue.phone}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button className="w-full h-10 rounded-full bg-[#18181B] hover:bg-white text-white hover:text-black font-bold text-sm transition-colors">
                                    Visit Website
                                </button>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/5 group cursor-pointer">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url("${venue.mapImage}")`,
                                    filter: 'grayscale(100%) invert(90%) hue-rotate(180deg) brightness(85%)',
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            {/* Pin */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <span className="material-symbols-outlined text-primary text-[40px] drop-shadow-lg animate-bounce">location_on</span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <button className="w-full h-10 rounded-full bg-white text-black font-bold text-sm shadow-lg hover:bg-gray-200 transition-colors">
                                    Get Directions
                                </button>
                            </div>
                        </div>

                        {/* Rating Widget */}
                        <div className="p-6 bg-[#0F0F11] rounded-3xl border border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white">{venue.rating}</span>
                                    <div className="flex text-yellow-500 text-[16px]">
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star_half</span>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">{venue.reviewCount.toLocaleString()} Reviews</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {/* Rating Bars */}
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-400 w-3">5</span>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[85%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-400 w-3">4</span>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[10%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-400 w-3">3</span>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[3%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 italic border-t border-white/5 pt-3">
                                "Incredible atmosphere and sound system. The best place in Tenerife for house music lovers!"
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
