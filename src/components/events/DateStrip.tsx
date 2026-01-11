'use client'

import { addDays, format, isSameDay, startOfDay } from 'date-fns'

interface DateStripProps {
    selectedDate: Date | null
    onDateSelect: (date: Date) => void
    daysToShow?: number
}

export default function DateStrip({
    selectedDate,
    onDateSelect,
    daysToShow = 14
}: DateStripProps) {
    const today = startOfDay(new Date())
    const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i))

    return (
        <div className="relative">
            {/* Fade indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            {/* Scrollable date strip */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
                {dates.map((date, index) => {
                    const isSelected = selectedDate ? isSameDay(date, selectedDate) : index === 0
                    const isToday = isSameDay(date, today)
                    const dayAbbr = format(date, 'EEE') // Mon, Tue, etc.
                    const dayNum = format(date, 'd')

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateSelect(date)}
                            className={`
                                flex flex-col items-center justify-center min-w-[56px] px-3 py-2 rounded-xl
                                transition-all duration-200 shrink-0
                                ${isSelected
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                }
                            `}
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday && !isSelected ? 'text-primary' : ''}`}>
                                {isToday ? 'Today' : dayAbbr}
                            </span>
                            <span className="text-lg font-black">{dayNum}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
