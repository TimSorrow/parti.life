'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
    const router = useRouter()
    const [searchVal, setSearchVal] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchVal.trim()) {
            router.push(`/events?q=${encodeURIComponent(searchVal)}`)
        }
    }

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-20">
            {/* Aggressive Background Splitting */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-primary opacity-20 skew-y-12 translate-y-1/2"></div>
                <img 
                    className="w-full h-full object-cover grayscale contrast-150 brightness-50" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_YheFBNhq8WggFdfr6qQ5ZYpUJ_FcQbmSOibWQm8deUOL9Iwn2tb5c16jGSxveHbDIPD5hXHUfqt4-_PUYdOssN9_x3Tj4r4H5YK2i_PKUUrSB4bfSmnFchPcg3QG5RPPbF7CchPgU2p0JHQAU5ZUwK9bfrYGb4vexX658l9xdHiabUskX-9yMtygzSotgKrFqUOmfIZDmicN58W7i4jn1suLXkdNV08hVzIaS6U1fqNOPLin2p19BHDqZZnBCnh-q9QFKR3Wn60"
                    alt="Nightlife Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
                {/* Dynamic Geometric Shapes */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary opacity-10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-purple opacity-10 blur-3xl rounded-full"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-6xl px-8 text-center flex flex-col items-center">
                <div className="mb-6 transform -rotate-2">
                    <span className="text-white text-2xl font-black italic uppercase tracking-widest bg-black px-4 py-1 font-headline">Welcome to the Palace</span>
                </div>
                
                <h1 className="font-headline font-black italic text-8xl md:text-[160px] tracking-tighter leading-[0.8] mb-12 drop-shadow-[15px_15px_0px_rgba(255,0,60,0.8)] text-white">
                    <span className="block">PARTI</span>
                    <span className="block text-right -mr-12 md:-mr-24 knockout-text">LIFE</span>
                </h1>
                
                <p className="font-headline text-2xl md:text-4xl text-white italic font-black uppercase mb-16 max-w-3xl transform skew-x-[-10deg]">
                    The Electric Pulse of <span className="text-primary underline decoration-4">Tenerife's</span> Nightlife
                </p>
                
                {/* Persona Stylized Search */}
                <form onSubmit={handleSearch} className="w-full max-w-4xl search-bar-persona p-2 flex flex-col md:flex-row items-center gap-4 group">
                    <div className="flex-1 flex items-center px-8 gap-4 w-full">
                        <span className="material-symbols-outlined text-white text-4xl">search</span>
                        <input 
                            className="bg-transparent border-none text-white placeholder-white/60 w-full focus:ring-0 font-headline font-black italic text-2xl uppercase italic outline-none" 
                            placeholder="TARGET AN EVENT..." 
                            type="text"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-white text-black px-16 py-6 font-headline font-black italic text-3xl uppercase hover:bg-primary hover:text-white transition-all w-full md:w-auto"
                    >
                        GO!
                    </button>
                </form>
            </div>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                <span className="font-black italic text-xs tracking-tighter font-label">SCROLL DOWN</span>
                <span className="material-symbols-outlined text-primary text-4xl animate-bounce">expand_more</span>
            </div>
        </section>
    )
}
