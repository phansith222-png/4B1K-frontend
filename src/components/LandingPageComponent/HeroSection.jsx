import React from 'react';
import HeroHeadline from './hero/HeroHeadline';
import HeroCtaButtons from './hero/HeroCtaButtons';
import HeroVideoShowcase from './hero/HeroVideoShowcase';
import MiniMap from './hero/MiniMap';

export default function HeroSection() {
    return (
        <main className="relative z-20 flex flex-col items-center pt-6 md:pt-10 pb-20 w-full overflow-visible">
            {/* โชว์รูปศิลปินแบบสายรุ้ง (Arc Showcase) ปล่อยให้กางเต็มจอ */}
            <div className="w-full relative z-10 -mb-20 md:-mb-32 lg:-mb-40">
                <HeroVideoShowcase />
            </div>
            
            {/* ข้อความและปุ่ม ซ้อนทับขึ้นไปใต้ส่วนโค้งของรูปภาพให้เป็นหนึ่งเดียวกัน */}
            <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center relative z-20 px-4">
                <HeroHeadline />
                
                {/* 🗺️ Mini Map Section (Playable from Landing) */}
                <div className="w-full max-w-5xl mt-12 mb-8 relative z-30">
                    <MiniMap />
                </div>

                <div className="mt-4 md:mt-6">
                    <HeroCtaButtons />
                </div>
            </div>
        </main>
    );
}
