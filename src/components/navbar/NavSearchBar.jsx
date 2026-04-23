import React, { useState, useRef } from 'react';
import { useSearchData } from '../../hooks/useSearchData';
import NavSearchDropdown from './NavSearchDropdown';

/**
 * [NavSearchBar Component]
 * ส่วนประกอบของแถบค้นหาบน Navbar ที่สามารถขยายออกได้ (Expanding Search Bar)
 * ทำงานร่วมกับ useSearchData Hook เพื่อจัดการข้อมูลและการนำทาง
 */
export default function NavSearchBar({ navigate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDrop, setShowDrop] = useState(false);
    const inputRef = useRef(null);
    const wrapRef = useRef(null);

    // query: ข้อความที่พิมพ์, suggestions: ผลลัพธ์ที่ได้, executeSearch: ค้นหาเมื่อกด Enter
    const { query, setQuery, suggestions, executeSearch, selectSuggestion, clearSearch } =
        useSearchData(navigate);

    // เปิดแถบค้นหา และทำการ Focus ทันทีหลังจาก Animation จบ
    const openSearch = () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 60);
    };

    const closeSearch = () => {
        setIsOpen(false);
        setShowDrop(false);
        clearSearch();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setShowDrop(false);
            executeSearch(); // เรียกฟังก์ชันค้นหาหลัก (ไปหน้าศิลปินหรือเปิดหน้าดีเทล)
            // ปิดแถบค้นหาก็ต่อเมื่อมีการพิมพ์ข้อความทิ้งไว้
            if (query.trim()) setTimeout(closeSearch, 50);
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
        <div ref={wrapRef} className="flex items-center ml-2 lg:ml-8 relative z-[100]">

            {/* 💊 แถบค้นหาแบบ Pill Shape ที่ขยายออกได้เมื่อกดเปิด */}
            <div
                className={[
                    'transition-all duration-500 ease-in-out flex items-center',
                    'bg-[#1A1C23]/80 backdrop-blur-sm rounded-full border',
                    isOpen
                        ? 'w-64 xl:w-80 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] opacity-100'
                        : 'w-0 border-transparent opacity-0 pointer-events-none',
                ].join(' ')}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
                    onFocus={() => setShowDrop(true)}
                    onBlur={() => setTimeout(() => setShowDrop(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder="Artist, Song, Event, Label..."
                    className="w-full text-[14px] bg-transparent outline-none text-white placeholder:text-gray-500 px-5 py-2.5 min-w-0"
                />
                {isOpen && (
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); executeSearch(); setTimeout(closeSearch, 50); }}
                        className="pr-4 text-gray-400 hover:text-[#00E5FF] transition-colors flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                )}
            </div>

            {/*
              * Dropdown แสดงผลลัพธ์:
              * วางไว้นอก Pill แต่อยู่ใน Wrapper เดียวกันเพื่อให้ลอยทับเนื้อหาด้านล่างได้ (z-index สูง)
              */}
            <NavSearchDropdown
                suggestions={suggestions}
                query={query}
                onSelect={handleSelect}
                isOpen={dropVisible}
                anchorRef={wrapRef}
            />

            {/* Icon buttons */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={openSearch}
                    className="p-2.5 rounded-full transition-all duration-300 flex-shrink-0 z-10 text-gray-400 hover:text-[#00E5FF] bg-[#1A1C23] hover:bg-[#252830]"
                    aria-label="Open search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            )}
            {isOpen && (
                <button
                    type="button"
                    onClick={closeSearch}
                    className="p-2.5 rounded-full transition-all duration-300 absolute -right-10 text-gray-500 hover:text-red-400 flex-shrink-0"
                    aria-label="Close search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
