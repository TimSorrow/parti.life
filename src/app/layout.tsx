import type { Metadata } from 'next'
import { Epilogue, Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'

const epilogue = Epilogue({ subsets: ['latin'], variable: '--font-epilogue', weight: ['700', '800', '900'] })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['400', '500', '600'] })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta-sans', weight: ['500', '600'] })

export const metadata: Metadata = {
  title: 'parti.life | Tenerife Event Aggregator',
  description: 'Discover the best island parties in Tenerife, from beach events to exclusive VIP raves.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${epilogue.variable} ${manrope.variable} ${plusJakartaSans.variable} font-body antialiased bg-background text-on-surface min-h-screen flex flex-col`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
