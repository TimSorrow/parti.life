import { Button } from '@/components/ui/button'
import { Search, Calendar as CalendarIcon } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative pt-20 h-screen max-h-[900px] min-h-[700px] w-full overflow-hidden bg-background flex items-center">
            {/* Hero Background with Images & Gradients */}
            <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full">
                    <img
                        alt="Hero Event"
                        className="w-full h-full object-cover opacity-40"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRTe1C0owJhUg4KGciryFSLSOtW-p6S2EbxlFnEgvvAZjfLQvd-scAyRYzQtlocCg6q14afSZ6rQFEcfjPJvV3_yMRbRVOudBVRlDkc2ZN8L2RL6rbMpA-bzYhyM6nqCDrev0x09xypoIFRBQtHo8c0qjT-D37lMNyRt1H_lzelwi1ZqnG_gvvWv4jlfL9SMcfCY5EaB2fOlG6wPCRLS_2pfX4L8ZRslO5Qu23k3l1tqUfI3ZmzcuIvvOf3dDYcPcc88ld-t0oFoo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple/10 via-background/50 to-background"></div>
                </div>
            </div>

            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full pb-20 pt-10">
                <div className="max-w-5xl text-center mx-auto w-full">
                    <div className="mb-10 sm:mb-12 select-none">
                        <h1 className="text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] leading-none font-display font-black tracking-tighter text-image-clip drop-shadow-2xl">
                            parti.life
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 font-light mt-4 tracking-wide max-w-2xl mx-auto">
                            The ultimate guide to Tenerife&apos;s nightlife.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple via-primary to-purple rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition duration-500 animate-gradient"></div>
                        <div className="relative bg-[#121212] rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col md:flex-row gap-2">
                            <div className="flex-grow flex items-center bg-[#1E1E1E] rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary/50 transition-all">
                                <Search className="text-gray-500 mr-3 h-5 w-5" />
                                <input
                                    className="bg-transparent border-none focus:ring-0 w-full text-white placeholder-gray-500 font-medium text-lg outline-none"
                                    placeholder="Search events, artists..."
                                    type="text"
                                />
                            </div>
                            <div className="flex-grow md:flex-none md:w-56 flex items-center bg-[#1E1E1E] rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary/50 transition-all">
                                <CalendarIcon className="text-gray-500 mr-3 h-5 w-5" />
                                <input
                                    className="bg-transparent border-none focus:ring-0 w-full text-white placeholder-gray-500 font-medium text-lg outline-none"
                                    placeholder="Any Date"
                                    type="text"
                                />
                            </div>
                            <button className="bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center">
                                Search
                            </button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 items-center justify-center px-2">
                            <span className="font-bold uppercase tracking-wider text-gray-500">Trending:</span>
                            <Link href="/search?q=Carnival" className="hover:text-primary transition-colors flex items-center group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary mr-2 transition-colors"></span>Carnival
                            </Link>
                            <Link href="/search?q=Boat Parties" className="hover:text-primary transition-colors flex items-center group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary mr-2 transition-colors"></span>Boat Parties
                            </Link>
                            <Link href="/search?q=Rooftops" className="hover:text-primary transition-colors flex items-center group">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary mr-2 transition-colors"></span>Rooftops
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 sm:mt-24 border-t border-white/10 pt-8 max-w-5xl mx-auto w-full">
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">50+</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Active Events</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">12</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Secret Parties</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">5k+</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Party Goers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">100%</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Island Vibe</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
