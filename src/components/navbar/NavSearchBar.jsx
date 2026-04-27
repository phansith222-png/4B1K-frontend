import React, { useState, useRef, useEffect } from 'react';
import { useSearchData } from '../../hooks/useSearchData';
import NavSearchDropdown from './NavSearchDropdown';
import useSearchStore from '../../stores/searchStore';

/**
 * [NavSearchBar Component]
 * ส่วนประกอบของแถบค้นหาบน Navbar ที่สามารถขยายออกได้ (Expanding Search Bar)
 * ทำงานร่วมกับ useSearchData Hook เพื่อจัดการข้อมูลและการนำทาง
 */
export default function NavSearchBar({ navigate }) {
    const { isSearchOpen: isOpen, openSearch: globalOpenSearch, closeSearch: globalCloseSearch } = useSearchStore();
    const [showDrop, setShowDrop] = useState(false);
    const inputRef = useRef(null);
    const wrapRef = useRef(null);

    // query: ข้อความที่พิมพ์, suggestions: ผลลัพธ์ที่ได้, executeSearch: ค้นหาเมื่อกด Enter
    const { query, setQuery, suggestions, executeSearch, selectSuggestion, clearSearch } =
        useSearchData(navigate);

    // เปิดแถบค้นหา และทำการ Focus ทันทีหลังจาก Animation จบ
    const openSearch = () => {
        globalOpenSearch();
        setTimeout(() => inputRef.current?.focus(), 60);
    };

    const closeSearch = () => {
        globalCloseSearch();
        setShowDrop(false);
        clearSearch();
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) {
                closeSearch();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setShowDrop(false);
            executeSearch(); // เรียกฟังก์ชันค้นหาหลัก (ไปหน้าศิลปินหรือเปิดหน้าดีเทล)
        }
        if (e.key === 'Escape') closeSearch();
    };

    const handleSelect = (item) => {
        selectSuggestion(item);
        closeSearch();
    };

    /**
     * เงื่อนไขการแสดง Dropdown:
     * 1. แถบค้นหาถูกเปิดอยู่ (isOpen)
     * 2. กำลังต้องการให้แสดง (showDrop)
     * 3. มีการพิมพ์ข้อความมากกว่า 0 ตัวอักษร
     * 4. มีข้อมูลผลลัพธ์ (suggestions) ที่ตรงกับคำค้นหา
     */
    const dropVisible = isOpen && showDrop && query.trim().length > 0 && suggestions.length > 0;

    return (
        // Wrapper must NOT have overflow:hidden so dropdown can escape
        <div ref={wrapRef} className="flex items-center xl:ml-8 relative z-[100]">

            {/* 💊 แถบค้นหาแบบ Pill Shape ที่เป็นช่องค้นหาปกติเสมอ (ไม่มีเอฟเฟคขยาย) */}
            <div
                className={[
                    'flex items-center bg-[#1A1C23]/80 backdrop-blur-sm rounded-full border',
                    'w-full xl:w-64', // ความกว้างคงที่ ไม่ขยับ
                    isOpen
                        ? 'border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'border-white/10 hover:border-white/30',
                ].join(' ')}
            >
                {/* Search Icon (Always visible on the left) */}
                <div className="pl-4 text-gray-400 flex-shrink-0 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                
                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
                    onFocus={() => { globalOpenSearch(); setShowDrop(true); }}
                    onBlur={() => setTimeout(() => setShowDrop(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder="Artist, Song, Event..."
                    className="w-full text-[14px] bg-transparent outline-none text-white placeholder:text-gray-500 px-3 py-2 min-w-0"
                />

                {/* Clear Button (Shown only when typing) */}
                {query.length > 0 && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                        className="pr-4 text-gray-500 hover:text-white transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown แสดงผลลัพธ์ */}
            <NavSearchDropdown
                suggestions={suggestions}
                query={query}
                onSelect={handleSelect}
                isOpen={dropVisible}
                anchorRef={wrapRef}
            />
        </div>
    );
}
