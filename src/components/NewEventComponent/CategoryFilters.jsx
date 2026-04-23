import React from 'react';
import Reveal from '../Reveal';
import { getCategoryStyle } from '../../utils/eventStyles';

export default function CategoryFilters({ categories, activeCategory, setActiveCategory }) {
    return (
        <Reveal delay={0.2} effect="fade-up">
            <div className=" flex flex-wrap items-center justify-center md:justify-start gap-4 mb-20 border-b border-white/10 pb-10 px-2 md:px-0">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveCategory(cat)}
                        className={`ml-5 mt-2 relative px-8 py-3.5 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden group ${activeCategory === cat
                            ? `${getCategoryStyle(cat)} border-white/20 scale-105 z-10 `
                            : "bg-[#1A1C23]/40 backdrop-blur-xl text-gray-400 border border-white/10 hover:border-white/30 hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </Reveal>
    );
}
