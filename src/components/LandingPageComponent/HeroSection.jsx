import React, { lazy, Suspense } from 'react';
import HeroHeadline from './hero/HeroHeadline';
import HeroCtaButtons from './hero/HeroCtaButtons';
import HeroVideoShowcase from './hero/HeroVideoShowcase';

const MiniMap = lazy(() => import('./hero/MiniMap'));

export default function HeroSection({ artists, events }) {
    return (
        <main className="relative z-20 flex flex-col items-center pt-6 md:pt-10 pb-20 w-full overflow-visible">
            {/* โชว์รูปศิลปินแบบสายรุ้ง (Arc Showcase) ปล่อยให้กางเต็มจอ */}
            <div className="w-full relative z-10 -mb-20 md:-mb-32 lg:-mb-40">
                <HeroVideoShowcase artists={artists} />
            </div>

            {/* ข้อความและปุ่ม ซ้อนทับขึ้นไปใต้ส่วนโค้งของรูปภาพให้เป็นหนึ่งเดียวกัน */}
            <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center relative z-20 px-4">
                <HeroHeadline />

                {/* 🗺️ Mini Map Section (Playable from Landing) */}
                <div className="w-full max-w-5xl mt-12 mb-8 relative z-30 min-h-[400px]">
                    <Suspense fallback={<div className="w-full h-[400px] md:h-[450px] bg-white/5 animate-pulse rounded-3xl" />}>
                        <MiniMap events={events} />
                    </Suspense>
                </div>

                <div className="mt-4 md:mt-6">
                    <HeroCtaButtons />
                </div>
            </div>
        </main>
    );
}
