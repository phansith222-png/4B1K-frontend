import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ── Icon map ──────────────────────────────────────────────────────────
const ICONS = {
    artist: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    song: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    ),
    event: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    label: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
};

const TYPE_CONFIG = {
    artist: { color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10', label: 'Artists' },
    song:   { color: 'text-[#FF007F]', bg: 'bg-[#FF007F]/10', label: 'Songs'   },
    event:  { color: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', label: 'Events'  },
    label:  { color: 'text-[#CEFF67]', bg: 'bg-[#CEFF67]/10', label: 'Labels'  },
};

/** Highlight matching substring in grey, matching part in white/bold */
function Highlight({ text, query }) {
    if (!query || !text) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-transparent text-white font-black not-italic">
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}

/**
 * Autocomplete dropdown — uses `position: fixed` to escape any parent
 * overflow:hidden or stacking-context that would clip it.
 *
 * @param {object[]}            suggestions  - from useSearchData
 * @param {string}              query        - raw search string (for highlighting)
 * @param {function}            onSelect     - called with suggestion when clicked
 * @param {boolean}             isOpen       - controls visibility
 * @param {React.RefObject}     anchorRef    - ref of the pill/input wrapper to anchor below
 */
export default function NavSearchDropdown({ suggestions, query, onSelect, isOpen, anchorRef }) {
    const [rect, setRect] = useState(null);

    // Track the anchor element's bounding rect so we can position with `fixed`
    useEffect(() => {
        if (!isOpen) { setRect(null); return; }
        const update = () => {
            if (anchorRef?.current) setRect(anchorRef.current.getBoundingClientRect());
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [isOpen, anchorRef]);

    const ORDER = ['artist', 'song', 'event', 'label'];
    const grouped = ORDER.reduce((acc, type) => {
        const items = suggestions.filter(s => s.type === type);
        if (items.length) acc.push({ type, items });
        return acc;
    }, []);

    if (!isOpen || grouped.length === 0) return null;

    // When anchorRef is not provided, fall back to absolute positioning inside parent
    const posStyle = rect
        ? {
            position:        'fixed',
            top:             rect.bottom + 8,
            left:            rect.left,
            width:           Math.max(rect.width, 340),
            maxWidth:        420,
            zIndex:          99999,
            transformOrigin: 'top left',
          }
        : {
            position:        'absolute',
            top:             '100%',
            left:            0,
            minWidth:        320,
            maxWidth:        420,
            marginTop:       8,
            zIndex:          99999,
            transformOrigin: 'top left',
          };

    return (
        <AnimatePresence>
            <motion.div
                key="search-dropdown"
                initial={{ opacity: 0, y: -6, scaleY: 0.97 }}
                animate={{ opacity: 1, y: 0,  scaleY: 1    }}
                exit={{    opacity: 0, y: -6, scaleY: 0.97 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={posStyle}
                className="bg-[#0f1117]/97 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden"
            >
                {grouped.map(({ type, items }) => {
                    const cfg = TYPE_CONFIG[type];
                    return (
                        <div key={type}>
                            {/* Section header */}
                            <div className={`flex items-center gap-2 px-4 pt-3 pb-1.5 ${cfg.color}`}>
                                {ICONS[type]}
                                <span className="text-[10px] font-black tracking-[0.18em] uppercase">{cfg.label}</span>
                            </div>

                            {items.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onMouseDown={(e) => { e.preventDefault(); onSelect(item); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors group text-left focus:outline-none"
                                >
                                    {/* Thumbnail / fallback icon */}
                                    <div className={`w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 ${cfg.bg} flex items-center justify-center`}>
                                        {item.image
                                            ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            : <span className={`${cfg.color} opacity-60`}>{ICONS[type]}</span>
                                        }
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-gray-300 group-hover:text-white transition-colors truncate leading-tight">
                                            <Highlight text={item.label} query={query} />
                                        </p>
                                        <p className="text-[11px] text-gray-600 group-hover:text-gray-400 transition-colors truncate mt-0.5">
                                            {item.sublabel}
                                        </p>
                                    </div>

                                    {/* Arrow chevron */}
                                    <svg
                                        className={`w-3.5 h-3.5 ${cfg.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    );
                })}

                {/* Footer hint */}
                <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">
                        <kbd className="bg-white/5 rounded px-1 py-0.5 font-mono text-gray-500 mr-1">Enter</kbd>
                        to search
                    </span>
                    <span className="text-[10px] text-gray-600">
                        <kbd className="bg-white/5 rounded px-1 py-0.5 font-mono text-gray-500">Esc</kbd>
                        {' '}to close
                    </span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
