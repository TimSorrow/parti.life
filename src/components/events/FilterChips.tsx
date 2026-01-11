'use client'

import * as Icons from 'lucide-react'

interface Category {
    id: string
    name: string
    icon_name?: string
}

interface FilterChipsProps {
    categories: Category[]
    selectedCategory: string | null
    onCategorySelect: (categoryId: string | null) => void
}

const IconLoader = ({ iconName, ...props }: { iconName: string } & React.ComponentProps<typeof Icons.HelpCircle>) => {
    const Icon = (Icons as any)[iconName] || Icons.HelpCircle
    return <Icon {...props} />
}

export default function FilterChips({
    categories,
    selectedCategory,
    onCategorySelect
}: FilterChipsProps) {
    return (
        <div className="relative">
            {/* Fade indicators for mobile scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none md:hidden" />

            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1">
                {/* All Events chip */}
                <button
                    onClick={() => onCategorySelect(null)}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider
                        transition-all duration-200 shrink-0 whitespace-nowrap
                        ${selectedCategory === null
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }
                    `}
                >
                    <Icons.Sparkles className="h-3.5 w-3.5" />
                    All Events
                </button>

                {/* Category chips */}
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.id

                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategorySelect(category.id)}
                            className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider
                                transition-all duration-200 shrink-0 whitespace-nowrap
                                ${isSelected
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                }
                            `}
                        >
                            {category.icon_name && (
                                <IconLoader iconName={category.icon_name} className="h-3.5 w-3.5" />
                            )}
                            {category.name}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
