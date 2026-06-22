import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-black w-full pt-32 pb-16 relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-surface to-black"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 px-8 max-w-7xl mx-auto relative z-10">
                <div className="col-span-1">
                    <div className="hero-logo-mask text-3xl font-black italic mb-8 text-black select-none">parti.life</div>
                    <p className="font-black italic text-sm text-white/50 leading-relaxed uppercase font-headline">
                        © {new Date().getFullYear()} parti.life. The Electric Pulse of Nightlife. Take your heart.
                    </p>
                </div>
                
                <div className="flex flex-col gap-6">
                    <h5 className="text-primary font-black italic text-xl uppercase tracking-tighter font-headline">Platform</h5>
                    <div className="flex flex-col gap-4 font-headline">
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/events">Events</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/venues">Venues</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/artists">Artists</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/calendar">Calendar</Link>
                    </div>
                </div>
                
                <div className="flex flex-col gap-6">
                    <h5 className="text-primary font-black italic text-xl uppercase tracking-tighter font-headline">Company</h5>
                    <div className="flex flex-col gap-4 font-headline">
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/about">About Us</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/contact">Contact Us</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/partner">Partner with Us</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/terms">Terms</Link>
                    </div>
                </div>
                
                <div className="flex flex-col gap-6">
                    <h5 className="text-primary font-black italic text-xl uppercase tracking-tighter font-headline">Connect</h5>
                    <div className="flex flex-col gap-4 font-headline">
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="https://instagram.com">Instagram</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="https://tiktok.com">TikTok</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="https://facebook.com">Facebook</Link>
                        <Link className="text-white hover:text-secondary transition-colors font-black italic uppercase text-sm" href="/privacy">Privacy Policy</Link>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-8 mt-32 pt-10 border-t-8 border-white flex flex-col md:flex-row justify-between items-center gap-8 font-headline">
                <div className="font-black italic text-lg uppercase text-white">Made with <span className="text-primary">heart</span> in Tenerife</div>
                <div className="flex gap-10">
                    <span className="material-symbols-outlined text-white hover:text-primary transition-colors cursor-pointer text-3xl">language</span>
                    <span className="material-symbols-outlined text-white hover:text-primary transition-colors cursor-pointer text-3xl">settings</span>
                </div>
            </div>
        </footer>
    )
}
