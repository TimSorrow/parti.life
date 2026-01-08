import Link from 'next/link'
import { Twitter, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-white/5 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="font-display font-black text-2xl tracking-tighter mb-4 inline-block">
                            <span className="text-white">parti</span><span className="text-primary">.life</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Connecting you to the best experiences Tenerife has to offer. From sunset to sunrise, live your best life.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Discover</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-primary transition-colors">Featured Events</Link></li>
                            <li><Link href="/venues" className="hover:text-primary transition-colors">Venues</Link></li>
                            <li><Link href="/artists" className="hover:text-primary transition-colors">Artists</Link></li>
                            <li><Link href="/calendar" className="hover:text-primary transition-colors">Calendar</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/ticketing" className="hover:text-primary transition-colors">Ticketing Info</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} parti.life. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
