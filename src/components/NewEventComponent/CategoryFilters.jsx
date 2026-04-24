import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';
import { getCategoryStyle } from '../../utils/eventStyles';

export default function CategoryFilters({ categories, activeCategory, setActiveCategory }) {
    return (
        <Reveal delay={0.2} effect="fade-up">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 px-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-md">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 group ${activeCategory === cat
                                ? "scale-105 z-10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span className={`relative z-10 transition-colors duration-500 ${activeCategory === cat 
                                ? (cat.toLowerCase().includes('hip') || cat.toLowerCase().includes('edm') || !['pop', 'rock', 'r&b', 'classic', 'all'].some(k => cat.toLowerCase().includes(k)) ? 'text-black' : 'text-white')
                                : ''
                            }`}>
                                {cat}
                            </span>
                            {activeCategory === cat && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className={`absolute inset-0 rounded-full -z-0 ${getCategoryStyle(cat)}`}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] bg-white/5 px-6 py-3 rounded-full border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                    Filtering {activeCategory}
                </div>
            </div>
        </Reveal>
    );
}
